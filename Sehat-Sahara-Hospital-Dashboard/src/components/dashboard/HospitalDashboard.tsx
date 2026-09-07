import { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Stethoscope,
  Users,
  Briefcase,
  Share2,
  ChevronDown,
  MapPin,
  Building2,
} from 'lucide-react';
import { Card, StatCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import {
  hospitalStats,
  hospitalBookings,
  hospitalFileShares,
  hospitalDoctors,
  hospitalHiring,
  facilities,
} from '../../data/demo-data';
import { store } from '../../store';

export function HospitalDashboard() {
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId) || facilities[0];
  const activeBranch = activeFacility.branches.find((b) => b.id === state.session.activeBranchId) || activeFacility.branches[0];
  const [selectedDepartment] = useState('All Departments');

  return (
    <div className="space-y-6">
      {/* ═══════ Header ═══════ */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm border border-surface-border">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Building2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-txt-primary">
                {activeBranch.name}
              </h1>
              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                Hospital
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-txt-secondary">
              <MapPin size={14} className="text-brand-500" />
              {activeBranch.address}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={<CalendarDays size={16} />}
          >
            19 May 2025, Monday
          </Button>
        </div>
      </div>

      {/* ═══════ KPI Cards ═══════ */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Today Bookings"
          value={hospitalStats.bookings}
          icon={<CalendarDays size={20} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend={{ value: 'Total', positive: true }}
        />
        <StatCard
          label="Doctors"
          value={hospitalStats.doctors}
          icon={<Stethoscope size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          trend={{ value: 'On duty', positive: true }}
        />
        <StatCard
          label="Patients"
          value={hospitalStats.patients}
          icon={<Users size={20} />}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          trend={{ value: 'Admitted', positive: true }}
        />
        <StatCard
          label="Shared Files"
          value={hospitalStats.sharedFiles}
          icon={<Share2 size={20} />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          trend={{ value: 'Active requests', positive: true }}
        />
        <StatCard
          label="Open Jobs"
          value={hospitalStats.openJobs}
          icon={<Briefcase size={20} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          trend={{ value: 'Hiring', positive: true }}
        />
      </div>

      {/* ═══════ Main Content Grid ═══════ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        
        {/* ── Left Column (Spans 2) ── */}
        <div className="space-y-6 xl:col-span-2">
          
          {/* Today's Bookings Overview */}
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-txt-primary">Today's Bookings Overview</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-1.5 text-sm">
                  <span className="text-txt-secondary">{selectedDepartment}</span>
                  <ChevronDown size={14} className="text-txt-muted" />
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/bookings')}>
                  View All
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border bg-slate-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Time</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Booking ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Patient Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Doctor</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Department</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalBookings.map((bk) => (
                    <tr key={bk.id} className="border-b border-surface-border last:border-b-0 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{bk.time}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-brand-600">{bk.bookingId}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-txt-primary">{bk.patient}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-primary">{bk.doctor}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{bk.department}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium',
                            bk.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' :
                            bk.status === 'Completed' ? 'bg-green-50 text-green-700' :
                            'bg-amber-50 text-amber-700'
                          )}
                        >
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Authorized File-Share Requests */}
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-txt-primary">Recent Authorized File-Share Requests</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
                Manage Shares
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border bg-slate-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Request ID</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Requested By</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Purpose</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">File Type</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitalFileShares.map((req) => (
                    <tr key={req.id} className="border-b border-surface-border last:border-b-0 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-sm font-medium text-txt-primary">{req.id}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{req.requestedBy}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{req.purpose}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{req.fileType}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                            req.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          )}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-txt-muted">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          
          {/* Doctor Availability */}
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-txt-primary">Doctor Availability</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/schedule')}>
                Schedule
              </Button>
            </div>
            <div className="divide-y divide-surface-border">
              {hospitalDoctors.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={doc.avatar} alt={doc.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-txt-primary">{doc.name}</p>
                      <p className="text-xs text-txt-secondary">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1.5 rounded-full px-2.5 py-1',
                    doc.status === 'available' ? 'bg-green-50' : 'bg-amber-50'
                  )}>
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      doc.status === 'available' ? 'bg-green-600' : 'bg-amber-600'
                    )}></span>
                    <span className={cn(
                      'text-[10px] font-medium',
                      doc.status === 'available' ? 'text-green-700' : 'text-amber-700'
                    )}>{doc.availability}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-surface-border p-4 text-center">
              <Button variant="secondary" className="w-full text-sm" onClick={() => navigate('/doctors')}>
                View All Doctors
              </Button>
            </div>
          </Card>

          {/* Hiring Summary */}
          <Card 
            padding="none" 
            className="bg-brand-50/30 cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate('/hiring')}
          >
            <div className="border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-txt-primary">Hiring Summary</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl bg-white p-4 shadow-sm border border-surface-border/50">
                  <p className="text-xs text-txt-secondary">Open Jobs</p>
                  <p className="mt-1 text-2xl font-bold text-txt-primary">{hospitalHiring.openJobs}</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border border-surface-border/50">
                  <p className="text-xs text-txt-secondary">Applications</p>
                  <p className="mt-1 text-2xl font-bold text-brand-600">{hospitalHiring.applications}</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border border-surface-border/50">
                  <p className="text-xs text-txt-secondary">Shortlisted</p>
                  <p className="mt-1 text-2xl font-bold text-amber-600">{hospitalHiring.shortlisted}</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border border-surface-border/50">
                  <p className="text-xs text-txt-secondary">Interviews</p>
                  <p className="mt-1 text-2xl font-bold text-purple-600">{hospitalHiring.interviews}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-txt-secondary">Top Open Positions</h3>
                <div className="space-y-3">
                  {hospitalHiring.topPositions.map((pos, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm border border-surface-border/50">
                      <div>
                        <p className="text-sm font-medium text-txt-primary">{pos.title}</p>
                        <p className="text-xs text-txt-muted">{pos.department}</p>
                      </div>
                      <div className="flex h-6 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-medium text-txt-secondary">
                        {pos.applicants} Applied
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
