import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { KeyRound, CheckCircle, ArrowLeft, Shield, Lock } from 'lucide-react';
import { showToast } from '../../components/common/Toast';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isReset, setIsReset] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      showToast('No email provided. Please go back to forgot password.', 'error');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate OTP
    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    // Validate password
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength check
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      setError('Password must contain uppercase, lowercase, number, and special character');
      showToast('Password must contain uppercase, lowercase, number, and special character', 'warning');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);
      setIsReset(true);
      showToast('Password reset successful!', 'success');
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      showToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isReset) {
    return (
      <AuthCard 
        title="Password Reset Successful" 
        subtitle="Your password has been updated"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Your password has been successfully reset.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can now login with your new password.
          </p>
          
          <div className="mt-6 space-y-3">
            <Button
              onClick={() => navigate('/login')}
              fullWidth
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Reset Password" 
      subtitle={`Enter the code sent to ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-2">
            <KeyRound className="w-10 h-10 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the 6-digit code and your new password
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Verification Code
          </label>
          <Input
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setOtp(value);
            }}
            placeholder="000000"
            className="text-center text-2xl tracking-widest bg-gray-50 dark:bg-gray-700"
            maxLength={6}
            required
            icon={<Shield className="w-4 h-4" />}
          />
          <p className="mt-1 text-xs text-gray-400">Enter the 6-digit code from your email</p>
        </div>

        <PasswordInput
          value={newPassword}
          onChange={setNewPassword}
          placeholder="8+ characters"
          label="New Password"
          error={error}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 border-gray-300 dark:border-gray-600"
              required
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Password Requirements */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Password requirements:
          </p>
          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
            <li className="flex items-center gap-2">
              <span className={newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}>
                {newPassword.length >= 8 ? '✓' : '○'}
              </span>
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span className={/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>
                {/[A-Z]/.test(newPassword) ? '✓' : '○'}
              </span>
              One uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className={/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>
                {/[a-z]/.test(newPassword) ? '✓' : '○'}
              </span>
              One lowercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className={/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>
                {/[0-9]/.test(newPassword) ? '✓' : '○'}
              </span>
              One number
            </li>
            <li className="flex items-center gap-2">
              <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}>
                {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? '✓' : '○'}
              </span>
              One special character
            </li>
          </ul>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
        >
          <KeyRound className="w-4 h-4 mr-2" />
          Reset Password
        </Button>

        <p className="text-center">
          <Link
            to="/login"
            className="text-sm text-purple-500 hover:text-purple-600 hover:underline flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordPage;