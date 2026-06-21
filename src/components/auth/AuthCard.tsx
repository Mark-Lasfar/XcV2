import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
      <div 
        className={`
          w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl 
          shadow-2xl p-8 transition-all duration-300 
          hover:shadow-3xl hover:-translate-y-1
          ${className}
        `}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img src="/assets/img/logo.svg" alt="Logo" className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};