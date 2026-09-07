import React from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Ban,
  RotateCcw,
  User,
  ShieldAlert,
  History,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';
import type { AdminUser } from '../data/usersMockData';

interface UserDetailDrawerProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSuspend: (userId: string) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  user,
  isOpen,
  onClose,
  onToggleSuspend,
}) => {
  if (!isOpen || !user) return null;

  const isSuspended = user.status === 'Suspended';

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* ── Drawer Panel ─────────────────────────────────────────── */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-50 flex flex-col border-l border-surface-border overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header with User summary & Close */}
        <div className="p-6 border-b border-surface-border flex items-start justify-between bg-surface-page/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 text-lg font-bold flex items-center justify-center border-2 border-white shadow-sm shrink-0">
              {user.avatarInitials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[17px] font-bold text-slate-900 truncate">{user.name}</h2>
                {user.status === 'Verified' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full leading-none">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
                {user.status === 'Pending' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full leading-none">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Pending
                  </span>
                )}
                {user.status === 'Suspended' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full leading-none">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    Suspended
                  </span>
                )}
              </div>
              <p className="text-[12px] font-medium text-slate-500 mt-0.5">{user.role}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">User ID: {user.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── Section: Account Information ───────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-[13.5px]">
              <User className="w-4 h-4 text-brand-600" />
              <span>Account Information</span>
            </div>

            <div className="bg-surface-page/80 border border-surface-border rounded-xl p-4 space-y-2.5 text-[12.5px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Full Name</span>
                <span className="text-slate-900 font-semibold">{user.name}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                </span>
                <span className="text-slate-900 font-semibold font-mono">{user.phone}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </span>
                <span className="text-slate-900 font-semibold truncate max-w-[200px]">{user.email}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">CNIC</span>
                <span className="text-slate-900 font-semibold font-mono">{user.cnic}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Birth
                </span>
                <span className="text-slate-900 font-semibold">{user.dateOfBirth}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Gender</span>
                <span className="text-slate-900 font-semibold">{user.gender}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location
                </span>
                <span className="text-slate-900 font-semibold">{user.location}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Joined On</span>
                <span className="text-slate-900 font-semibold">{user.joinedDate} {user.joinedTime}</span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Last Login</span>
                <span className="text-slate-900 font-semibold">{user.lastLogin}</span>
              </div>
              {user.specialty && (
                <>
                  <div className="border-t border-slate-200/60" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Specialty</span>
                    <span className="text-brand-700 font-semibold">{user.specialty}</span>
                  </div>
                </>
              )}
              {user.facilityType && (
                <>
                  <div className="border-t border-slate-200/60" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Facility Type</span>
                    <span className="text-brand-700 font-semibold">{user.facilityType}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Section: Account Status ────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-[13.5px]">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <span>Account Status</span>
            </div>

            <div className="bg-surface-page/80 border border-surface-border rounded-xl p-4 space-y-2.5 text-[12.5px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isSuspended
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {isSuspended ? 'Suspended' : 'Active'}
                </span>
              </div>
              <div className="border-t border-slate-200/60" />
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Account Type</span>
                <span className="text-slate-900 font-semibold">{user.accountType}</span>
              </div>
            </div>
          </div>

          {/* ── Section: Actions ───────────────────────────────────── */}
          <div className="space-y-3">
            <span className="text-slate-900 font-bold text-[13.5px]">Actions</span>
            <div className="flex items-center gap-3">
              {isSuspended ? (
                <button
                  onClick={() => onToggleSuspend(user.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-600" />
                  Reactivate Account
                </button>
              ) : (
                <button
                  onClick={() => onToggleSuspend(user.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  <Ban className="w-4 h-4 text-rose-600" />
                  Suspend Account
                </button>
              )}
            </div>
          </div>

          {/* ── Section: Audit Trail ───────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-[13.5px]">
              <History className="w-4 h-4 text-brand-600" />
              <span>Audit Trail</span>
            </div>

            <div className="bg-surface-page/80 border border-surface-border rounded-xl p-4 space-y-3">
              {user.auditTrail.map((item, index) => (
                <div key={index} className="text-[12px] space-y-0.5">
                  <p className="text-slate-800 font-semibold">{item.event}</p>
                  <p className="text-slate-400 font-medium">{item.date}</p>
                  {item.notes && (
                    <p className="text-slate-600 text-[11.5px] italic mt-0.5">{item.notes}</p>
                  )}
                  {index < user.auditTrail.length - 1 && (
                    <div className="border-t border-slate-200/60 pt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
