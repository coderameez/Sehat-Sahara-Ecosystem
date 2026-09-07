import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ArrowLeft, Clock, AlertCircle, Home, Bell } from 'lucide-react';

export const ProviderNoticeFallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type') || 'unfinished';
  const customTitle = searchParams.get('title');

  const isComingSoon = type === 'unfinished' || customTitle?.toLowerCase().includes('coming');
  const title = customTitle || (isComingSoon ? 'Coming Soon' : 'This update is no longer available');

  const explanation = isComingSoon
    ? 'This feature is part of our upcoming release. The Sehat Sahara provider network is expanding with new modules in the next update.'
    : 'The requested appointment record, review, or opportunity update has been archived, rescheduled, or is no longer available.';

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Header */}
        <header className="px-4 py-3.5 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/doctor/notifications')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 active:bg-slate-200 transition-colors"
            aria-label="Back to Notifications"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[17px] font-bold text-slate-900">Provider Notice</h1>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#166B32] mb-4 shadow-2xs">
            {isComingSoon ? (
              <Clock className="w-8 h-8 text-[#166B32]" />
            ) : (
              <AlertCircle className="w-8 h-8 text-amber-600" />
            )}
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-[#166B32] uppercase tracking-wider mb-2">
            {isComingSoon ? 'Feature Preview' : 'Status Update'}
          </span>

          <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-sm text-slate-600 max-w-xs mb-8 leading-relaxed">
            {explanation}
          </p>

          <div className="w-full max-w-xs space-y-3">
            <Button
              fullWidth
              variant="primary"
              size="lg"
              onClick={() => navigate('/doctor/notifications')}
              icon={<Bell className="w-4 h-4" />}
              className="bg-[#166B32] hover:bg-[#125828] text-white font-bold"
            >
              Back to Notifications
            </Button>

            <Button
              fullWidth
              variant="outline"
              size="lg"
              onClick={() => navigate('/doctor/home')}
              icon={<Home className="w-4 h-4" />}
            >
              Go to Provider Home
            </Button>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
