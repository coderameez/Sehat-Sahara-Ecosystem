// ─── Admin Navigation Configuration ─────────────────────────────────────────
// Source of truth for sidebar items. Later chunks will add their own routes.

export interface AdminNavItem {
  id: string;
  label: string;
  icon: string; // lucide icon name
  path: string;
  badge?: number;
  enabled: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/admin',
    enabled: true,
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'Users',
    path: '/admin/users',
    enabled: true,
  },
  {
    id: 'doctor-verification',
    label: 'Doctor Verification',
    icon: 'ShieldCheck',
    path: '/admin/verification',
    badge: 23,
    enabled: true,
  },
  {
    id: 'hospital-accounts',
    label: 'Hospital / Clinic Accounts',
    icon: 'Building2',
    path: '/admin/hospitals',
    enabled: true,
  },
  {
    id: 'community-moderation',
    label: 'Community Moderation',
    icon: 'MessageSquareWarning',
    path: '/admin/community',
    badge: 148,
    enabled: true,
  },
  {
    id: 'platform-settings',
    label: 'Platform Settings',
    icon: 'Settings',
    path: '/admin/settings',
    enabled: true,
  },
];
