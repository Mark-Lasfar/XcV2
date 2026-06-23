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

export interface AuthResponse {
  token?: string;
  refreshToken?: string;
  user?: User;
  requiresVerification?: boolean;
  error?: string;
  message?: string;
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
  email?: string;
}

// ✅ نوع للـ Social Login
export interface SocialLoginData {
  provider: string;
  email?: string;
  token?: string;
}