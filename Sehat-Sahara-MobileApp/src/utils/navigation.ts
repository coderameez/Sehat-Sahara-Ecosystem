import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Central Logical Parent Route Resolver
 * Maps any route or screen to its explicit logical parent.
 * Avoids history-based loops and ensures deterministic back-routing.
 */
export function getBackTarget(pathname: string, state?: any): string {
  // If state provides an explicit valid parent route, respect it
  if (state && typeof state.from === 'string' && state.from.startsWith('/')) {
    return state.from;
  }

  // ─── 1. Community Flow ───
  // Blood Donation
  if (pathname === '/patient/community/blood') {
    return '/patient/community';
  }
  if (pathname.startsWith('/patient/community/blood/coordination')) {
    return '/patient/community/blood';
  }
  if (pathname.startsWith('/patient/community/blood/chat')) {
    return '/patient/community/blood';
  }
  if (pathname.startsWith('/patient/community/blood/')) {
    return '/patient/community/blood';
  }

  // Things Sharing
  if (pathname === '/patient/community/things') {
    return '/patient/community';
  }
  if (pathname === '/patient/community/things/add') {
    return '/patient/community/things';
  }
  if (pathname === '/patient/community/things/borrow') {
    return '/patient/community/things';
  }
  if (pathname.startsWith('/patient/community/things/')) {
    return '/patient/community/things';
  }
  if (pathname === '/patient/community/chat') {
    return '/patient/community';
  }

  // ─── 2. Care / Booking Flow ───
  if (pathname.startsWith('/patient/appointments/')) {
    return '/patient/care/my-care';
  }
  if (pathname.startsWith('/patient/queue/')) {
    return '/patient/care/my-care';
  }
  if (pathname.startsWith('/patient/consultation/')) {
    return '/patient/care/my-care';
  }
  if (pathname === '/patient/booking/confirmation') {
    return '/patient/care/my-care';
  }
  if (pathname.startsWith('/patient/book/')) {
    const docId = pathname.replace('/patient/book/', '');
    return `/patient/doctors/${docId}`;
  }
  if (pathname.startsWith('/patient/doctors/')) {
    return '/patient/care';
  }
  if (pathname === '/patient/doctors') {
    return '/patient/care';
  }
  if (pathname === '/patient/checkout') {
    return '/patient/care';
  }
  if (pathname.startsWith('/patient/care/home-visit/tracker/')) {
    return '/patient/care/my-care';
  }
  if (pathname.startsWith('/patient/care/home-visit/')) {
    return '/patient/care/home-visit';
  }
  if (pathname === '/patient/care/home-visit') {
    return '/patient/care';
  }
  if (pathname.startsWith('/patient/care/in-clinic/')) {
    return '/patient/care/in-clinic';
  }
  if (pathname === '/patient/care/in-clinic') {
    return '/patient/care';
  }
  if (pathname.startsWith('/patient/care/online/')) {
    return '/patient/care/online';
  }
  if (pathname === '/patient/care/online') {
    return '/patient/care';
  }
  if (pathname.startsWith('/patient/care/facilities/')) {
    return '/patient/care/facilities';
  }
  if (pathname === '/patient/care/facilities') {
    return '/patient/care';
  }
  if (pathname.startsWith('/patient/care/token/')) {
    return '/patient/care/token';
  }
  if (pathname === '/patient/care/token') {
    return '/patient/care';
  }
  if (pathname.startsWith('/patient/care/home-support/')) {
    return '/patient/care/home-support';
  }
  if (pathname === '/patient/care/home-support') {
    return '/patient/care';
  }
  if (pathname === '/patient/care/open-request') {
    return '/patient/care';
  }
  if (pathname === '/patient/care/my-care') {
    return '/patient/care';
  }

  // ─── 3. Triage & Emergency ───
  if (pathname === '/patient/triage/result') {
    return '/patient/triage';
  }
  if (pathname === '/patient/sos/result') {
    return '/patient/sos';
  }
  if (pathname === '/patient/sos') {
    return '/patient';
  }
  if (pathname === '/patient/notifications') {
    return '/patient';
  }

  // ─── 4. Medical Records & Medicines ───
  if (pathname.startsWith('/patient/records/folder/')) {
    return '/patient/records';
  }
  if (pathname.startsWith('/patient/records/share/')) {
    return '/patient/records';
  }
  if (pathname === '/patient/records/upload') {
    return '/patient/records';
  }
  if (pathname === '/patient/records/shares') {
    return '/patient/records';
  }
  if (pathname.startsWith('/patient/records/')) {
    return '/patient/records';
  }
  if (pathname.startsWith('/patient/prescriptions/')) {
    return '/patient/records';
  }
  if (pathname === '/patient/records') {
    return '/patient/profile';
  }
  if (pathname === '/patient/medicines/add') {
    return '/patient/medicines';
  }
  if (pathname === '/patient/medicines') {
    return '/patient';
  }

  // ─── 5. Profile Flow ───
  if (pathname.startsWith('/patient/profile/household/')) {
    return '/patient/profile/household';
  }
  if (pathname === '/patient/profile/household') {
    return '/patient/profile';
  }
  if (pathname.startsWith('/patient/profile/sos-setup/')) {
    return '/patient/profile/sos-setup';
  }
  if (pathname === '/patient/profile/sos-setup') {
    return '/patient/profile';
  }
  if (pathname === '/patient/profile/personal') {
    return '/patient/profile';
  }
  if (pathname === '/patient/profile/settings') {
    return '/patient/profile';
  }
  if (pathname === '/patient/profile/help') {
    return '/patient/profile';
  }
  if (pathname === '/patient/profile/about') {
    return '/patient/profile';
  }
  if (pathname === '/patient/profile/privacy') {
    return '/patient/profile';
  }

  // ─── 6. Provider Flow ───
  // Provider Community
  if (pathname.startsWith('/doctor/community/blood/coordination')) {
    return '/doctor/community/blood';
  }
  if (pathname.startsWith('/doctor/community/blood/chat')) {
    return '/doctor/community/blood';
  }
  if (pathname.startsWith('/doctor/community/blood/')) {
    return '/doctor/community/blood';
  }
  if (pathname === '/doctor/community/blood') {
    return '/doctor/community';
  }
  if (pathname.startsWith('/doctor/community/things/borrow')) {
    return '/doctor/community/things';
  }
  if (pathname.startsWith('/doctor/community/things/')) {
    return '/doctor/community/things';
  }
  if (pathname === '/doctor/community/things') {
    return '/doctor/community';
  }
  if (pathname === '/doctor/community/chat') {
    return '/doctor/community';
  }

  // Provider Medical & Appointments
  if (pathname.startsWith('/doctor/appointments/')) {
    return '/doctor/appointments';
  }
  if (pathname === '/doctor/opportunities/post') {
    return '/doctor/opportunities';
  }
  if (pathname.startsWith('/doctor/opportunities/')) {
    return '/doctor/opportunities';
  }
  if (pathname.startsWith('/doctor/consultation/') && pathname.includes('/ai-note')) {
    const baseId = pathname.replace('/doctor/consultation/', '').replace('/ai-note', '');
    return `/doctor/consultation/${baseId}`;
  }
  if (pathname.startsWith('/doctor/consultation/') && pathname.includes('/prescription')) {
    const baseId = pathname.replace('/doctor/consultation/', '').replace('/prescription', '');
    return `/doctor/consultation/${baseId}`;
  }
  if (pathname.startsWith('/doctor/consultation/')) {
    const baseId = pathname.replace('/doctor/consultation/', '');
    return `/doctor/appointments/${baseId}`;
  }
  if (pathname.startsWith('/doctor/home-visit/')) {
    return '/doctor/home';
  }
  if (pathname === '/doctor/queue') {
    return '/doctor/home';
  }
  if (pathname === '/doctor/patients') {
    return '/doctor/home';
  }
  if (pathname === '/doctor/ai-copilot') {
    return '/doctor/home';
  }

  // ─── 7. Onboarding & Auth Flow ───
  if (pathname === '/onboarding/language') return '/welcome';
  if (pathname === '/onboarding/role') return '/onboarding/language';
  if (pathname === '/onboarding/provider-type') return '/onboarding/role';
  if (pathname === '/onboarding/doctor') return '/onboarding/provider-type';
  if (pathname === '/onboarding/student') return '/onboarding/provider-type';
  if (pathname === '/onboarding/fresher') return '/onboarding/provider-type';
  if (pathname === '/onboarding/consultant') return '/onboarding/provider-type';
  if (pathname === '/onboarding/intro') return '/onboarding/role';
  if (pathname === '/auth/entry') return '/onboarding/role';
  if (pathname === '/auth/verify') return '/auth/entry';
  if (pathname === '/auth/profile') return '/auth/verify';
  if (pathname === '/auth/care-scope') return '/auth/profile';
  if (pathname === '/auth/dependents') return '/auth/care-scope';
  if (pathname === '/auth/emergency') return '/auth/dependents';
  if (pathname === '/auth/preferences') return '/auth/emergency';
  if (pathname === '/auth/review') return '/auth/preferences';

  // Fallback defaults
  if (pathname.startsWith('/doctor')) return '/doctor/home';
  return '/patient';
}

/**
 * Hook to navigate to the explicit parent route with replace: true
 * to prevent back-loops in history.
 */
export function useAppBack() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (fallback?: string, stateOverride?: any) => {
      const target = fallback || getBackTarget(location.pathname, location.state);
      navigate(target, { replace: true, state: stateOverride });
    },
    [navigate, location.pathname, location.state]
  );
}
