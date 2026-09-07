import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  className = '',
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const posClass = position === 'right'
    ? 'inset-y-0 right-0 max-w-[280px] rounded-l-3xl'
    : 'inset-y-0 left-0 max-w-[280px] rounded-r-3xl';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`absolute bg-white shadow-card-elevated flex flex-col h-full w-full z-10 ${posClass} ${className}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <h3 className="font-bold text-base text-slate-900">{title}</h3>
          <IconButton icon={<X className="w-4 h-4" />} size="sm" onClick={onClose} label="Close" />
        </div>
        <div className="p-5 overflow-y-auto flex-1 text-sm text-slate-600 leading-relaxed app-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};
