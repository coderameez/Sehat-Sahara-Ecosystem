import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full max-w-xs bg-white rounded-3xl shadow-card-elevated overflow-hidden flex flex-col max-h-[80vh] z-10 ${className}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <h3 className="font-bold text-base text-slate-900 leading-tight">{title}</h3>
          <IconButton icon={<X className="w-4 h-4" />} size="sm" onClick={onClose} label="Close" />
        </div>
        <div className="p-5 overflow-y-auto flex-1 text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-3.5 bg-surface-section border-t border-surface-border flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
