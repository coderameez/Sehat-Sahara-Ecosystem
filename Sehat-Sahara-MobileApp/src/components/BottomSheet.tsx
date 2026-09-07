import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showHandle?: boolean;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showHandle = true,
  className = '',
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full max-w-[440px] bg-white rounded-t-3xl shadow-card-elevated overflow-hidden flex flex-col max-h-[85vh] z-10 ${className}`}>
        {showHandle && (
          <div className="pt-3 pb-1 flex justify-center">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
        {title && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border">
            <h3 className="font-bold text-base text-slate-900">{title}</h3>
            <IconButton icon={<X className="w-4 h-4" />} size="sm" onClick={onClose} label="Close" />
          </div>
        )}
        <div className="p-5 overflow-y-auto flex-1 text-sm text-slate-600 leading-relaxed app-scroll">
          {children}
        </div>
        {footer && (
          <div className="p-4 bg-surface-section border-t border-surface-border pb-safe">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
