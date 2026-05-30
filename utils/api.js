import { getApiBaseUrl } from './apiBaseUrl';

const GUEST_SESSION_HEADER = 'X-Guest-Session-Id';
const GUEST_SESSION_STORAGE_KEY = 'guest_session_id';
let guestSessionIdMemory = null;

const readGuestSessionId = () => {
    if (guestSessionIdMemory) return guestSessionIdMemory;
    if (typeof window === 'undefined') return null;
    try {
        const v = window.sessionStorage.getItem(GUEST_SESSION_STORAGE_KEY);
        if (v) guestSessionIdMemory = v;
        return v;
    } catch {
        return null;
    }
};

const writeGuestSessionId = (id, options = {}) => {
    if (!id || typeof id !== 'string') return;
    const v = id.trim();
    if (!v) return;
    const current = readGuestSessionId();
    const force = !!options.force;
    if (current && current !== v && !force) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[guest-session] ignore overwrite', { current, incoming: v });
        }
        return;
    }
    guestSessionIdMemory = v;
    if (typeof window === 'undefined') return;
    try {
        window.sessionStorage.setItem(GUEST_SESSION_STORAGE_KEY, v);
    } catch {}
};

// Extract guest session id from response headers
const captureGuestSessionFromResponse = (response) => {
    const guestSessionId =
        response?.headers?.get('x-guest-session-id') ||
        response?.headers?.get(GUEST_SESSION_HEADER) ||
        response?.headers?.get(GUEST_SESSION_HEADER.toLowerCase());
    if (guestSessionId) {
        writeGuestSessionId(guestSessionId);
    }
    return guestSessionId;
};

const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        return '/api';
    }
    return getApiBaseUrl();
};

const BASE_URL = getBaseURL();

const SERVER_SIDE_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || process.env.API_TOKEN;

// Build headers for a request
const buildHeaders = (customHeaders = {}) => {
    const headers = new Headers(customHeaders);

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!headers.has('Content-Type') && !headers.has('content-type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    } else {
        if (SERVER_SIDE_TOKEN) {
            headers.set('Authorization', `Bearer ${SERVER_SIDE_TOKEN}`);
        }
    }

    const guestSessionId = readGuestSessionId();
    if (guestSessionId) {
        headers.set(GUEST_SESSION_HEADER, guestSessionId);
    }

    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }

    return headers;
};

// Parse response body
const parseResponse = async (response) => {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

// Core request function
const request = async (method, url, body, config = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    const { headers: customHeaders, signal, ...restConfig } = config;

    const headers = buildHeaders(customHeaders);

    const fetchOptions = {
        method,
        headers,
        credentials: 'include',
        signal,
        ...restConfig,
    };

    if (body !== undefined && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = headers.get('Content-Type')?.includes('application/json')
            ? JSON.stringify(body)
            : body;
    }

    let response;
    try {
        response = await fetch(fullUrl, fetchOptions);
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        console.error('网络错误:', {
            message: '请求超时或网络连接失败',
            url: fullUrl,
            method,
            code: error.code,
        });
        throw error;
    }

    captureGuestSessionFromResponse(response);
    const data = await parseResponse(response);

    if (!response.ok) {
        const isPreviewBatch = typeof url === 'string' && url.includes('/preview/batches/');
        const msg = data?.message;
        const forceGuestSession =
            response.status === 403 &&
            isPreviewBatch &&
            typeof msg === 'string' &&
            msg.includes('无权访问该预览批次');

        // Capture guest session from error response too
        const guestHeader = captureGuestSessionFromResponse(response);
        if (guestHeader && forceGuestSession) {
            writeGuestSessionId(guestHeader, { force: true });
        }

        // Retry on 403 for preview batch with new guest session
        if (
            response.status === 403 &&
            typeof msg === 'string' &&
            msg.includes('无权访问该预览批次') &&
            !config.__retried_with_guest_session__
        ) {
            const retryConfig = { ...config, __retried_with_guest_session__: true };
            const latest = readGuestSessionId();
            if (latest) {
                retryConfig.headers = { ...retryConfig.headers, [GUEST_SESSION_HEADER]: latest };
            }
            return request(method, url, body, retryConfig);
        }

        // 401: clear token
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        }

        console.error('API错误:', {
            status: response.status,
            statusText: response.statusText,
            data,
            url: fullUrl,
        });

        const err = new Error(msg || `Request failed with status code ${response.status}`);
        err.response = { status: response.status, statusText: response.statusText, data };
        err.status = response.status;
        throw err;
    }

    return data;
};

// Public API object mimicking axios interface
const api = {
    get: (url, config) => request('GET', url, undefined, config),
    post: (url, data, config) => request('POST', url, data, config),
    put: (url, data, config) => request('PUT', url, data, config),
    delete: (url, config) => request('DELETE', url, undefined, config),
};

/**
 * Browser-only: direct API call to Dreamazebook API.
 * - Production/preview: direct to getApiBaseUrl()
 * - localhost: same-origin /api proxy
 */
export async function fetchDreamazebookApi(path, options = {}) {
    if (typeof window === 'undefined') {
        throw new Error('fetchDreamazebookApi is client-only');
    }
    const { timeoutMs = 0, headers: initHeaders, ...restInit } = options;
    const host = window.location.hostname;
    const useSameOriginApiProxy =
        host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
    const base = (useSameOriginApiProxy ? '/api' : getApiBaseUrl().replace(/\/+$/, ''));
    const rel = String(path || '').replace(/^\/+/, '');
    const url = `${base}/${rel}`;

    const headers = buildHeaders(initHeaders);

    let signal = restInit.signal;
    let clearTimer;
    if (timeoutMs > 0 && !signal) {
        const controller = new AbortController();
        clearTimer = setTimeout(() => controller.abort(), timeoutMs);
        signal = controller.signal;
    }

    let res;
    try {
        res = await fetch(url, {
            ...restInit,
            signal,
            credentials: 'include',
            headers,
        });
    } catch (e) {
        if (clearTimer) clearTimeout(clearTimer);
        throw e;
    }
    if (clearTimer) clearTimeout(clearTimer);

    captureGuestSessionFromResponse(res);

    const text = await res.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!res.ok) {
        const err = new Error(`Request failed with status code ${res.status}`);
        err.response = { status: res.status, statusText: res.statusText, data };
        throw err;
    }

    return data;
}

export default api;
