tsx
'use client';

import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  const baseClasses = 'font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantClasses = '';
  let sizeClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400';
      break;
  }

  switch (size) {
    case 'sm':
      sizeClasses = 'px-2 py-1 text-sm';
      break;
    case 'md':
      sizeClasses = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeClasses = 'px-6 py-3 text-lg';
      break;
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses}`}
    >
      {children}
    </button>
  );
};

export default Button;