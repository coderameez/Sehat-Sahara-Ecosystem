import React, { useState } from 'react';
import { OnboardingStore } from '../services/OnboardingStore';
import { User, ChevronDown } from 'lucide-react';
import { BottomSheet, Button } from '.';

export const ActiveCareRecipientChip: React.FC = () => {
  const [showPicker, setShowPicker] = useState(false);
  const state = OnboardingStore.getSnapshot();
  const profiles = state.careProfiles;

  if (profiles.length <= 1) return null; // Don't show if only one profile exists

  // If activeProfileId is null, use primary profile or first profile
  const activeId = state.activeProfileId || profiles.find(p => p.isPrimary)?.id || profiles[0]?.id;
  const activeProfile = profiles.find(p => p.id === activeId);

  if (!activeProfile) return null;

  const handleSelect = (id: string) => {
    OnboardingStore.updateState({ activeProfileId: id });
    setShowPicker(false);
  };

  return (
    <>
      <div className="px-5 py-3 bg-brand-50 border-b border-brand-100 shrink-0">
        <button 
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-brand-200 shadow-sm active:bg-slate-50 transition-colors"
        >
          <User className="w-4 h-4 text-brand-600" />
          <span className="text-[13px] font-bold text-slate-700">For: <span className="text-brand-700">{activeProfile.name}</span></span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <BottomSheet isOpen={showPicker} onClose={() => setShowPicker(false)} title="Select Care Recipient">
        <div className="pb-4 space-y-3">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`w-full p-4 rounded-xl flex items-center justify-between transition-colors ${
                activeId === p.id ? 'bg-brand-50 border border-brand-200' : 'bg-slate-50 border border-slate-200 active:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeId === p.id ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 text-[15px]">{p.name}</h3>
                  <p className="text-[13px] text-slate-500">{p.relation}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                activeId === p.id ? 'border-brand-600' : 'border-slate-300'
              }`}>
                {activeId === p.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
              </div>
            </button>
          ))}
          <Button 
            variant="outline" 
            fullWidth 
            className="mt-4"
            onClick={() => setShowPicker(false)}
          >
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </>
  );
};
