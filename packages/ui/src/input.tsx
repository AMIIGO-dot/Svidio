import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm text-gray-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'rounded-lg bg-[#333333] border border-[#444444] px-4 py-3 text-white placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-[#555555]',
          'transition-all duration-200',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  );
}
