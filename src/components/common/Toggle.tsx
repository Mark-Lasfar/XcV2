import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}) => {
  const sizes = {
    sm: { width: 'w-8', height: 'h-5', dot: 'w-3 h-3', translate: 'translate-x-3' },
    md: { width: 'w-10', height: 'h-6', dot: 'w-4 h-4', translate: 'translate-x-4' },
    lg: { width: 'w-12', height: 'h-7', dot: 'w-5 h-5', translate: 'translate-x-5' },
  };

  const sizeStyles = sizes[size];

  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative inline-block">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            ${sizeStyles.width} ${sizeStyles.height}
            rounded-full transition-colors duration-200 ease-in-out
            ${checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
          `}
        >
          <div
            className={`
              ${sizeStyles.dot}
              bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
              ${checked ? sizeStyles.translate : 'translate-x-0.5'}
              ${size === 'sm' ? 'mt-0.5' : size === 'md' ? 'mt-1' : 'mt-1'}
            `}
          />
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      )}
    </label>
  );
};