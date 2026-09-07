import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, CreditCard, Building2, CheckCircle2 } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { useAppBack } from '../../../utils/navigation';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const goBack = useAppBack();
  const bookingState = location.state as any;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'jazzcash' | 'clinic' | null>(
    bookingState?.visitType === 'clinic' ? 'clinic' : null
  );

  if (!bookingState) {
    return <MobileAppShell><div className="p-6">Invalid session</div></MobileAppShell>;
  }

  const { doctorId, visitType, recipient, date, time } = bookingState;
  const doctor = PrototypeStore.getSnapshot().providers.find(p => p.id === doctorId);

  const getFees = () => {
    if (!doctor) return 0;
    const baseFee = doctor.fees?.['in_clinic_doctor'] || 1500;
    if (visitType === 'clinic') return baseFee;
    if (visitType === 'video') return baseFee - 500;
    if (visitType === 'home') return baseFee + 1000;
    return baseFee;
  };

  const fee = getFees();
  const serviceFee = 150;
  const total = fee + serviceFee;

  const handlePay = () => {
    // In prototype, we consider it successful
    // Then navigate to booking confirmation
    navigate(PATIENT_ROUTES.BOOKING_CONFIRM, {
      state: { ...bookingState, paymentStatus: paymentMethod === 'clinic' ? 'pay_at_facility' : 'paid' },
      replace: true
    });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <header className="px-4 py-4 bg-white flex items-center border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => goBack()} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 shrink-0">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">Checkout</h1>
          </div>
        </header>

        <div className="app-scroll flex-1 px-5 py-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
            <h2 className="text-[15px] font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Booking Summary</h2>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[14px] text-slate-500">Provider</span>
              <span className="text-[14px] font-bold text-slate-900">{doctor?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[14px] text-slate-500">Visit Type</span>
              <span className="text-[14px] font-bold text-slate-900 capitalize">{visitType}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[14px] text-slate-500">Date & Time</span>
              <span className="text-[14px] font-bold text-slate-900">{date} at {time}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <span className="text-[14px] text-slate-500">Patient</span>
              <span className="text-[14px] font-bold text-slate-900">{recipient}</span>
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-[14px] text-slate-600">Consultation Fee</span>
              <span className="text-[14px] text-slate-900">PKR {fee}</span>
            </div>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <span className="text-[14px] text-slate-600">Service Fee</span>
              <span className="text-[14px] text-slate-900">PKR {serviceFee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-bold text-slate-900">Total</span>
              <span className="text-[18px] font-black text-[#1B7F4C]">PKR {total}</span>
            </div>
          </div>

          <h2 className="text-[15px] font-bold text-slate-900 mb-4 uppercase tracking-wide">Payment Method</h2>
          <div className="flex flex-col gap-3">
            
            {visitType === 'clinic' && (
              <button
                onClick={() => setPaymentMethod('clinic')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  paymentMethod === 'clinic' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'clinic' ? 'bg-[#1B7F4C] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[15px] font-bold text-slate-900">Pay at Clinic</h3>
                    <p className="text-[12px] text-slate-500">Pay directly when you arrive</p>
                  </div>
                </div>
                {paymentMethod === 'clinic' && <CheckCircle2 className="w-5 h-5 text-[#1B7F4C]" />}
              </button>
            )}

            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                paymentMethod === 'card' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-[#1B7F4C] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-[15px] font-bold text-slate-900">Debit / Credit Card</h3>
                  <p className="text-[12px] text-slate-500">Instant secure payment</p>
                </div>
              </div>
              {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-[#1B7F4C]" />}
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl text-[12px] text-blue-800 leading-relaxed">
            <span className="font-bold">Refund Policy:</span> Full refund if cancelled 24 hours before the appointment. 50% refund for late cancellations.
          </div>
        </div>

        <div className="px-4 py-4 bg-white border-t border-slate-200 shrink-0 pb-safe z-50">
          <Button onClick={handlePay} disabled={!paymentMethod} fullWidth>
            {paymentMethod === 'clinic' ? 'Confirm Booking' : `Pay PKR ${total}`}
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
