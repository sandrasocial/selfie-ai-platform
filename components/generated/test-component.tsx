tsx
'use client';

import { MouseEventHandler } from 'react';

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: React.ReactNode;
}

export default function Button({ onClick, className = '', children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm ${className}`}
    >
      {children}
    </button>
  );
}