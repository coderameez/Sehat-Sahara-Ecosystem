import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button, BottomSheet } from '../../components';
import { 
  ChevronLeft, AlertTriangle, FileText, Lock, Unlock, Phone, Video, 
  Clock, Calendar as CalendarIcon, CheckCircle2, Star, MessageSquare, 
  MapPin, Pill, ShieldAlert, ArrowRight
} from 'lucide-react';
import { PrototypeStore } from '../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../services/OnboardingStore';
import { ProviderStore } from '../../services/ProviderStore';

export const DoctorAppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [storeSnapshot, setStoreSnapshot] = useState(PrototypeStore.getSnapshot());
  useEffect(() => {
    return PrototypeStore.subscribe(() => {
      setStoreSnapshot(PrototypeStore.getSnapshot());
    });
  }, []);

  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeModal, setActiveModal] = useState<'reschedule' | 'decline' | 'summary' | 'rx' | 'review' | null>(null);

  const booking = storeSnapshot.bookings.find(b => b.id === id);
  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  const patientName = booking?.patientName || (booking?.patientId === 'USR-PATIENT-DEMO' ? 'Ayesha Siddiqui' : (currentUser.name || 'Patient'));

  const providerState = ProviderStore.getSnapshot();
  const isStudent = providerState.journey === 'medical_student';

  const existingReview = storeSnapshot.reviews.find(
    r => r.appointmentId === booking?.id || (booking?.status === 'completed' && !r.appointmentId)
  );

  const handleUnlock = () => {
    if (pin === '4921') {
      setIsUnlocked(true);
    } else {
      alert('Incorrect PIN (Hint: 4921)');
    }
  };

  const handleConfirm = () => {
    if (!booking) return;
    PrototypeStore.updateBooking(booking.id, { status: 'confirmed' });
  };

  const handleDecline = () => {
    if (!booking) return;
    PrototypeStore.updateBooking(booking.id, { status: 'cancelled' });
    setActiveModal(null);
  };

  const handleReschedule = () => {
    if (!booking) return;
    PrototypeStore.updateBooking(booking.id, { 
      scheduledDate: 'Tomorrow, 13 Oct', 
      scheduledTime: '11:00 AM', 
      status: 'confirmed' 
    });
    setActiveModal(null);
  };

  if (!booking) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-[#F8FAFC]">
          <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 flex items-center">
            <button onClick={() => navigate('/doctor/notifications')} className="p-1 -ml-1 rounded-full active:bg-slate-100 mr-2" aria-label="Back">
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <h1 className="text-[18px] font-bold text-slate-900">Appointment Detail</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3 shadow-2xs">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">This update is no longer available</h2>
            <p className="text-xs text-slate-500 max-w-xs mb-6">This appointment record was updated, rescheduled, or is no longer available in the active schedule.</p>
            <div className="w-full max-w-xs space-y-2">
              <Button fullWidth onClick={() => navigate('/doctor/notifications')} variant="primary" className="bg-[#166B32] text-white font-bold">
                Back to Notifications
              </Button>
              <Button fullWidth onClick={() => navigate('/doctor/home')} variant="outline">
                Go to Provider Home
              </Button>
            </div>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const isVideo = booking.careType === 'online_consultation';
  const isHomeVisit = booking.careType === 'direct_home_visit';
  const isCompleted = booking.status === 'completed';
  const isCancelled = booking.status === 'cancelled' || booking.status === 'no_show';
  const isRequested = booking.status === 'requested';
  const isConfirmed = booking.status === 'confirmed';
  const isInProgress = booking.status === 'in_progress';
  const isWaiting = booking.status === 'checked_in' || booking.status === 'in_queue';
  const isConsultationReady = booking.status === 'consultation_ready';

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/doctor/appointments', { replace: true })} className="mr-3 p-1 -ml-1 rounded-full active:bg-slate-100" aria-label="Go back">
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <div>
              <h1 className="text-[17px] font-bold text-slate-900 leading-tight">Appointment Detail</h1>
              <p className="text-[11px] text-slate-500">{booking.id}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${
            isCompleted ? 'bg-emerald-100 text-emerald-800' :
            isCancelled ? 'bg-rose-100 text-rose-700' :
            isRequested ? 'bg-amber-100 text-amber-800 animate-pulse' :
            isInProgress ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {booking.status}
          </span>
        </header>

        <div className="app-scroll flex-1 px-5 py-5 pb-24 space-y-4">
          
          {/* Medical Student Restrictions Banner */}
          {isStudent && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-0.5">Supervised Student Account</h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Independent consultation, complete actions, and prescribing are disabled. You can review clinical history and shadow under Dr. Ayesha Khan.
                </p>
              </div>
            </div>
          )}

          {/* Patient Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#166B32] font-black text-xl shrink-0">
              {patientName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight truncate">{patientName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">32 yrs • Blood: B+ • Verified Profile</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-[#166B32] font-semibold">
                <span>{isVideo ? 'Online Video Consult' : 'In-Clinic Fixed Appointment'}</span>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span className="font-bold">{booking.scheduledDate || 'Today'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-bold">{booking.scheduledTime || '10:00 AM'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium truncate max-w-[90px]">{booking.facilityId || 'Sehat Clinic'}</span>
            </div>
          </div>

          {/* Known Allergies Alert */}
          <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-orange-900 uppercase tracking-wide">Known Allergies</h3>
              <p className="text-xs text-orange-800 mt-0.5">Penicillin (Severe Rash), Peanuts</p>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reason for Consultation</h3>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              "{booking.reason || "General health consultation, fever and severe headache evaluation."}"
            </p>
          </div>

          {/* COMPLETED OUTCOMES: Summary, Prescription, Review */}
          {isCompleted && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Completed Outcomes</h3>
              
              <button 
                onClick={() => setActiveModal('summary')}
                className="w-full bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-left hover:border-emerald-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#166B32] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Consultation Summary</h4>
                    <p className="text-[11px] text-slate-500">Diagnosis & Clinical Notes recorded</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => setActiveModal('rx')}
                className="w-full bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-left hover:border-blue-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Issued E-Prescription (Rx)</h4>
                    <p className="text-[11px] text-slate-500">Digital signature verified</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button 
                onClick={() => setActiveModal('review')}
                className="w-full bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-left hover:border-amber-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Patient Review</h4>
                    <p className="text-[11px] text-slate-500">
                      {existingReview ? `${existingReview.rating}★ Review from ${existingReview.patientName}` : 'Waiting for patient rating'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          {/* Patient Records (PIN Protected) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#166B32]" /> Authorized Medical History
              </h3>
              {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
            </div>

            {!isUnlocked ? (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <p className="text-xs text-slate-600 mb-2.5">Enter patient verification PIN to view past CBC reports and contact info.</p>
                <div className="flex gap-2 justify-center mb-1.5">
                  <input
                    type="text"
                    maxLength={4}
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="PIN"
                    className="w-20 text-center px-2 py-1.5 border border-slate-300 rounded-lg font-bold text-xs outline-none focus:border-[#166B32]"
                  />
                  <button onClick={handleUnlock} className="bg-[#166B32] text-white px-3 py-1.5 rounded-lg font-bold text-xs">
                    Unlock
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">PIN: 4921</p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> +92 300 1234567
                  </div>
                  <span className="text-[#166B32] font-bold cursor-pointer">Call</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <FileText className="w-3.5 h-3.5 text-slate-500" /> Complete Blood Count (1.2 MB)
                  </div>
                  <span className="text-slate-500 font-medium">Verified</span>
                </div>
              </div>
            )}
          </div>

          {/* CANCELLED STATE NOTICE */}
          {isCancelled && (
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center text-xs text-slate-600">
              This appointment has been cancelled. No clinical action is required.
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* FOOTER ACTIONS DEPENDING ON APPOINTMENT STATUS */}
        {/* ======================================================== */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-safe space-y-2.5 shadow-lg">

          {/* 1. REQUESTED APPOINTMENT */}
          {isRequested && (
            <>
              <Button fullWidth size="lg" onClick={handleConfirm} className="bg-[#166B32] text-white font-bold">
                Confirm Appointment
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="md" fullWidth onClick={() => setActiveModal('reschedule')}>
                  Propose Reschedule
                </Button>
                <button 
                  onClick={() => setActiveModal('decline')} 
                  className="w-full text-center text-xs font-semibold text-slate-400 hover:text-red-600 py-1"
                >
                  Decline request
                </button>
              </div>
            </>
          )}

          {/* 2. WAITING / CHECKED IN APPOINTMENT */}
          {isWaiting && (
            <div className="space-y-2">
              <Button 
                fullWidth 
                size="lg" 
                onClick={() => navigate(`/doctor/consultation/${booking.id}`)}
                disabled={isStudent}
                className="bg-[#166B32] text-white font-bold"
              >
                Call Patient In / Start Consultation
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                size="md" 
                onClick={() => navigate('/doctor/queue')}
                icon={<Clock className="w-4 h-4" />}
              >
                View Live Queue
              </Button>
            </div>
          )}

          {/* 3. CONSULTATION READY */}
          {isConsultationReady && (
            <div className="space-y-2">
              <Button 
                fullWidth 
                size="lg" 
                onClick={() => navigate(`/doctor/consultation/${booking.id}`)}
                disabled={isStudent}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold animate-pulse"
              >
                {isVideo ? 'Join Ready Video Call' : 'Start Ready Consultation'}
              </Button>
              {isVideo && booking.meetLink && (
                <a
                  href={booking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                >
                  Open External Meet Link
                </a>
              )}
            </div>
          )}

          {/* 4. CONFIRMED APPOINTMENT */}
          {isConfirmed && !isConsultationReady && (
            <>
              {isVideo ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <a
                      href="https://meet.google.com/amh-eidp-oei"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Video className="w-4 h-4" /> Open Meet (External)
                    </a>
                    <Button 
                      size="lg" 
                      onClick={() => navigate(`/doctor/consultation/${booking.id}`)}
                      disabled={isStudent}
                      className="flex-1 bg-[#166B32] text-white font-bold text-xs"
                    >
                      Start Consultation
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      fullWidth 
                      size="md"
                      onClick={() => setActiveModal('reschedule')}
                    >
                      Propose Reschedule
                    </Button>
                    <Button 
                      variant="outline" 
                      fullWidth 
                      size="md"
                      onClick={() => navigate('/doctor/community/chat')}
                      icon={<MessageSquare className="w-4 h-4" />}
                    >
                      Chat
                    </Button>
                  </div>
                </div>
              ) : isHomeVisit ? (
                <div className="space-y-2">
                  <Button 
                    fullWidth 
                    size="lg" 
                    onClick={() => navigate(`/doctor/home-visit/${booking.id}`)}
                    disabled={isStudent}
                    className="bg-[#166B32] text-white font-bold"
                  >
                    Start Home Visit & Navigation
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    size="md"
                    onClick={() => setActiveModal('reschedule')}
                  >
                    Propose Reschedule
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    fullWidth 
                    size="lg" 
                    onClick={() => navigate(`/doctor/consultation/${booking.id}`)}
                    disabled={isStudent}
                    className="bg-[#166B32] text-white font-bold"
                  >
                    Start Clinic Consultation
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      fullWidth 
                      size="md"
                      onClick={() => setActiveModal('reschedule')}
                    >
                      Propose Reschedule
                    </Button>
                    <Button 
                      variant="outline" 
                      fullWidth 
                      size="md"
                      onClick={() => navigate('/doctor/community/chat')}
                      icon={<MessageSquare className="w-4 h-4" />}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 5. IN PROGRESS APPOINTMENT */}
          {isInProgress && (
            <Button 
              fullWidth 
              size="lg" 
              onClick={() => navigate(`/doctor/consultation/${booking.id}`)}
              disabled={isStudent}
              className="bg-[#166B32] text-white font-bold"
            >
              Continue Documentation & Notes
            </Button>
          )}

          {/* 6. COMPLETED APPOINTMENT - NO Cancel, Reschedule, Join or Start */}
          {isCompleted && (
            <div className="text-center py-1">
              <p className="text-xs text-emerald-800 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Consultation Complete & Recorded
              </p>
            </div>
          )}

          {/* 7. CANCELLED / NO SHOW APPOINTMENT - NO active CTA */}
          {isCancelled && (
            <div className="text-center py-2 bg-slate-100 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold">
                {booking.status === 'no_show' ? 'Marked as Patient No-Show' : 'Cancelled Appointment Record'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">No active clinical consultation required.</p>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODALS */}
        {/* ======================================================== */}

        {/* Reschedule Modal */}
        <BottomSheet isOpen={activeModal === 'reschedule'} onClose={() => setActiveModal(null)} title="Propose Reschedule">
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600">Select a new slot to propose to {patientName}:</p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">New Proposal</span>
              <p className="text-sm font-bold text-[#166B32]">Tomorrow, 13 Oct at 11:00 AM</p>
            </div>
            <Button fullWidth onClick={handleReschedule} className="bg-[#166B32] text-white font-bold">
              Send Reschedule Proposal
            </Button>
          </div>
        </BottomSheet>

        {/* Decline Modal */}
        <BottomSheet isOpen={activeModal === 'decline'} onClose={() => setActiveModal(null)} title="Decline Appointment Request">
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to decline this appointment request from <strong>{patientName}</strong>? The patient will be alerted.
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="danger" fullWidth onClick={handleDecline}>
                Confirm Decline
              </Button>
              <Button variant="outline" fullWidth onClick={() => setActiveModal(null)}>
                Keep Request
              </Button>
            </div>
          </div>
        </BottomSheet>

        {/* Summary Modal */}
        <BottomSheet isOpen={activeModal === 'summary'} onClose={() => setActiveModal(null)} title="Consultation Summary">
          <div className="pb-4 space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold uppercase text-slate-400 text-[10px] block mb-1">Diagnosis</span>
              <p className="font-bold text-slate-900">Viral Fever, Tension Headache, Seasonal Allergy</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold uppercase text-slate-400 text-[10px] block mb-1">Doctor Plan & Advice</span>
              <p className="text-slate-700 leading-relaxed">
                Advised oral hydration, rest for 48 hours. Prescribed Panadol and Surbex-Z. If fever exceeds 101°F, follow up with blood test.
              </p>
            </div>
            <Button fullWidth onClick={() => setActiveModal(null)} className="bg-[#166B32] text-white">
              Close
            </Button>
          </div>
        </BottomSheet>

        {/* Rx Modal */}
        <BottomSheet isOpen={activeModal === 'rx'} onClose={() => setActiveModal(null)} title="Issued Prescription (Rx)">
          <div className="pb-4 space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <div>
                <p className="font-bold text-[#166B32]">Dr. Ayesha Khan</p>
                <p className="text-slate-500 text-[11px]">PMDC: 12345-S</p>
              </div>
              <span className="text-slate-500">{booking.scheduledDate}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
              <p className="font-bold text-slate-900">1. Tab. Panadol 500mg (1 tab TDS - 3 days)</p>
              <p className="font-bold text-slate-900">2. Cap. Surbex-Z (1 cap OD morning - 10 days)</p>
            </div>
            <Button fullWidth onClick={() => setActiveModal(null)} className="bg-[#166B32] text-white">
              Close
            </Button>
          </div>
        </BottomSheet>

        {/* Review Modal */}
        <BottomSheet isOpen={activeModal === 'review'} onClose={() => setActiveModal(null)} title="Patient Review">
          <div className="pb-4 space-y-3 text-xs">
            {existingReview ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-5 h-5 ${s <= existingReview.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-lg font-black text-slate-900">{existingReview.rating}.0 / 5.0</p>
                <p className="text-xs text-slate-600 italic mt-2">"{existingReview.comment || 'Great experience and clear advice'}"</p>
                <p className="text-[11px] text-emerald-800 font-bold mt-2">Verified Patient: {existingReview.patientName}</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500">
                Patient has not submitted a review for this completed session yet.
              </div>
            )}
            <Button fullWidth onClick={() => setActiveModal(null)} className="bg-[#166B32] text-white">
              Close
            </Button>
          </div>
        </BottomSheet>

      </div>
    </MobileAppShell>
  );
};
