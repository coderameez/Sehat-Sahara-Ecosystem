import React, { useState, useMemo } from 'react';
import {
  Users as UsersIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
} from 'lucide-react';
import { mockPatients, mockDoctors, mockHospitals } from '../data/usersMockData';
import type { AdminUser } from '../data/usersMockData';
import { UserDetailDrawer } from '../components/UserDetailDrawer';

type RoleTab = 'Patients' | 'Doctors' | 'Hospitals';

export const AdminUsers: React.FC = () => {
  // ─── Local state for users data (so suspend/reactivate toggles reflect live) ─
  const [patients, setPatients] = useState<AdminUser[]>(mockPatients);
  const [doctors, setDoctors] = useState<AdminUser[]>(mockDoctors);
  const [hospitals, setHospitals] = useState<AdminUser[]>(mockHospitals);

  // ─── Filtering & Tab State ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<RoleTab>('Patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // ─── Drawer State ───────────────────────────────────────────────────────────
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ─── Get current dataset based on active tab ────────────────────────────────
  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'Patients':
        return patients;
      case 'Doctors':
        return doctors;
      case 'Hospitals':
        return hospitals;
    }
  }, [activeTab, patients, doctors, hospitals]);

  // ─── Filtered items ─────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return currentList.filter((user) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.cnic.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      // Status match
      const matchesStatus =
        statusFilter === 'All' || user.status.toLowerCase() === statusFilter.toLowerCase();

      // Type match
      const matchesType =
        typeFilter === 'All' ||
        user.accountType.toLowerCase().includes(typeFilter.toLowerCase()) ||
        (user.specialty && user.specialty.toLowerCase().includes(typeFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [currentList, searchQuery, statusFilter, typeFilter]);

  // ─── User Actions: Suspend / Reactivate ─────────────────────────────────────
  const handleToggleSuspend = (userId: string) => {
    const updater = (prev: AdminUser[]) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus: AdminUser['status'] =
            u.status === 'Suspended' ? 'Verified' : 'Suspended';
          const updatedUser: AdminUser = {
            ...u,
            status: newStatus,
            auditTrail: [
              {
                event:
                  newStatus === 'Suspended'
                    ? 'Suspended by Super Admin'
                    : 'Reactivated by Super Admin',
                date: 'Just now',
                notes: 'Status updated from Admin Users panel',
              },
              ...u.auditTrail,
            ],
          };
          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      });

    if (activeTab === 'Patients') setPatients(updater);
    else if (activeTab === 'Doctors') setDoctors(updater);
    else setHospitals(updater);
  };

  const handleOpenDrawer = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">

      {/* ─── Top Header & Role Tabs ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-slate-900 leading-tight">Users</h1>
            <p className="text-[12px] text-slate-500 font-medium">Manage and audit registered platform accounts</p>
          </div>
        </div>

        {/* Segmented Tabs matching PDF: Patients | Doctors | Hospitals */}
        <div className="inline-flex bg-slate-200/70 p-1 rounded-xl border border-slate-200">
          {(['Patients', 'Doctors', 'Hospitals'] as RoleTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                  setStatusFilter('All');
                  setTypeFilter('All');
                }}
                className={`
                  px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150
                  ${isActive
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Search & Filter Controls ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab.toLowerCase()} by name, phone or CNIC...`}
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-surface-border bg-surface-page text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[12px] font-semibold text-slate-500 shrink-0">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-surface-border bg-white text-[13px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Type Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-[12px] font-semibold text-slate-500 shrink-0">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-surface-border bg-white text-[13px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors cursor-pointer"
          >
            <option value="All">All Types</option>
            {activeTab === 'Patients' && <option value="Patient">Standard Patient</option>}
            {activeTab === 'Doctors' && (
              <>
                <option value="GP">General Physician</option>
                <option value="Specialist">Specialist</option>
              </>
            )}
            {activeTab === 'Hospitals' && (
              <>
                <option value="Hospital">Hospital</option>
                <option value="Clinic">Clinic</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* ─── Users Table Card ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-page border-b border-surface-border">
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verification / Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-[13px]">
                    No {activeTab.toLowerCase()} found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => handleOpenDrawer(user)}
                    className="hover:bg-surface-page/60 cursor-pointer transition-colors"
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 text-[12px] font-bold flex items-center justify-center shrink-0 border border-slate-200">
                          {user.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-semibold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{user.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-slate-700 font-medium">{user.role}</span>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-mono text-slate-800">{user.phone}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">{user.email}</p>
                      </div>
                    </td>

                    {/* Verification / Status */}
                    <td className="px-5 py-3.5">
                      {user.status === 'Verified' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full leading-none">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                      {user.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full leading-none">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Pending
                        </span>
                      )}
                      {user.status === 'Suspended' && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full leading-none">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5">
                      <p className="text-[12.5px] font-medium text-slate-800">{user.joinedDate}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{user.joinedTime}</p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDrawer(user)}
                          title="View Details"
                          className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDrawer(user)}
                          title="More options"
                          className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Bar ─────────────────────────────────────────── */}
        <div className="px-5 py-3.5 bg-surface-page/50 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">1</span> to{' '}
            <span className="font-semibold text-slate-900">{filteredUsers.length}</span> of{' '}
            <span className="font-semibold text-slate-900">248</span> {activeTab.toLowerCase()}
          </div>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 font-medium">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 font-medium">
              3
            </button>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 font-medium">
              4
            </button>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 font-medium">
              5
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 font-medium">
              31
            </button>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select className="h-8 px-2 rounded-lg border border-surface-border bg-white text-[12px] font-medium text-slate-700 focus:outline-none cursor-pointer">
              <option>10 per page</option>
              <option>25 per page</option>
              <option>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Detail Drawer ──────────────────────────────────────────── */}
      <UserDetailDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onToggleSuspend={handleToggleSuspend}
      />

    </div>
  );
};
