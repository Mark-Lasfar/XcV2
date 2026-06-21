import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { SocialLogin } from '../../components/auth/SocialLogin';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, User, UserPlus } from 'lucide-react';
import { showToast } from '../../components/common/Toast';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile/me');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Please accept the Terms of Service');
      showToast('Please accept the Terms of Service', 'warning');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      showToast('Password must be at least 8 characters', 'warning');
      return;
    }

    // Check password strength
    const isStrong = Object.values(passwordStrength).every(Boolean);
    if (!isStrong) {
      setError('Please meet all password requirements');
      showToast('Please meet all password requirements', 'warning');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username: username.toLowerCase().replace(/\s/g, ''),
        email,
        password,
        nickname: nickname || username,
      });

      if (result.requiresVerification) {
        showToast('Account created! Please verify your email.', 'success');
        navigate(`/verify?email=${encodeURIComponent(email)}`);
        return;
      }

      showToast('Registration successful! Welcome!', 'success');
      navigate('/profile/me');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Social Login Success Handler
  const handleSocialLoginSuccess = (provider: string, data: any) => {
    console.log(`Registered with ${provider}:`, data);
    showToast(`Successfully registered with ${provider}!`, 'success');
    navigate('/profile/me');
  };

  const handleSocialLoginError = (error: string) => {
    setError(error);
    showToast(error, 'error');
  };

  return (
    <AuthCard title="Create Account" subtitle="Join the community">
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          label="Username"
          icon={<User className="w-4 h-4" />}
          required
          minLength={3}
          disabled={loading}
          autoFocus
        />

        <Input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname (optional)"
          label="Display Name"
          icon={<UserPlus className="w-4 h-4" />}
          disabled={loading}
        />

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          label="Email Address"
          icon={<Mail className="w-4 h-4" />}
          required
          disabled={loading}
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="8+ characters"
          label="Password"
          error={error}
          disabled={loading}
        />

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Password requirements:
            </p>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
              <li className="flex items-center gap-2">
                <span className={passwordStrength.length ? 'text-green-500' : 'text-gray-400'}>
                  {passwordStrength.length ? '✓' : '○'}
                </span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <span className={passwordStrength.uppercase ? 'text-green-500' : 'text-gray-400'}>
                  {passwordStrength.uppercase ? '✓' : '○'}
                </span>
                One uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <span className={passwordStrength.lowercase ? 'text-green-500' : 'text-gray-400'}>
                  {passwordStrength.lowercase ? '✓' : '○'}
                </span>
                One lowercase letter
              </li>
              <li className="flex items-center gap-2">
                <span className={passwordStrength.number ? 'text-green-500' : 'text-gray-400'}>
                  {passwordStrength.number ? '✓' : '○'}
                </span>
                One number
              </li>
              <li className="flex items-center gap-2">
                <span className={passwordStrength.special ? 'text-green-500' : 'text-gray-400'}>
                  {passwordStrength.special ? '✓' : '○'}
                </span>
                One special character
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
            disabled={loading}
          />
          <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
            I agree to the{' '}
            <Link to="/terms" className="text-purple-500 hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-purple-500 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
        >
          Create Account
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
          Already have an account?{' '}
          <Link to="/login" className="text-purple-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;