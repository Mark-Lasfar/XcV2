import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mgzon-server.hf.space';

// ✅ إنشاء Axios instance للطلبات العامة (بدون withCredentials)
export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // ✅ إضافة timeout 30 ثانية
});

// ✅ إنشاء Axios instance للطلبات المحمية (بدون withCredentials)
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // ✅ إضافة timeout 30 ثانية
  // ❌ إزالة withCredentials: true عشان CORS
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
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Interceptor لتجديد التوكن
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // ✅ منع التكرار اللانهائي
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // ✅ فقط معالجة 401 وليس طلب refresh-token نفسه
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        console.log('🔄 Refreshing token...');
        const response = await publicApi.post('/api/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        
        if (accessToken) {
          localStorage.setItem('userToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
        // ✅ تنظيف التوكنات وإعادة التوجيه إلى صفحة تسجيل الدخول
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
        
        // ✅ منع إعادة التوجيه المتكرر
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default publicApi;