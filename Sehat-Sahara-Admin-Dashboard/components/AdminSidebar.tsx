import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  MessageSquareWarning,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '../config/navigation';

// Icon resolver — maps string name to lucide component
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  MessageSquareWarning,
  Settings,
};

interface AdminSidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`
        flex flex-col h-full bg-brand-700 text-white
        transition-all duration-200 ease-in-out shrink-0
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* ── Brand Header ─────────────────────────────────────────────── */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-brand-800/50 shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <img
          src="/brand/sehat-sahara-logo-transparent.png"
          alt="Sehat Sahara"
          className="w-9 h-9 shrink-0 object-contain"
          onError={(e) => {
            const t = e.currentTarget;
            if (!t.src.endsWith('.png.png')) {
              t.src = '/brand/sehat-sahara-logo-transparent.png.png';
            }
          }}
        />
        {!collapsed && (
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-sm font-bold tracking-tight text-white">Sehat Sahara</span>
            <span className="text-[11px] font-medium text-brand-200 mt-0.5">Admin Panel</span>
          </div>
        )}
      </div>

      {/* ── Navigation Items ─────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = activeSection === item.id;
            const isDisabled = !item.enabled;

            return (
              <button
                key={item.id}
                onClick={() => item.enabled && onNavigate(item.id)}
                disabled={isDisabled}
                title={collapsed ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-left text-[13.5px] font-medium
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : isDisabled
                      ? 'text-brand-300/50 cursor-not-allowed'
                      : 'text-brand-200 hover:bg-white/10 hover:text-white cursor-pointer'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`
                        text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                        ${isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-brand-500/40 text-brand-100'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                    {isDisabled && (
                      <span className="text-[9px] uppercase tracking-wider text-brand-400/60 font-bold">Soon</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom Section ────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-brand-800/50 px-2 py-3 space-y-1">
        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-brand-200 hover:bg-white/10 hover:text-white transition-colors text-[13px] font-medium"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* Logout */}
        <button
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-brand-200 hover:bg-white/10 hover:text-white transition-colors text-[13px] font-medium ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
