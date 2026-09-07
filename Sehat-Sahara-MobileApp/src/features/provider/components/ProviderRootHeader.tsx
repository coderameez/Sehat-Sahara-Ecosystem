import React, { useSyncExternalStore } from 'react';
import { Bell, ShieldCheck, ShieldAlert, GraduationCap, XOctagon } from 'lucide-react';
import { ProviderStore, VerificationStatus } from '../../../services/ProviderStore';
import { SehatSaharaLogo } from '../../../components';
import { useNavigate } from 'react-router-dom';

export const ProviderRootHeader: React.FC = () => {
  const navigate = useNavigate();
  const state = useSyncExternalStore(ProviderStore.subscribe, ProviderStore.getSnapshot);
  const journey = state.journey || 'practicing_doctor';
  const verificationStatus = state.verificationStatus || 'PMDC Verified';
  const unreadMessagesCount = state.unreadMessagesCount || 0;
  const identity = state.identity || { name: 'Dr. Healthcare Provider', label: 'Doctor', avatarUrl: '' };

  const getJourneyLabel = () => {
    switch (journey) {
      case 'medical_student': return 'Medical Student';
      case 'fresh_doctor': return 'Fresh Doctor';
      case 'practicing_doctor': return 'General Physician';
      case 'consultant_specialist': return 'Consultant Specialist';
      default: return 'Healthcare Provider';
    }
  };

  const renderVerificationBadge = (status: VerificationStatus) => {
    let icon, bg, text, label;

    switch (status) {
      case 'PMDC Verified':
        icon = <ShieldCheck className="w-3.5 h-3.5 shrink-0" />;
        bg = 'bg-emerald-50 border border-emerald-200'; text = 'text-emerald-700'; label = 'PMDC Verified';
        break;
      case 'Supervised Student':
        icon = <GraduationCap className="w-3.5 h-3.5 shrink-0" />;
        bg = 'bg-blue-50 border border-blue-200'; text = 'text-blue-700'; label = 'Supervised Student';
        break;
      case 'Needs Changes':
      case 'Verification Pending':
        icon = <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
        bg = 'bg-amber-50 border border-amber-200'; text = 'text-amber-700'; label = status;
        break;
      case 'Restricted':
      case 'Registration Expired':
        icon = <XOctagon className="w-3.5 h-3.5 shrink-0" />;
        bg = 'bg-red-50 border border-red-200'; text = 'text-red-700'; label = status;
        break;
      default:
        return null;
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight shrink-0 ${bg} ${text}`}>
        {icon}
        {label}
      </span>
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return 'DR';
    const parts = name.replace('Dr.', '').trim().split(' ').filter(Boolean);
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    return (name.slice(0, 2) || 'DR').toUpperCase();
  };

  return (
    <header className="px-4 py-3 pt-safe bg-white border-b border-slate-100 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top Utility Row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center min-w-0">
          <SehatSaharaLogo variant="lightBackground" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Notification bell */}
          <button 
            onClick={() => navigate('/doctor/notifications')}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center relative transition-colors text-slate-700 border border-slate-200"
            aria-label="Provider Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Profile / Avatar */}
          <button 
            onClick={() => navigate('/doctor/profile')}
            className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center overflow-hidden shrink-0 active:scale-95 transition-transform"
            aria-label="Provider Profile"
          >
            {identity.avatarUrl ? (
              <img src={identity.avatarUrl} alt={identity.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-emerald-800">{getInitials(identity.name)}</span>
            )}
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
        <p className="text-xs text-slate-500 font-medium leading-none mb-1">Assalam-o-Alaikum,</p>
        <h2 className="text-base font-extrabold text-slate-900 leading-snug truncate mb-2">
          {identity.name}
        </h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            {getJourneyLabel()}
          </span>
          {renderVerificationBadge(verificationStatus)}
        </div>
      </div>
    </header>
  );
};
