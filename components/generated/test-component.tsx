tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const Button = ({ label, onClick, variant = 'primary', size = 'medium', disabled = false }: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const className = `rounded font-semibold transition-colors duration-200 ${
    variantClasses[variant]
  } ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;