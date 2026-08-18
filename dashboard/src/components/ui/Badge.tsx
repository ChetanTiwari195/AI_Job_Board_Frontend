import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'score' | 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  score?: number | null;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  score,
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';
  
  let variantStyles = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (variant === 'score' && score !== undefined && score !== null) {
    if (score >= 80) {
      variantStyles = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
    } else if (score >= 50) {
      variantStyles = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
    }
    const standardStyles: Record<string, string> = {
      primary: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
      success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
      warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
      danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50',
      neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    };
    variantStyles = standardStyles[variant] || variantStyles;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {variant === 'score' && score !== undefined && score !== null && !children ? `${score}% Match` : children}
    </span>
  );
};

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
}

export const Pill: React.FC<PillProps> = ({ children, icon, className = '', ...props }) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-medium ${className}`}
    {...props}
  >
    {icon && <span className="text-slate-400 flex-shrink-0">{icon}</span>}
    <span className="truncate">{children}</span>
  </span>
);
