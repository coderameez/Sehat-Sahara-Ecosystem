import React from 'react';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = 'md',
  fullScreen = false,
}) => {
  const spinnerSizes: Record<string, string> = {
    sm: 'w-5  h-5  border-2',
    md: 'w-7  h-7  border-2',
    lg: 'w-10 h-10 border-[3px]',
  };

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
      <div className={`animate-spin rounded-full border-brand-100 border-t-brand-600 ${spinnerSizes[size]}`} />
      {message && <p className="text-xs font-medium text-slate-500">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
