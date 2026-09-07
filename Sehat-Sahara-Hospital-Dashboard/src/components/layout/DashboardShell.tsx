import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardShell() {
  return (
    <div className="flex min-h-screen bg-surface-page">
      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main Area ── */}
      <div className="flex flex-1 flex-col ml-[260px]">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
