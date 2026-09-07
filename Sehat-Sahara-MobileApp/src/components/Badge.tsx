import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'verified' | 'pending' | 'sos' | 'success' | 'warning' | 'info' | 'neutral' | 'cancelled';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Badge / Status Chip — Sehat Sahara visual language
 * Pill shape (rounded-full). Compact height.
 * Colors matched to reference status appearances on pages 28-36.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizes: Record<string, string> = {
    sm: 'text-[10px] px-2   py-0.5 gap-1',
    md: 'text-xs    px-2.5 py-1   gap-1',
  };

  const variants: Record<string, string> = {
    verified:  'bg-emerald-50  text-emerald-700 border border-emerald-200',
    success:   'bg-emerald-50  text-emerald-700 border border-emerald-200',
    pending:   'bg-amber-50    text-amber-700   border border-amber-200',
    warning:   'bg-amber-50    text-amber-700   border border-amber-200',
    sos:       'bg-rose-50     text-rose-700    border border-rose-200 font-bold',
    cancelled: 'bg-rose-50     text-rose-700    border border-rose-200',
    info:      'bg-sky-50      text-sky-700     border border-sky-200',
    neutral:   'bg-slate-100   text-slate-600   border border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold leading-none shrink-0 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
