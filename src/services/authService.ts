import { api } from './api';
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
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/login', credentials);
    // ✅ تأكد من أن الاستجابة تحتوي على جميع حقول User
    const data = response.data;
    if (data.user) {
      // تأكد من وجود createdAt و updatedAt
      if (!data.user.createdAt) data.user.createdAt = new Date().toISOString();
      if (!data.user.updatedAt) data.user.updatedAt = new Date().toISOString();
    }
    return data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/register', data);
    const result = response.data;
    if (result.user) {
      if (!result.user.createdAt) result.user.createdAt = new Date().toISOString();
      if (!result.user.updatedAt) result.user.updatedAt = new Date().toISOString();
    }
    return result;
  },

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

  async resendVerification(email: string): Promise<void> {
    await api.post('/api/resend-verification', { email });
  },

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await api.post('/api/forgot-password', data);
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post('/api/reset-password', data);
  },

  async logout(): Promise<void> {
    await api.post('/api/logout');
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await api.post('/api/refresh-token', { refreshToken });
    return response.data;
  },

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