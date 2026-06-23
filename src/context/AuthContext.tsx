import React, { createContext, useState, useEffect, useCallback } from 'react';
import { publicApi } from '../services/api';
import { authService } from '../services/authService';
import { User } from '../types/user';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresVerification?: boolean }>;
  register: (data: RegisterData) => Promise<{ success: boolean; requiresVerification?: boolean }>;
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
    
    return {
      _id: id,
      id: id,
      username: userData.username || '',
      email: userData.email || '',
      nickname: userData.nickname || userData.profile?.nickname || userData.username,
      avatar: userData.avatar || userData.profile?.avatar || '/assets/img/default-avatar.png',
      jobTitle: userData.jobTitle || userData.profile?.jobTitle || '',
      bio: userData.bio || userData.profile?.bio || '',
      profile: userData.profile || {},
      isAdmin: userData.isAdmin || false,
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString(),
      isVerified: userData.isVerified || false,
      isActive: userData.isActive !== false,
      role: userData.role || 'user',
    };
  };

  // ✅ تحميل المستخدم
  const loadUser = useCallback(async () => {
    const currentToken = localStorage.getItem('userToken');
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.verifyToken();
      if (response.user) {
        const userData = normalizeUser(response.user);
        setUser(userData);
        setToken(currentToken);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ✅ تسجيل الدخول
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      // ✅ إذا كان الإيميل غير مفعل
      if (response.requiresVerification) {
        return { success: false, requiresVerification: true };
      }

      // ✅ إذا كان هناك توكن
      if (response.token) {
        localStorage.setItem('userToken', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setToken(response.token);
        
        // ✅ جلب بيانات المستخدم
        if (response.user) {
          const userData = normalizeUser(response.user);
          setUser(userData);
        } else {
          // ✅ إذا لم تكن بيانات المستخدم موجودة، جلبها
          try {
            const userResponse = await authService.verifyToken();
            if (userResponse.user) {
              const userData = normalizeUser(userResponse.user);
              setUser(userData);
            }
          } catch (userError) {
            console.error('Error fetching user after login:', userError);
          }
        }
        
        return { success: true };
      }
      
      return { success: false };
    } catch (error: any) {
      // ✅ معالجة خطأ 403 (إيميل غير مفعل)
      if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
        return { success: false, requiresVerification: true };
      }
      throw error;
    }
  };

  // ✅ التسجيل
  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      
      if (response.requiresVerification) {
        return { success: true, requiresVerification: true };
      }
      
      if (response.token) {
        localStorage.setItem('userToken', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        setToken(response.token);
        
        if (response.user) {
          const userData = normalizeUser(response.user);
          setUser(userData);
        }
        
        return { success: true };
      }
      
      return { success: true };
    } catch (error: any) {
      // ✅ معالجة خطأ 201 (إيميل غير مفعل)
      if (error.response?.status === 201 && error.response?.data?.requiresVerification) {
        return { success: true, requiresVerification: true };
      }
      throw error;
    }
  };

  // ✅ التحقق من الإيميل
  const verifyEmail = async (email: string, otp: string) => {
    const response = await authService.verifyEmail({ email, otp });
    
    if (response.token) {
      localStorage.setItem('userToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      setToken(response.token);
      
      if (response.user) {
        const userData = normalizeUser({
          ...response.user,
          isVerified: true,
        });
        setUser(userData);
      }
    }
    
    return response;
  };

  // ✅ إعادة إرسال رمز التحقق
  const resendVerification = async (email: string) => {
    await authService.resendVerification(email);
  };

  // ✅ نسيت كلمة المرور
  const forgotPassword = async (email: string) => {
    await authService.forgotPassword({ email });
  };

  // ✅ إعادة تعيين كلمة المرور
  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    await authService.resetPassword({ email, otp, newPassword });
  };

  // ✅ تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    // محاولة تسجيل الخروج من السيرفر (غير ضروري)
    authService.logout().catch(console.error);
  };

  // ✅ تجديد التوكن
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