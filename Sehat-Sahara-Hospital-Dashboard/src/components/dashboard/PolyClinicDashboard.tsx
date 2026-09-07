import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Stethoscope,
  UserCheck,
  Users,
  ChevronDown,
  Briefcase,
} from 'lucide-react';
import { Card, StatCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import {
  polyClinicStats,
  polyClinicAppointments,
  polyClinicDoctors,
  polyClinicJobs,
} from '../../data/demo-data';

export function PolyClinicDashboard() {
  const navigate = useNavigate();
  const [selectedSpecialty] = useState('All Specialties');

  return (
    <div className="space-y-6">
      {/* ═══════ Header ═══════ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">
            Welcome back, <span className="text-brand-700">Admin</span>
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Here's what's happening at <span className="font-medium text-txt-primary">Sehat Poly Clinic</span> today.
          </p>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today Appointments"
          value={polyClinicStats.todayAppointments}
          icon={<CalendarDays size={20} />}
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          trend={{ value: 'Total scheduled', positive: true }}
        />
        <StatCard
          label="Doctors On Duty"
          value={polyClinicStats.doctorsOnDuty}
          icon={<Stethoscope size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          trend={{ value: 'Available today', positive: true }}
        />
        <StatCard
          label="Checked In"
          value={polyClinicStats.checkedIn}
          icon={<UserCheck size={20} />}
          iconBg="bg-teal-50"
          iconColor="text-teal-600"
          trend={{ value: 'Patients', positive: true }}
        />
        <StatCard
          label="Waiting"
          value={polyClinicStats.waiting}
          icon={<Users size={20} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: 'Patients', positive: true }}
        />
      </div>

      {/* ═══════ Main Content Grid ═══════ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ── Today's Appointments & Check-ins (spans 2 cols) ── */}
        <div className="xl:col-span-2">
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-txt-primary">Today's Appointments & Check-ins</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-1.5 text-sm">
                  <span className="text-txt-secondary">{selectedSpecialty}</span>
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
                  <tr className="border-b border-surface-border">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Time</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Patient</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Age / Gender</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Doctor</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Specialty</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-txt-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {polyClinicAppointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-surface-border last:border-b-0 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{apt.time}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-txt-primary">{apt.patient}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{apt.ageGender}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-primary">{apt.doctor}</td>
                      <td className="px-5 py-3.5 text-sm text-txt-secondary">{apt.specialty}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                            apt.status === 'Checked In'
                              ? 'bg-brand-50 text-brand-700'
                              : 'bg-amber-50 text-amber-700'
                          )}
                        >
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="border-t border-surface-border p-4 text-center">
              <Button variant="secondary" className="w-full max-w-sm justify-center" onClick={() => navigate('/schedule')}>
                View Full Schedule
              </Button>
            </div>
          </Card>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-6">
          {/* Doctors On Duty Today */}
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-txt-primary">Doctors On Duty Today</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/doctors')}>
                View All
              </Button>
            </div>
            <div className="divide-y divide-surface-border">
              {polyClinicDoctors.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={doc.avatar} alt={doc.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-txt-primary">{doc.name}</p>
                      <p className="text-xs text-txt-secondary">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span>
                    <span className="text-[10px] font-medium text-brand-700">{doc.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hiring & Vacancies */}
          <Card padding="none">
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <h2 className="text-base font-semibold text-txt-primary">Hiring & Vacancies</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/hiring')}>
                View All
              </Button>
            </div>
            <div className="flex items-center gap-6 p-5">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Briefcase size={24} />
                </div>
                <p className="mt-2 text-2xl font-bold text-txt-primary">{polyClinicJobs.openPositions}</p>
                <p className="text-xs text-txt-secondary">Open<br/>Positions</p>
              </div>
              <ul className="flex-1 space-y-2 text-sm text-txt-secondary">
                {polyClinicJobs.list.map((job, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-txt-muted"></span>
                    {job}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 pt-0">
              <Button variant="primary" className="w-full justify-center bg-green-500 hover:bg-green-600 text-white" onClick={() => navigate('/hiring')}>
                Manage Hiring
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
