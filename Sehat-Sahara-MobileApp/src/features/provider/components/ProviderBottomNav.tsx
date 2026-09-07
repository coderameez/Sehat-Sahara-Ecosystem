import React from 'react';
import { Home, Calendar, Briefcase, Users, User } from 'lucide-react';
import { BottomNav, NavItem } from '../../../components/BottomNav';

export interface ProviderBottomNavProps {
  activeId: string;
  onChange: (id: string) => void;
}

const PROVIDER_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
  { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
  { id: 'opportunities', label: 'Opportunities', icon: <Briefcase className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
  { id: 'community', label: 'Community', icon: <Users className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" /> },
];

export const ProviderBottomNav: React.FC<ProviderBottomNavProps> = ({
  activeId,
  onChange,
}) => {
  return (
    <BottomNav
      activeId={activeId}
      onChange={onChange}
      items={PROVIDER_ITEMS}
    />
  );
};
