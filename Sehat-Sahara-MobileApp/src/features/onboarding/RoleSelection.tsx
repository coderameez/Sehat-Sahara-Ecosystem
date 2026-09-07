import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { OnboardingStore } from '../../services/OnboardingStore';
import { User, Stethoscope } from 'lucide-react';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('');

  const handleContinue = () => {
    if (!selected) return;
    
    OnboardingStore.updateState({ role: selected });
    
    if (selected === 'Patient') {
      navigate('/auth/entry', { replace: true });
    } else {
      navigate('/onboarding/provider-type', { replace: true });
    }
  };

  const roles = [
    { 
      id: 'Patient', 
      label: 'I need healthcare', 
      desc: 'Find doctors, book appointments, request blood, and manage records.',
      icon: <User className="w-6 h-6" /> 
    },
    { 
      id: 'Doctor', 
      label: 'I am a doctor', 
      desc: 'Manage your patients, view records, and provide consultations.',
      icon: <Stethoscope className="w-6 h-6" /> 
    },
  ];

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        <header className="px-5 py-4 pt-safe shrink-0">
          <h1 className="text-2xl font-bold text-slate-900">How will you use Sehat Sahara?</h1>
        </header>

        <div className="app-scroll flex-1 px-5 pb-8">
          <p className="text-[15px] text-slate-600 mb-8">
            Select your role to continue.
          </p>

          <div className="flex flex-col gap-4">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`flex flex-col p-5 rounded-2xl border-2 transition-all text-left ${
                  selected === role.id 
                    ? 'border-[#1B7F4C] bg-green-50' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selected === role.id ? 'bg-[#1B7F4C] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {role.icon}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selected === role.id ? 'border-[#1B7F4C]' : 'border-slate-300'
                  }`}>
                    {selected === role.id && <div className="w-3 h-3 rounded-full bg-[#1B7F4C]" />}
                  </div>
                </div>
                
                <h3 className={`text-[17px] font-bold mb-1 ${
                  selected === role.id ? 'text-[#1B7F4C]' : 'text-slate-900'
                }`}>
                  {role.label}
                </h3>
                <p className={`text-[13px] leading-relaxed ${
                  selected === role.id ? 'text-green-800' : 'text-slate-500'
                }`}>
                  {role.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0">
          <Button onClick={handleContinue} disabled={!selected} size="lg" fullWidth>
            Continue
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
