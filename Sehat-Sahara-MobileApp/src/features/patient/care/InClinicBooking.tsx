import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Provider, Booking, QueueToken } from '../../../models';
import { CounterpartEngine } from '../../../services/prototype/CounterpartEngine';
import { ChevronLeft, CheckCircle, User, Paperclip, FolderInput, UploadCloud, Calendar as CalendarIcon, Ticket, Users, Clock } from 'lucide-react';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { useAppBack } from '../../../utils/navigation';

type BookingStep = 'mode' | 'recipient' | 'date' | 'time' | 'reason' | 'records' | 'review' | 'confirmed';

export const InClinicBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goBack = useAppBack();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [step, setStep] = useState<BookingStep>('mode');
  const [selectedMode, setSelectedMode] = useState<'fixed_time' | 'queue_token'>('fixed_time');
  
  const [recipient, setRecipient] = useState<string>('Just Myself');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [issuedToken, setIssuedToken] = useState<QueueToken | null>(null);

  const stateSnapshot = OnboardingStore.getSnapshot();
  const careProfiles = stateSnapshot.careProfiles;
  const preferences = stateSnapshot.preferences || { currency: 'PKR' };
  const currency = preferences.currency || 'PKR';

  useEffect(() => {
    let p = PrototypeStore.getSnapshot().providers.find(x => x.id === id);
    if (!p) {
      p = PrototypeStore.getSnapshot().providers.find(x => x.id === 'd1' || x.id === 'PROV-1');
    }
    if (p) {
      setProvider(p);
      const modes = p.bookingModes || ['fixed_time'];
      if (modes.length === 1) {
        setSelectedMode(modes[0]);
        setStep('recipient');
      } else {
        setStep('mode');
      }
    }
  }, [id]);

  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return `${dayName}, ${dayNum}`;
  });

  const times = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  if (!provider) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-[#F8FAFC]">
          <header className="px-4 py-4 pt-safe bg-white flex items-center border-b border-slate-200 shrink-0">
            <button onClick={() => navigate('/patient/care', { replace: true })} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 ml-1">Provider Unavailable</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Provider information is unavailable</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xs">
              The selected doctor or healthcare service could not be loaded. Please choose another verified provider.
            </p>
            <div className="w-full max-w-xs space-y-3">
              <Button onClick={() => navigate('/patient/care', { replace: true })} fullWidth>
                Back to Find Care
              </Button>
              <Button onClick={() => navigate('/patient', { replace: true })} variant="outline" fullWidth>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const handleNext = () => {
    if (step === 'mode') setStep('recipient');
    else if (step === 'recipient') setStep(selectedMode === 'queue_token' ? 'reason' : 'date');
    else if (step === 'date') setStep('time');
    else if (step === 'time') setStep('reason');
    else if (step === 'reason') setStep('records');
    else if (step === 'records') setStep('review');
    else if (step === 'review') handleConfirm();
  };

  const handleBack = () => {
    if (step === 'review') setStep('records');
    else if (step === 'records') setStep('reason');
    else if (step === 'reason') setStep(selectedMode === 'queue_token' ? 'recipient' : 'time');
    else if (step === 'time') setStep('date');
    else if (step === 'date') setStep('recipient');
    else if (step === 'recipient') {
      const modes = provider?.bookingModes || ['fixed_time'];
      if (modes.length > 1) setStep('mode');
      else goBack();
    }
    else if (step === 'mode') goBack();
  };

  const handleConfirm = () => {
    if (selectedMode === 'queue_token') {
      const newToken: QueueToken = {
        id: `TOK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        patientId: 'USR-PATIENT-DEMO',
        providerId: provider.id,
        tokenNumber: Math.floor(Math.random() * 20) + 45,
        estimatedWaitMinutes: Math.floor(Math.random() * 45) + 15,
        status: 'IN_QUEUE',
        issuedAt: new Date().toISOString()
      };
      
      PrototypeStore.updateState({
        queueTokens: [newToken, ...PrototypeStore.getSnapshot().queueTokens]
      });
      
      CounterpartEngine.scheduleQueueAdvance(newToken.id);
      
      setIssuedToken(newToken);
      setStep('confirmed');
    } else {
      const newBooking: Booking = {
        id: `BKG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        patientId: 'USR-PATIENT-DEMO',
        providerId: provider.id,
        careType: 'in_clinic_doctor',
        status: 'confirmed',
        scheduledDate: selectedDate || dates[0],
        scheduledTime: selectedTime || times[0],
        fee: provider.fees.in_clinic_doctor || 0,
        paymentPolicy: 'pay_at_clinic',
      };
      
      PrototypeStore.updateState({
        bookings: [newBooking, ...PrototypeStore.getSnapshot().bookings]
      });
      
      CounterpartEngine.scheduleBookingConfirmation(newBooking.id);
      
      setStep('confirmed');
    }
  };

  if (step === 'confirmed') {
    if (selectedMode === 'queue_token' && issuedToken) {
      return (
        <MobileAppShell>
          <div className="flex flex-col h-full bg-[#F8FAFC] p-6 items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="flex items-center gap-2 text-emerald-500 mb-6">
                <CheckCircle className="w-6 h-6" />
                <span className="font-bold">Token Issued</span>
              </div>
              
              <p className="text-sm text-slate-500 mb-2">Your Token Number</p>
              <h2 className="text-[64px] font-black text-amber-600 mb-6 leading-none">{issuedToken.tokenNumber}</h2>
              
              <div className="w-full h-px border-t-2 border-dashed border-slate-200 mb-6" />
              
              <div className="flex w-full justify-between mb-4">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-slate-500">Est. Wait Time</span>
                  <span className="text-[15px] font-bold text-slate-900">{issuedToken.estimatedWaitMinutes} mins</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500">Provider</span>
                  <span className="text-[15px] font-bold text-slate-900 truncate max-w-[120px]">{provider.name}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-sm mt-8">
              <Button onClick={() => navigate('/patient/care/my-care', { replace: true })}>
                Track Token
              </Button>
            </div>
          </div>
        </MobileAppShell>
      );
    }

    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-[#F8FAFC] p-6 items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-10 h-10 text-[#1B7F4C]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3 text-center">Booking Confirmed</h1>
          <p className="text-[15px] text-slate-600 text-center mb-8 leading-relaxed max-w-[280px]">
            Your in-clinic appointment with {provider.name} is confirmed for {selectedDate || dates[0]} at {selectedTime || times[0]}. No upfront payment is required.
          </p>
          <div className="w-full">
            <Button onClick={() => navigate('/patient/care', { replace: true })}>
              Back to Care Hub
            </Button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const renderStepIndicator = () => {
    const stepOrder = selectedMode === 'queue_token'
      ? ['recipient', 'reason', 'records', 'review']
      : ['recipient', 'date', 'time', 'reason', 'records', 'review'];
      
    if (step === 'mode') return null;

    return (
      <div className="flex px-5 py-4 gap-1.5 bg-white border-b border-slate-200 shrink-0">
        {stepOrder.map((s, idx) => {
          const isActive = stepOrder.indexOf(step) >= idx;
          return (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${isActive ? 'bg-[#1B7F4C]' : 'bg-slate-200'}`} />
          );
        })}
      </div>
    );
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        <header className="px-4 py-4 bg-white flex items-center border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 shrink-0">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">Book Appointment</h1>
            <p className="text-[13px] text-slate-500 truncate">{provider.name} (In-Clinic)</p>
          </div>
        </header>

        {renderStepIndicator()}

        <div className="app-scroll flex-1 px-5 py-6 pb-28">
          
          {step === 'mode' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Choose Booking Mode</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { setSelectedMode('fixed_time'); setTimeout(handleNext, 150); }}
                  className={`flex items-start p-5 rounded-2xl border-2 text-left transition-all ${
                    selectedMode === 'fixed_time' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4 text-slate-500">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Book Fixed Time</h3>
                    <p className="text-[13px] text-slate-500 leading-snug">Select a specific date and time for a scheduled appointment.</p>
                  </div>
                </button>

                <button
                  onClick={() => { setSelectedMode('queue_token'); setTimeout(handleNext, 150); }}
                  className={`flex items-start p-5 rounded-2xl border-2 text-left transition-all ${
                    selectedMode === 'queue_token' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4 text-slate-500">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Get Queue Token</h3>
                    <p className="text-[13px] text-slate-500 leading-snug">Get the earliest walk-in token and join the live queue.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'recipient' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Who is this for?</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => { setRecipient('Just Myself'); setTimeout(handleNext, 150); }}
                  className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                    recipient === 'Just Myself' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4 text-slate-500">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">Just Myself</h3>
                  </div>
                </button>
                {careProfiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setRecipient(p.name); setTimeout(handleNext, 150); }}
                    className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                      recipient === p.name ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4 text-slate-500">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">{p.name}</h3>
                      <p className="text-[13px] text-slate-500">{p.relation}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'date' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Select Date</h2>
              <div className="flex flex-col gap-3">
                {dates.map(date => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setTimeout(handleNext, 150); }}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedDate === date ? 'border-[#1B7F4C] bg-[#1B7F4C] text-white' : 'border-slate-200 bg-white text-slate-900'
                    }`}
                  >
                    <span className="block text-[13px] opacity-80 mb-1">{date.split(',')[0]}</span>
                    <span className="block text-lg font-bold">{date.split(',')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'time' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Select Time Slot</h2>
              <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">{selectedDate || 'Any Date'}</p>
              <div className="grid grid-cols-2 gap-3">
                {times.map(time => (
                  <button
                    key={time}
                    onClick={() => { setSelectedTime(time); setTimeout(handleNext, 150); }}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      selectedTime === time ? 'border-[#1B7F4C] bg-emerald-50 text-[#1B7F4C]' : 'border-slate-200 bg-white text-slate-900'
                    }`}
                  >
                    <span className="font-bold text-[15px]">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'reason' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Reason for Visit</h2>
              <p className="text-[15px] text-slate-600 mb-6">Optional: Let the doctor know why you are visiting.</p>
              
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="E.g. Fever and headache since 2 days..."
                className="w-full p-4 bg-white border border-slate-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-[#1B7F4C] outline-none mb-6 text-[15px]"
              />

              <button 
                onClick={() => setStep('records')}
                className="flex items-center justify-center gap-2 w-full p-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 font-bold bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
                Attach Records
              </button>
            </div>
          )}

          {step === 'records' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Attach Records (Optional)</h2>
              <p className="text-[15px] text-slate-600 mb-6">Attach medical records for the doctor to review.</p>
              
              <div className="flex flex-col gap-4">
                <button
                  className="flex items-center p-5 rounded-2xl border-2 border-slate-200 bg-white text-left active:bg-slate-50"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mr-4 text-blue-600">
                    <FolderInput className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">Select from My Records</h3>
                    <p className="text-[13px] text-slate-500">Choose from your existing folders</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/patient/records/upload')}
                  className="flex items-center p-5 rounded-2xl border-2 border-slate-200 bg-white text-left active:bg-slate-50"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mr-4 text-emerald-600">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">Upload New</h3>
                    <p className="text-[13px] text-slate-500">Take a photo or upload a file</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Review Booking</h2>
              
              {selectedMode === 'queue_token' && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center mb-6 shadow-sm">
                  <Ticket className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Join OPD Queue</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Get a live walk-in token for {provider.name}.
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    <div className="flex flex-col items-center bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
                      <Users className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] text-slate-500 mb-1 font-medium uppercase tracking-wider">In Queue</span>
                      <span className="text-base font-bold text-slate-900">~14</span>
                    </div>
                    <div className="flex flex-col items-center bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
                      <Clock className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] text-slate-500 mb-1 font-medium uppercase tracking-wider">Est. Wait</span>
                      <span className="text-base font-bold text-slate-900">30-45m</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
                
                <div className="p-4 flex gap-4 border-b border-slate-100">
                  <img src={provider.avatarUrl} alt={provider.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                  <div className="flex-1 pt-1">
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">{provider.name}</h3>
                    <p className="text-[13px] text-slate-500">{provider.specialty}</p>
                  </div>
                </div>

                <div className="flex flex-col">
                  
                  <div className="flex p-4 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Visit Type</p>
                      <p className="text-[15px] font-semibold text-slate-900">In-Clinic Visit</p>
                    </div>
                  </div>

                  <div className="flex p-4 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Care Recipient</p>
                      <p className="text-[15px] font-semibold text-slate-900">Care for: {recipient || 'Just Myself'}</p>
                    </div>
                    <button onClick={() => setStep('recipient')} className="text-[#1B7F4C] text-sm font-bold p-2 h-fit">Edit</button>
                  </div>

                  {selectedMode === 'fixed_time' && (
                    <div className="flex p-4 border-b border-slate-100">
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
                        <p className="text-[15px] font-semibold text-slate-900">{selectedDate || 'Any Date'} at {selectedTime || 'Any Time'}</p>
                      </div>
                      <button onClick={() => setStep('date')} className="text-[#1B7F4C] text-sm font-bold p-2 h-fit">Edit</button>
                    </div>
                  )}

                  {reason && (
                    <div className="flex p-4 border-b border-slate-100">
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reason</p>
                        <p className="text-[15px] font-semibold text-slate-900">{reason}</p>
                      </div>
                      <button onClick={() => setStep('reason')} className="text-[#1B7F4C] text-sm font-bold p-2 h-fit">Edit</button>
                    </div>
                  )}

                  <div className="flex p-4 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attached Records</p>
                      <p className="text-[15px] font-semibold text-slate-900">2 records attached</p>
                    </div>
                    <button onClick={() => setStep('records')} className="text-[#1B7F4C] text-sm font-bold p-2 h-fit">Edit</button>
                  </div>

                  <div className="p-4 bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Consultation Fee</p>
                      <p className="text-[13px] text-slate-600 font-medium">Payment: Cash at clinic</p>
                    </div>
                    <p className="text-xl font-black text-slate-900">
                      {currency === 'USD' 
                        ? `$${((provider.fees.in_clinic_doctor || 0) / 280).toFixed(2)}` 
                        : `PKR ${provider.fees.in_clinic_doctor || 0}`}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          {step === 'records' && (
            <div className="flex justify-center mb-4">
              <button onClick={handleNext} className="text-[#1B7F4C] font-bold text-[15px]">Skip for now</button>
            </div>
          )}
          <Button onClick={handleNext}>
            {step === 'review' ? (selectedMode === 'queue_token' ? 'Generate Token' : 'Confirm Booking') : 'Continue'}
          </Button>
        </div>

      </div>
    </MobileAppShell>
  );
};
