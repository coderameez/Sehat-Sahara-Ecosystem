import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, Video, Building2, Home, User, Paperclip, FolderInput, UploadCloud, Ticket, Calendar } from 'lucide-react';
import { MOCK_DOCTORS } from './mockData';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { QueueToken } from '../../../models';
import { CounterpartEngine } from '../../../services/prototype/CounterpartEngine';

type BookingStep = 'type' | 'recipient' | 'date' | 'time' | 'reason' | 'records' | 'review';

export const BookingFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { 
    symptom?: string; 
    priority?: string; 
    prefilledDate?: string;
    prefilledTime?: string;
    prefilledVisitType?: 'clinic' | 'video' | 'home';
    prefilledBookingMode?: 'fixed_time' | 'queue_token';
  } | null;
  const triageContext = locationState;
  let doctor: any = MOCK_DOCTORS.find(d => d.id === id);
  if (!doctor) {
    const prov = PrototypeStore.getSnapshot().providers.find(p => p.id === id);
    if (prov) {
      doctor = {
        id: prov.id,
        name: prov.name,
        specialty: prov.specialty,
        experience: `${prov.experienceYears || 10} Years`,
        fee: prov.fees.in_clinic_doctor || 1500,
        rating: prov.rating,
        reviews: prov.reviewsCount,
        avatarUrl: prov.avatarUrl || 'https://i.pravatar.cc/150?u=doc',
        availableToday: true,
        nextAvailable: 'Today, 02:00 PM',
        about: prov.about,
        gender: (prov.gender as any) || 'Female',
        bookingModes: prov.bookingModes || ['fixed_time', 'queue_token']
      };
    }
  }

  const availableModes: ('fixed_time' | 'queue_token')[] = doctor?.bookingModes || ['fixed_time', 'queue_token'];
  const supportsFixed = availableModes.includes('fixed_time');
  const supportsToken = availableModes.includes('queue_token');
  const supportsBoth = supportsFixed && supportsToken;
  const initialMode: 'fixed_time' | 'queue_token' = 
    locationState?.prefilledBookingMode || 
    (sessionStorage.getItem(`booking_mode_${id}`) as any) ||
    (!supportsFixed && supportsToken ? 'queue_token' : 'fixed_time');

  const [step, setStep] = useState<BookingStep>(() => {
    return locationState?.prefilledDate ? 'review' : (sessionStorage.getItem(`booking_step_${id}`) as BookingStep) || 'type';
  });
  
  const [visitType, setVisitType] = useState<'clinic' | 'video' | 'home' | null>(() => {
    return locationState?.prefilledVisitType || (sessionStorage.getItem(`booking_visit_${id}`) as 'clinic' | 'video' | 'home') || 'clinic';
  });

  const [bookingMode, setBookingMode] = useState<'fixed_time' | 'queue_token'>(initialMode);
  
  const [recipient, setRecipient] = useState<string | null>('Just Myself');
  
  const [selectedDate, setSelectedDate] = useState<string | null>(() => {
    return locationState?.prefilledDate || sessionStorage.getItem(`booking_date_${id}`) || null;
  });
  
  const [selectedTime, setSelectedTime] = useState<string | null>(() => {
    return locationState?.prefilledTime || sessionStorage.getItem(`booking_time_${id}`) || null;
  });
  
  const [reason, setReason] = useState<string>(triageContext?.symptom || 'General checkup');

  const careProfiles = OnboardingStore.getSnapshot().careProfiles;

  useEffect(() => {
    sessionStorage.setItem(`booking_step_${id}`, step);
  }, [step, id]);
  useEffect(() => {
    if (visitType) sessionStorage.setItem(`booking_visit_${id}`, visitType);
  }, [visitType, id]);
  useEffect(() => {
    sessionStorage.setItem(`booking_mode_${id}`, bookingMode);
  }, [bookingMode, id]);
  useEffect(() => {
    if (selectedDate) sessionStorage.setItem(`booking_date_${id}`, selectedDate);
  }, [selectedDate, id]);
  useEffect(() => {
    if (selectedTime) sessionStorage.setItem(`booking_time_${id}`, selectedTime);
  }, [selectedTime, id]);

  if (!doctor) {
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
              <Building2 className="w-8 h-8" />
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
    if (step === 'type' && visitType) {
      setStep('recipient');
    } else if (step === 'recipient' && recipient) {
      if (visitType === 'clinic' && bookingMode === 'queue_token') {
        setStep('reason');
      } else {
        setStep('date');
      }
    } else if (step === 'date' && selectedDate) {
      setStep('time');
    } else if (step === 'time' && selectedTime) {
      setStep('reason');
    } else if (step === 'reason') {
      setStep('records');
    } else if (step === 'records') {
      setStep('review');
    } else if (step === 'review') {
      const providers = PrototypeStore.getSnapshot().providers;
      const matchedProvider = providers.find(p => p.id === doctor.id || p.name === doctor.name) || providers[0];

      // If user chose queue token walk-in:
      if (visitType === 'clinic' && bookingMode === 'queue_token') {
        const newToken: QueueToken = {
          id: `TOK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          patientId: 'USR-PATIENT-DEMO',
          providerId: matchedProvider.id,
          tokenNumber: Math.floor(Math.random() * 20) + 40,
          estimatedWaitMinutes: Math.floor(Math.random() * 30) + 15,
          status: 'IN_QUEUE',
          issuedAt: new Date().toISOString()
        };
        PrototypeStore.updateState({
          queueTokens: [newToken, ...PrototypeStore.getSnapshot().queueTokens]
        });
        CounterpartEngine.scheduleQueueAdvance(newToken.id);
        navigate(PATIENT_ROUTES.QUEUE.replace(':id', newToken.id), { replace: true });
        return;
      }

      // Fixed-time appointment booking flow:
      const newBookingId = `BKG-${Math.floor(100000 + Math.random() * 900000)}`;
      const careTypeMap: Record<string, any> = {
        clinic: 'in_clinic_doctor',
        video: 'online_consultation',
        home: 'direct_home_visit',
      };
      const scheduledDateVal = selectedDate || new Date().toISOString().split('T')[0];
      const scheduledTimeVal = selectedTime || '10:00 AM';

      const newBooking: any = {
        id: newBookingId,
        patientId: 'USR-PATIENT-DEMO',
        providerId: matchedProvider.id,
        careType: careTypeMap[visitType || 'clinic'],
        status: 'confirmed',
        scheduledDate: scheduledDateVal,
        scheduledTime: scheduledTimeVal,
        paymentPolicy: 'pay_at_clinic',
        paymentStatus: 'pending',
        facilityId: 'City Care Clinic',
        reason: reason || 'Consultation',
        history: [{ status: 'confirmed', timestamp: new Date().toISOString() }],
        createdAt: new Date().toISOString()
      };

      PrototypeStore.updateState({
        bookings: [newBooking, ...PrototypeStore.getSnapshot().bookings]
      });
      CounterpartEngine.scheduleBookingConfirmation(newBooking.id);

      navigate(PATIENT_ROUTES.BOOKING_CONFIRM, { 
        replace: true,
        state: { 
          bookingId: newBookingId,
          providerId: matchedProvider.id,
          providerName: matchedProvider.name,
          careType: careTypeMap[visitType || 'clinic'],
          visitType, 
          recipient,
          date: scheduledDateVal, 
          time: scheduledTimeVal, 
          triageSymptom: reason,
          triagePriority: triageContext?.priority,
          fee: getFees(),
        }
      });
    }
  };

  const handleBack = () => {
    if (step === 'review') setStep('records');
    else if (step === 'records') setStep('reason');
    else if (step === 'reason') {
      if (visitType === 'clinic' && bookingMode === 'queue_token') {
        setStep('recipient');
      } else {
        setStep('time');
      }
    }
    else if (step === 'time') setStep('date');
    else if (step === 'date') setStep('recipient');
    else if (step === 'recipient') setStep('type');
    else navigate(PATIENT_ROUTES.DOCTORS, { replace: true });
  };

  const today = new Date();
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return `${dayName}, ${dayNum}`;
  });

  const times = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];
  const unavailableTimes = ['10:30 AM', '06:00 PM'];

  const getFees = () => {
    if (visitType === 'clinic') return doctor.fee;
    if (visitType === 'video') return doctor.fee - 500;
    if (visitType === 'home') return doctor.fee + 1000;
    return doctor.fee;
  };

  const renderStepIndicator = () => {
    const isQueue = visitType === 'clinic' && bookingMode === 'queue_token';
    const stepOrder = isQueue
      ? ['type', 'recipient', 'reason', 'records', 'review']
      : ['type', 'recipient', 'date', 'time', 'reason', 'records', 'review'];

    return (
      <div className="flex px-5 py-4 gap-1.5 bg-white border-b border-slate-200 shrink-0">
        {stepOrder.map((s, idx) => {
          const isActive = stepOrder.indexOf(step) >= idx;
          return (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${isActive ? 'bg-brand-600' : 'bg-slate-200'}`} />
          );
        })}
      </div>
    );
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        <header className="px-4 py-4 pt-safe bg-white flex items-center border-b border-slate-200 shrink-0">
          <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 shrink-0" aria-label="Go back">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">Book Appointment</h1>
            <p className="text-[13px] text-slate-500 truncate">{doctor.name}</p>
          </div>
        </header>

        {renderStepIndicator()}

        <div className="app-scroll flex-1 px-5 py-6 pb-28">
          
          {step === 'type' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Select Visit Type</h2>
              
              <div className="flex flex-col gap-4">
                <div className={`rounded-2xl border-2 transition-all overflow-hidden ${
                  visitType === 'clinic' ? 'border-brand-600 bg-brand-50/50' : 'border-slate-200 bg-white'
                }`}>
                  <button
                    onClick={() => setVisitType('clinic')}
                    className="w-full flex items-center p-5 text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 ${
                      visitType === 'clinic' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-1">In-Clinic Visit</h3>
                      <p className="text-[13px] text-slate-500">PKR {doctor.fee}</p>
                    </div>
                  </button>

                  {/* Mode Selector for In-Clinic */}
                  {visitType === 'clinic' && (
                    <div className="px-5 pb-5 pt-1 border-t border-brand-100 bg-white/80">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                        {supportsBoth ? 'Choose Clinic Booking Mode' : 'Clinic Service Mode'}
                      </p>
                      {supportsBoth ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setBookingMode('fixed_time')}
                            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                              bookingMode === 'fixed_time'
                                ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold ring-1 ring-brand-500'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              <Calendar className="w-3.5 h-3.5 text-brand-600" />
                              Fixed Time
                            </div>
                            <span className="text-[11px] text-slate-500 leading-tight">Pick exact date & time</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setBookingMode('queue_token')}
                            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                              bookingMode === 'queue_token'
                                ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold ring-1 ring-brand-500'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              <Ticket className="w-3.5 h-3.5 text-amber-600" />
                              Live Token
                            </div>
                            <span className="text-[11px] text-slate-500 leading-tight">Walk-in queue today</span>
                          </button>
                        </div>
                      ) : supportsToken ? (
                        <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/80 text-amber-900 flex items-center gap-2.5">
                          <Ticket className="w-5 h-5 text-amber-600 shrink-0" />
                          <div>
                            <div className="text-xs font-bold">Walk-in Queue Token Only</div>
                            <div className="text-[11px] text-amber-700">No date/time selection needed. Instant token issued for today's queue.</div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl border border-brand-200 bg-brand-50/80 text-brand-900 flex items-center gap-2.5">
                          <Calendar className="w-5 h-5 text-brand-600 shrink-0" />
                          <div>
                            <div className="text-xs font-bold">Fixed-Time Appointment</div>
                            <div className="text-[11px] text-brand-700">Select your preferred date and slot in the next step.</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setVisitType('video')}
                  className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                    visitType === 'video' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 ${
                    visitType === 'video' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Video Consult</h3>
                    <p className="text-[13px] text-slate-500">PKR {doctor.fee - 500}</p>
                  </div>
                </button>

                <button
                  onClick={() => setVisitType('home')}
                  className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                    visitType === 'home' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 ${
                    visitType === 'home' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-1">Home Visit</h3>
                    <p className="text-[13px] text-slate-500">PKR {doctor.fee + 1000}</p>
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
                  onClick={() => setRecipient('Just Myself')}
                  className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                    recipient === 'Just Myself' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4 ${
                    recipient === 'Just Myself' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">Just Myself</h3>
                    <p className="text-[13px] text-slate-500">Primary Account Holder</p>
                  </div>
                </button>

                {careProfiles.map(profile => (
                  <button
                    key={profile.id}
                    onClick={() => setRecipient(profile.name)}
                    className={`flex items-center p-5 rounded-2xl border-2 text-left transition-all ${
                      recipient === profile.name ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mr-4 ${
                      recipient === profile.name ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-0.5">{profile.name}</h3>
                      <p className="text-[13px] text-slate-500">{profile.relation} • {profile.age} yrs</p>
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
                {dates.map((date) => {
                  const isSelected = selectedDate === date;
                  const [dayName, dayNum] = date.split(', ');
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        isSelected ? 'border-brand-600 bg-brand-50 text-brand-900' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-base">{dayName}</span>
                      <span className="text-sm">{dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'time' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Select Time Slot</h2>
              <div className="grid grid-cols-2 gap-3">
                {times.map((time) => {
                  const isUnavailable = unavailableTimes.includes(time);
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      disabled={isUnavailable}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        isUnavailable 
                          ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                          : isSelected
                          ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-base">{time}</span>
                      {isUnavailable && <span className="block text-[11px] text-slate-400 mt-1">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'reason' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Reason for Visit</h2>
              <p className="text-sm text-slate-500 mb-6">Briefly describe what you're experiencing.</p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="E.g. Fever and persistent dry cough for 3 days..."
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl h-40 resize-none outline-none focus:border-brand-600 text-[15px]"
              />
            </div>
          )}

          {step === 'records' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Attach Medical Records</h2>
              <p className="text-sm text-slate-500 mb-6">Share existing prescriptions or lab reports.</p>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <FolderInput className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">Select from Vault</h3>
                    <p className="text-[13px] text-slate-500">2 documents available</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-600" />
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">Upload New File</h3>
                    <p className="text-[13px] text-slate-500">Image, PDF up to 10MB</p>
                  </div>
                  <Paperclip className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Review Booking</h2>
              
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
                {/* Doctor Info */}
                <div className="p-4 flex gap-4 border-b border-slate-100">
                  <img src={doctor.avatarUrl} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0" />
                  <div className="flex-1 pt-1">
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">{doctor.name}</h3>
                    <p className="text-[13px] text-slate-500">{doctor.specialty}</p>
                  </div>
                </div>

                {/* Details List */}
                <div className="flex flex-col">
                  
                  <div className="flex p-4 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Visit Type & Mode</p>
                      <p className="text-[15px] font-semibold text-slate-900">
                        {visitType === 'clinic' 
                          ? (bookingMode === 'queue_token' ? 'In-Clinic • Walk-in Queue Token' : 'In-Clinic • Fixed-Time Appointment')
                          : visitType === 'video' ? 'Online Consultation' : 'Home Visit'}
                      </p>
                      {visitType === 'clinic' && bookingMode === 'queue_token' && (
                        <p className="text-xs text-amber-700 mt-1 font-medium">Walk-in token for today's queue (~20-40 mins wait)</p>
                      )}
                    </div>
                    <button onClick={() => setStep('type')} className="text-brand-600 text-sm font-bold p-2 h-fit">Edit</button>
                  </div>

                  <div className="flex p-4 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Care Recipient</p>
                      <p className="text-[15px] font-semibold text-slate-900">Care for: {recipient}</p>
                    </div>
                    <button onClick={() => setStep('recipient')} className="text-brand-600 text-sm font-bold p-2 h-fit">Edit</button>
                  </div>

                  {/* Show Date & Time only for fixed time or non-clinic */}
                  {!(visitType === 'clinic' && bookingMode === 'queue_token') && (
                    <div className="flex p-4 border-b border-slate-100">
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
                        <p className="text-[15px] font-semibold text-slate-900">{selectedDate} at {selectedTime}</p>
                      </div>
                      <button onClick={() => setStep('date')} className="text-brand-600 text-sm font-bold p-2 h-fit">Edit</button>
                    </div>
                  )}

                  {reason && (
                    <div className="flex p-4 border-b border-slate-100">
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reason</p>
                        <p className="text-[15px] font-semibold text-slate-900">{reason}</p>
                      </div>
                      <button onClick={() => setStep('reason')} className="text-brand-600 text-sm font-bold p-2 h-fit">Edit</button>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">Consultation Fee</p>
                      <p className="text-[13px] text-slate-600 font-medium">Payment: Cash at clinic</p>
                    </div>
                    <p className="text-xl font-black text-brand-700">PKR {getFees()}</p>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          {step === 'records' && (
            <div className="flex justify-center mb-3">
              <button onClick={handleNext} className="text-[#1B7F4C] font-bold text-[15px]">Skip for now</button>
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={
              (step === 'type' && !visitType) || 
              (step === 'recipient' && !recipient) ||
              (step === 'date' && !selectedDate && !(visitType === 'clinic' && bookingMode === 'queue_token')) || 
              (step === 'time' && !selectedTime && !(visitType === 'clinic' && bookingMode === 'queue_token'))
            }
          >
            {step === 'review' 
              ? (visitType === 'clinic' && bookingMode === 'queue_token' ? 'Get Queue Token' : 'Confirm Booking')
              : 'Continue'}
          </Button>
        </div>

      </div>
    </MobileAppShell>
  );
};
