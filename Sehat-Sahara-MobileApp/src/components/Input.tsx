import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leadingIcon,
  trailingIcon,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 leading-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {leadingIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm
            rounded-xl border h-11 transition-colors duration-150
            focus:outline-none focus:ring-2 focus:border-brand-600
            disabled:bg-surface-section disabled:text-slate-400 disabled:cursor-not-allowed
            ${leadingIcon  ? 'pl-10'  : 'pl-3.5'}
            ${trailingIcon ? 'pr-10'  : 'pr-3.5'}
            ${error
              ? 'border-sos-500 focus:ring-sos-500/20 focus:border-sos-600'
              : 'border-surface-border hover:border-slate-300 focus:ring-brand-600/15'}
            ${className}
          `}
          {...props}
        />
        {trailingIcon && (
          <div className="absolute right-3.5 flex items-center text-slate-400">
            {trailingIcon}
          </div>
        )}
      </div>
      {error
        ? <p className="text-xs text-sos-600 font-medium">{error}</p>
        : helperText
        ? <p className="text-xs text-slate-500">{helperText}</p>
        : null}
    </div>
  );
});

Input.displayName = 'Input';
