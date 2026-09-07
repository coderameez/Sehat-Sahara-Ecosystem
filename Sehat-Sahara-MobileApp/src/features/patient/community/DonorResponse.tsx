import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';

const MOCK_DONORS = [
  { id: 'd-1', name: 'Raza Ali', distance: '1.2 km away', time: '5 mins ago', match: '100% Match', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop' },
  { id: 'd-2', name: 'Ahmed Khan', distance: '3.4 km away', time: '12 mins ago', match: '95% Match', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop' }
];

export const DonorResponse: React.FC = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState(MOCK_DONORS);

  const handleDecline = (id: string) => {
    setDonors(donors.filter(d => d.id !== id));
  };

  const handleAccept = (id: string) => {
    navigate(`/patient/community/blood/coordination/${id}`);
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate(PATIENT_ROUTES.COMMUNITY)} className="p-1 -ml-1 active:bg-slate-100 rounded-full">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900 ml-2">Donor Responses</h1>
        </header>

        <div className="app-scroll flex-1 px-4 py-6 pb-32">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#1B7F4C]" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{donors.length} Donors Found</h2>
            <p className="text-[14px] text-slate-500 mt-1">Review and accept a donor</p>
          </div>

          <div className="flex flex-col gap-4">
            {donors.map(donor => (
              <div key={donor.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-5 border-b border-slate-100 pb-5">
                  <img src={donor.avatar} alt={donor.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100" />
                  <div className="flex-1">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight mb-1">{donor.name}</h3>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{donor.match}</span>
                      <span className="text-[12px] text-slate-500">{donor.distance}</span>
                    </div>
                    <p className="text-[12px] text-slate-400">Responded {donor.time}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" fullWidth onClick={() => handleDecline(donor.id)} icon={<XCircle className="w-5 h-5" />}>
                    Decline
                  </Button>
                  <Button fullWidth onClick={() => handleAccept(donor.id)} icon={<CheckCircle2 className="w-5 h-5" />}>
                    Accept
                  </Button>
                </div>
              </div>
            ))}
            {donors.length === 0 && (
              <div className="text-center text-slate-500 py-10 font-medium">
                No more donors to review.
              </div>
            )}
          </div>
          
        </div>
      </div>
    </MobileAppShell>
  );
};
