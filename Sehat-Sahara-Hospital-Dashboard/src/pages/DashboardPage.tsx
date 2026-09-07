import { useSyncExternalStore } from 'react';
import { store } from '../store';
import { facilities } from '../data/demo-data';
import { ClinicDashboard } from '../components/dashboard/ClinicDashboard';
import { HospitalDashboard } from '../components/dashboard/HospitalDashboard';

export function DashboardPage() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId);
  
  if (!activeFacility) return null;

  switch (activeFacility.type) {
    case 'HOSPITAL':
      return <HospitalDashboard />;
    case 'CLINIC':
    default:
      return <ClinicDashboard />;
  }
}
