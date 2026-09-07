import React, { useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AdminLayout } from './components';
import {
  AdminDashboard,
  AdminUsers,
  DoctorVerificationQueue,
  DoctorVerificationDetail,
  HospitalAccountsList,
  CreateHospitalAccount,
  CommunityModeration,
  PlatformSettings,
} from './pages';

// ─── Page title map ──────────────────────────────────────────────────────────
const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  dashboard:             { title: 'Dashboard', subtitle: 'Platform overview & analytics' },
  users:                 { title: 'Users', subtitle: 'Manage platform users' },
  'doctor-verification': { title: 'Doctor Verification', subtitle: 'Review doctor credentials and PMDC verification' },
  'hospital-accounts':   { title: 'Hospitals / Clinics', subtitle: 'Manage registered hospitals and clinic accounts' },
  'community-moderation':{ title: 'Community Moderation', subtitle: 'Review and moderate reported community content' },
  'platform-settings':   { title: 'Platform Settings', subtitle: 'Configure platform policies, verification rules, and demo mode' },
};

/**
 * AdminApp — Root component for the Admin module.
 *
 * This component owns admin-local routing and navigation state.
 * It renders inside the existing app's <Routes> once integrated.
 *
 * Usage:
 *   <Route path="/admin/*" element={<AdminApp />} />
 */
export const AdminApp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active section from URL path
  const activeSection = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/verification') || path.includes('/admin/doctor-verification')) return 'doctor-verification';
    if (path.includes('/admin/hospitals') || path.includes('/admin/hospital-accounts')) return 'hospital-accounts';
    if (path.includes('/admin/community') || path.includes('/admin/community-moderation')) return 'community-moderation';
    if (path.includes('/admin/settings') || path.includes('/admin/platform-settings')) return 'platform-settings';
    return 'dashboard';
  }, [location.pathname]);

  const handleNavigate = useCallback((sectionId: string) => {
    const paths: Record<string, string> = {
      dashboard: '/admin',
      users: '/admin/users',
      'doctor-verification': '/admin/verification',
      'hospital-accounts': '/admin/hospitals',
      'community-moderation': '/admin/community',
      'platform-settings': '/admin/settings',
    };
    navigate(paths[sectionId] || '/admin');
  }, [navigate]);

  const meta = pageMeta[activeSection] || pageMeta.dashboard;

  return (
    <AdminLayout
      activeSection={activeSection}
      onNavigate={handleNavigate}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
    >
      <Routes>
        {/* Admin-01 Dashboard */}
        <Route index element={<AdminDashboard />} />

        {/* Admin-02 Users */}
        <Route path="users" element={<AdminUsers />} />

        {/* Admin-03 & Admin-04 Doctor Verification */}
        <Route path="verification" element={<DoctorVerificationQueue />} />
        <Route path="verification/:doctorId" element={<DoctorVerificationDetail />} />
        <Route path="doctor-verification" element={<Navigate to="/admin/verification" replace />} />
        <Route path="doctor-verification/:doctorId" element={<Navigate to="/admin/verification/:doctorId" replace />} />

        {/* Admin-05 & Admin-06 Hospital / Clinic Accounts */}
        <Route path="hospitals" element={<HospitalAccountsList />} />
        <Route path="hospitals/create" element={<CreateHospitalAccount />} />
        <Route path="hospital-accounts" element={<Navigate to="/admin/hospitals" replace />} />
        <Route path="hospital-accounts/create" element={<Navigate to="/admin/hospitals/create" replace />} />

        {/* Admin-07 Community Moderation */}
        <Route path="community" element={<CommunityModeration />} />
        <Route path="community-moderation" element={<Navigate to="/admin/community" replace />} />

        {/* Admin-08 Platform Settings */}
        <Route path="settings" element={<PlatformSettings />} />
        <Route path="platform-settings" element={<Navigate to="/admin/settings" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
