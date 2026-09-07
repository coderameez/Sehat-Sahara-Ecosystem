import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { OnboardingStore } from '../../services/OnboardingStore';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier || 'your number';

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    // Take just the last typed char
    const char = value.slice(-1);
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (char && index === 3) {
      // Auto submit
      handleVerify();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const snap = OnboardingStore.getSnapshot();
    const roleLower = (snap.role || snap.activeRole || '').toLowerCase();
    const isDoctor = roleLower === 'doctor' || roleLower === 'provider' || roleLower === 'student';

    if (isDoctor) {
      const journey = snap.providerJourney || 'practicing_doctor';
      const routeMap: Record<string, string> = {
        medical_student: '/onboarding/student',
        fresh_doctor: '/onboarding/fresher',
        practicing_doctor: '/onboarding/doctor',
        consultant_specialist: '/onboarding/consultant',
      };
      const dest = routeMap[journey] || '/onboarding/doctor';
      OnboardingStore.updateState({
        isAuthenticated: true,
        role: 'Doctor',
        activeRole: 'doctor',
        activeAccountId: 'USR-DOCTOR-DEMO',
        lastStep: dest
      });
      navigate(dest, { replace: true });
      return;
    }

    OnboardingStore.updateState({
      isAuthenticated: true,
      role: 'Patient',
      activeRole: 'patient',
      activeAccountId: 'USR-PATIENT-DEMO',
      lastStep: '/auth/profile'
    });
    navigate('/auth/profile', { replace: true });
  };

  return (
    <InnerScreenLayout title="" onBack={() => navigate('/auth/entry', { replace: true })} bottomPadding={false}>
      <div className="flex flex-col min-h-full bg-white relative justify-between">
        <div className="px-5 pt-4 pb-28">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Verify your number</h2>
            <p className="text-[15px] text-slate-600">Code sent to <span className="font-bold">{identifier}</span></p>
          </div>

          <div className="flex justify-center gap-2.5 sm:gap-4 mb-8 w-full max-w-sm mx-auto">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                value={otp[index]}
                onChange={e => handleChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-14 sm:w-16 max-w-[64px] flex-1 aspect-square text-center text-xl sm:text-2xl font-bold rounded-2xl border-2 border-slate-200 focus:border-[#1B7F4C] focus:outline-none transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-[14px] text-slate-500">Resend code in <span className="font-bold">{countdown}s</span></p>
            ) : (
              <button className="text-[14px] font-bold text-[#1B7F4C]">Resend Code</button>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 px-4 py-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 pb-safe z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] mt-auto">
          <Button onClick={handleVerify} fullWidth size="lg">
            Verify
          </Button>
        </div>
      </div>
    </InnerScreenLayout>
  );
};
