import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

interface AdminHeaderProps {
  /** Current page title shown in header */
  pageTitle: string;
  /** Subtitle / breadcrumb */
  pageSubtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  pageTitle,
  pageSubtitle,
}) => {
  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 shrink-0">
      {/* ── Left: Page title ──────────────────────────────────────── */}
      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-[17px] font-bold text-slate-900 leading-tight truncate">
          {pageTitle}
        </h1>
        {pageSubtitle && (
          <span className="text-[12px] text-slate-500 font-medium leading-tight mt-0.5 truncate">
            {pageSubtitle}
          </span>
        )}
      </div>

      {/* ── Right: Search + Notifications + Admin Profile ─────────── */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative hidden lg:flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search platform…"
            className="w-60 h-9 pl-9 pr-3 rounded-lg border border-surface-border bg-surface-page text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
          />
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-lg border border-surface-border bg-white flex items-center justify-center hover:bg-surface-page transition-colors">
          <Bell className="w-[18px] h-[18px] text-slate-600" />
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-sos-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            5
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-surface-border" />

        {/* Admin avatar + dropdown */}
        <button className="flex items-center gap-2.5 hover:bg-surface-page rounded-lg px-2 py-1.5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
            A
          </div>
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-[13px] font-semibold text-slate-900">Admin</span>
            <span className="text-[11px] text-slate-500 font-medium">Super Admin</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};
