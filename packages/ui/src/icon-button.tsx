import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  danger?: boolean;
}

export function IconButton({
  active = false,
  danger = false,
  className = '',
  children,
  ...props
}: IconButtonProps) {
  const base =
    'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1F1F1F]';

  const variant = danger
    ? 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500'
    : active
      ? 'bg-white text-[#1F1F1F] hover:bg-gray-100 focus:ring-white'
      : 'bg-[#333333] text-gray-300 hover:bg-[#444444] hover:text-white focus:ring-[#555555]';

  return (
    <button className={[base, variant, className].join(' ')} {...props}>
      {children}
    </button>
  );
}
