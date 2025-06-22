tsx
'use client';

import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md font-semibold transition-colors duration-200 ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default Button;