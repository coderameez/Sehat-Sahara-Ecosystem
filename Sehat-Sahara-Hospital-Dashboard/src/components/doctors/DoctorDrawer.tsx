import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, Mail, Phone, MapPin, CalendarDays, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { store } from '../../store';
import type { Provider } from '../../types';

function ConfirmUnlinkDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  doctorName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  doctorName: string;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-txt-primary">Unlink Doctor</h3>
        <p className="mt-2 text-sm text-txt-secondary">
          Are you sure you want to unlink <span className="font-semibold text-txt-primary">{doctorName}</span>? This will mark them as inactive.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700 border-none" onClick={onConfirm}>Unlink</Button>
        </div>
      </div>
    </div>
  );
}

interface DoctorDrawerProps {
  doctor: Provider | null;
  onClose: () => void;
}

export function DoctorDrawer({ doctor, onClose }: DoctorDrawerProps) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!doctor) return null;

  const handleUnlink = () => {
    store.updateProviderStatus(doctor.id, 'Inactive');
    setIsConfirmOpen(false);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-surface-border flex flex-col">
        
        {/* Header (Avatar & Basics) */}
        <div className="relative border-b border-surface-border bg-slate-50/50 p-6 pt-12">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-txt-muted hover:bg-slate-100 hover:text-txt-primary transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            {doctor.avatar ? (
              <img src={doctor.avatar} alt={doctor.name} className="h-20 w-20 rounded-full object-cover shadow-sm border-2 border-white" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                {doctor.name.charAt(0)}
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold text-txt-primary">{doctor.name}</h2>
            <p className="text-sm font-medium text-txt-secondary">{doctor.specialty}</p>
            <p className="mt-1 text-xs text-txt-muted">{doctor.qualification} • PMDC: {doctor.pmdcId || 'N/A'}</p>
            
            {doctor.verificationStatus === 'VERIFIED' && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                <CheckCircle2 size={14} />
                Verified with PMDC
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Profile Details */}
          <section>
            <h3 className="text-sm font-semibold text-txt-primary mb-4">Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-txt-muted" />
                <span className="text-txt-secondary">{doctor.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-txt-muted" />
                <span className="text-txt-secondary">{doctor.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-txt-muted" />
                <span className="text-txt-secondary">{doctor.address || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays size={16} className="text-txt-muted" />
                <span className="text-txt-secondary">Linked On: {doctor.linkedOn || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Assigned Schedule */}
          <section>
            <h3 className="text-sm font-semibold text-txt-primary mb-4">Assigned Schedule</h3>
            <div className="rounded-xl border border-surface-border bg-slate-50/50 p-4">
              <ul className="space-y-2 text-sm">
                {doctor.schedule?.fullSchedule ? (
                  doctor.schedule.fullSchedule.map((slot, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="font-medium text-txt-secondary">{slot.day}</span>
                      <span className={slot.time === 'Off' ? 'text-txt-muted' : 'text-txt-primary'}>{slot.time}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-txt-muted">No detailed schedule provided.</li>
                )}
              </ul>
            </div>
          </section>

          {/* Today Overview */}
          <section>
            <h3 className="text-sm font-semibold text-txt-primary mb-4">Today Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-surface-border p-4">
                <div className="flex items-center gap-2 text-brand-600 mb-1">
                  <CalendarDays size={16} />
                  <span className="text-xs font-medium">Today Bookings</span>
                </div>
                <p className="text-xl font-bold text-txt-primary">{doctor.todayBookings ?? 0}</p>
              </div>
              <div className="rounded-xl border border-surface-border p-4">
                <div className="flex items-center gap-2 text-amber-600 mb-1">
                  <Clock size={16} />
                  <span className="text-xs font-medium">Next Slot</span>
                </div>
                <p className="text-xl font-bold text-txt-primary">{doctor.nextSlot || 'N/A'}</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-surface-border bg-slate-50/50 p-4 flex items-center justify-end gap-3">
          <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setIsConfirmOpen(true)}>
            Unlink Doctor
          </Button>
          <Button variant="primary" onClick={() => navigate('/schedule')}>
            Update Schedule
          </Button>
        </div>
      </div>

      <ConfirmUnlinkDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleUnlink}
        doctorName={doctor.name}
      />
    </>
  );
}
