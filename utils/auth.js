import { API_USER_LOGOUT } from '@/constants/api';
import api from './api';

export async function login(email, password) {
  try {
    // 1. 获取 CSRF Cookie
    await fetch('http://localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include'
    });

    // 2. 调用登录接口
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('登录失败');
    }

    const data = await response.json();
    
    // 3. 保存 token 到 localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    console.error('登录错误:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await api.post(API_USER_LOGOUT);
    localStorage.removeItem('token');
  } catch (error) {
    console.error('登出错误:', error);
    throw error;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
} 