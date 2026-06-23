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
  // ✅ Login - يستخدم publicApi (بدون withCredentials) عشان CORS
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await publicApi.post('/api/login', credentials);
    const data = response.data;
    if (data.user) {
      if (!data.user.createdAt) data.user.createdAt = new Date().toISOString();
      if (!data.user.updatedAt) data.user.updatedAt = new Date().toISOString();
    }
    return data;
  },

  // ✅ Register - يستخدم publicApi (بدون withCredentials) عشان CORS
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await publicApi.post('/api/register', data);
    const result = response.data;
    if (result.user) {
      if (!result.user.createdAt) result.user.createdAt = new Date().toISOString();
      if (!result.user.updatedAt) result.user.updatedAt = new Date().toISOString();
    }
    return result;
  },

  // ✅ Verify Email - يستخدم api (مع withCredentials)
  async verifyEmail(data: VerifyData): Promise<AuthResponse> {
    const response = await api.post('/api/verify-email', data);
    const result = response.data;
    if (result.user) {
      if (!result.user.createdAt) result.user.createdAt = new Date().toISOString();
      if (!result.user.updatedAt) result.user.updatedAt = new Date().toISOString();
      result.user.isVerified = true;
    }
    return result;
  },

  // ✅ Resend Verification - يستخدم publicApi
  async resendVerification(email: string): Promise<void> {
    await publicApi.post('/api/resend-verification', { email });
  },

  // ✅ Forgot Password - يستخدم publicApi
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await publicApi.post('/api/forgot-password', data);
  },

  // ✅ Reset Password - يستخدم publicApi
  async resetPassword(data: ResetPasswordData): Promise<void> {
    await publicApi.post('/api/reset-password', data);
  },

  // ✅ Logout - يستخدم api (مع withCredentials)
  async logout(): Promise<void> {
    await api.post('/api/logout');
  },

  // ✅ Refresh Token - يستخدم publicApi (بدون withCredentials)
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await publicApi.post('/api/refresh-token', { refreshToken });
    return response.data;
  },

  // ✅ Verify Token - يستخدم api (مع withCredentials)
  async verifyToken(): Promise<{ user: User }> {
    const response = await api.get('/api/verify-token');
    const data = response.data;
    if (data.user) {
      if (!data.user.createdAt) data.user.createdAt = new Date().toISOString();
      if (!data.user.updatedAt) data.user.updatedAt = new Date().toISOString();
    }
    return data;
  },
};

// ✅ Export الـ authService كـ default للتوافق
export default authService;