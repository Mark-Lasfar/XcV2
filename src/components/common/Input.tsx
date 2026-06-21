import React, { forwardRef } from 'react';
import { Search, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  type = 'text',
  disabled = false, // ✅ إضافة disabled مع القيمة الافتراضية
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';

  const inputClasses = `
    px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg
    text-gray-900 dark:text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${isPassword ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${disabled ? 'opacity-50' : ''}`}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition ${
              disabled ? 'opacity-50 cursor-not-allowed hover:text-gray-400' : ''
            }`}
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {icon && iconPosition === 'right' && !isPassword && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ${disabled ? 'opacity-50' : ''}`}>
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';