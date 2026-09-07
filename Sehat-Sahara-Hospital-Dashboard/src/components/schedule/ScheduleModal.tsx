import { useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { store } from '../../store';
import { providers, facilities } from '../../data/demo-data';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId) || facilities[0];
  
  const [doctorId, setDoctorId] = useState('');
  const [branchId, setBranchId] = useState(state.session.activeBranchId || '');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(15);
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !dayOfWeek || !startTime || !endTime) return;
    
    const provider = providers.find(p => p.id === doctorId);
    if (!provider) return;

    store.addSchedule({
      providerId: provider.id,
      providerName: provider.name,
      specialty: provider.specialty,
      facilityId: activeFacility.id,
      branchId: branchId,
      dayOfWeek: dayOfWeek,
      startTime: startTime,
      endTime: endTime,
      slotDurationMinutes: slotDurationMinutes,
      status: 'Confirmed'
    });

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
            <h2 className="text-lg font-semibold text-txt-primary">Add Schedule</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-txt-muted hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto">
            <form id="schedule-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1">Doctor</label>
                <select 
                  className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={doctorId}
                  onChange={e => setDoctorId(e.target.value)}
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
                    onChange={e => setBranchId(e.target.value)}
                    required
                  >
                    {activeFacility.branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1">Day of Week</label>
                <select 
                  className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(e.target.value)}
                  required
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1">Start Time</label>
                  <select 
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                  >
                    {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-txt-secondary mb-1">End Time</label>
                  <select 
                    className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                  >
                    {['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-txt-secondary mb-1">Slot Duration</label>
                <select 
                  className="w-full rounded-lg border border-surface-border p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={slotDurationMinutes}
                  onChange={e => setSlotDurationMinutes(Number(e.target.value))}
                  required
                >
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

            </form>
          </div>
          
          <div className="p-4 border-t border-surface-border bg-slate-50 flex justify-end gap-3 rounded-b-xl">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" form="schedule-form">Save Schedule</Button>
          </div>
        </div>
      </div>
    </>
  );
}
