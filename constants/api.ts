// 使用相对路径，让 axios baseURL 生效
// 客户端会通过 /api 代理，服务器端会使用完整的 API URL
export const OAUTH_REDIRECT = (provider: string) => `/api/auth/${provider}/redirect`;
export const OAUTH_CALLBACK = (provider: string) => `/api/auth/${provider}/callback`;

export const API_USER_REGISTER = '/register';

export const API_USER_LOGIN = '/login';
export const API_GET_LOGIN_CODE = `${API_USER_LOGIN}/send-code`;
export const API_VERIFY_LOGIN_CODE = `${API_USER_LOGIN}/verify-code`;

export const API_USER_LOGOUT = '/logout';

export const API_USER_SEND_PASSWORD_RESET_EMAIL = '/forgot-password';
export const API_RESET_PASSWORD = '/reset-password';

export const API_USER_CURRENT = '/user/profile';
export const API_USER_PROFILE = '/user/profile';
export const API_USER_RESET_PASSWORD = '/user/change-password';

export const API_ADMIN_LOGIN = '/admin/login';

export const API_ADMIN_USERS = '/admin/users';
export const API_ADMIN_ROLES = '/admin/roles';
export const API_ADMIN_ASSIGN_USER_ROLES = (userId: number) => `/admin/user-roles/${userId}/roles`;
export const API_ADMIN_PERMISSIONS = '/admin/permissions';

export const API_ADMIN_ORDERS = '/admin/orders'
export const API_ADMIN_ORDER_DETAIL = (id: string | number) => `${API_ADMIN_ORDERS}/${id}`
export const API_ADMIN_ORDER_RETRY_FACE_SWAP = (orderId: string | number) => `${API_ADMIN_ORDER_DETAIL(orderId)}/retry-face-swap`;
export const API_ADMIN_ORDER_ITEM_UPLOAD_FINAL_IMAGE = (orderId:string|number, itemId:string|number) => `${API_ADMIN_ORDERS}/${orderId}/items/${itemId}/upload-final-images`;
export const API_ADMIN_ORDER_DETAIL_MANUAL_CONFIRM = (orderId: string | number, itemId: string|number) => `${API_ADMIN_ORDER_DETAIL(orderId)}/items/${itemId}/confirm`
export const API_ADMIN_ORDER_DOWNLOAD_IMAGES = '/api/admin/orders/download-images'
export const API_ADMIN_ORDER_GENERATE_PDF = (orderId: string | number) => `${API_ADMIN_ORDER_DETAIL(orderId)}/generate-pdf`
export const API_ADMIN_ORDER_PDF_URLS = (orderId: string | number) => `${API_ADMIN_ORDER_DETAIL(orderId)}/pdf-urls`
export const API_ADMIN_ORDER_SEND_PREVIEW_PDF = (orderId: string | number) => `${API_ADMIN_ORDER_DETAIL(orderId)}/send-preview-pdf`

export const API_ADMIN_LOGSTICS = '/admin/logistics'
export const API_ADMIN_LOGSTIC_DETAIL = (id: string | number) => `${API_ADMIN_LOGSTICS}/${id}`
export const API_ADMIN_LOGSTIC_DETAIL_PRINT_LABEL = (id: string | number) =>`${API_ADMIN_LOGSTIC_DETAIL(id)}/print-label`
export const API_ADMIN_LOGSTIC_COMFIRM = `${API_ADMIN_LOGSTICS}/confirm`;
export const API_ADMIN_LOGSTIC_PRINT_PICKUP_ORDER = `${API_ADMIN_LOGSTICS}/print-pickup-order`;
export const API_ADMIN_LOGSTIC_RESCHEDULE_PICKUP = (id:string|number) => `${API_ADMIN_LOGSTIC_DETAIL(id)}/reschedule-pickup`;

export const API_ADMIN_PICBOOKS = '/admin/picbooks'
export const API_ADMIN_PICBOOK_DETAIL = (id: string | number) => `${API_ADMIN_PICBOOKS}/${id}`

export const API_ADMIN_COUPONS = '/admin/coupons';
export const API_ADMIN_COUPON_DETAIL = (id: string | number) => `${API_ADMIN_COUPONS}/${id}`;
export const API_ADMIN_COUPON_DISABLE = (id: string | number) => `${API_ADMIN_COUPON_DETAIL(id)}/disable`;

export const API_PRODUCTS = '/products';

export const API_PICBOOKS = '/picbooks'
export const API_PICBOOK_DETAIL = (id: string | number) => `${API_PICBOOKS}/${id}`
