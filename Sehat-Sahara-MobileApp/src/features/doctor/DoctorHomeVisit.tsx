import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { ChevronLeft, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { PrototypeStore } from '../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../services/OnboardingStore';

export const DoctorHomeVisit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [stage, setStage] = useState<'assigned' | 'en_route' | 'arrived' | 'completed'>('assigned');
  
  const booking = PrototypeStore.getSnapshot().bookings.find(b => b.id === id);
  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  const patientName = currentUser.name || 'Patient';

  const handleNextStage = () => {
    if (stage === 'assigned') setStage('en_route');
    else if (stage === 'en_route') setStage('arrived');
    else if (stage === 'arrived') {
      // Complete visit
      const state = PrototypeStore.getSnapshot();
      PrototypeStore.updateState({
        bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'completed' } : b)
      });
      navigate(`/doctor/consultation/${id}/ai-note`, { replace: true });
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/doctor/home', { replace: true })} className="mr-3 p-1 -ml-1 rounded-full active:bg-slate-100" aria-label="Go back">
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <h1 className="text-[18px] font-bold text-slate-900">Home Visit Tracker</h1>
          </div>
        </header>

        <div className="app-scroll flex-1 px-5 py-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient</p>
                <p className="text-[16px] font-bold text-slate-900">{patientName}</p>
                <p className="text-[12px] text-slate-500">{booking?.reason || 'Home Care Checkup'}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <div className="flex gap-3 mb-2">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[14px] font-medium text-slate-900 leading-relaxed">
                    House 42, Street 5, Phase 4, DHA
                  </p>
                  <p className="text-[12px] text-slate-500 mt-1">Distance: 4.2 km</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-[15px] font-bold text-slate-900 mb-4 uppercase tracking-wide">Status Update</h2>
            
            <div className="relative pl-6">
              <div className="absolute top-3 bottom-3 left-[9px] w-0.5 bg-slate-200" />
              
              <div className="relative mb-6">
                <div className="absolute -left-6 bg-white py-1">
                  <CheckCircle2 className={`w-[18px] h-[18px] ${stage !== 'assigned' ? 'text-[#1B7F4C]' : 'text-[#1B7F4C]'}`} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900">Assigned</h3>
                <p className="text-[13px] text-slate-500">You have been assigned to this visit</p>
              </div>
              
              <div className={`relative mb-6 ${stage === 'assigned' ? 'opacity-40' : ''}`}>
                <div className="absolute -left-6 bg-white py-1">
                  <CheckCircle2 className={`w-[18px] h-[18px] ${stage === 'arrived' || stage === 'completed' ? 'text-[#1B7F4C]' : 'text-slate-300'}`} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900">En Route</h3>
                <p className="text-[13px] text-slate-500">You are travelling to the patient</p>
              </div>

              <div className={`relative mb-6 ${stage === 'assigned' || stage === 'en_route' ? 'opacity-40' : ''}`}>
                <div className="absolute -left-6 bg-white py-1">
                  <CheckCircle2 className={`w-[18px] h-[18px] ${stage === 'completed' ? 'text-[#1B7F4C]' : 'text-slate-300'}`} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900">Arrived</h3>
                <p className="text-[13px] text-slate-500">You are at the patient's location</p>
              </div>

              <div className={`relative ${stage !== 'completed' ? 'opacity-40' : ''}`}>
                <div className="absolute -left-6 bg-white py-1">
                  <CheckCircle2 className="w-[18px] h-[18px] text-slate-300" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900">Completed</h3>
                <p className="text-[13px] text-slate-500">Consultation is finished</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-white border-t border-slate-200 shrink-0 pb-safe">
          <Button onClick={handleNextStage} fullWidth>
            {stage === 'assigned' ? 'Mark En Route' : 
             stage === 'en_route' ? 'Mark Arrived' :
             'Complete Visit & Write Note'}
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
