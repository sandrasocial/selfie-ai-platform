tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function Button({ 
  text, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'font-bold rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? disabledClasses : ''
      }`}
    >
      {text}
    </button>
  );
}