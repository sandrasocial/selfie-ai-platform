tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Button({ onClick, children, className = '', disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}