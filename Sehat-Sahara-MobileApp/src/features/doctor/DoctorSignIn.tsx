import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button, SehatSaharaLogo } from '../../components';
import { OnboardingStore } from '../../services/OnboardingStore';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const DoctorSignIn: React.FC = () => {
  const navigate = useNavigate();
  const [pmdcNumber, setPmdcNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoSignIn = (journey: 'medical_student' | 'fresh_doctor' | 'practicing_doctor' | 'consultant_specialist') => {
    OnboardingStore.updateState({ 
      isAuthenticated: true,
      onboardingComplete: true,
      role: 'Doctor',
      activeRole: 'Doctor',
      activeAccountId: 'USR-DOCTOR-DEMO',
      providerJourney: journey,
      verificationStatus: journey === 'medical_student' ? 'Supervised Student' : 'PMDC Verified',
      verificationOutcome: journey === 'medical_student' ? 'Supervised Student' : 'PMDC Verified',
      lastStep: '/doctor/home'
    });
    navigate('/doctor/home', { replace: true });
  };

  const handleSignIn = () => {
    if (pmdcNumber && password) {
      handleDemoSignIn('practicing_doctor'); // Fallback for manual sign in
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-white">
        <div className="flex-1 app-scroll px-6 py-8">
          
          <div className="flex flex-col items-center mb-10 mt-4">
            <SehatSaharaLogo variant="lightBackground" className="w-16 h-16 text-[#166B32] mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Doctor Portal</h1>
            <p className="text-[15px] text-slate-500 text-center">
              Sign in to manage your practice and patient consultations
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[14px] font-bold text-emerald-900 mb-1">PMDC Verified Platform</h3>
              <p className="text-[13px] text-emerald-700 leading-relaxed">
                Sehat Sahara is integrated with the Pakistan Medical & Dental Council. Use your registered credentials to sign in.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">PMDC Registration Number</label>
              <input
                type="text"
                placeholder="e.g. 12345-S"
                value={pmdcNumber}
                onChange={e => setPmdcNumber(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166B32] focus:ring-1 focus:ring-[#166B32] transition-colors text-[15px]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[13px] font-bold text-slate-700">Password</label>
                <button className="text-[13px] font-bold text-[#166B32]">Forgot?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166B32] focus:ring-1 focus:ring-[#166B32] transition-colors text-[15px] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button onClick={handleSignIn} disabled={!pmdcNumber || !password} size="lg" fullWidth>
              Sign In
            </Button>
          </div>

          <div className="mt-8">
            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-[13px] font-medium uppercase tracking-wider">
                Prototype Mode
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleDemoSignIn('medical_student')}
                className="w-full p-4 text-left border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-colors"
              >
                <div className="font-bold text-slate-900">Sara Ahmed</div>
                <div className="text-sm text-slate-500">Medical Student (Supervised)</div>
              </button>
              <button 
                onClick={() => handleDemoSignIn('fresh_doctor')}
                className="w-full p-4 text-left border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-colors"
              >
                <div className="font-bold text-slate-900">Dr. Hamza Ahmed</div>
                <div className="text-sm text-slate-500">Fresh Doctor / GP / MO</div>
              </button>
              <button 
                onClick={() => handleDemoSignIn('practicing_doctor')}
                className="w-full p-4 text-left border border-brand-200 bg-brand-50 rounded-xl hover:border-brand-500 transition-colors relative"
              >
                <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">Primary Demo</div>
                <div className="font-bold text-slate-900">Dr. Raza Ali</div>
                <div className="text-sm text-slate-500">Practicing Doctor (GP)</div>
              </button>
              <button 
                onClick={() => handleDemoSignIn('consultant_specialist')}
                className="w-full p-4 text-left border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="font-bold text-slate-900">Dr. Ayesha Khan</div>
                <div className="text-sm text-slate-500">Consultant / Specialist</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
