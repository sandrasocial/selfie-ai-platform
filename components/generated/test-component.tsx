tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, className = '', children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;