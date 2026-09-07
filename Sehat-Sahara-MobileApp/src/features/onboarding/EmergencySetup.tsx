import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, BottomSheet } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

export const EmergencySetup: React.FC = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [profiles, setProfiles] = useState([
    { id: 'ali', name: 'Ali Raza', status: 'pending' },
    { id: 'shazia', name: 'Shazia Raza', status: 'pending' }
  ]);

  const handleConfig = (id: string) => {
    setActiveId(id);
  };

  const completeConfig = () => {
    if (activeId) {
      setProfiles(p => p.map(prof => prof.id === activeId ? { ...prof, status: 'configured' } : prof));
    }
    setActiveId(null);
  };

  const handleContinue = () => {
    navigate('/auth/preferences');
  };

  const allConfigured = profiles.every(p => p.status === 'configured');

  return (
    <InnerScreenLayout title="Emergency Readiness">
      <div className="flex flex-col h-full bg-slate-50">
        <div className="app-scroll flex-1 px-5 pb-8 pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">SOS Configuration</h2>
            <p className="text-[15px] text-slate-600 leading-relaxed">
              Set up emergency contacts and critical health information for each person.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {profiles.map(prof => (
              <button
                key={prof.id}
                onClick={() => handleConfig(prof.id)}
                className="p-4 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-between text-left transition-colors active:bg-slate-50"
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

        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0">
          <Button onClick={handleContinue} size="lg" fullWidth disabled={!allConfigured}>
            Continue
          </Button>
        </div>

        <BottomSheet isOpen={!!activeId} onClose={() => setActiveId(null)} title="Configure SOS">
          <div className="pb-4 space-y-4">
            <p className="text-slate-600 text-sm">Review your emergency contacts and preferences.</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Contact</label>
                <div className="text-sm font-semibold text-slate-900">Brother (0300-1234567)</div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hospital Preference</label>
                <div className="text-sm font-semibold text-slate-900">Aga Khan University Hospital</div>
              </div>
            </div>
            <Button fullWidth onClick={completeConfig}>Save & Mark Ready</Button>
          </div>
        </BottomSheet>
      </div>
    </InnerScreenLayout>
  );
};
