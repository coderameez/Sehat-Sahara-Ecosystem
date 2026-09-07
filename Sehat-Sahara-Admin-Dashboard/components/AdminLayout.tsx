import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  /** Current active section ID matching navigation config */
  activeSection: string;
  /** Function to handle section navigation */
  onNavigate: (sectionId: string) => void;
  /** Page title shown in the header */
  pageTitle: string;
  pageSubtitle?: string;
}

/**
 * AdminLayout — Full-viewport desktop layout.
 * Persistent sidebar on the left. Top header. Scrollable main area.
 * Matches the Sehat Sahara professional healthcare SaaS quality.
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onNavigate,
  pageTitle,
  pageSubtitle,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-page">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <AdminSidebar
        activeSection={activeSection}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* ── Main Column ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader pageTitle={pageTitle} pageSubtitle={pageSubtitle} />

        {/* ── Scrollable Content Area ─────────────────────────────── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
