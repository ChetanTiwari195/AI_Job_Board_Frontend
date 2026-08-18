import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  message,
  onDismiss,
  className = '',
}) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
  }[variant];

  const variantStyles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    error: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300',
    warning: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-300',
    info: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300',
  }[variant];

  return (
    <div className={`p-4 border rounded-xl flex items-center gap-3 text-sm animate-fade-in ${variantStyles} ${className}`}>
      {icons}
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
