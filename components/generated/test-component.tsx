tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false }: ButtonProps) => {
  const baseClasses = 'font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantClasses = '';
  
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-300 text-gray-700';
      break;
    case 'danger':
      variantClasses = 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white';
      break;
  }
  
  let sizeClasses = '';
  
  switch (size) {
    case 'sm':
      sizeClasses = 'px-3 py-1.5 text-sm';
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
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;