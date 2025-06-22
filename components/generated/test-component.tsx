tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

const Button = ({ onClick, text, variant = 'primary', size = 'medium' }: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
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
    case 'small':
      sizeClasses = 'px-2 py-1 text-sm';
      break;
    case 'medium':
      sizeClasses = 'px-4 py-2 text-base';
      break;
    case 'large':
      sizeClasses = 'px-6 py-3 text-lg';
      break;
  }

  const classes = `${baseClasses} ${variantClasses} ${sizeClasses}`;

  return (
    <button className={classes} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;