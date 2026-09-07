import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { CheckCircle, Calendar, Home } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { CareType, PaymentPolicy } from '../../../models';

interface BookingConfirmationState {
  bookingId?: string;
  doctorId?: string;
  providerId?: string;
  providerName?: string;
  visitType?: string;
  careType?: CareType;
  date?: string;
  time?: string;
  recipient?: string;
  fee?: number;
  triageSymptom?: string;
  triagePriority?: string;
  paymentPolicy?: PaymentPolicy;
}

export const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as BookingConfirmationState) || {};

  // Resolve the actual booking ID — may have been passed directly or derived
  const bookingId = state.bookingId || `BKG-${Math.floor(100000 + Math.random() * 900000)}`;

  // Resolve provider name from store if not passed
  const storeSnapshot = PrototypeStore.getSnapshot();
  const resolvedProvider = state.providerId
    ? storeSnapshot.providers.find(p => p.id === state.providerId)
    : null;
  const providerName = state.providerName || resolvedProvider?.name || 'Your Healthcare Provider';
  const providerSpecialty = resolvedProvider?.specialty || '';

  const hasCreated = React.useRef(false);

  React.useEffect(() => {
    if (state.providerId || state.doctorId) {
      sessionStorage.setItem('last_confirmed_booking_id', bookingId);
    }
    // Prevent double-create on Strict Mode double-mount
    if (hasCreated.current) return;
    const sessionKey = `bkgcreated_${bookingId}`;
    if (sessionStorage.getItem(sessionKey)) return;

    hasCreated.current = true;
    sessionStorage.setItem(sessionKey, 'true');

    const providerId = state.providerId || state.doctorId || 'PROV-1';
    const careTypeMap: Record<string, CareType> = {
      clinic: 'in_clinic_doctor',
      video: 'online_consultation',
      home: 'direct_home_visit',
    };
    const resolvedCareType: CareType = state.careType || careTypeMap[state.visitType || 'clinic'] || 'in_clinic_doctor';
    const paymentPolicyMap: Record<string, PaymentPolicy> = {
      clinic: 'pay_at_clinic',
      video: 'online_full',
      home: 'cash_after_home_visit',
    };
    const resolvedPaymentPolicy: PaymentPolicy = state.paymentPolicy || paymentPolicyMap[state.visitType || 'clinic'] || 'pay_at_clinic';

    const snap = PrototypeStore.getSnapshot();
    // Only add if not already present (idempotent)
    if (!snap.bookings.find(b => b.id === bookingId)) {
      const fee = state.fee ?? resolvedProvider?.fees?.[resolvedCareType] ?? 1500;
      PrototypeStore.addBooking({
        id: bookingId,
        patientId: 'USR-PATIENT-DEMO',
        providerId,
        careType: resolvedCareType,
        scheduledDate: state.date || new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
        scheduledTime: state.time || '10:00 AM',
        status: 'confirmed',
        fee,
        paymentPolicy: resolvedPaymentPolicy,
        reason: state.triageSymptom || 'General consultation',
        meetLink: 'https://meet.google.com/amh-eidp-oei',
      });

      PrototypeStore.addNotification({
        id: `NOTIF-BKG-${bookingId}`,
        userId: 'USR-PATIENT-DEMO',
        type: 'GENERAL',
        title: 'Appointment Confirmed',
        body: `Your appointment with ${providerName} has been confirmed.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        deepLink: PATIENT_ROUTES.APPOINTMENT_DETAIL.replace(':id', bookingId),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safe fallback if refreshed without navigation state:
  const latestBooking = storeSnapshot.bookings.find(b => b.id === bookingId) || storeSnapshot.bookings[0];
  const displayDate = state.date || latestBooking?.scheduledDate || 'Today';
  const displayTime = state.time || latestBooking?.scheduledTime || '10:00 AM';
  const displayFee = state.fee ?? latestBooking?.fee ?? 1500;
  const displayRecipient = state.recipient || 'Just Myself';

  const visitLabel =
    state.visitType === 'video' ? 'Video Consultation' :
    state.visitType === 'home' ? 'Home Visit' : 'In-Clinic';

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <div className="app-scroll flex-1 px-5 py-10 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-brand-50 border-4 border-brand-100 flex items-center justify-center mb-6 shadow-lg shadow-brand-100">
            <CheckCircle className="w-12 h-12 text-brand-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Booking Confirmed!</h1>
          <p className="text-[15px] text-slate-500 mb-8 text-center leading-relaxed">
            Your appointment with <strong className="text-slate-900">{providerName}</strong>
            {providerSpecialty ? ` (${providerSpecialty})` : ''} has been booked successfully.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 w-full shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Booking ID</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{bookingId}</span>
            </div>
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Date & Time</span>
              <span className="text-sm font-bold text-slate-900">
                {displayDate} · {displayTime}
              </span>
            </div>
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Type</span>
              <span className="text-sm font-bold text-slate-900">{visitLabel}</span>
            </div>
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">For</span>
              <span className="text-sm font-bold text-slate-900">{displayRecipient}</span>
            </div>
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Consultation Fee</span>
              <span className="text-sm font-bold text-brand-700">Rs. {displayFee}</span>
            </div>
            <div className="px-5 py-4 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">Status</span>
              <span className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">Confirmed ✓</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-3 shrink-0">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate(PATIENT_ROUTES.APPOINTMENT_DETAIL.replace(':id', bookingId), {
              replace: true,
              state: { triageSymptom: state.triageSymptom, triagePriority: state.triagePriority }
            })}
            icon={<Calendar className="w-5 h-5" />}
          >
            View Appointment
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => navigate(PATIENT_ROUTES.HOME, { replace: true })}
            icon={<Home className="w-5 h-5" />}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
