import { User } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

// ✅ تحديث AuthResponse لاستخدام نوع User بالكامل
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;  // ✅ استخدام نوع User الكامل بدلاً من كائن جزئي
  requiresVerification?: boolean;
}

export interface VerifyData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthError {
  error: string;
  requiresVerification?: boolean;
}