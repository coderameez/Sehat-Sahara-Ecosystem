import React, { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { AppNotification } from '../../../models';
import { 
  ArrowLeft, 
  CheckCheck, 
  Calendar, 
  CheckCircle2, 
  Ticket, 
  FileText, 
  Star, 
  Droplet, 
  Package, 
  Briefcase, 
  Bell, 
  ChevronRight
} from 'lucide-react';

export const ProviderNotifications: React.FC = () => {
  const navigate = useNavigate();
  const storeSnapshot = useSyncExternalStore(
    PrototypeStore.subscribe,
    PrototypeStore.getSnapshot
  );

  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'APPOINTMENTS' | 'COMMUNITY'>('ALL');

  // Filter provider-relevant notifications
  const allNotifications: AppNotification[] = (storeSnapshot.notifications || []).filter(
    n => n.role === 'provider' || n.role === 'all' || !n.role || n.userId === 'd1'
  );

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const filteredNotifications = allNotifications.filter(n => {
    if (activeTab === 'UNREAD') return !n.isRead;
    if (activeTab === 'APPOINTMENTS') {
      return n.entityType === 'appointment' || n.entityType === 'queue_token' || n.entityType === 'review';
    }
    if (activeTab === 'COMMUNITY') {
      return n.entityType === 'blood_request' || n.entityType === 'borrow_item' || n.entityType === 'opportunity' || n.entityType === 'care_marketplace';
    }
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    // 1. Mark as read
    PrototypeStore.markNotificationAsRead(notif.id);

    // 2. Determine target destination with role and entity safety
    if (notif.entityType === 'care_marketplace' || notif.entityId?.includes('UNFINISHED')) {
      navigate('/doctor/notice?type=unfinished&title=Coming%20Soon');
      return;
    }

    if (notif.entityType === 'appointment' || notif.entityType === 'review') {
      const exists = (storeSnapshot.bookings || []).some(b => b.id === notif.entityId);
      if (exists) {
        navigate(`/doctor/appointments/${notif.entityId}`);
      } else {
        navigate('/doctor/notice?type=unavailable&title=This%20update%20is%20no%20longer%20available');
      }
      return;
    }

    if (notif.entityType === 'queue_token') {
      navigate('/doctor/queue');
      return;
    }

    if (notif.entityType === 'blood_request') {
      navigate(notif.deepLink || `/doctor/community/blood/${notif.entityId || 'REQ-1'}`);
      return;
    }

    if (notif.entityType === 'borrow_item') {
      navigate(notif.deepLink || `/doctor/community/things/${notif.entityId || 'itm-1'}`);
      return;
    }

    if (notif.entityType === 'opportunity') {
      navigate(notif.deepLink || `/doctor/opportunities/${notif.entityId || 'o1'}`);
      return;
    }

    // Default deepLink using internal router
    if (notif.deepLink) {
      navigate(notif.deepLink);
    } else {
      navigate('/doctor/home');
    }
  };

  const getIcon = (notif: AppNotification) => {
    switch (notif.notificationType || notif.type) {
      case 'appointment_requested':
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case 'appointment_confirmed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'token_your_turn':
        return <Ticket className="w-5 h-5 text-indigo-600" />;
      case 'consultation_follow_up':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'review_received':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-400" />;
      case 'blood_response':
        return <Droplet className="w-5 h-5 text-rose-600" />;
      case 'borrow_request':
        return <Package className="w-5 h-5 text-teal-600" />;
      case 'opportunity_update':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#166B32]" />;
    }
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="px-4 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/doctor/home')}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:bg-slate-200 transition-colors"
              aria-label="Back to Provider Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-bold text-slate-900 leading-tight">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Practice alerts & patient updates</p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => PrototypeStore.markAllNotificationsAsRead('provider')}
              className="flex items-center gap-1 text-[12px] font-bold text-[#166B32] hover:text-[#125828] active:opacity-75 transition-opacity"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}
        </header>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'ALL', label: 'All', count: allNotifications.length },
            { id: 'UNREAD', label: 'Unread', count: unreadCount },
            { id: 'APPOINTMENTS', label: 'Appointments' },
            { id: 'COMMUNITY', label: 'Community & Jobs' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-[#166B32] text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-3">
                <Bell className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-600">No notifications found</p>
              <p className="text-xs text-slate-400 mt-1">You are up to date on all patient activities.</p>
            </div>
          ) : (
            filteredNotifications.map(notif => {
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 relative ${
                    !notif.isRead 
                      ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Icon Container */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    !notif.isRead ? 'bg-white shadow-2xs' : 'bg-slate-100'
                  }`}>
                    {getIcon(notif)}
                  </div>

                  {/* Body Info */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className={`text-[13px] leading-tight truncate ${
                        !notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                      }`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {notif.body}
                    </p>

                    {/* Metadata tags */}
                    <div className="mt-2 flex items-center gap-2">
                      {notif.entityType && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wide">
                          {notif.entityType.replace('_', ' ')}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-[#166B32] flex items-center gap-0.5 ml-auto">
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Unread indicator dot */}
                  {!notif.isRead && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </MobileAppShell>
  );
};
