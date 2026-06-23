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
    const response = await publicApi.post('/api/login', credentials);
    return response.data;
  },

  // ✅ Register - يستخدم publicApi
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await publicApi.post('/api/register', data);
    return response.data;
  },

  // ✅ Verify Email - يستخدم publicApi
  async verifyEmail(data: VerifyData): Promise<AuthResponse> {
    const response = await publicApi.post('/api/verify-email', data);
    return response.data;
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

  // ✅ Logout - يستخدم api (مع التوكن)
  async logout(): Promise<void> {
    const token = localStorage.getItem('userToken');
    if (token) {
      await api.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  },

  // ✅ Refresh Token - يستخدم publicApi
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await publicApi.post('/api/refresh-token', { refreshToken });
    return response.data;
  },

  // ✅ Verify Token - يستخدم publicApi (بدون withCredentials)
  async verifyToken(): Promise<{ user: User }> {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await publicApi.get('/api/verify-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export default authService;