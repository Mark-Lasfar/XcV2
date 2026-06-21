import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { SocialLogin } from '../../components/auth/SocialLogin';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail } from 'lucide-react';
import { showToast } from '../../components/common/Toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login, forgotPassword, resetPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile/me');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.requiresVerification) {
        showToast('Please verify your email first!', 'warning');
        navigate(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }

      showToast('Welcome back!', 'success');
      const redirect = location.state?.from || '/profile/me';
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setForgotLoading(true);

    try {
      await forgotPassword(forgotEmail);
      showToast('Reset code sent to your email!', 'success');
      setShowForgotPassword(false);
      setShowResetPassword(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
      showToast(err.message || 'Failed to send reset code', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetLoading(true);

    try {
      await resetPassword(forgotEmail, resetOtp, newPassword);
      showToast('Password reset successful!', 'success');
      setShowResetPassword(false);
      setShowForgotPassword(false);
      setForgotEmail('');
      setResetOtp('');
      setNewPassword('');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      showToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  // Social Login Success Handler
  const handleSocialLoginSuccess = (provider: string, data: any) => {
    console.log(`Logged in with ${provider}:`, data);
    showToast(`Successfully logged in with ${provider}!`, 'success');
    navigate('/profile/me');
  };

  const handleSocialLoginError = (error: string) => {
    setError(error);
    showToast(error, 'error');
  };

  if (showResetPassword) {
    return (
      <AuthCard title="Reset Password" subtitle="Enter the code sent to your email">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-50 dark:bg-gray-700"
              required
              disabled={resetLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verification Code
            </label>
            <Input
              type="text"
              value={resetOtp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setResetOtp(value);
              }}
              placeholder="Enter 6-digit code"
              className="bg-gray-50 dark:bg-gray-700 text-center text-2xl tracking-widest"
              maxLength={6}
              required
              disabled={resetLoading}
            />
          </div>

          <PasswordInput
            value={newPassword}
            onChange={setNewPassword}
            placeholder="New password (8+ characters)"
            label="New Password"
            error={error}
            disabled={resetLoading}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            loading={resetLoading}
            fullWidth
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Reset Password
          </Button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <button
              type="button"
              onClick={() => {
                setShowResetPassword(false);
                setShowForgotPassword(false);
                setError('');
              }}
              className="text-purple-500 hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </form>
      </AuthCard>
    );
  }

  if (showForgotPassword) {
    return (
      <AuthCard title="Forgot Password" subtitle="Enter your email to receive a reset code">
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <Input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="your@email.com"
            label="Email Address"
            icon={<Mail className="w-4 h-4" />}
            required
            disabled={forgotLoading}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            loading={forgotLoading}
            fullWidth
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Send Reset Code
          </Button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setError('');
              }}
              className="text-purple-500 hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          label="Email Address"
          icon={<Mail className="w-4 h-4" />}
          required
          disabled={loading}
          autoFocus
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          label="Password"
          error={error}
          disabled={loading}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(true);
              setError('');
            }}
            className="text-sm text-purple-500 hover:text-purple-600 hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
        >
          Sign In
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <SocialLogin 
          onSuccess={handleSocialLoginSuccess}
          onError={handleSocialLoginError}
        />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-500 hover:underline font-medium">
            Create Account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default LoginPage;