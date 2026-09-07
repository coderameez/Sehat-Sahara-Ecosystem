import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { Search, MapPin } from 'lucide-react';

export const FindingDonors: React.FC = () => {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState('Scanning nearby hospitals...');

  useEffect(() => {
    const textTimer1 = setTimeout(() => {
      setLoadingText('Checking blood banks...');
    }, 1300);
    
    const textTimer2 = setTimeout(() => {
      setLoadingText('Contacting eligible donors...');
    }, 2600);

    const navTimer = setTimeout(() => {
      navigate('/patient/community/blood/response', { replace: true });
    }, 4000);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-900 relative overflow-hidden">
        
        {/* Background Radar Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-slate-700 absolute" />
          <div className="w-[600px] h-[600px] rounded-full border border-slate-700 absolute" />
          <div className="w-[400px] h-[400px] rounded-full border border-slate-700 absolute" />
          <div className="w-[200px] h-[200px] rounded-full border border-slate-600 absolute bg-slate-800/50" />
          
          <div 
            className="absolute w-[400px] h-[400px] origin-bottom-right"
            style={{
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(220, 38, 38, 0.4) 100%)',
              animation: 'spin 3s linear infinite',
              top: '50%',
              left: '50%',
              transformOrigin: '0 0'
            }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center">
          
          <div className="animate-in fade-in duration-500 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-8">
              {/* Center Pulse */}
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-4 rounded-full bg-red-500/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50">
                  <Search className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Simulated Donor Blips */}
              <div className="absolute top-0 right-4 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
              <div className="absolute bottom-4 left-0 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -right-8 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" style={{ animationDelay: '1.5s' }} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">Finding Donors</h2>
            <p className="text-slate-400 text-base max-w-[280px] leading-relaxed mb-8 h-12 transition-all">
              {loadingText}
            </p>

            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <div className="text-left">
                <p className="text-slate-300 text-sm font-medium">Radius expanding</p>
                <p className="text-slate-500 text-xs">Searching 15km radius</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </MobileAppShell>
  );
};
