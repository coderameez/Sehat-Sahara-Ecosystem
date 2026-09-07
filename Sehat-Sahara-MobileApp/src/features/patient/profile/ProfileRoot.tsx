import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootScreenLayout } from '../../../components/layouts';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import {
  User,
  Users,
  ShieldAlert,
  Settings,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Camera
} from 'lucide-react';

export const ProfileRoot: React.FC = () => {
  const navigate = useNavigate();
  const state = OnboardingStore.getSnapshot();
  const profile = state.profile || FALLBACK_PROFILE;
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleLogout = () => {
    OnboardingStore.signOut();
    navigate('/welcome', { replace: true });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatar(url);
    }
  };

  return (
    <RootScreenLayout activeTab="profile">
      <header className="px-5 py-4 shrink-0 bg-white border-b border-slate-100 flex items-center">
        <h1 className="text-lg font-bold text-slate-900">Profile & Settings</h1>
      </header>

      <div className="app-scroll flex-1 bg-slate-50 pb-20">
        {/* User Card */}
        <div className="bg-white px-5 py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer block">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow border border-slate-200 text-slate-500">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </label>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile?.name || 'Patient'}</h2>
              <p className="text-[14px] text-slate-500 mt-0.5">{profile?.phone || '0300 0000000'}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{profile?.city || 'Karachi'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 mt-6 space-y-6">

          {/* Section: Account & Family */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Account & Family
            </h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <MenuButton
                icon={<User className="w-5 h-5 text-slate-600" />}
                label="Personal Information"
                onClick={() => navigate('/patient/profile/personal')}
              />
              <div className="h-px bg-slate-100 ml-12" />
              <MenuButton
                icon={<Users className="w-5 h-5 text-slate-600" />}
                label="Care Profiles (Household)"
                onClick={() => navigate('/patient/profile/household')}
              />
            </div>
          </div>

          {/* Section: Security & Emergency */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              Safety & Emergency
            </h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <MenuButton
                icon={<ShieldAlert className="w-5 h-5 text-red-500" />}
                label="Emergency SOS Setup"
                onClick={() => navigate('/patient/profile/sos-setup')}
              />
            </div>
          </div>

          {/* Section: Settings */}
          <div>
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              App Settings
            </h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <MenuButton
                icon={<Settings className="w-5 h-5 text-slate-600" />}
                label="Settings & Preferences"
                onClick={() => navigate('/patient/profile/settings', { state: { from: 'profile' } })}
              />
              <div className="h-px bg-slate-100 ml-12" />
              <MenuButton
                icon={<Shield className="w-5 h-5 text-slate-600" />}
                label="Privacy & Contact"
                onClick={() => navigate('/patient/profile/privacy')}
              />
              <div className="h-px bg-slate-100 ml-12" />
              <MenuButton
                icon={<HelpCircle className="w-5 h-5 text-slate-600" />}
                label="Help & Support"
                onClick={() => navigate('/patient/profile/help')}
              />
              <div className="h-px bg-slate-100 ml-12" />
              <MenuButton
                icon={<HelpCircle className="w-5 h-5 text-slate-600 opacity-0" />}
                label="About Sehat Sahara"
                onClick={() => navigate('/patient/profile/about')}
              />
            </div>
          </div>


          {/* Switch App Removed */}

          <button
            onClick={handleLogout}
            className="w-full h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center gap-2 text-red-600 font-bold active:bg-slate-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>

          <div className="text-center pt-2 pb-6">
            <p className="text-[11px] text-slate-400 font-medium">Sehat Sahara v1.0.0</p>
          </div>
        </div>
      </div>
    </RootScreenLayout>
  );
};

const MenuButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white active:bg-slate-50 transition-colors text-left"
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[15px] font-semibold text-slate-800">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400" />
  </button>
);
