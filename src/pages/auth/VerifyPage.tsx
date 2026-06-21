import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { showToast } from '../../components/common/Toast';

const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResendSuccess, setIsResendSuccess] = useState(false);

  const { verifyEmail, resendVerification, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = searchParams.get('email') || sessionStorage.getItem('pendingVerificationEmail') || '';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile/me');
    }

    if (!email) {
      showToast('No email provided. Please register first.', 'error');
      navigate('/register');
    }

    // Start countdown for resend
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    return () => clearInterval(timer);
  }, [email, isAuthenticated, navigate]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(new Event('submit') as any);
    }
  }, [otp]);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = otp.split('');
    newOtp[index] = value;
    const newOtpString = newOtp.join('');
    setOtp(newOtpString);

    // Move to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code');
      setLoading(false);
      return;
    }

    try {
      await verifyEmail(email, otp);
      sessionStorage.removeItem('pendingVerificationEmail');
      showToast('Email verified successfully!', 'success');
      navigate('/profile/me');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      showToast(err.message || 'Invalid verification code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendLoading(true);
    setIsResendSuccess(false);

    try {
      await resendVerification(email);
      showToast('New verification code sent!', 'success');
      setIsResendSuccess(true);
      setOtp('');
      setTimeLeft(60);
      setCanResend(false);
      
      // Focus first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }

      // Restart timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      showToast(err.message || 'Failed to resend code', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Verify Your Email" 
      subtitle={`We sent a verification code to ${email}`}
    >
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <Mail className="w-10 h-10 text-purple-500" />
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Enter the 6-digit code to verify your email address
        </p>
        {isResendSuccess && (
          <p className="mt-1 text-sm text-green-500 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            New code sent successfully!
          </p>
        )}
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
            Verification Code
          </label>
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={otp[index] || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 1) {
                    handleOtpChange(index, value);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-12 h-14 text-center text-2xl font-bold
                  border-2 rounded-xl transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                `}
                disabled={loading}
                autoComplete="off"
              />
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
          <p className="mt-2 text-xs text-gray-400 text-center">
            Enter the 6-digit code from your email
          </p>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resendLoading}
            className={`
              text-sm font-medium transition flex items-center justify-center gap-2 mx-auto
              ${canResend && !resendLoading
                ? 'text-purple-500 hover:text-purple-600 hover:underline'
                : 'text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {resendLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : canResend ? (
              'Resend Code'
            ) : (
              `Resend in ${timeLeft}s`
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-purple-500 hover:underline font-medium flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-purple-500 hover:underline font-medium"
          >
            Create new account
          </button>
        </div>
      </form>
    </AuthCard>
  );
};

export default VerifyPage;