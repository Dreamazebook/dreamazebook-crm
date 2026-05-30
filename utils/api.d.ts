declare const api: {
    get: <T = any>(url: string, config?: RequestInit) => Promise<T>;
    post: <T = any>(url: string, data?: any, config?: RequestInit) => Promise<T>;
    put: <T = any>(url: string, data?: any, config?: RequestInit) => Promise<T>;
    delete: <T = any>(url: string, config?: RequestInit) => Promise<T>;
};

export function fetchDreamazebookApi(
    path: string,
    options?: Omit<RequestInit, 'credentials'> & { timeoutMs?: number }
): Promise<any>;

export default api;
