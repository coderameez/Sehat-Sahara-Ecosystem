import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { OnboardingStore } from '../../services/OnboardingStore';
import { Bell, Heart, Users, Type } from 'lucide-react';

export const PreferencesSetup: React.FC = () => {
  const navigate = useNavigate();
  const state = OnboardingStore.getSnapshot();

  const [prefs, setPrefs] = useState({
    appointmentReminders: state.preferences?.appointmentReminders ?? true,
    medicineReminders: state.preferences?.medicineReminders ?? true,
    communityOpportunities: state.preferences?.communityOpportunities ?? true,
    largeText: state.preferences?.largeText ?? false,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const handleFinish = () => {
    OnboardingStore.updateState({ 
      preferences: prefs,
    });
    navigate('/auth/review');
  };

  return (
    <InnerScreenLayout title="Preferences">
      <div className="flex flex-col h-full bg-slate-50">
        <div className="app-scroll flex-1 px-5 pb-8 pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Tailor Your App</h2>
            <p className="text-[15px] text-slate-600">Customize notifications and display settings.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-[15px]">Appointment Reminders</h3>
                  <p className="text-[12px] text-slate-500">Get notified before visits</p>
                </div>
              </div>
              <Toggle active={prefs.appointmentReminders} onClick={() => toggle('appointmentReminders')} />
            </div>

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-[15px]">Medicine Alerts</h3>
                  <p className="text-[12px] text-slate-500">Daily dose reminders</p>
                </div>
              </div>
              <Toggle active={prefs.medicineReminders} onClick={() => toggle('medicineReminders')} />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-[15px]">Community Need</h3>
                  <p className="text-[12px] text-slate-500">Blood or sharing requests near you</p>
                </div>
              </div>
              <Toggle active={prefs.communityOpportunities} onClick={() => toggle('communityOpportunities')} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-slate-600" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-[15px]">Large Text</h3>
                  <p className="text-[12px] text-slate-500">Increase readability</p>
                </div>
              </div>
              <Toggle active={prefs.largeText} onClick={() => toggle('largeText')} />
            </div>
          </div>
        </div>

        <div className="px-4 pt-3 pb-6 bg-white border-t border-slate-200 shrink-0">
          <Button onClick={handleFinish} variant="primary">
            Finish Setup
          </Button>
        </div>
      </div>
    </InnerScreenLayout>
  );
};

const Toggle: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
        active ? 'bg-brand-600' : 'bg-slate-300'
      }`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
        active ? 'transform translate-x-5' : ''
      }`} />
    </button>
  );
};
