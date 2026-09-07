import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { OnboardingStore } from '../../services/OnboardingStore';
import { ChevronLeft, CheckCircle2, User, Users, Bell, ShieldAlert } from 'lucide-react';

export const ReviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const state = OnboardingStore.getSnapshot();

  const handleFinish = () => {
    OnboardingStore.updateState({ 
      onboardingComplete: true
    });
    navigate('/patient', { replace: true });
  };

  const dependentsCount = state.careProfiles.filter(p => !p.isPrimary).length;
  const sosReadyCount = state.careProfiles.filter(p => p.sosEnabled).length;
  
  let householdDesc = "None added";
  if (dependentsCount > 0) {
    const firstDependent = state.careProfiles.find(p => !p.isPrimary);
    if (firstDependent) {
      householdDesc = `${firstDependent.name} (${firstDependent.relation})${dependentsCount > 1 ? ` + ${dependentsCount - 1} more` : ''}`;
    }
  }

  let prefsDesc = "Defaults";
  if (state.preferences) {
    const activePrefs = [];
    if (state.preferences.appointmentReminders) activePrefs.push("Appt Reminders");
    if (state.preferences.medicineReminders) activePrefs.push("Med Reminders");
    prefsDesc = activePrefs.length > 0 ? activePrefs.join(', ') : "None enabled";
  }

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 text-slate-900">
        <header className="px-5 py-4 pt-safe shrink-0 flex items-center bg-white border-b border-slate-200">
          <button onClick={() => navigate('/auth/preferences', { replace: true })} className="mr-3 p-1 -ml-1 text-slate-700" aria-label="Go back">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">Review Setup</h1>
        </header>

        <div className="app-scroll flex-1 px-5 pb-8 pt-6">
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-brand-600" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-slate-900">You're All Set!</h2>
            <p className="text-[15px] text-slate-600 leading-relaxed max-w-[280px]">
              Your account has been configured securely. Here's a summary of what you've set up.
            </p>
          </div>

          <div className="space-y-4">
            <SummaryCard icon={<User className="text-brand-600" />} title="Personal Profile" desc={`${state.profile?.name || 'Not set'} (Self)`} />
            <SummaryCard icon={<Users className="text-brand-600" />} title="Household Members" desc={householdDesc} />
            <SummaryCard icon={<ShieldAlert className="text-brand-600" />} title="Emergency SOS" desc={`${sosReadyCount} Profiles Ready`} />
            <SummaryCard icon={<Bell className="text-brand-600" />} title="Preferences" desc={prefsDesc} />
          </div>
        </div>

        <div className="px-4 pt-3 pb-6 bg-white border-t border-slate-200 shrink-0">
          <Button onClick={handleFinish} variant="primary">
            Enter Patient Home
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};

const SummaryCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-200 shadow-sm">
    <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-[15px] text-slate-900">{title}</h3>
      <p className="text-[13px] text-slate-500 mt-0.5">{desc}</p>
    </div>
  </div>
);
