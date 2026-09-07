import React from 'react';
import { MobileAppShell } from '../../../components';
import { ArrowLeft } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const ProviderInnerLayout: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  action?: React.ReactNode;
  bottomPadding?: boolean;
}> = ({ title, subtitle, children, onBack, action, bottomPadding = true }) => {
  const goBack = useAppBack();

  return (
    <MobileAppShell className="sehat-provider-inner-layout">
      <header className="sticky top-0 z-20 bg-brand-600 border-b border-brand-700 px-4 py-3 pt-safe flex items-center gap-3 shadow-sm text-white">
        <button
          onClick={onBack || (() => goBack())}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 active:bg-black/20 text-white transition-colors -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{title}</h1>
          {subtitle && <p className="text-[13px] text-brand-100 truncate opacity-90">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </header>
      <main className={`app-scroll flex-1 min-h-0 relative bg-[#F8FAFC] ${bottomPadding ? 'pb-24' : ''}`}>
        {children}
      </main>
    </MobileAppShell>
  );
};
