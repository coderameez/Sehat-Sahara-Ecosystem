import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Settings, Calendar, FileText, Pill, MessageCircle } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const NotificationsList: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-4 py-4 pt-safe bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => goBack(PATIENT_ROUTES.HOME)} 
              className="p-1 -ml-1 text-slate-700 active:bg-slate-100 rounded-full"
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 ml-2">Notifications</h1>
          </div>
          <button 
            onClick={() => navigate('/patient/profile/settings', { state: { from: 'notifications' } })}
            className="p-2 text-slate-500 hover:text-slate-700 active:bg-slate-100 rounded-full transition-colors"
            aria-label="Notification Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        <div className="app-scroll flex-1 px-4 py-5">
          {/* Upcoming */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Upcoming</h2>
            
            <div 
              onClick={() => navigate(PATIENT_ROUTES.APPOINTMENT_DETAIL.replace(':id', 'mock-apt-1'))}
              className="bg-white rounded-2xl p-4 flex gap-4 mb-3 cursor-pointer border border-slate-200 shadow-sm relative active:scale-[0.99] transition-transform"
            >
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1 pr-4">
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Appointment Reminder</h3>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">Upcoming consultation with Dr. Sarah Ahmed in 30 minutes.</p>
                <span className="text-[11px] text-slate-400 font-semibold">10:00 AM</span>
              </div>
            </div>
            
            <div 
              onClick={() => navigate(PATIENT_ROUTES.MEDICINES)}
              className="bg-white rounded-2xl p-4 flex gap-4 cursor-pointer border border-slate-200 shadow-sm relative active:scale-[0.99] transition-transform"
            >
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500" />
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0 text-green-600">
                <Pill className="w-6 h-6" />
              </div>
              <div className="flex-1 pr-4">
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Medicine Reminder</h3>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">Time to take Amoxicillin 500mg (with water).</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-slate-400 font-semibold">12:00 PM</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(PATIENT_ROUTES.MEDICINES); }}
                    className="px-3 py-1 bg-brand-600 text-white rounded-lg text-xs font-bold"
                  >
                    Mark as Taken
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Today */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Today</h2>
            
            <div 
              onClick={() => navigate(PATIENT_ROUTES.RECORDS)}
              className="bg-white rounded-2xl p-4 flex gap-4 cursor-pointer border border-slate-200 shadow-sm mb-3 active:scale-[0.99] transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Lab Report Available</h3>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">Your Complete Blood Count (CBC) report is ready to review.</p>
                <span className="text-[11px] text-slate-400 font-semibold">09:15 AM</span>
              </div>
            </div>

            <div 
              onClick={() => navigate(PATIENT_ROUTES.COMMUNITY_BLOOD)}
              className="bg-white rounded-2xl p-4 flex gap-4 cursor-pointer border border-slate-200 shadow-sm active:scale-[0.99] transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 text-rose-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">Community Blood Need</h3>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">Urgent O+ blood request at Indus Hospital Karachi.</p>
                <span className="text-[11px] text-slate-400 font-semibold">08:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
