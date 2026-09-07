import React, { useState } from 'react';
import { MobileAppShell, Button } from '../../../components';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { ChevronLeft, User, Mail, MapPin } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const PersonalInfo: React.FC = () => {
  const goBack = useAppBack();
  const state = OnboardingStore.getSnapshot();
  const profile = state.profile;

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    city: profile?.city || '',
    area: profile?.area || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      OnboardingStore.updateState({ profile: { ...profile, ...formData } });
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
          <h1 className="text-lg font-bold text-slate-900">Personal Info</h1>
        </header>

        <form onSubmit={handleSave} className="app-scroll flex-1 px-5 pt-6 pb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Update Details</h2>
            <p className="text-slate-500 text-sm">Keep your personal information up to date.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2"><User className="w-4 h-4"/> Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2"><User className="w-4 h-4"/> Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200 bg-slate-100 text-[15px] outline-none text-slate-500" readOnly />
              <p className="text-xs text-slate-400 mt-1">Phone number cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2"><Mail className="w-4 h-4"/> Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4"/> City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Area</label>
                <input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" required />
              </div>
            </div>
          </div>
        </form>

        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0">
          <Button onClick={handleSave} size="lg" fullWidth>
            Save Changes
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
