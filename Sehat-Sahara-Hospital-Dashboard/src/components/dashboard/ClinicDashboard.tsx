import { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingDrawer } from '../bookings/BookingDrawer';
import { BookingModal } from '../bookings/BookingModal';
import type { Booking } from '../../types';
import {
  CalendarCheck,
  Users,
  Stethoscope,
  TrendingUp,
  Clock,
  Eye,
  MoreHorizontal,
  Plus,
  CalendarDays,
  UserPlus,
  ClipboardList,
  Video,
  Home,
  User,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { Card, StatCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge, getBookingBadgeVariant } from '../ui/StatusBadge';
import { cn } from '../../lib/utils';
import { todayBookings, dashboardStats, providers, facilities } from '../../data/demo-data';
import { store } from '../../store';
import type { BookingStatus } from '../../types';

// Care type icon mapping
function CareTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'VIDEO':
      return <Video size={14} className="text-blue-500" />;
    case 'HOME_VISIT':
      return <Home size={14} className="text-amber-500" />;
    default:
      return <User size={14} className="text-txt-muted" />;
  }
}

// Format status for display
function formatStatus(status: string): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

// Format currency
function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString()}`;
}

function ConfirmCancelDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  bookingId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  bookingId: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-txt-primary">Cancel Booking</h3>
        <p className="mt-2 text-sm text-txt-secondary">
          Are you sure you want to cancel booking <span className="font-semibold text-txt-primary">{bookingId}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Keep Booking</Button>
          <Button variant="primary" className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 border-none" onClick={onConfirm}>Yes, Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export function ClinicDashboard() {
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId) || facilities[0];
  const activeBranch = activeFacility.branches.find((b) => b.id === state.session.activeBranchId);
  const [selectedFilter, setSelectedFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  // Active booking tracking for drawer sync
  const activeBooking = selectedBooking 
    ? state.bookings.find(b => b.id === selectedBooking.id) || null
    : null;

  // Filter bookings by active facility and today's date
  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const facilityBookings = state.bookings.filter(b => b.facilityId === state.session.activeFacilityId);
  
  let todayClinicBookings = facilityBookings.filter(b => b.scheduledDate === todayDateStr);
  
  // Safe fallback to recent clinic bookings if demo env doesn't have today's
  if (todayClinicBookings.length === 0 && facilityBookings.length > 0) {
    todayClinicBookings = facilityBookings.slice(0, 5); // Just show the top 5 most recent if none today
  } else if (facilityBookings.length === 0) {
    // If completely empty, fallback to todayBookings from demo-data just to not show empty initially if possible
    todayClinicBookings = todayBookings as Booking[];
  }

  // Filter bookings
  const filteredBookings =
    selectedFilter === 'ALL'
      ? todayClinicBookings
      : todayClinicBookings.filter((b) => b.status === selectedFilter);

  const handleCancelConfirm = () => {
    if (bookingToCancel) {
      store.updateBookingStatus(bookingToCancel.id, 'CANCELLED');
      setBookingToCancel(null);
    }
  };

  // Get time greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const statusFilters: { label: string; value: BookingStatus | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div className="space-y-6">
      {/* ═══════ Welcome Header ═══════ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">
            {greeting}, <span className="text-brand-700">Staff Admin</span> 👋
          </h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Here's what's happening at{' '}
            <span className="font-medium text-txt-primary">
              {activeBranch?.name || activeFacility.name}
            </span>{' '}
            today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={<CalendarDays size={16} />}
          >
            {new Date().toLocaleDateString('en-PK', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Button>
        </div>
      </div>

      {/* ═══════ KPI Stat Cards ═══════ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Today's Bookings"
          value={dashboardStats.todayBookings}
          icon={<CalendarCheck size={20} />}
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          trend={{ value: '12% from yesterday', positive: true }}
        />
        <StatCard
          label="Total Patients"
          value={dashboardStats.totalPatients.toLocaleString()}
          icon={<Users size={20} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          trend={{ value: '8% this month', positive: true }}
        />
        <StatCard
          label="Active Doctors"
          value={dashboardStats.totalDoctors}
          icon={<Stethoscope size={20} />}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <StatCard
          label="Revenue (Today)"
          value={formatCurrency(dashboardStats.revenue)}
          icon={<TrendingUp size={20} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: '5% from yesterday', positive: true }}
        />
      </div>

      {/* ═══════ Main Content Grid ═══════ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* ── Today's Bookings Table (spans 3 cols) ── */}
        <div className="xl:col-span-3">
          <Card padding="none">
            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-txt-primary">Today's Bookings</h2>
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-brand-50 px-2 text-xs font-bold text-brand-700">
                  {todayClinicBookings.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={<Filter size={14} />}>
                  Filter
                </Button>
                <Button variant="ghost" size="sm" icon={<ArrowUpDown size={14} />}>
                  Sort
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => { setSelectedBooking(null); setIsModalOpen(true); }}
                >
                  New Booking
                </Button>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 border-b border-surface-border px-5 py-2">
              {statusFilters.map((filter) => {
                const count =
                  filter.value === 'ALL'
                    ? todayClinicBookings.length
                    : todayClinicBookings.filter((b) => b.status === filter.value).length;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                      selectedFilter === filter.value
                        ? 'bg-brand-600 text-white'
                        : 'text-txt-secondary hover:bg-slate-100'
                    )}
                  >
                    {filter.label}
                    {count > 0 && (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                          selectedFilter === filter.value
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-600'
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-section/50">
                    <th className="py-3 px-5 text-left text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Patient
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Doctor
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Department
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Time
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Type
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Fee
                    </th>
                    <th className="py-3 px-4 text-right text-[11px] font-bold uppercase tracking-wider text-txt-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-surface-border last:border-b-0 hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Patient */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-txt-secondary">
                            {booking.patientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-txt-primary">
                              {booking.patientName}
                            </p>
                            <p className="text-[11px] text-txt-muted">ID: {booking.patientId}</p>
                          </div>
                        </div>
                      </td>
                      {/* Doctor */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-txt-primary">{booking.providerName}</p>
                      </td>
                      {/* Department */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-txt-secondary">{booking.department}</p>
                      </td>
                      {/* Time */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-txt-muted" />
                          <p className="text-sm text-txt-primary font-medium">
                            {booking.scheduledTime}
                          </p>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <CareTypeIcon type={booking.careType} />
                          <span className="text-sm text-txt-secondary capitalize">
                            {booking.careType.replace(/_/g, ' ').toLowerCase()}
                          </span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge variant={getBookingBadgeVariant(booking.status)} dot>
                          {formatStatus(booking.status)}
                        </StatusBadge>
                      </td>
                      {/* Fee */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-txt-primary">
                          {formatCurrency(booking.fee)}
                        </p>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedBooking(booking as Booking)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-txt-muted hover:bg-slate-100 hover:text-txt-primary transition-colors"
                            title="View Details"
                          >
                            <Eye size={15} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActionMenuId(
                                  actionMenuId === booking.id ? null : booking.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-txt-muted hover:bg-slate-100 hover:text-txt-primary transition-colors"
                              title="More Actions"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                            {actionMenuId === booking.id && (
                              <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-surface-border bg-white shadow-modal z-50">
                                <div className="py-1">
                                  <button
                                    onClick={() => { setActionMenuId(null); setSelectedBooking(booking as Booking); setIsModalOpen(true); }}
                                    className="flex w-full items-center px-3 py-2 text-sm text-txt-secondary hover:bg-slate-50"
                                  >
                                    Edit Booking
                                  </button>
                                  <button
                                    onClick={() => { setActionMenuId(null); setSelectedBooking(booking as Booking); setIsModalOpen(true); }}
                                    className="flex w-full items-center px-3 py-2 text-sm text-txt-secondary hover:bg-slate-50"
                                  >
                                    Reschedule
                                  </button>
                                  {booking.status !== 'CANCELLED' && (
                                    <button
                                      onClick={() => { setActionMenuId(null); setBookingToCancel(booking as Booking); }}
                                      className="flex w-full items-center px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                    >
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredBookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <CalendarCheck size={40} className="text-txt-disabled" />
                  <p className="mt-3 text-sm font-medium text-txt-secondary">
                    No bookings found
                  </p>
                  <p className="text-xs text-txt-muted">
                    Try a different filter or create a new booking
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ── Right Side Panel ── */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <h3 className="text-sm font-semibold text-txt-primary mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                className="flex flex-col items-center gap-2 rounded-xl border border-surface-border p-3.5 text-center hover:bg-brand-50 hover:border-brand-200 transition-all group"
                onClick={() => { setSelectedBooking(null); setIsModalOpen(true); }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-medium text-txt-secondary group-hover:text-brand-700">
                  New Booking
                </span>
              </button>
              <button 
                className="flex flex-col items-center gap-2 rounded-xl border border-surface-border p-3.5 text-center hover:bg-blue-50 hover:border-blue-200 transition-all group"
                onClick={() => navigate('/patients')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <UserPlus size={18} />
                </div>
                <span className="text-xs font-medium text-txt-secondary group-hover:text-blue-700">
                  Add Patient
                </span>
              </button>
              <button 
                className="flex flex-col items-center gap-2 rounded-xl border border-surface-border p-3.5 text-center hover:bg-violet-50 hover:border-violet-200 transition-all group"
                onClick={() => navigate('/queue')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
                  <ClipboardList size={18} />
                </div>
                <span className="text-xs font-medium text-txt-secondary group-hover:text-violet-700">
                  Queue Token
                </span>
              </button>
              <button 
                className="flex flex-col items-center gap-2 rounded-xl border border-surface-border p-3.5 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                onClick={() => navigate('/schedule')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                  <CalendarDays size={18} />
                </div>
                <span className="text-xs font-medium text-txt-secondary group-hover:text-emerald-700">
                  Schedule
                </span>
              </button>
            </div>
          </Card>

          {/* Today's Doctors */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-txt-primary">Today's Doctors</h3>
              <button className="text-xs font-medium text-brand-600 hover:text-brand-700" onClick={() => navigate('/doctors')}>
                View All
              </button>
            </div>
            <div className="space-y-3">
              {providers.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-xs font-bold">
                    {doc.name
                      .replace('Dr. ', '')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-txt-primary truncate">{doc.name}</p>
                    <p className="text-[11px] text-txt-muted">{doc.specialty}</p>
                  </div>
                  <StatusBadge
                    variant={doc.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}
                  >
                    {doc.verificationStatus === 'VERIFIED' ? 'On Duty' : 'Pending'}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </Card>

          {/* Clinic Hours */}
          <Card>
            <h3 className="text-sm font-semibold text-txt-primary mb-3">Clinic Hours</h3>
            <div className="flex items-center gap-2.5 text-sm">
              <Clock size={16} className="text-brand-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-txt-primary">
                  {activeBranch?.hours || 'Mon–Sat 9:00 AM – 9:00 PM'}
                </p>
                <p className="text-xs text-txt-muted mt-0.5">
                  {activeBranch?.departments.length || 0} departments active
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BookingDrawer
        booking={activeBooking}
        onClose={() => setSelectedBooking(null)}
        onReschedule={() => { setIsModalOpen(true); }}
      />

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedBooking(null); }}
        booking={isModalOpen && selectedBooking ? activeBooking : null}
      />

      <ConfirmCancelDialog
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleCancelConfirm}
        bookingId={bookingToCancel?.id || ''}
      />
    </div>
  );
}
