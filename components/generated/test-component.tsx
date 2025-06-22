tsx
'use client';

import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  const buttonClasses = `
    ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
    ${size === 'small' ? 'px-2 py-1 text-sm' : size === 'large' ? 'px-6 py-3 text-xl' : 'px-4 py-2 text-base'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
    rounded font-semibold transition duration-200 ease-in-out
  `;

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;