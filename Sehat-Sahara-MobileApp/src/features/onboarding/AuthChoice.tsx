import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button, SehatSaharaLogo } from '../../components';
import { OnboardingStore, FALLBACK_PROFILE } from '../../services/OnboardingStore';

export const AuthChoice: React.FC = () => {
  const navigate = useNavigate();

  const handleDemo = () => {
    OnboardingStore.updateState({ 
      authMode: 'demo',
      profile: FALLBACK_PROFILE,
      careProfiles: [
        { id: 'care-ali-raza', name: 'Ali Raza', relation: 'Self', isPrimary: true },
        { id: 'care-shazia-raza', name: 'Shazia Raza', relation: 'Mother', age: 58 }
      ]
    });
    navigate('/onboarding/location');
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <div className="flex-1 flex flex-col px-6 pt-16">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
            <SehatSaharaLogo variant="lightBackground"  />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
            Welcome to<br/>Sehat Sahara
          </h1>
          <p className="text-[16px] text-slate-600 mb-10 leading-relaxed">
            Create an account to track your health, book appointments, and connect with community.
          </p>

          <div className="w-full max-w-sm space-y-3">
            <div className="space-y-3 mb-6">
              <Button onClick={() => navigate('/auth/create-account')} size="lg" fullWidth>
                Create Account
              </Button>
              <Button onClick={() => navigate('/auth/login')} variant="outline" size="lg" fullWidth>
                Sign In
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-[13px] font-medium uppercase tracking-wider">
                Prototype Mode
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <button 
              onClick={handleDemo}
              className="w-full py-4 text-center text-brand-700 font-bold text-[15px] hover:bg-brand-50 rounded-xl transition-colors"
            >
              Skip & Use Demo Profile
            </button>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
