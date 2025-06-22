tsx
'use client';

import { MouseEventHandler } from 'react';

type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

const Button = ({ onClick, variant = 'primary', size = 'md', children }: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded font-semibold transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
};

export default Button;