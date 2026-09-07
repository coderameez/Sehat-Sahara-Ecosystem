import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { ChevronLeft, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { useAppBack } from '../../../utils/navigation';

export const EmergencySetupList: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();

  const { careProfiles, profile: primaryProfile } = OnboardingStore.getSnapshot();
  
  // Build list including primary and dependents
  const profiles = careProfiles.map(p => ({
    id: p.id,
    name: p.name,
    status: p.sosEnabled ? 'configured' : 'pending'
  }));

  if (profiles.length === 0 && primaryProfile) {
    profiles.push({
      id: 'primary',
      name: primaryProfile.name,
      status: 'pending'
    });
  }

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        <header className="px-5 py-4 shrink-0 flex items-center bg-white border-b border-slate-100">
          <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
            <ChevronLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Emergency SOS Setup</h1>
        </header>

        <div className="app-scroll flex-1 px-5 pt-6 pb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">SOS Profiles</h2>
            <p className="text-[15px] text-slate-600">
              Manage emergency contacts and hospital preferences for each family member.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {profiles.map(prof => (
              <button
                key={prof.id}
                onClick={() => navigate(`/patient/profile/sos-setup/${prof.id}`)}
                className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between text-left transition-colors active:bg-slate-50 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    prof.status === 'configured' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {prof.status === 'configured' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-[16px]">{prof.name}</h3>
                    <p className={`text-[13px] mt-0.5 font-semibold ${prof.status === 'configured' ? 'text-green-600' : 'text-red-500'}`}>
                      {prof.status === 'configured' ? 'Ready' : 'Setup Required'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
