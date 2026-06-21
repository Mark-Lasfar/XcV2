import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { showToast } from '../../components/common/Toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setIsSent(true);
      setResendCooldown(60);
      
      // Start cooldown timer
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      showToast('Reset code sent to your email!', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
      showToast(err.message || 'Failed to send reset code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      await forgotPassword(email);
      setResendCooldown(60);
      
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      showToast('New reset code sent!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to resend code', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <AuthCard 
        title="Check Your Email" 
        subtitle="We've sent a password reset code to your email"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {email}
          </p>
          
          <div className="mt-6 space-y-4">
            <Button
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
              fullWidth
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            >
              Continue to Reset Password
            </Button>

            <div className="flex items-center gap-2 justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the code?
              </span>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className={`
                  text-sm font-medium transition
                  ${resendCooldown > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-purple-500 hover:text-purple-600 hover:underline'
                  }
                `}
              >
                {resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s` 
                  : 'Resend Code'
                }
              </button>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="text-sm text-purple-500 hover:text-purple-600 hover:underline flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Forgot Password" 
      subtitle="Enter your email to receive a password reset code"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
            <Mail className="w-10 h-10 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We'll send a 6-digit code to your email to reset your password
          </p>
        </div>

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          label="Email Address"
          icon={<Mail className="w-4 h-4" />}
          error={error}
          required
          autoFocus
        />

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3"
        >
          Send Reset Code
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

export default ForgotPasswordPage;