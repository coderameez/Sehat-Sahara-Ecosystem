import React from 'react';
import { Home, Search, Mic, Users, User } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSpecial?: boolean;
  badge?: number | string;
}

export interface BottomNavProps {
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  items?: NavItem[];
}

const DEFAULT_ITEMS: NavItem[] = [
  { id: 'home',      label: 'Home',      icon: <Home      className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
  { id: 'find-care', label: 'Find Care', icon: <Search    className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
  { id: 'ai',        label: 'AI',        icon: <Mic       className="w-5 h-5 sm:w-6 sm:h-6"           />, isSpecial: true },
  { id: 'community', label: 'Community', icon: <Users     className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
  { id: 'profile',   label: 'Profile',   icon: <User      className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
];

/**
 * BottomNav — Sehat Sahara
 * Maximum 5 items as per contract.
 * Center item (AI Check) floats above the bar as a primary action.
 * Active state: brand-600 color with bold label.
 * Inactive state: slate-400.
 */
export const BottomNav: React.FC<BottomNavProps> = ({
  activeId,
  onChange,
  className = '',
  items = DEFAULT_ITEMS,
}) => {
  return (
    <nav
      className={`shrink-0 bg-white border-t border-surface-border flex items-end justify-around z-30 select-none pb-safe ${className}`}
      style={{ minHeight: '60px', paddingLeft: '2px', paddingRight: '2px' }}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;

        if (item.isSpecial) {
          return (
            <div key={item.id} className="flex flex-col items-center px-0.5" style={{ marginBottom: '4px' }}>
              {/* Floating elevated button */}
              <button
                onClick={() => onChange(item.id)}
                aria-label={item.label}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-600 text-white shadow-card-elevated hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 transition-colors -translate-y-3 sm:-translate-y-4"
              >
                {item.icon}
              </button>
              <span
                className="text-[9px] sm:text-[10px] font-semibold leading-none -mt-1 tracking-tight"
                style={{ color: isActive ? '#166B32' : '#94A3B8' }}
              >
                {item.label}
              </span>
            </div>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex-1 min-w-0 flex flex-col items-center justify-end gap-0.5 pb-2 focus:outline-none px-0.5"
            style={{ color: isActive ? '#166B32' : '#94A3B8' }}
          >
            <div className="relative">
              {item.icon}
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 text-[9px] font-bold text-white bg-sos-500 rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[9px] sm:text-[10px] leading-none truncate max-w-full tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
