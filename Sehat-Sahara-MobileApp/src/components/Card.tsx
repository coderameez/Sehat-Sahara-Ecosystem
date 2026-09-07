import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'elevated' | 'brand-dark' | 'sos';
  noPad?: boolean;
}

/**
 * Card — Sehat Sahara visual language
 * Rounded corners (xl = 16px for standard cards).
 * Subtle border + restrained shadow.
 * No exaggerated radius or dark surfaces except where explicitly in references.
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  noPad = false,
  className = '',
  ...props
}) => {
  const base = 'rounded-xl overflow-hidden';

  const variants: Record<string, string> = {
    default:
      'bg-white border border-surface-border shadow-card text-slate-900',
    interactive:
      'bg-white border border-surface-border shadow-card text-slate-900 ' +
      'cursor-pointer hover:shadow-card-hover hover:border-slate-300 ' +
      'transition-shadow duration-150 active:scale-[0.99]',
    elevated:
      'bg-white border border-surface-border shadow-card-elevated text-slate-900',
    'brand-dark':
      'bg-brand-700 border border-brand-800 text-white shadow-card',
    sos:
      'bg-sos-600 border border-sos-700 text-white shadow-card',
  };

  const pad = noPad ? '' : 'p-4';

  return (
    <div className={`${base} ${variants[variant]} ${pad} ${className}`} {...props}>
      {children}
    </div>
  );
};
