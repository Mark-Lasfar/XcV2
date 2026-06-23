import React, { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { Github, Twitter, Chrome, Mail, Loader2, Facebook } from 'lucide-react';
import { showToast } from '../common/Toast';
import { useNavigate } from 'react-router';

interface SocialLoginProps {
  onSuccess?: (provider: string, data: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
  enabled: boolean;
  authPath: string; // ✅ إضافة مسار المصادقة
}

export const SocialLogin: React.FC<SocialLoginProps> = ({
  onSuccess,
  onError,
  className = '',
}) => {
  const [loading, setLoading] = useState<string | null>(null);

  const providers: SocialProvider[] = [
    {
      id: 'google',
      name: 'Google',
      icon: <Chrome className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      enabled: true,
      authPath: '/auth/google',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-gray-800',
      hoverColor: 'hover:bg-gray-900',
      enabled: true,
      authPath: '/auth/github',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      enabled: true,
      authPath: '/auth/facebook',
    },
    {
      id: 'mgzon',
      name: 'MGZon',
      icon: <img src="https://elasfar.vercel.app/logo.png" className="w-5 h-5" alt="MGZon" />,
      color: 'text-white',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      enabled: true,
      authPath: '/auth/mgz',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'text-white',
      bgColor: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500',
      enabled: false,
      authPath: '/auth/twitter',
    },
    {
      id: 'email',
      name: 'Email Magic Link',
      icon: <Mail className="w-5 h-5" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
      enabled: true,
      authPath: '/auth/magic-link',
    },
  ];

  const handleSocialLogin = async (provider: SocialProvider) => {
    if (!provider.enabled) {
      showToast(`${provider.name} login is not available yet`, 'warning');
      return;
    }

    setLoading(provider.id);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://mgzon-server.hf.space';
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
      const successRedirect = encodeURIComponent('/profile/me');

      // ✅ استخدام المسار الصحيح من provider
      const authUrl = `${baseUrl}${provider.authPath}?redirect_uri=${redirectUri}&success_redirect=${successRedirect}`;
      
      console.log('🔐 Redirecting to:', authUrl);
      window.location.href = authUrl;
      
    } catch (error: any) {
      showToast(error.message || 'Social login failed', 'error');
      if (onError) onError(error.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => {
          const isLoading = loading === provider.id;
          const isEnabled = provider.enabled;

          return (
            <Button
              key={provider.id}
              onClick={() => handleSocialLogin(provider)}
              disabled={isLoading || !isEnabled}
              variant={provider.id === 'email' ? 'outline' : 'primary'}
              className={`
                flex items-center justify-center gap-2 py-2.5
                ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${provider.id === 'email' 
                  ? 'border-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                  : `${provider.bgColor} ${provider.hoverColor} ${provider.color}`
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                provider.icon
              )}
              <span className="text-sm font-medium">
                {isLoading ? 'Connecting...' : provider.name}
              </span>
              {!isEnabled && (
                <span className="text-[10px] opacity-60">(Soon)</span>
              )}
            </Button>
          );
        })}
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-500">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

// OAuth Callback Handler Component
export const OAuthCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const refreshToken = params.get('refreshToken');
      const errorParam = params.get('error');

      console.log('🔐 Callback params:', { 
        token: !!token, 
        refreshToken: !!refreshToken, 
        error: errorParam 
      });

      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        setLoading(false);
        return;
      }

      if (token) {
        localStorage.setItem('userToken', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        showToast('Login successful!', 'success');
        navigate('/profile/me');
      } else {
        setError('No token received from provider');
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader-spinner mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Completing login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Authentication Failed
          </h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};