import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center mx-auto ${className}`}>
    {icon && (
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        {icon}
      </div>
    )}
    <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
    {description && <p className="text-xs text-slate-500 mb-5 leading-relaxed max-w-[220px]">{description}</p>}
    {actionLabel && onAction && (
      <Button size="sm" onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);
