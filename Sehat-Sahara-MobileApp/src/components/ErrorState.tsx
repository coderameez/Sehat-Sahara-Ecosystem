import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'banner' | 'card';
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  variant = 'card',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div className={`p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2 min-w-0">
          <AlertCircle className="w-4 h-4 text-sos-600 shrink-0" />
          <p className="text-xs text-sos-700 font-medium truncate">{message}</p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="text-xs font-bold text-sos-700 hover:text-sos-900 underline shrink-0">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center mx-auto ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-sos-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed max-w-[220px]">{message}</p>
      {onRetry && (
        <Button size="sm" variant="secondary" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
