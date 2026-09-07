import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { ProviderRootHeader } from './ProviderRootHeader';
import { ProviderBottomNav } from './ProviderBottomNav';

export const ProviderRootLayout: React.FC<{
  children: React.ReactNode;
  activeTab: string;
}> = ({ children, activeTab }) => {
  const navigate = useNavigate();
  return (
    <MobileAppShell className="sehat-provider-root-layout">
      {activeTab === 'home' && <ProviderRootHeader />}
      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden bg-[#F8FAFC]">
        {children}
      </div>
      <ProviderBottomNav
        activeId={activeTab}
        onChange={(id) => {
          if (id === 'home') navigate('/doctor/home');
          else if (id === 'appointments') navigate('/doctor/appointments');
          else if (id === 'opportunities') navigate('/doctor/opportunities');
          else if (id === 'community') navigate('/doctor/community');
          else if (id === 'profile') navigate('/doctor/profile');
        }}
      />
    </MobileAppShell>
  );
};
