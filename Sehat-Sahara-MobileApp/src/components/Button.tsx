import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg'; // Supported sizes
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  let baseClass = "rounded-full font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:pointer-events-none disabled:opacity-50";
  
  if (fullWidth) baseClass += " w-full";

  if (size === 'sm') baseClass += " h-10 px-4 text-sm";
  else if (size === 'md') baseClass += " h-12 px-5 text-base";
  else if (size === 'lg') baseClass += " h-14 px-6 text-base";
  
  if (variant === 'primary') {
    baseClass += " bg-brand-600 text-white shadow-sm hover:bg-brand-700";
  } else if (variant === 'secondary') {
    baseClass += " bg-brand-50 text-brand-700 hover:bg-brand-100";
  } else if (variant === 'outline') {
    baseClass += " border-2 border-brand-600 text-brand-600 bg-transparent hover:bg-brand-50";
  } else if (variant === 'ghost') {
    baseClass += " bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  } else if (variant === 'danger') {
    baseClass += " bg-red-600 text-white shadow-sm hover:bg-red-700";
  }

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0 flex items-center">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0 flex items-center">{icon}</span>}
        </>
      )}
    </button>
  );
};
