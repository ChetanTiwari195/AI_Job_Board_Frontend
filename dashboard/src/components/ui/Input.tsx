import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  icon,
  rightElement,
  className = '',
  ...props
}) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-lg py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
          icon ? 'pl-9' : 'pl-3.5'
        } ${rightElement ? 'pr-8' : 'pr-3.5'} ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
};
