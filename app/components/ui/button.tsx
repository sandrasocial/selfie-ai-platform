import React from 'react';

interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const buttonVariants = {
  default: 'bg-[#171719] text-[#F1F1F1] hover:bg-[#000000] border border-[#171719]',
  outline: 'bg-transparent text-[#171719] border border-[#171719] hover:bg-[#171719] hover:text-[#F1F1F1]',
  ghost: 'bg-transparent text-[#171719] hover:bg-[#F1F1F1]'
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

export function Button({ 
  variant = 'default', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-["Inter"] font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#171719] focus:ring-offset-2';
  const classes = `${baseClasses} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
  
  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
} 