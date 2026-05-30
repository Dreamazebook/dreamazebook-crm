import axios from 'axios';
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
        // 避免并发请求在“首次建立 guest session”阶段产生竞争覆盖：
        // 一旦建立了 guest session id，后续从其他响应头读到不同值时默认不覆盖。
        // 只有在特定场景（如 preview batch 403）才允许 force 覆盖。
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

// 在客户端使用 /api 代理，在服务器端使用完整 API URL
const getBaseURL = () => {
    if (typeof window !== 'undefined') {
        // 客户端环境：使用 Next.js API 路由代理，避免 CORS 问题
        return '/api';
    } else {
        // 服务器端环境：直接使用完整 API URL
        return getApiBaseUrl();
    }
};

const BASE_URL = getBaseURL();

const api= axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000, // 请求超时时间设置为 10 秒
    headers: {
        'Content-Type': 'application/json',
    },
});

// 创建一个专门用于文件上传的axios实例
const uploadApi = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    timeout: 10000, // 恢复默认超时时间
    // 移除默认的 Content-Type，让浏览器自动设置正确的 boundary
});

// 注意：不要在浏览器端回退到硬编码 token，否则所有未登录用户会共享同一个 user_id，
// 导致后端唯一键（如 package_id + user_id + item_index）发生全站冲突。
// 如确需服务端调用鉴权接口，请通过环境变量注入，而不是写死在代码里。
const SERVER_SIDE_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || process.env.API_TOKEN

// 请求拦截器
const addAuthHeader = (config) => {
    // 检查是否在客户端环境
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } else {
        // 服务器端环境：仅在显式提供 token 时才注入
        if (SERVER_SIDE_TOKEN) {
            config.headers.Authorization = `Bearer ${SERVER_SIDE_TOKEN}`;
        }
    }

    // 透传 guest session id（无痕/未登录场景下用于访问 preview batch）
    const guestSessionId = readGuestSessionId();
    if (guestSessionId) {
        config.headers[GUEST_SESSION_HEADER] = guestSessionId;
    }
    return config;
};

api.interceptors.request.use(addAuthHeader);
uploadApi.interceptors.request.use(addAuthHeader);

// 响应拦截器
const handleResponse = (response) => {
    // axios 会把响应头 key 统一转小写
    const guestSessionId =
        response?.headers?.['x-guest-session-id'] ||
        response?.headers?.[GUEST_SESSION_HEADER] ||
        response?.headers?.[GUEST_SESSION_HEADER.toLowerCase()];
    if (guestSessionId) {
        writeGuestSessionId(Array.isArray(guestSessionId) ? guestSessionId[0] : String(guestSessionId));
    }
    return response.data;
};

const handleError = async (error) => {
    if (error.response) {
        const status = error.response.status;
        const msg = error?.response?.data?.message;
        const cfg = error?.config;
        const isPreviewBatch =
            typeof cfg?.url === 'string' && cfg.url.includes('/preview/batches/');
        const forceGuestSession =
            status === 403 &&
            isPreviewBatch &&
            typeof msg === 'string' &&
            msg.includes('无权访问该预览批次');

        // 即使是错误响应（如 403），后端也可能回传 X-Guest-Session-Id；此处也要捕获并保存
        const guestSessionId =
            error?.response?.headers?.['x-guest-session-id'] ||
            error?.response?.headers?.[GUEST_SESSION_HEADER] ||
            error?.response?.headers?.[GUEST_SESSION_HEADER.toLowerCase()];
        if (guestSessionId) {
            writeGuestSessionId(
                Array.isArray(guestSessionId) ? guestSessionId[0] : String(guestSessionId),
                { force: forceGuestSession }
            );
        }

        // 服务器返回错误状态码
        console.error('API错误:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            url: error.config?.url
        });

        // 特判：无痕模式下首次访问 preview batch 可能因 session 不一致返回 403，
        // 后端同时回传新的 X-Guest-Session-Id。保存后重试一次即可恢复。
        try {
            const shouldRetry =
                status === 403 &&
                typeof msg === 'string' &&
                msg.includes('无权访问该预览批次') &&
                cfg &&
                !cfg.__retried_with_guest_session__;

            if (shouldRetry) {
                cfg.__retried_with_guest_session__ = true;
                // 确保重试请求一定带上最新的 guest session id
                const latest = readGuestSessionId();
                cfg.headers = cfg.headers || {};
                if (latest) cfg.headers[GUEST_SESSION_HEADER] = latest;
                return await axios.request(cfg);
            }
        } catch {}

        if (error.response.status === 401) {
            // 处理未授权错误
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                
            }
        }
    } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('网络错误:', {
            message: '请求超时或网络连接失败',
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            timeout: error.config?.timeout,
            code: error.code
        });
    } else {
        // 请求配置出错
        console.error('请求错误:', {
            message: error.message,
            url: error.config?.url
        });
    }
    return Promise.reject(error);
};

api.interceptors.response.use(handleResponse, handleError);
uploadApi.interceptors.response.use(handleResponse, handleError);

/**
 * 浏览器端调用 Dreamazebook API。
 * - 生产/预览域名：直连 getApiBaseUrl()，避免大请求体经 Netlify 等 Next 代理被拦截。
 * - localhost：走同源 `/api` 代理（与 axios 一致），避免 dev-api 未放行本地 Origin 的 CORS。
 * 鉴权与 X-Guest-Session-Id 与默认 api 实例一致；错误对象带 `response: { status, data }`。
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

    const headers = new Headers(initHeaders || {});
    const token = localStorage.getItem('token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    const guestSessionId = readGuestSessionId();
    if (guestSessionId) {
        headers.set(GUEST_SESSION_HEADER, guestSessionId);
    }
    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json');
    }

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

    const headerGuest =
        res.headers.get('x-guest-session-id') ||
        res.headers.get(GUEST_SESSION_HEADER) ||
        res.headers.get(GUEST_SESSION_HEADER.toLowerCase());
    if (headerGuest) {
        writeGuestSessionId(Array.isArray(headerGuest) ? headerGuest[0] : String(headerGuest));
    }

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

export { uploadApi };
export default api;