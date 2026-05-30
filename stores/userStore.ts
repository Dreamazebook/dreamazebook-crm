import { API_USER_LOGIN, API_USER_REGISTER, API_USER_CURRENT, API_USER_SEND_PASSWORD_RESET_EMAIL, API_ADMIN_LOGIN, API_GET_LOGIN_CODE, API_VERIFY_LOGIN_CODE } from '@/constants/api'
import api from '@/utils/api'
import { ApiResponse, UserResponse } from '@/types/api'
import { create } from 'zustand'
import type { UserType, LoginData, RegisterData, GoogleLoginData, FacebookLoginData } from '@/types/user'

interface UserState {
  // Modal state
  isLoginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
  toggleLoginModal: () => void
  setLoginUserToken: (userResponse:UserResponse) => void
  
  // User state
  user: UserType | null

  isLoggedIn: boolean
  login: (userData: LoginData) => Promise<ApiResponse<UserResponse> | null>
  loginAdmin: (userData: LoginData) => Promise<ApiResponse<UserResponse> | null>
  register: (userData: RegisterData) => Promise<ApiResponse<UserResponse> | null>
  loginWithGoogleToken: (userData: GoogleLoginData) => Promise<ApiResponse<UserResponse> | null>
  loginWithFacebookToken: (userData: FacebookLoginData) => Promise<ApiResponse<UserResponse> | null>
  logout: () => void
  fetchCurrentUser: () => void
  sendResetPasswordLink: (email: string) => Promise<boolean>
  sendLoginCode: (email: string) => Promise<ApiResponse<any>>
  verifyLoginCode: (email: string, code: string) => Promise<ApiResponse<UserResponse> | null>
}

const useUserStore = create<UserState>((set,get) => ({
  // Modal state - initially closed
  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  toggleLoginModal: () => set((state) => ({ isLoginModalOpen: !state.isLoginModalOpen })),
  
  // User state - initially not logged in
  user: null,

  isLoggedIn: false,
  sendResetPasswordLink: async (email: string): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<any>>(API_USER_SEND_PASSWORD_RESET_EMAIL, { email });
      return response.success;
    } catch (error) {
      console.error('Send reset password link error:', error);
      return false;
    }
  },
  sendLoginCode: async (email: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post<ApiResponse<any>>(API_GET_LOGIN_CODE, { email });
      return response;
    } catch (error) {
      console.error('Send login code error:', error);
      return { success: false, message: 'Failed to send login code' } as ApiResponse<any>;
    }
  },
  verifyLoginCode: async (email: string, code: string): Promise<ApiResponse<UserResponse> | null> => {
    try {
      const response = await api.post<ApiResponse<UserResponse>>(API_VERIFY_LOGIN_CODE, { email, code });
      if (response.success && response.data?.token) {
        get().setLoginUserToken(response.data);
      }
      return response;
    } catch (error) {
      console.error('Verify login code error:', error);
      return null;
    }
  },
  register: async (userData): Promise<ApiResponse<UserResponse> | null> => {
    try {
      const response = await api.post<ApiResponse<UserResponse>>(API_USER_REGISTER, userData);
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        set({ isLoggedIn: true, user: response.data?.user || null });
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  },
  setLoginUserToken: (userResponse:UserResponse) => {
    if (userResponse.token) {
      set({isLoggedIn:true, user:userResponse.user});
      localStorage.setItem('token', userResponse.token);
    }
  },
  login: async (userData): Promise<ApiResponse<UserResponse> | null> => {
    try {
      const response = await api.post<ApiResponse<UserResponse>>(API_USER_LOGIN, userData);
      if (response.success && response.data?.token) {
        get().setLoginUserToken(response.data);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },
  loginAdmin: async (userData): Promise<ApiResponse<UserResponse> | null> => {
    try {
      const response = await api.post<ApiResponse<UserResponse>>(API_ADMIN_LOGIN, userData);
      if (response.success && response.data?.token) {
        get().setLoginUserToken(response.data);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isLoggedIn: false });
  },
  fetchCurrentUser: async () => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }
    
    try {
      const response = await api.get<ApiResponse>(API_USER_CURRENT);
      if (response.success && response.data) {
        set({ user: response.data, isLoggedIn: true });
      }
      return response;
    } catch (error) {
      console.error('Fetch current user error:', error);
      // 如果获取用户信息失败（例如token过期），清除登录状态
      localStorage.removeItem('token');
      set({ user: null, isLoggedIn: false });
    }
  },
  loginWithGoogleToken: async (userData: GoogleLoginData): Promise<ApiResponse<UserResponse> | null> => {
    try {
      // Send Google token and user data to backend for authentication
      const response = await api.post<ApiResponse<UserResponse>>('/auth/google/login', {
        google_id: userData.googleId,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        email_verified: userData.emailVerified,
        id_token: userData.idToken,
      });

      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        set({ isLoggedIn: true, user: response.data?.user || null });
      }
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
    }
  },
  loginWithFacebookToken: async (userData: FacebookLoginData): Promise<ApiResponse<UserResponse> | null> => {
    try {
      // Send Facebook token and user data to backend for authentication
      const response = await api.post<ApiResponse<UserResponse>>('/auth/facebook/login', {
        facebook_id: userData.facebookId,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        access_token: userData.accessToken,
      });

      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        set({ isLoggedIn: true, user: response.data?.user || null });
      }
      return response;
    } catch (error) {
      console.error('Facebook login error:', error);
      return null;
    }
  },
}))

export default useUserStore