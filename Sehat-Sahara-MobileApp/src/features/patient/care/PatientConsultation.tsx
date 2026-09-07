import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { Video } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Booking, Provider } from '../../../models';

export const PatientConsultation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const booking = PrototypeStore.getSnapshot().bookings.find((b: Booking) => b.id === id);
  const provider = PrototypeStore.getSnapshot().providers.find((p: Provider) => p.id === booking?.providerId);
  const providerName = provider?.name || 'Doctor';

  const handleEndCall = () => {
    // Navigate back to live queue which will handle completion detection
    navigate(`/patient/queue/${id}`, { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-black">
        {/* Meet Link Area */}
        <div className="relative flex-1 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Google Meet Session</h2>
          <p className="text-slate-400 mb-8 max-w-xs">
            Join the external Google Meet call to speak with {providerName}.
          </p>
          
          {booking?.meetLink ? (
            <a 
              href={booking.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold text-[16px] shadow-lg transition-colors flex items-center gap-3"
            >
              <Video className="w-5 h-5" /> Open Google Meet
            </a>
          ) : (
            <div className="text-slate-500 bg-slate-800 px-6 py-3 rounded-lg">
              No Meet link available for this appointment.
            </div>
          )}
        </div>

        {/* Patient Workspace (Bottom Half) */}
        <div className="bg-white h-[35%] rounded-t-3xl flex flex-col overflow-hidden">
          
          <div className="px-5 py-6 flex-1 flex flex-col items-center justify-center text-center">
             <h2 className="text-[20px] font-bold text-slate-900 mb-2">Consultation in Progress</h2>
             <p className="text-[14px] text-slate-500 max-w-[250px] mx-auto leading-relaxed">
               Please describe your symptoms clearly. The doctor is taking notes and will generate your prescription shortly.
             </p>
          </div>

          {/* Call Controls */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-center shrink-0 pb-safe">
            <button 
              onClick={handleEndCall}
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-900 flex items-center justify-center text-white font-bold transition-colors shadow-sm"
            >
              Return to Queue
            </button>
          </div>

        </div>
      </div>
    </MobileAppShell>
  );
};
