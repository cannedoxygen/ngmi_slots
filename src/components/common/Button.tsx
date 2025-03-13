// src/components/common/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled,
  className = '',
  ...rest
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size specific classes
  const sizeClasses = {
    small: 'text-xs px-2.5 py-1.5 rounded',
    medium: 'text-sm px-4 py-2 rounded-md',
    large: 'text-base px-6 py-3 rounded-lg',
  };
  
  // Variant specific classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-800/30',
    secondary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-800/30',
    outline: 'bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/20',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-800/30',
    ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white',
  };
  
  // Combine classes
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${className}
  `;
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;