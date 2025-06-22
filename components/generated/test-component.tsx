tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button = ({ label, onClick, variant = 'primary', size = 'md', disabled = false }: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantClasses = '';
  let sizeClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400';
      break;
  }

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

  const classes = `${baseClasses} ${variantClasses} ${sizeClasses}`;

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;