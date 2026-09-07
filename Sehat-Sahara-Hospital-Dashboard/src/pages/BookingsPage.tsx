import { useState, useSyncExternalStore } from 'react';
import { Plus, MoreHorizontal, Calendar, List, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { store } from '../store';
import { BookingDrawer } from '../components/bookings/BookingDrawer';
import { BookingModal } from '../components/bookings/BookingModal';
import type { Booking } from '../types';

export function BookingsPage() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Re-fetch booking from store to ensure we have latest status if updated
  const activeBooking = selectedBooking 
    ? state.bookings.find(b => b.id === selectedBooking.id) || null
    : null;

  const filteredBookings = state.bookings.filter(b => {
    // 1. Check facility
    const facilityMatch = b.facilityId === state.session.activeFacilityId;
    if (!facilityMatch) return false;

    // 2. Search Query (ID, Patient Name, Phone)
    const query = searchQuery.toLowerCase();
    const searchMatch = !query || 
      b.id.toLowerCase().includes(query) || 
      b.patientName.toLowerCase().includes(query) || 
      (b.patientPhone && b.patientPhone.includes(query));
    if (!searchMatch) return false;

    // 3. Filter Date
    const dateMatch = !filterDate || b.scheduledDate === filterDate;
    if (!dateMatch) return false;

    // 4. Filter Doctor
    const docMatch = !filterDoctor || b.providerId === filterDoctor;
    if (!docMatch) return false;

    // 5. Filter Status
    const statusMatch = !filterStatus || b.status === filterStatus;
    if (!statusMatch) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* ═══════ Page Header ═══════ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Bookings</h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Manage appointments and patient bookings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white z-10">
              5
            </span>
            <Button variant="outline" className="p-2.5">
              <span className="sr-only">Notifications</span>
              <svg className="h-5 w-5 text-txt-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════ Filters ═══════ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-surface-border bg-white p-1">
            <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-txt-secondary hover:text-txt-primary transition-colors">
              <Calendar size={16} />
              <span>Calendar</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
              <List size={16} />
              <span>List</span>
            </button>
          </div>

          <div className="relative flex items-center bg-white border border-surface-border rounded-xl px-3 py-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
            <Search size={16} className="text-txt-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="text-sm border-none outline-none bg-transparent w-32 md:w-40 text-txt-primary placeholder:text-txt-muted"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-1.5 text-sm text-txt-secondary focus-within:border-brand-500">
            <input 
              type="date" 
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="border-none outline-none bg-transparent text-txt-primary cursor-pointer w-[120px]"
            />
          </div>

          <select 
            value={filterDoctor} 
            onChange={e => setFilterDoctor(e.target.value)}
            className="cursor-pointer rounded-xl border border-surface-border bg-white px-3 py-2 text-sm text-txt-secondary outline-none focus:border-brand-500 w-[140px]"
          >
            <option value="">All Doctors</option>
            {Array.from(new Set(state.bookings.map(b => JSON.stringify({id: b.providerId, name: b.providerName})))).map(s => {
              const doc = JSON.parse(s);
              return <option key={doc.id} value={doc.id}>{doc.name}</option>;
            })}
          </select>

          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="cursor-pointer rounded-xl border border-surface-border bg-white px-3 py-2 text-sm text-txt-secondary outline-none focus:border-brand-500"
          >
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Checked In">Checked In</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No Show">No Show</option>
          </select>
        </div>
        
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setSelectedBooking(null); setIsModalOpen(true); }}>
          Add Booking
        </Button>
      </div>

      {/* ═══════ Bookings Table ═══════ */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Check-in</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-txt-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="cursor-pointer border-b border-surface-border last:border-b-0 hover:bg-slate-50/80 transition-colors"
                >
                  {/* Booking ID */}
                  <td className="px-6 py-4 text-sm font-medium text-txt-primary">
                    {booking.id}
                  </td>
                  
                  {/* Patient Info */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-txt-primary">{booking.patientName}</p>
                    <p className="text-xs text-txt-muted">{booking.patientPhone || '0301-1234567'}</p>
                  </td>
                  
                  {/* Doctor Info */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-txt-primary">{booking.providerName}</p>
                    <p className="text-xs text-txt-muted">{booking.department}</p>
                  </td>
                  
                  {/* Type */}
                  <td className="px-6 py-4 text-sm text-txt-secondary">
                    {booking.type || 'Consultation'}
                  </td>
                  
                  {/* Time */}
                  <td className="px-6 py-4 text-sm font-medium text-txt-primary">
                    {booking.time || booking.scheduledTime}
                  </td>

                  {/* Check-in Time */}
                  <td className="px-6 py-4 text-sm text-txt-secondary">
                    {booking.checkInTime || '—'}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="rounded-lg p-1.5 text-txt-muted hover:bg-slate-100 hover:text-txt-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Optional popover
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-txt-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-slate-300 mb-3" />
                      <p className="text-base font-medium text-txt-primary">No bookings found</p>
                      <p className="text-sm mt-1">We couldn't find any bookings matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="border-t border-surface-border p-4 flex items-center justify-between">
          <p className="text-sm text-txt-muted">Showing 1 to 8 of 48 bookings</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="px-2 py-1 text-txt-muted">{'<'}</Button>
            <Button variant="primary" className="px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="px-3 py-1">3</Button>
            <span className="text-txt-muted">...</span>
            <Button variant="outline" className="px-3 py-1">6</Button>
            <Button variant="outline" className="px-2 py-1 text-txt-muted">{'>'}</Button>
          </div>
        </div>
      </Card>

      {/* ═══════ Drawer Overlay ═══════ */}
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
    </div>
  );
}
