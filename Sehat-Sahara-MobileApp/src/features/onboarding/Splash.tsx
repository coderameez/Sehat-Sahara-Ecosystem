import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, SehatSaharaLogo } from '../../components';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding/language', { replace: true });
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleNext = () => {
    navigate('/onboarding/language', { replace: true });
  };

  return (
    <MobileAppShell>
      <div 
        onClick={handleNext}
        className="flex-1 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-[#1B7F4C] to-[#0D5232]"
      >
        <div className="flex flex-col items-center text-center px-6 transition-transform duration-700 scale-110">
          <div className="mb-6 relative animate-[pulse_2s_ease-in-out_infinite]">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
            <SehatSaharaLogo variant="darkBackground" className="w-24 h-24 relative z-10"  />
          </div>
          
          <h1 className="text-white text-3xl font-extrabold tracking-tight mb-2">
            SEHAT SAHARA
          </h1>
          <p className="text-emerald-100 text-[15px] font-medium tracking-wide">
            Healthcare, within reach
          </p>
          
          <div className="mt-12 flex space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
