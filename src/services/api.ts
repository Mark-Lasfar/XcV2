import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mgzon-server.hf.space';

// ✅ إنشاء Axios instance للطلبات العامة (بدون withCredentials)
export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // ✅ بدون withCredentials عشان CORS ما يمنعش
});

// ✅ إنشاء Axios instance للطلبات المحمية (مع withCredentials)
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ للطلبات اللي محتاجة Cookies/Session
});

// ✅ Interceptor لإضافة التوكن للطلبات المحمية
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor لتجديد التوكن
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        // ✅ استخدام publicApi بدلاً من api عشان ما يدخلش في لوب لا نهائية
        const response = await publicApi.post('/api/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        
        localStorage.setItem('userToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Export الـ publicApi كـ default للتوافق
export default publicApi;