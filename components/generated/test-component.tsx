tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: React.ReactNode;
}

const Button = ({ onClick, className = '', children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;