import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InnerScreenLayout } from '../../components/layouts';
import { User, Users, HeartHandshake } from 'lucide-react';
import { OnboardingStore } from '../../services/OnboardingStore';

export const CareScopeSetup: React.FC = () => {
  const navigate = useNavigate();

  const handleSelect = () => {
    OnboardingStore.updateState({ 
      isAuthenticated: true,
      onboardingComplete: true,
      role: 'Patient',
      activeRole: 'Patient',
      activeAccountId: 'USR-PATIENT-DEMO',
      lastStep: '/patient'
    });
    navigate('/patient', { replace: true });
  };

  return (
    <InnerScreenLayout title="Who will you use this for?">
      <div className="flex flex-col h-full bg-slate-50">
        <div className="app-scroll flex-1 px-5 pt-6 pb-8">
          <div className="flex flex-col gap-4">
            
            <button 
              onClick={handleSelect}
              className="w-full p-6 bg-white rounded-2xl border-2 border-slate-100 flex items-center gap-5 text-left hover:border-[#1B7F4C] active:scale-[0.98] transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-[#1B7F4C]" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-1">Just Myself</h3>
                <p className="text-[13px] text-slate-500">I only need to manage my own appointments and records.</p>
              </div>
            </button>

            <button 
              onClick={handleSelect}
              className="w-full p-6 bg-white rounded-2xl border-2 border-slate-100 flex items-center gap-5 text-left hover:border-[#1B7F4C] active:scale-[0.98] transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-1">Myself and Family</h3>
                <p className="text-[13px] text-slate-500">I will manage care for myself, my spouse, and my children.</p>
              </div>
            </button>

            <button 
              onClick={handleSelect}
              className="w-full p-6 bg-white rounded-2xl border-2 border-slate-100 flex items-center gap-5 text-left hover:border-[#1B7F4C] active:scale-[0.98] transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-1">A Parent or Dependent</h3>
                <p className="text-[13px] text-slate-500">I am setting this up primarily to manage care for someone else.</p>
              </div>
            </button>

          </div>
        </div>
      </div>
    </InnerScreenLayout>
  );
};
