import { X, User, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import type { Booking } from '../../types';
import { store } from '../../store';
import { useSyncExternalStore } from 'react';

interface BookingDrawerProps {
  booking: Booking | null;
  onClose: () => void;
  onReschedule?: () => void;
}

export function BookingDrawer({ booking, onClose, onReschedule }: BookingDrawerProps) {
  useSyncExternalStore(store.subscribe, store.getSnapshot);
  
  if (!booking) return null;

  const handleCheckIn = () => {
    store.checkInBooking(booking.id);
    onClose();
  };

  const handleCancel = () => {
    store.updateBookingStatus(booking.id, 'Cancelled');
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-surface-border flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border p-4 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-semibold text-txt-primary">Booking Details</h2>
            <p className="text-sm font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded inline-block mt-1">
              {booking.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-txt-muted hover:bg-slate-200 hover:text-txt-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Patient Information */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-brand-600" />
              <h3 className="font-semibold text-txt-primary">Patient Information</h3>
            </div>
            <div className="ml-6 space-y-3">
              <div>
                <p className="text-base font-semibold text-txt-primary">{booking.patientName}</p>
                <p className="text-sm text-txt-secondary">34 Years / Male</p>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-1 text-sm">
                <span className="text-txt-muted">Phone</span>
                <span className="text-txt-primary font-medium">{booking.patientPhone || '0301-1234567'}</span>
                
                <span className="text-txt-muted mt-2">Address</span>
                <span className="text-txt-primary font-medium mt-2">123, Johar Town, Lahore</span>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-surface-border" />

          {/* Booking Information */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-brand-600" />
              <h3 className="font-semibold text-txt-primary">Booking Information</h3>
            </div>
            <div className="ml-6 space-y-3">
              <div className="grid grid-cols-[100px_1fr] gap-3 text-sm items-center">
                <span className="text-txt-muted">Doctor</span>
                <div className="text-txt-primary font-medium leading-snug">
                  {booking.providerName}
                  <br />
                  <span className="text-xs text-txt-secondary font-normal">{booking.department}</span>
                </div>
                
                <span className="text-txt-muted">Type</span>
                <span className="text-txt-primary font-medium">{booking.type || 'Consultation'}</span>
                
                <span className="text-txt-muted">Date</span>
                <span className="text-txt-primary font-medium">{booking.date || booking.scheduledDate}</span>
                
                <span className="text-txt-muted">Time</span>
                <span className="text-txt-primary font-medium">{booking.time || booking.scheduledTime}</span>
                
                <span className="text-txt-muted">Check-in</span>
                <span className="text-txt-primary font-medium">{booking.checkInTime || '—'}</span>
                
                <span className="text-txt-muted mt-1">Status</span>
                <div className="mt-1">
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </div>
          </section>

          {/* Visit Outcome (Conditional based on demo notes) */}
          {booking.notes && (
            <>
              <div className="h-px w-full bg-surface-border" />
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={18} className="text-brand-600" />
                  <h3 className="font-semibold text-txt-primary">Visit Outcome</h3>
                </div>
                <div className="ml-6 space-y-3 text-sm">
                  <div className="grid grid-cols-[100px_1fr] gap-3">
                    <span className="text-txt-muted">Diagnosis</span>
                    <span className="text-txt-primary font-medium">Acute Gastritis</span>
                    
                    <span className="text-txt-muted">Notes</span>
                    <span className="text-txt-primary leading-relaxed">{booking.notes}</span>
                    
                    <span className="text-txt-muted">Prescription</span>
                    <span className="text-txt-primary font-medium">Issued</span>
                    
                    <span className="text-txt-muted">Next Visit</span>
                    <span className="text-txt-primary font-medium">31 May 2025, 09:30 AM</span>
                  </div>
                </div>
              </section>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="border-t border-surface-border bg-slate-50/50 p-4">
          <div className="flex flex-col gap-3">
            {booking.status === 'Scheduled' && (
              <Button 
                variant="primary" 
                className="w-full justify-center text-base py-3 h-auto"
                icon={<CheckCircle2 size={20} />}
                onClick={handleCheckIn}
              >
                Check In
              </Button>
            )}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 justify-center"
                onClick={() => {
                  if (onReschedule) onReschedule();
                }}
              >
                Reschedule
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={handleCancel}
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
