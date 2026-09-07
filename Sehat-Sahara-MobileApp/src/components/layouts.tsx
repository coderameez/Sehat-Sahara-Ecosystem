import React from 'react';
import { MobileAppShell } from './MobileAppShell';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppBack } from '../utils/navigation';

import { BottomNav } from './BottomNav';

/**
 * RootScreenLayout — wraps root tab screens (Home, Care, Community, Profile).
 * Shows bottom navigation. Content area scrolls independently.
 */
export const RootScreenLayout: React.FC<{ 
  children: React.ReactNode;
  activeTab: string;
}> = ({ children, activeTab }) => {
  const navigate = useNavigate();
  return (
    <MobileAppShell className="sehat-root-layout">
      {/* Content area: flex-1 + min-h-0 = takes remaining space; overflow-y-auto = scrolls */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        {children}
      </div>
      {/* Bottom nav: shrink-0 = never compressed */}
      <BottomNav 
        activeId={activeTab} 
        onChange={(id) => {
          if (id === 'home') navigate('/patient');
          else if (id === 'find-care') navigate('/patient/care');
          else if (id === 'ai') navigate('/patient/triage');
          else if (id === 'community') navigate('/patient/community');
          else if (id === 'profile') navigate('/patient/profile');
        }}
      />
    </MobileAppShell>
  );
};

/**
 * InnerScreenLayout — wraps detail/form screens without bottom navigation.
 * Has a sticky header with back button. Main content scrolls.
 */
export const InnerScreenLayout: React.FC<{ 
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
  action?: React.ReactNode;
  bottomPadding?: boolean;
}> = ({ title, subtitle, children, onBack, action, bottomPadding = true }) => {
  const goBack = useAppBack();

  return (
    <MobileAppShell className="sehat-inner-layout">
      {/* Header: shrink-0 = fixed height, never compressed */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-3 pt-safe flex items-center gap-3 shrink-0">
        <button
          onClick={onBack || (() => goBack())}
          className="w-10 h-10 min-w-[40px] flex items-center justify-center rounded-full hover:bg-slate-50 active:bg-slate-100 text-slate-700 transition-colors -ml-1 shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-900 truncate leading-snug">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {/* Main content: flex-1 + min-h-0 + overflow-y-auto = scrollable */}
      <main className={`flex-1 min-h-0 overflow-y-auto relative ${bottomPadding ? 'pb-24' : 'pb-6'}`}>
        {children}
      </main>
    </MobileAppShell>
  );
};
