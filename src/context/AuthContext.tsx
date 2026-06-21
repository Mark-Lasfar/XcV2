import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { authService } from '../services/authService';
import { User } from '../types/user';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: RegisterData) => Promise<any>;
  verifyEmail: (email: string, otp: string) => Promise<any>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);

  // ✅ دالة مساعدة لتحويل بيانات المستخدم
  const normalizeUser = (userData: any): User => {
    const id = userData._id || userData.id || '';
    if (!id) {
      console.warn('User ID is missing, using fallback');
    }
    
    return {
      _id: id,
      id: id,
      username: userData.username || '',
      email: userData.email || '',
      profile: userData.profile || {},
      isAdmin: userData.isAdmin || false,
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString(),
      isVerified: userData.isVerified || false,
      isActive: userData.isActive !== false,
      role: userData.role || 'user',
    };
  };

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.verifyToken();
      if (response.user) {
        const userData = normalizeUser(response.user);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.login({ email, password });
      
      if (response.token && response.user) {
        const userData = normalizeUser(response.user);
        
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        setToken(response.token);
        setUser(userData);
        return { success: true, requiresVerification: false };
      }
      
      return { success: false, requiresVerification: response.requiresVerification };
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
        return { success: false, requiresVerification: true };
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response: AuthResponse = await authService.register(data);
      
      if (response.token && response.user) {
        const userData = normalizeUser(response.user);
        
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        setToken(response.token);
        setUser(userData);
        return { success: true, requiresVerification: false };
      }
      
      return { success: true, requiresVerification: response.requiresVerification };
    } catch (error: any) {
      if (error.response?.status === 201 && error.response?.data?.requiresVerification) {
        return { success: true, requiresVerification: true };
      }
      throw error;
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    const response: AuthResponse = await authService.verifyEmail({ email, otp });
    
    if (response.token && response.user) {
      const userData = normalizeUser({
        ...response.user,
        isVerified: true,
      });
      
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setToken(response.token);
      setUser(userData);
    }
    
    return response;
  };

  const resendVerification = async (email: string) => {
    await authService.resendVerification(email);
  };

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword({ email });
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    await authService.resetPassword({ email, otp, newPassword });
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    authService.logout().catch(console.error);
  };

  const refreshToken = async (): Promise<string | null> => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return null;

    try {
      const response = await authService.refreshToken(refresh);
      const newToken = response.token;
      localStorage.setItem('userToken', newToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};