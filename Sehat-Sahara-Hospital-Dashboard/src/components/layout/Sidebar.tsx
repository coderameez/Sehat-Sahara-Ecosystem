import { useState, useCallback, useSyncExternalStore } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  ListOrdered,
  Users,
  Stethoscope,
  Building2,
  HeartPulse,
  Clock,
  Receipt,
  Hospital,
  Settings,
  ChevronDown,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { facilities, sidebarNavigation } from '../../data/demo-data';
import { store } from '../../store';

// Icon mapping for sidebar items
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  CalendarCheck,
  ListOrdered,
  Users,
  Stethoscope,
  Building2,
  HeartPulse,
  Clock,
  Receipt,
  Hospital,
  Settings,
  Briefcase,
};

export function Sidebar() {
  const location = useLocation();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [, setHoveredItem] = useState<string | null>(null);

  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );
  
  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId) || facilities[0];
  const activeBranch = activeFacility.branches.find((b) => b.id === state.session.activeBranchId) || activeFacility.branches[0];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col bg-brand-700 shadow-xl">
      {/* ── Logo & Brand ── */}
      <div className="flex h-16 items-center gap-3 border-b border-brand-600/50 px-5">
        <img
          src={activeFacility.logoUrl}
          alt="Sehat Sahara"
          className="h-10 w-auto"
          onError={(e) => {
            // Fallback: hide broken image and show text only
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* We keep the text hidden by default if the logo has text, or rely on the logo asset size.
            The logo might already have the text in it based on the user's attachment. */}
      </div>

      {/* ── Clinic Identity / Branch Selector ── */}
      <div className="mx-4 mt-4 mb-2 relative">
        <div 
          className={cn(
            "flex items-center gap-2.5 rounded-xl bg-brand-800/50 px-3 py-2.5",
            state.session.facilityType === 'HOSPITAL' ? "cursor-pointer hover:bg-brand-800" : ""
          )}
          onClick={() => {
            if (state.session.facilityType === 'HOSPITAL') {
              const menu = document.getElementById('branch-menu');
              if (menu) menu.classList.toggle('hidden');
            }
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Hospital size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{activeBranch.name}</p>
            <p className="text-[10px] text-brand-200 capitalize">{activeBranch.type.replace('_', ' ').toLowerCase()}</p>
          </div>
          {state.session.facilityType === 'HOSPITAL' && (
            <ChevronDown size={14} className="text-brand-400 flex-shrink-0" />
          )}
        </div>
        
        {/* Branch Menu (Hospital only) */}
        {state.session.facilityType === 'HOSPITAL' && (
          <div id="branch-menu" className="hidden absolute top-full left-0 mt-1 w-full rounded-xl bg-white shadow-lg overflow-hidden z-50 py-1">
            {activeFacility.branches.map((b) => (
              <button
                key={b.id}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm text-txt-primary hover:bg-slate-50 transition-colors",
                  b.id === state.session.activeBranchId ? "font-bold bg-brand-50 text-brand-700" : ""
                )}
                onClick={() => {
                  store.setSessionBranch(b.id);
                  document.getElementById('branch-menu')?.classList.add('hidden');
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Navigation Groups ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {sidebarNavigation.map((group, groupIndex) => (
          <div key={groupIndex} className={groupIndex > 0 ? 'mt-5' : ''}>
            {group.title && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-brand-300">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const IconComponent = iconMap[item.icon] || LayoutDashboard;
                const active = isActive(item.path);
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-brand-600 text-white font-bold shadow-sm'
                        : 'text-brand-100 hover:bg-brand-800 hover:text-white'
                    )}
                  >
                    {/* Active accent bar */}
                    {active && (
                      <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-white" />
                    )}
                    <IconComponent
                      size={18}
                      className={cn(
                        'flex-shrink-0 transition-colors',
                        active ? 'text-white' : 'text-brand-300 group-hover:text-brand-100'
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-brand-700 shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer / Version ── */}
      <div className="border-t border-brand-600/50 px-5 py-3">
        <p className="text-[10px] text-brand-300 text-center">
          Sehat Sahara Hospital v1.0
        </p>
      </div>
    </aside>
  );
}
