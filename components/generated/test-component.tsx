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
  const baseClasses = 'rounded font-bold transition-colors duration-200';
  let variantClasses = '';
  let sizeClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-500 hover:bg-blue-600 text-white';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 hover:bg-gray-300 text-gray-700';
      break;
  }

  switch (size) {
    case 'small':
      sizeClasses = 'text-sm py-1 px-2';
      break;
    case 'medium':
      sizeClasses = 'text-base py-2 px-4';
      break;
    case 'large':
      sizeClasses = 'text-lg py-3 px-6';
      break;
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;