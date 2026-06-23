import { publicApi, api } from './api';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  VerifyData,
  ForgotPasswordData,
  ResetPasswordData,
} from '../types/auth';
import { User } from '../types/user';

export const authService = {
  // ✅ Login - يستخدم publicApi
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await publicApi.post('/api/login', credentials);
      return response.data;
    } catch (error: any) {
      console.error('Login service error:', error);
      // ✅ إعادة الخطأ كما هو مع الحفاظ على البيانات المهمة
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },

  // ✅ Register - يستخدم publicApi
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await publicApi.post('/api/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Register service error:', error);
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },

  // ✅ Verify Email - يستخدم publicApi
  async verifyEmail(data: VerifyData): Promise<AuthResponse> {
    try {
      const response = await publicApi.post('/api/verify-email', data);
      return response.data;
    } catch (error: any) {
      console.error('Verify email error:', error);
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },

  // ✅ Resend Verification - يستخدم publicApi
  async resendVerification(email: string): Promise<void> {
    try {
      await publicApi.post('/api/resend-verification', { email });
    } catch (error: any) {
      console.error('Resend verification error:', error);
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },

  // ✅ Forgot Password - يستخدم publicApi
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      await publicApi.post('/api/forgot-password', data);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },

  // ✅ Reset Password - يستخدم publicApi
  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      await publicApi.post('/api/reset-password', data);
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },

  // ✅ Logout - يستخدم api (مع التوكن)
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('userToken');
      if (token) {
        await api.post('/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error: any) {
      console.error('Logout error:', error);
      // ✅ لا نحتاج إلى رمي الخطأ لأننا نريد تسجيل الخروج محلياً anyway
    } finally {
      // ✅ تنظيف التوكنات محلياً حتى لو فشل الطلب
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // ✅ Refresh Token - يستخدم publicApi
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const response = await publicApi.post('/api/refresh-token', { refreshToken });
      return response.data;
    } catch (error: any) {
      console.error('Refresh token error:', error);
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },

  // ✅ Verify Token - يستخدم publicApi (بدون withCredentials)
  async verifyToken(): Promise<{ user: User }> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }
    
    try {
      const response = await publicApi.get('/api/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('Verify token error:', error);
      
      // ✅ إذا كان الخطأ 401 أو 403، قم بتنظيف التوكنات
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('refreshToken');
      }
      
      if (error.response?.data) {
        throw { ...error, response: error.response };
      }
      throw error;
    }
  },
};

export default authService;