import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 3,
  disabled,
  ...props
}, ref) => {
  const textareaId = id ?? (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold text-slate-700 leading-none">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={`
          w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm
          rounded-xl border p-3.5 transition-colors duration-150 resize-none
          focus:outline-none focus:ring-2 focus:border-brand-600
          disabled:bg-surface-section disabled:text-slate-400 disabled:cursor-not-allowed
          ${error
            ? 'border-sos-500 focus:ring-sos-500/20 focus:border-sos-600'
            : 'border-surface-border hover:border-slate-300 focus:ring-brand-600/15'}
          ${className}
        `}
        {...props}
      />
      {error
        ? <p className="text-xs text-sos-600 font-medium">{error}</p>
        : helperText
        ? <p className="text-xs text-slate-500">{helperText}</p>
        : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
