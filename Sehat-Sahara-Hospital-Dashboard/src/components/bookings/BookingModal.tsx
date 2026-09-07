import { useState, useSyncExternalStore, useMemo } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { store } from '../../store';
import { providers, facilities } from '../../data/demo-data';
import type { Booking } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking | null; // If provided, we are rescheduling
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function formatMinutesToTime(minutes: number): string {
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}

export function BookingModal({ isOpen, onClose, booking }: BookingModalProps) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId) || facilities[0];
  
  const [patientName, setPatientName] = useState(booking?.patientName || '');
  const [patientPhone, setPatientPhone] = useState(booking?.patientPhone || '');
  const [doctorId, setDoctorId] = useState(booking?.providerId || '');
  const [branchId, setBranchId] = useState(
    state.session.facilityType === 'HOSPITAL' 
      ? (state.session.activeBranchId || activeFacility.branches[0].id) 
      : (activeFacility.branches[0].id)
  );
  
  // For simplicity we'll use an HTML date input which gives YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  const [dateStr, setDateStr] = useState(booking?.scheduledDate || today);
  const [timeSlot, setTimeSlot] = useState(booking?.time || '');
  const [type, setType] = useState(booking?.type || 'Consultation');
  
  const isReschedule = !!booking;

  // Derive day of week from dateStr (YYYY-MM-DD)
  const dayOfWeek = useMemo(() => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }, [dateStr]);

  // Compute available slots
  const availableSlots = useMemo(() => {
    if (!doctorId || !dateStr || !dayOfWeek) return [];

    // Find a schedule that matches doctor, branch, and dayOfWeek
    const schedule = state.schedules.find(sch => 
      sch.providerId === doctorId && 
      sch.facilityId === activeFacility.id &&
      (state.session.facilityType === 'CLINIC' || sch.branchId === branchId) &&
      sch.dayOfWeek === dayOfWeek &&
      sch.status === 'Confirmed'
    );

    if (!schedule) return [];

    const startMin = parseTimeToMinutes(schedule.startTime);
    let endMin = parseTimeToMinutes(schedule.endTime);
    if (endMin <= startMin) {
      endMin += 24 * 60; // Handle overnight shifts if any
    }

    const slots: string[] = [];
    let currentMin = startMin;

    while (currentMin + schedule.slotDurationMinutes <= endMin) {
      const slotTime = formatMinutesToTime(currentMin);
      
      // Check if slot is already booked
      const isBooked = state.bookings.some(b => 
        b.providerId === doctorId &&
        b.scheduledDate === dateStr &&
        b.time === slotTime &&
        b.status !== 'Cancelled' &&
        b.id !== booking?.id // Ignore current booking if rescheduling
      );

      if (!isBooked) {
        slots.push(slotTime);
      }

      currentMin += schedule.slotDurationMinutes;
    }

    return slots;
  }, [doctorId, dateStr, dayOfWeek, branchId, state.schedules, state.bookings, activeFacility.id, state.session.facilityType, booking?.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !dateStr || !timeSlot || !patientName) return;
    
    const provider = providers.find(p => p.id === doctorId);
    if (!provider) return;

    if (isReschedule) {
      store.updateBooking(booking.id, {
        providerId: provider.id,
        providerName: provider.name,
        patientName,
        patientPhone,
        date: new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        scheduledDate: dateStr,
        time: timeSlot,
        scheduledTime: timeSlot,
        type,
      });
    } else {
      store.addBooking({
        patientId: `PT-${Date.now()}`, // Demo mock ID
        patientName,
        patientPhone,
        providerId: provider.id,
        providerName: provider.name,
        facilityId: activeFacility.id,
        careType: 'IN_PERSON',
        type,
        date: new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: timeSlot,
        scheduledDate: dateStr,
        scheduledTime: timeSlot,
        status: 'Scheduled',
        fee: 2000,
        department: provider.specialty
      });
    }

    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b border-surface-border">
            <h2 className="text-lg font-semibold text-txt-primary">
              {isReschedule ? 'Reschedule Booking' : 'Add Booking'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-txt-muted hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto">
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1">Patient Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1">Phone</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1">Doctor</label>
                <select 
                  className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={doctorId}
                  onChange={e => {
                    setDoctorId(e.target.value);
                    setTimeSlot(''); // Reset slot on doctor change
                  }}
                  required
                >
                  <option value="">Select a Doctor</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - {p.specialty}</option>
                  ))}
                </select>
              </div>

              {activeFacility.type === 'HOSPITAL' && (
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1">Branch</label>
                  <select 
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={branchId}
                    onChange={e => {
                      setBranchId(e.target.value);
                      setTimeSlot(''); // Reset slot on branch change
                    }}
                    required
                  >
                    {activeFacility.branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={dateStr}
                    min={today}
                    onChange={e => {
                      setDateStr(e.target.value);
                      setTimeSlot(''); // Reset slot on date change
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1">Care Type</label>
                  <select 
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    required
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Procedure">Procedure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1">Available Slot</label>
                {availableSlots.length > 0 ? (
                  <select 
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    required
                  >
                    <option value="">Select Time</option>
                    {availableSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-center gap-2 text-amber-700 text-sm">
                    <Calendar size={16} />
                    {doctorId && dateStr ? 'No available schedule for this doctor on this day.' : 'Select a doctor and date to see available slots.'}
                  </div>
                )}
              </div>

            </form>
          </div>
          
          <div className="p-4 border-t border-surface-border bg-slate-50 flex justify-end gap-3 rounded-b-xl">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" form="booking-form" disabled={!timeSlot}>
              {isReschedule ? 'Save Changes' : 'Add Booking'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
