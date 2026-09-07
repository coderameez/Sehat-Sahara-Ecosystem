import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, Shield, PhoneCall } from 'lucide-react';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { CounterpartEngine } from '../../../services/prototype/CounterpartEngine';
import { MobileAppShell } from '../../../components';

export const EmergencySOS: React.FC = () => {
  const navigate = useNavigate();
  const obState = OnboardingStore.getSnapshot();
  const profile = obState.profile || FALLBACK_PROFILE;
  
  const [phase, setPhase] = useState<'CONFIRM' | 'COUNTDOWN'>('CONFIRM');
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const unsub = PrototypeStore.subscribe(() => {
      // PrototypeStore updated
    });
    return unsub;
  }, []);

  // Countdown logic
  useEffect(() => {
    let timer: number;
    if (phase === 'COUNTDOWN' && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (phase === 'COUNTDOWN' && countdown === 0) {
      handleSOSActivate();
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, countdown, navigate]);

  const handleStartCountdown = () => {
    setPhase('COUNTDOWN');
    PrototypeStore.updateState({ sosState: { status: 'COUNTDOWN', startedAt: new Date().toISOString() } });
  };

  const handleCancel = () => {
    PrototypeStore.updateState({ sosState: { status: 'CANCELLED' } });
    navigate('/patient', { replace: true });
  };

  const handleSOSActivate = () => {
    PrototypeStore.updateState({ sosState: { status: 'ACTIVE' } });
    CounterpartEngine.scheduleEmergencyResponse();
    navigate('/patient/sos/result', { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#E6192B] text-white relative">
        
        {/* ─── HEADER ─── */}
        <div className="px-4 py-4 pt-safe flex items-center justify-between z-10">
          <button 
            onClick={handleCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-full text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            Secure Mode
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          
          {phase === 'CONFIRM' ? (
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">Emergency SOS</h1>
              <p className="text-red-100 text-lg mb-8 leading-snug">
                This will notify your emergency contact and prepare your medical information for responders.
              </p>

              <div className="bg-red-700/50 rounded-2xl p-4 w-full mb-8 text-left border border-red-500/30">
                <p className="text-red-200 text-xs font-semibold uppercase tracking-wider mb-1">Your Information</p>
                <div className="text-white text-sm mb-1">
                  <span className="opacity-80">Patient:</span> {profile.name}
                </div>
                <div className="text-white text-sm">
                  <span className="opacity-80">Location:</span> {profile.area}, {profile.city}
                </div>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={handleStartCountdown}
                  className="w-full bg-white text-red-600 font-bold py-4 rounded-xl text-lg shadow-lg active:scale-95 transition-transform"
                >
                  Start SOS
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm">
              <h2 className="text-white text-2xl font-bold mb-8">Emergency SOS</h2>
              
              <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
                {/* Animated Rings */}
                <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-4 border-4 border-white/40 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                
                {/* Countdown Circle */}
                <div className="relative z-10 w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-red-600 text-6xl font-black">{countdown}</span>
                </div>
              </div>

              <p className="text-white text-lg font-medium mb-2">
                Preparing emergency information...
              </p>
              <p className="text-red-100 text-sm mb-12">
                Sending your location and profile to emergency contacts in {countdown}s.
              </p>

              <button
                onClick={handleSOSActivate}
                className="w-full bg-red-800 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 mb-4 active:bg-red-900"
              >
                <PhoneCall className="w-5 h-5" />
                Contact Now
              </button>

              <button
                onClick={handleCancel}
                className="w-full bg-transparent border border-white/30 text-white font-bold py-4 rounded-xl text-lg active:bg-white/10"
              >
                Cancel
              </button>
            </div>
          )}

        </div>
      </div>
    </MobileAppShell>
  );
};
