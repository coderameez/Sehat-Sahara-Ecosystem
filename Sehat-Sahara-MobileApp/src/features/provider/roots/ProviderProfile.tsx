import React from 'react';
import { ProviderRootLayout } from '../components/ProviderRootLayout';
import { ProviderStore } from '../../../services/ProviderStore';
import { Button } from '../../../components';
import { ShieldCheck, ShieldAlert, FileText, Settings, HelpCircle, LogOut, GraduationCap, XOctagon, Building2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStore } from '../../../services/OnboardingStore';

export const ProviderProfile: React.FC = () => {
  const navigate = useNavigate();
  const state = ProviderStore.getSnapshot();
  const { identity, journey, verificationStatus, reviewsCount, rating } = state;
  const isStudent = journey === 'medical_student';

  const handleLogout = () => {
    OnboardingStore.signOut();
    ProviderStore.reset();
    navigate('/onboarding/role', { replace: true });
  };

  const renderVerificationBanner = () => {
    let icon, bg, border, text, title, desc;

    switch (verificationStatus) {
      case 'PMDC Verified':
        icon = <ShieldCheck className="w-5 h-5 text-green-700 mt-0.5" />;
        bg = 'bg-green-50'; border = 'border-green-200'; text = 'text-green-800';
        title = 'PMDC Verified'; desc = 'Your credentials have been verified by Sehat Sahara.';
        break;
      case 'Supervised Student':
        icon = <GraduationCap className="w-5 h-5 text-blue-700 mt-0.5" />;
        bg = 'bg-blue-50'; border = 'border-blue-200'; text = 'text-blue-800';
        title = 'Student Account'; desc = 'You are operating under supervision. Independent practice is disabled.';
        break;
      case 'Verification Pending':
        icon = <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5" />;
        bg = 'bg-amber-50'; border = 'border-amber-200'; text = 'text-amber-800';
        title = 'Verification Pending'; desc = 'Your documents are currently under review.';
        break;
      case 'Needs Changes':
        icon = <ShieldAlert className="w-5 h-5 text-orange-700 mt-0.5" />;
        bg = 'bg-orange-50'; border = 'border-orange-200'; text = 'text-orange-800';
        title = 'Action Required'; desc = 'Some submitted documents need to be re-uploaded.';
        break;
      default:
        icon = <XOctagon className="w-5 h-5 text-red-700 mt-0.5" />;
        bg = 'bg-red-50'; border = 'border-red-200'; text = 'text-red-800';
        title = 'Restricted'; desc = 'Your account has been restricted. Please contact support.';
        break;
    }

    return (
      <div className={`p-4 rounded-2xl border ${bg} ${border} flex items-start gap-3 mb-6`}>
        {icon}
        <div>
          <h3 className={`font-bold ${text} text-sm mb-0.5`}>{title}</h3>
          <p className={`${text} text-xs opacity-90`}>{desc}</p>
        </div>
      </div>
    );
  };

  return (
    <ProviderRootLayout activeTab="profile">
        {/* Header */}
        <header className="px-5 pt-4 pb-3 bg-white border-b border-slate-200 shrink-0 pt-safe">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-0.5">Provider Profile</h1>
          <p className="text-sm text-slate-500">
            {isStudent ? 'Manage student credentials & supervision' : 'Manage professional profile & settings'}
          </p>
        </header>

        <div className="flex-1 min-h-0 app-scroll p-5">
          
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-16 bg-brand-600"></div>
            
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 mx-auto mb-3 flex items-center justify-center font-bold text-slate-500 text-2xl overflow-hidden shadow-sm">
                {identity.avatarUrl ? (
                  <img src={identity.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  identity.name.replace('Dr.', '').trim().charAt(0)
                )}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{identity.name}</h2>
              <p className="text-sm font-medium text-slate-500 mb-4">
                {isStudent ? 'Medical Student' : journey === 'consultant_specialist' ? 'Consultant Specialist' : 'General Physician'}
              </p>

              {!isStudent && (
                <div className="flex justify-center gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{rating} <span className="text-yellow-500 text-sm">★</span></h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rating</p>
                  </div>
                  <div className="w-px bg-slate-200"></div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{reviewsCount}</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reviews</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {renderVerificationBanner()}

          {/* Links */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <ProfileLink icon={<FileText />} label="Professional Details" />
            <ProfileLink icon={<Building2 />} label="Clinic & Work Locations" />
            {isStudent && <ProfileLink icon={<BookOpen />} label="Academic Logbook" />}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <ProfileLink icon={<Settings />} label="App Settings" />
            <ProfileLink icon={<HelpCircle />} label="Help & Support" />
          </div>

          <Button 
            variant="secondary" 
            fullWidth 
            onClick={handleLogout}
            className="!text-red-600 !border-red-200 hover:!bg-red-50 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>

          <p className="text-center text-xs text-slate-400 mt-6 font-medium">Sehat Sahara Provider App v1.0.0</p>
        </div>
    </ProviderRootLayout>
  );
};

const ProfileLink: React.FC<{ icon: React.ReactNode, label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors active:bg-slate-100">
    <div className="flex items-center gap-3">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 text-slate-400' })}
      <span className="font-medium text-slate-700 text-[15px]">{label}</span>
    </div>
    <div className="w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45 mr-1"></div>
  </button>
);
