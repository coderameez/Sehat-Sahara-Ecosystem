import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, Phone, MessageCircle, MapPin, MessageSquare, CheckCircle } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const DonorCoordination: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();
  const { donorId } = useParams();

  const handleMarkFulfilled = () => {
    navigate('/patient/community/blood/history', { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => goBack()} className="p-1 -ml-1 active:bg-slate-100 rounded-full">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900 ml-2">Donor Coordination</h1>
        </header>

        <div className="app-scroll flex-1 px-4 py-6 pb-32">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm text-center">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop" 
              alt="Donor" 
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
            />
            <h2 className="text-xl font-bold text-slate-900 mb-1">Raza Ali</h2>
            <p className="text-[14px] text-slate-500 mb-4">Confirmed to donate blood</p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">A+ Blood Type</span>
              <span className="text-[12px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">1.2 km away</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="outline" 
              fullWidth 
              icon={<MessageCircle className="w-5 h-5" />}
              onClick={() => window.open('https://wa.me/', '_blank')}
            >
              WhatsApp
            </Button>
            <Button 
              variant="outline"
              fullWidth 
              icon={<Phone className="w-5 h-5" />}
              onClick={() => window.open('tel:', '_self')}
            >
              Call
            </Button>
            <Button 
              variant="outline"
              fullWidth 
              icon={<MessageSquare className="w-5 h-5" />}
              onClick={() => navigate(`/patient/community/blood/chat/${donorId}`)}
            >
              In-App Chat
            </Button>
            <Button 
              variant="outline"
              fullWidth 
              icon={<MapPin className="w-5 h-5" />}
              onClick={() => window.open('https://maps.google.com', '_blank')}
            >
              Location
            </Button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-slate-900 mb-2">Donation Status</h3>
            <p className="text-[13px] text-slate-500 mb-5">Once the donor has successfully donated blood, mark this request as fulfilled to close it.</p>
            
            <Button 
              fullWidth 
              variant="secondary"
              icon={<CheckCircle className="w-5 h-5" />}
              onClick={handleMarkFulfilled}
              className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            >
              Mark as Fulfilled
            </Button>
          </div>
          
        </div>
      </div>
    </MobileAppShell>
  );
};
