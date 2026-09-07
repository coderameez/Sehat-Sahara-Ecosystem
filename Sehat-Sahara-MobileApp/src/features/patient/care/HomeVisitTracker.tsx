import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, CheckCircle2, Circle, Navigation, MapPin } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

const STAGES = [
  { id: 1, title: 'Booking Confirmed', desc: 'Your home visit is scheduled' },
  { id: 2, title: 'Doctor Assigned', desc: 'Dr. has accepted the visit' },
  { id: 3, title: 'Doctor on the Way', desc: 'Doctor has left the clinic' },
  { id: 4, title: 'Doctor Arrived', desc: 'Doctor is at your location' },
  { id: 5, title: 'Consultation Complete', desc: 'The visit is finished' }
];

export const HomeVisitTracker: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    if (currentStage < 5) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 8000); // 8 seconds per stage
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => goBack()} className="p-1 -ml-1 active:bg-slate-100 rounded-full">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900 ml-2">Live Tracking</h1>
        </header>

        <div className="app-scroll flex-1 px-5 py-6 pb-28">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Appointment</p>
                <p className="text-[15px] font-bold text-slate-900">Home Visit</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Arrival</p>
                <p className="text-[15px] font-bold text-emerald-700">15 mins</p>
              </div>
            </div>

            {currentStage === 3 && (
              <div className="w-full h-32 bg-slate-100 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-slate-200">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#CBD5E1 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
                <Navigation className="w-8 h-8 text-[#1B7F4C] absolute top-1/2 left-1/4 animate-bounce" />
                <MapPin className="w-6 h-6 text-red-500 absolute top-1/3 right-1/4" />
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <path d="M 100 60 C 150 40 200 80 250 40" stroke="#1B7F4C" strokeWidth="3" strokeDasharray="5,5" fill="none" className="animate-pulse" />
                </svg>
                <span className="bg-white/90 text-[11px] font-bold px-2 py-1 rounded shadow-sm z-10 absolute bottom-2 left-2">Live Map Active</span>
              </div>
            )}

            <div className="relative pl-6">
              <div className="absolute top-3 bottom-3 left-[9px] w-0.5 bg-slate-200" />
              
              {STAGES.map((stage) => {
                const isActive = stage.id === currentStage;
                const isPassed = stage.id < currentStage;
                
                return (
                  <div key={stage.id} className="relative mb-6 last:mb-0">
                    <div className="absolute -left-6 bg-white py-1">
                      {isPassed || isActive ? (
                        <CheckCircle2 className={`w-[18px] h-[18px] ${isActive ? 'text-[#1B7F4C]' : 'text-[#1B7F4C]'}`} />
                      ) : (
                        <Circle className="w-[18px] h-[18px] text-slate-300" />
                      )}
                    </div>
                    <div className={isActive ? 'opacity-100' : isPassed ? 'opacity-70' : 'opacity-40'}>
                      <h3 className={`text-[15px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                        {stage.title}
                      </h3>
                      <p className="text-[13px] text-slate-500">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {currentStage === 5 && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
            <Button onClick={() => navigate('/patient/care', { replace: true })}>
              Done
            </Button>
          </div>
        )}

      </div>
    </MobileAppShell>
  );
};
