import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Info } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { MobileAppShell } from '../../../components';

export const SOSResult: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If somehow navigated here without being in ACTIVE state, redirect home
    if (PrototypeStore.getSnapshot().sosState.status !== 'ACTIVE') {
      navigate(PATIENT_ROUTES.HOME, { replace: true });
    }
  }, [navigate]);

  const handleEndSOS = () => {
    PrototypeStore.updateState({ sosState: { status: 'ENDED' } });
    navigate(PATIENT_ROUTES.HOME, { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC] relative animate-in slide-in-from-bottom duration-300">
        
        {/* ─── HEADER ─── */}
        <div className="pt-safe flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white shrink-0">
          <button 
            onClick={() => navigate(PATIENT_ROUTES.HOME, { replace: true })}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 active:bg-slate-200"
            aria-label="Go home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-slate-900">SOS Summary</span>
          <div className="w-10 h-10" />
        </div>

        {/* ─── CONTENT ─── */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-10 h-10 text-brand-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Emergency Alert Sent</h1>
            <p className="text-slate-500">
              Your emergency contacts have been notified.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-500" />
              Actions Completed
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs">1</div>
                <p>Your emergency medical details were shared with your contacts.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs">2</div>
                <p>Your saved emergency contact received an urgent SMS.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-xs">3</div>
                <p>Your live location was shared with responders.</p>
              </li>
            </ul>
          </div>

          <div className="flex justify-center mb-8">
            <p className="text-slate-400 text-[13px] text-center font-medium">
              For life-threatening emergencies, always call 1122 directly.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleEndSOS}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl text-lg shadow-sm active:scale-95 transition-transform"
            >
              End Emergency & Return Home
            </button>
          </div>

        </div>
      </div>
    </MobileAppShell>
  );
};
