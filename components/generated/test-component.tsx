tsx
'use client';

import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  const baseClasses = 'rounded font-semibold transition-colors duration-200';
  let variantClasses = '';
  let sizeClasses = '';

  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-500 text-white hover:bg-blue-600';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
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