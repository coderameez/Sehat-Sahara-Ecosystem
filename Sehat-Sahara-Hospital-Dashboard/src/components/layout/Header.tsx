import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Check,
  MapPin,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { facilities } from '../../data/demo-data';
import { store } from '../../store';

export function Header() {
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const branchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId) || facilities[0];
  const activeBranch = activeFacility.branches.find((b) => b.id === state.session.activeBranchId);
  const unreadCount = state.notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setShowBranchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-surface-border bg-white px-6">
      <div className="flex items-center gap-4">
        {state.session.facilityType === 'HOSPITAL' && (
          <div ref={branchRef} className="relative">
            <button
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-sm font-medium text-txt-primary hover:bg-slate-50 transition-colors"
            >
              <MapPin size={15} className="text-brand-600" />
              <span className="max-w-[200px] truncate">{activeBranch?.name || 'Select Branch'}</span>
              <ChevronDown size={14} className="text-txt-muted" />
            </button>

            {showBranchDropdown && (
              <div className="absolute left-0 top-full mt-1 w-72 rounded-xl border border-surface-border bg-white shadow-modal z-50">
                <div className="p-2">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-txt-muted">
                    Select Branch
                  </p>
                  {activeFacility.branches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => {
                        store.setSessionBranch(branch.id);
                        setShowBranchDropdown(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                        state.session.activeBranchId === branch.id
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-txt-secondary hover:bg-slate-50'
                      )}
                    >
                      <MapPin
                        size={14}
                        className={
                          state.session.activeBranchId === branch.id
                            ? 'text-brand-600'
                            : 'text-txt-muted'
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{branch.name}</p>
                        <p className="text-[11px] text-txt-muted truncate">{branch.address}</p>
                      </div>
                      {state.session.activeBranchId === branch.id && (
                        <Check size={14} className="text-brand-600 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Search, Notifications, Profile ── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
          <input
            type="text"
            placeholder="Search patients, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-64 rounded-xl border border-surface-border bg-white pl-9 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:border-brand-600 focus:shadow-focus-ring focus:outline-none transition-all"
          />
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border text-txt-secondary hover:bg-slate-50 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-sos-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-xl border border-surface-border bg-white shadow-modal z-50">
              <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
                <h3 className="text-sm font-semibold text-txt-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => store.markAllNotificationsRead()}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {state.notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => store.markNotificationRead(notif.id)}
                    className={cn(
                      'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50',
                      !notif.read && 'bg-brand-50/40'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-1.5 h-2 w-2 flex-shrink-0 rounded-full',
                        notif.read ? 'bg-transparent' : 'bg-brand-600'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-txt-primary">{notif.message}</p>
                      <p className="text-[11px] text-txt-muted mt-0.5">{notif.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 rounded-xl border border-surface-border px-3 py-1.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
              SA
            </div>
            <div className="hidden min-w-0 text-left lg:block">
              <p className="text-sm font-medium text-txt-primary leading-tight">Staff Admin</p>
              <p className="text-[11px] text-txt-muted leading-tight">Admin</p>
            </div>
            <ChevronDown size={14} className="text-txt-muted" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-surface-border bg-white shadow-modal z-50">
              <div className="p-2">
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-txt-secondary hover:bg-slate-50 transition-colors">
                  View Profile
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-txt-secondary hover:bg-slate-50 transition-colors">
                  Account Settings
                </button>
                <div className="my-1 border-t border-surface-border" />
                <button 
                  onClick={() => {
                    store.logout();
                    navigate('/login');
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
