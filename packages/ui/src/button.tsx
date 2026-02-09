import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const BASE_CLASSES =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1F1F1F] disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    'bg-white text-[#1F1F1F] hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus:ring-white',
  secondary:
    'bg-[#333333] text-white border border-[#444444] hover:bg-[#3a3a3a] focus:ring-[#555555]',
  ghost:
    'bg-transparent text-gray-300 hover:bg-[#333333] hover:text-white focus:ring-[#555555]',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
