import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const selectId = id ?? (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 leading-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`
            w-full appearance-none bg-white text-slate-900 text-sm
            rounded-xl border h-11 pl-3.5 pr-10 transition-colors duration-150
            focus:outline-none focus:ring-2 focus:border-brand-600
            disabled:bg-surface-section disabled:text-slate-400 disabled:cursor-not-allowed
            ${error
              ? 'border-sos-500 focus:ring-sos-500/20 focus:border-sos-600'
              : 'border-surface-border hover:border-slate-300 focus:ring-brand-600/15'}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error
        ? <p className="text-xs text-sos-600 font-medium">{error}</p>
        : helperText
        ? <p className="text-xs text-slate-500">{helperText}</p>
        : null}
    </div>
  );
});

Select.displayName = 'Select';
