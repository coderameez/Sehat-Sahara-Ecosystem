import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'ghost' | 'surface' | 'primary' | 'sos';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  badgeCount?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  badgeCount,
  className = '',
  ...props
}) => {
  const sizes: Record<string, string> = {
    sm: 'w-8  h-8  text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const variants: Record<string, string> = {
    ghost:
      'text-slate-600 hover:bg-surface-section active:bg-slate-200',
    surface:
      'bg-white text-slate-700 border border-surface-border shadow-card ' +
      'hover:bg-slate-50 active:bg-slate-100',
    primary:
      'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
    sos:
      'bg-sos-600 text-white hover:bg-sos-700 active:bg-sos-800 shadow-sm',
  };

  return (
    <button
      aria-label={label}
      className={`
        relative inline-flex items-center justify-center rounded-full
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1
        disabled:opacity-50 disabled:pointer-events-none select-none
        ${sizes[size]} ${variants[variant]} ${className}
      `}
      {...props}
    >
      {icon}
      {typeof badgeCount === 'number' && badgeCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-0.5 text-[9px] font-bold text-white bg-sos-500 rounded-full border-2 border-white">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </button>
  );
};
