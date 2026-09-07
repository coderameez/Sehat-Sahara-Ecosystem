import React from 'react';
import { useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft } from 'lucide-react';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { useAppBack } from '../../../utils/navigation';

export const EmergencySetupDetail: React.FC = () => {
  const goBack = useAppBack();
  const { id } = useParams();

  const state = OnboardingStore.getSnapshot();
  const isPrimary = id === 'primary';
  const profile = isPrimary ? state.profile : state.careProfiles.find(p => p.id === id);

  // Form states
  const [sosPrimaryContactRelation, setSosPrimaryContactRelation] = React.useState(
    isPrimary ? '' : (profile as any)?.sosPrimaryContactRelation || ''
  );
  const [sosPrimaryContactPhone, setSosPrimaryContactPhone] = React.useState(
    isPrimary ? state.profile?.emergencyContact || '' : (profile as any)?.sosPrimaryContactPhone || ''
  );
  const [bloodGroup, setBloodGroup] = React.useState(
    (profile as any)?.bloodGroup || ''
  );
  const [sosPreferredHospital, setSosPreferredHospital] = React.useState(
    (profile as any)?.sosPreferredHospital || ''
  );

  const name = profile?.name || 'Unknown Profile';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPrimary) {
      OnboardingStore.updateState({
        profile: { ...state.profile!, emergencyContact: sosPrimaryContactPhone }
      });
      // Primary SOS setup requires at least one care profile to be updated if we had primary fields,
      // but since primary is managed via `profile`, we can simulate `sosEnabled` on primary by adding it to careProfiles or just managing it globally.
      // Wait, let's look at getCompletionPercentage - it checks `careProfiles.some(p => p.sosEnabled)`.
      // So even for primary, there should be a primary CareProfile.
      const existingPrimaryCareProfile = state.careProfiles.find(p => p.isPrimary);
      if (existingPrimaryCareProfile) {
        OnboardingStore.updateCareProfile(existingPrimaryCareProfile.id, {
          sosEnabled: true,
          sosPrimaryContactRelation,
          sosPrimaryContactPhone,
          sosPreferredHospital,
          bloodGroup
        });
      } else {
         OnboardingStore.addCareProfile({
            name: state.profile!.name,
            relation: 'Self',
            isPrimary: true,
            sosEnabled: true,
            sosPrimaryContactRelation,
            sosPrimaryContactPhone,
            sosPreferredHospital,
            bloodGroup
         });
      }
    } else {
      OnboardingStore.updateCareProfile(id!, {
        sosEnabled: true,
        sosPrimaryContactRelation,
        sosPrimaryContactPhone,
        sosPreferredHospital,
        bloodGroup
      });
    }
    goBack();
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        <header className="px-5 py-4 shrink-0 flex items-center bg-white border-b border-slate-100">
          <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
            <ChevronLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">SOS Configuration</h1>
        </header>

        <form onSubmit={handleSave} className="app-scroll flex-1 px-5 pt-6 pb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">{name}</h2>
            <p className="text-sm text-slate-500">Configure emergency contacts and preferences.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Primary Emergency Contact</label>
              <input type="text" value={sosPrimaryContactRelation} onChange={e => setSosPrimaryContactRelation(e.target.value)} placeholder="Relation (e.g. Brother)" className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 mb-2" required />
              <input type="tel" value={sosPrimaryContactPhone} onChange={e => setSosPrimaryContactPhone(e.target.value)} placeholder="Phone Number" className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Hospital Preference (Optional)</label>
              <select value={sosPreferredHospital} onChange={e => setSosPreferredHospital(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option value="">No preference</option>
                <option value="Aga Khan University Hospital">Aga Khan University Hospital</option>
                <option value="South City Hospital">South City Hospital</option>
                <option value="Liaquat National Hospital">Liaquat National Hospital</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Blood Type</label>
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500">
                <option value="">Unknown</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </form>

        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0">
          <Button onClick={handleSave} size="lg" fullWidth>
            Save Configuration
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
