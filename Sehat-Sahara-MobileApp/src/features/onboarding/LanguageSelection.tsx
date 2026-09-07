import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { OnboardingStore } from '../../services/OnboardingStore';
import { Globe, Type } from 'lucide-react';

export const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('en');

  const handleContinue = () => {
    if (selected) {
      proceed(selected);
    }
  };

  const proceed = (lang: string) => {
    OnboardingStore.updateState({ language: lang });
    navigate('/onboarding/role');
  };

  const languages = [
    { id: 'en', label: 'English', icon: <Globe className="w-5 h-5" /> },
    { id: 'ur', label: 'اردو', icon: <span className="text-lg font-bold">ع</span> },
    { id: 'ru', label: 'Roman Urdu', icon: <Type className="w-5 h-5" /> },
  ];

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        <header className="px-5 py-4 pt-safe shrink-0 flex items-center">
          <h1 className="text-lg font-bold text-slate-900">Select Language</h1>
        </header>

        <div className="app-scroll flex-1 px-5 pb-8">
          <p className="text-[15px] text-slate-600 mb-8">
            Choose your preferred language to continue.
          </p>

          <div className="flex flex-col gap-3">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => {
                  setSelected(lang.id);
                }}
                className={`flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                  selected === lang.id 
                    ? 'border-brand-600 bg-brand-50' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  selected === lang.id ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {lang.icon}
                </div>
                <span className={`text-[16px] flex-1 ${
                  selected === lang.id ? 'font-bold text-brand-900' : 'font-medium text-slate-700'
                }`}>
                  {lang.label}
                </span>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selected === lang.id ? 'border-brand-600' : 'border-slate-300'
                }`}>
                  {selected === lang.id && <div className="w-3 h-3 rounded-full bg-brand-600" />}
                </div>
              </button>
            ))}
          </div>


        </div>

        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0">
          <Button onClick={handleContinue} size="lg" fullWidth>
            Continue
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
