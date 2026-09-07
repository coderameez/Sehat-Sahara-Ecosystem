import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { MobileAppShell, Button, BottomSheet } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, Video, Building2, 
  FileText, Users, ClipboardList, MapPin, Star, MessageSquare, 
  CheckCircle2, Pill, ShieldCheck, UserCheck, AlertCircle, ArrowRight
} from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { Booking, Review } from '../../../models';

export const AppointmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { triageSymptom?: string; triagePriority?: string }) || {};
  const { id } = useParams<{ id: string }>();
  
  const [storeSnapshot, setStoreSnapshot] = useState(PrototypeStore.getSnapshot());
  useEffect(() => {
    return PrototypeStore.subscribe(() => {
      setStoreSnapshot(PrototypeStore.getSnapshot());
    });
  }, []);

  const [activeModal, setActiveModal] = useState<
    'reschedule' | 'cancel' | 'upload' | 'photo_match' | 'write_review' | 'view_review' | 'summary' | 'rx' | null
  >(null);

  // Review Form State
  const [rating, setRating] = useState<number>(5);
  const [commRating, setCommRating] = useState<number>(5);
  const [punctRating, setPunctRating] = useState<number>(5);
  const [careRating, setCareRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [justReviewed, setJustReviewed] = useState<boolean>(false);

  const booking = storeSnapshot.bookings.find(b => b.id === id);
  const provider = booking?.providerId 
    ? (storeSnapshot.providers.find(p => p.id === booking.providerId) || storeSnapshot.providers[0]) 
    : storeSnapshot.providers[0];
  const facility = booking?.facilityId ? storeSnapshot.facilities.find(f => f.id === booking.facilityId) : null;
  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;

  const existingReview = storeSnapshot.reviews.find(
    r => r.appointmentId === booking?.id || (booking?.status === 'completed' && r.providerId === booking?.providerId && !r.appointmentId)
  );

  const status = booking?.status || 'confirmed';
  const appointmentDate = booking?.scheduledDate || 'Today';
  const appointmentTime = booking?.scheduledTime || '10:00 AM';
  const visitType = booking?.careType === 'online_consultation' ? 'video' : booking?.careType === 'direct_home_visit' ? 'home_visit' : 'clinic';

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' }) + ', ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const isDue = appointmentDate === 'Today' || appointmentDate === todayStr;

  const updateBookingState = (updates: Partial<Booking>) => {
    if (!booking) return;
    const allBookings = storeSnapshot.bookings;
    const updated = allBookings.map(b => (b.id === booking.id ? { ...b, ...updates } : b));
    PrototypeStore.updateState({ bookings: updated as any });
  };

  const handleReschedule = () => {
    updateBookingState({ scheduledDate: 'Tomorrow, 13 Oct', scheduledTime: '11:00 AM', status: 'confirmed' });
    setActiveModal(null);
  };

  const handleCancel = () => {
    updateBookingState({ status: 'cancelled' });
    setActiveModal(null);
  };

  const handleJoinQueue = () => {
    if (booking?.careType === 'online_consultation') {
      setActiveModal('photo_match');
    } else if (booking?.careType === 'direct_home_visit') {
      navigate(`/patient/care/home-visit/tracker/${booking?.id || '1'}`);
    } else {
      navigate(PATIENT_ROUTES.QUEUE.replace(':id', booking?.id || '1'));
    }
  };

  const handleVerifyPhotoAndJoin = () => {
    setActiveModal(null);
    navigate(`/patient/consultation/${booking?.id || '1'}`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    const newRev: Review = {
      id: `REV-${Date.now()}`,
      appointmentId: booking.id,
      providerId: booking.providerId || provider?.id || 'd1',
      patientName: isAnonymous ? 'Anonymous Patient' : (currentUser.name || 'Ali Raza'),
      rating,
      communication: commRating,
      punctuality: punctRating,
      careExperience: careRating,
      comment: reviewComment.trim() || 'Very professional, attentive care and thorough guidance.',
      isAnonymous,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    PrototypeStore.addReview(newRev);
    setJustReviewed(true);
    setActiveModal(null);
  };

  if (!booking) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full">
          <header className="px-4 py-4 pt-safe bg-white border-b border-slate-200 flex items-center">
            <button onClick={() => navigate('/patient/care/my-care', { replace: true })} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100" aria-label="Go back">
              <ChevronLeft className="w-7 h-7 text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 ml-2">Appointment Details</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Appointment Not Found</h2>
            <p className="text-sm text-slate-500 mb-6">This appointment may have expired or been removed.</p>
            <button
              onClick={() => navigate('/patient/care/my-care', { replace: true })}
              className="px-6 py-3 bg-[#166B32] text-white rounded-full font-bold text-sm"
            >
              View All Appointments
            </button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-4 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/patient/care/my-care', { replace: true })} className="p-1 -ml-1 rounded-full active:bg-slate-100 mr-2" aria-label="Go back">
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <h1 className="text-[18px] font-bold text-slate-900">Appointment Details</h1>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
            isCompleted 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
              : isCancelled 
              ? 'bg-slate-100 text-slate-600 border border-slate-200'
              : 'bg-green-100 text-[#166B32] border border-green-200'
          }`}>
            {status}
          </span>
        </header>

        <div className="app-scroll flex-1 px-5 py-6">
          {/* Post-review success banner */}
          {(justReviewed || existingReview) && isCompleted && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-emerald-900">Review Submitted</p>
                <p className="text-[11px] text-emerald-700">Your feedback has been shared with {provider?.name || 'the doctor'}.</p>
              </div>
              <button 
                onClick={() => setActiveModal('view_review')}
                className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold shadow-xs active:bg-emerald-50"
              >
                View
              </button>
            </div>
          )}

          {/* Cancelled Alert */}
          {isCancelled && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="text-[13px] font-bold text-amber-900">Appointment Cancelled</p>
                <p className="text-[11px] text-amber-700">This appointment was cancelled. You can schedule a fresh visit whenever ready.</p>
              </div>
            </div>
          )}

          {/* Provider/Facility Info Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-5 flex items-center gap-4 shadow-sm">
            <img 
              src={provider ? provider.avatarUrl : (facility?.logoUrl || "https://ui-avatars.com/api/?name=Dr+Khan&background=166B32&color=fff")} 
              alt={provider ? provider.name : (facility?.name || 'Facility')} 
              className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight truncate">
                {provider ? provider.name : (facility?.name || 'Care Facility')}
              </h2>
              <p className="text-[13px] text-[#166B32] font-semibold mt-0.5 truncate">
                {provider ? provider.specialty : (booking.reason || 'Medical Service')}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {provider?.rating || 4.9}
                </span>
                <span>•</span>
                <span>{provider?.reviewsCount || 24} reviews</span>
              </div>
            </div>
          </div>

          {/* Appointment Schedule & Visit Type Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-5 shadow-sm divide-y divide-slate-100">
            <div className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</p>
                <p className="text-[14px] font-bold text-slate-900">{appointmentDate}</p>
              </div>
            </div>
            
            <div className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time Slot</p>
                <p className="text-[14px] font-bold text-slate-900">{appointmentTime}</p>
              </div>
            </div>

            <div className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {visitType === 'video' ? <Video className="w-5 h-5 text-slate-600" /> : visitType === 'home_visit' ? <Users className="w-5 h-5 text-slate-600" /> : <Building2 className="w-5 h-5 text-slate-600" />}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Consultation Type</p>
                <p className="text-[14px] font-bold text-slate-900">{visitType === 'video' ? 'Video Tele-Consult' : visitType === 'home_visit' ? 'In-Home Visit' : 'In-Clinic Appointment'}</p>
              </div>
            </div>
          </div>

          {/* COMPLETED APPOINTMENT: Secondary Action Cards */}
          {isCompleted && (
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Consultation Outcomes</h3>
              
              {/* Consultation Summary Button/Card */}
              <button 
                onClick={() => setActiveModal('summary')}
                className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#166B32] shrink-0">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-[#166B32] transition-colors">Consultation Summary</h4>
                    <p className="text-[12px] text-slate-500">Diagnosis: Seasonal Allergy & Fever</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#166B32] transition-colors" />
              </button>

              {/* View Prescription Button/Card */}
              <button 
                onClick={() => setActiveModal('rx')}
                className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all text-left group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Digital Prescription (Rx)</h4>
                    <p className="text-[12px] text-slate-500">2 Medicines issued • Verified PMDC</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>

              {/* Quick Links Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <button 
                  onClick={() => navigate(`/patient/care/online/${provider?.id || 'd1'}`)}
                  className="bg-white p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 active:scale-98 transition-all flex flex-col items-center justify-center shadow-2xs"
                >
                  <CalendarIcon className="w-5 h-5 text-[#166B32] mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Book Follow-up</span>
                </button>

                <button 
                  onClick={() => navigate('/patient/community')}
                  className="bg-white p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 active:scale-98 transition-all flex flex-col items-center justify-center shadow-2xs"
                >
                  <MessageSquare className="w-5 h-5 text-blue-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Conversation</span>
                </button>

                <button 
                  onClick={() => navigate('/patient/records')}
                  className="bg-white p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 active:scale-98 transition-all flex flex-col items-center justify-center shadow-2xs"
                >
                  <FileText className="w-5 h-5 text-purple-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">Medical Record</span>
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE APPOINTMENTS: Video Link / Triage Info */}
          {!isCompleted && !isCancelled && visitType === 'video' && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Encrypted Video Room</span>
                <span className="text-[11px] px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded-md">Live Ready</span>
              </div>
              <p className="text-[12px] text-indigo-900 font-medium mb-3">Google Meet connection ready for tele-consultation.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('https://meet.google.com/amh-eidp-oei').catch(() => {});
                  }}
                  className="flex-1 py-2 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-xl active:bg-indigo-50 transition-colors shadow-2xs"
                >
                  Copy Link
                </button>
                <a
                  href="https://meet.google.com/amh-eidp-oei"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl text-center active:bg-indigo-700 transition-colors shadow-2xs"
                >
                  Open in Browser
                </a>
              </div>
            </div>
          )}

          {/* Triage Summary */}
          {state.triageSymptom && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-[#166B32]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900 mb-1">Reason for Visit</h3>
                  <p className="text-[13px] text-slate-600 italic mb-2">"{state.triageSymptom}"</p>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    state.triagePriority === 'Urgent' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {state.triagePriority || 'Routine'} Priority Assessment
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Attached Records */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 ml-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Records</h3>
              <button 
                onClick={() => setActiveModal('upload')}
                className="text-xs font-bold text-[#166B32] hover:underline"
              >
                + Add Record
              </button>
            </div>
            
            <div className="space-y-2.5">
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 leading-tight">Complete Blood Count</p>
                    <p className="text-[11px] text-slate-500">Lab Report • 1.2 MB</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Uploaded</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FOOTER ACTIONS - Clean Status-Specific Design */}
        {/* ======================================================== */}
        <div className="pb-safe shrink-0 mt-auto p-4 border-t border-slate-200 bg-white shadow-lg space-y-2.5">
          
          {/* CASE 1: COMPLETED APPOINTMENT */}
          {isCompleted && (
            <div>
              {existingReview ? (
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={() => setActiveModal('view_review')}
                  icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                  className="border-emerald-600 text-[#166B32] font-bold"
                >
                  View Your Review ({existingReview.rating}★)
                </Button>
              ) : (
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => setActiveModal('write_review')}
                  icon={<Star className="w-5 h-5 text-amber-300 fill-amber-300" />}
                  className="bg-[#166B32] hover:bg-[#125828] text-white shadow-md font-bold"
                >
                  Write a Review
                </Button>
              )}
            </div>
          )}

          {/* CASE 2: CANCELLED APPOINTMENT */}
          {isCancelled && (
            <Button
              size="lg"
              fullWidth
              onClick={() => navigate('/patient/care/online')}
              className="bg-[#166B32] text-white font-bold"
            >
              Book New Appointment
            </Button>
          )}

          {/* CASE 3: ACTIVE / CONFIRMED / REQUESTED APPOINTMENT */}
          {!isCompleted && !isCancelled && (
            <>
              {/* PRIMARY ACTION */}
              {visitType === 'video' ? (
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleJoinQueue}
                  icon={<Video className="w-5 h-5" />}
                  disabled={!isDue}
                  className="bg-[#166B32] text-white shadow-md font-bold"
                >
                  Join Video Call
                </Button>
              ) : visitType === 'home_visit' ? (
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleJoinQueue}
                  icon={<MapPin className="w-5 h-5" />}
                  disabled={!isDue}
                  className="bg-[#166B32] text-white shadow-md font-bold"
                >
                  Track Visit
                </Button>
              ) : (
                <div className="flex gap-2.5">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={() => window.open('https://maps.google.com')}
                  >
                    Get Directions
                  </Button>
                  <Button
                    size="lg"
                    fullWidth
                    onClick={handleJoinQueue}
                    icon={<Users className="w-5 h-5" />}
                    disabled={!isDue}
                    className="bg-[#166B32] text-white font-bold"
                  >
                    Check In
                  </Button>
                </div>
              )}

              {/* SECONDARY ACTIONS: Reschedule as outline button, Cancel as low-emphasis text */}
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setActiveModal('reschedule')}
                  className="text-slate-700"
                >
                  Reschedule Appointment
                </Button>

                {/* Requirement 5: Low-emphasis text action for Cancel - NOT a large red button */}
                <button 
                  onClick={() => setActiveModal('cancel')} 
                  className="w-full text-center text-xs font-semibold text-slate-400 hover:text-red-600 py-1 transition-colors active:opacity-70"
                >
                  Cancel appointment
                </button>
              </div>
            </>
          )}

        </div>

        {/* ======================================================== */}
        {/* MODALS AND BOTTOM SHEETS */}
        {/* ======================================================== */}

        {/* 1. WRITE A REVIEW MODAL */}
        <BottomSheet isOpen={activeModal === 'write_review'} onClose={() => setActiveModal(null)} title="Rate Your Consultation">
          <form onSubmit={handleSubmitReview} className="space-y-4 pb-4">
            <div className="text-center p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor</p>
              <p className="text-base font-bold text-slate-900">{provider?.name || 'Dr. Ayesha Khan'}</p>
              <p className="text-xs text-[#166B32] font-semibold">{provider?.specialty || 'General Physician'}</p>
            </div>

            {/* Overall Rating */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
                Overall Experience ({rating} of 5)
              </label>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 active:scale-110 transition-transform"
                  >
                    <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Criteria */}
            <div className="bg-slate-50 rounded-xl p-3.5 space-y-3 border border-slate-100">
              {/* Communication */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Communication & Listening</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setCommRating(s)} className="p-0.5">
                      <Star className={`w-4 h-4 ${s <= commRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Punctuality */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Punctuality & Wait Time</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setPunctRating(s)} className="p-0.5">
                      <Star className={`w-4 h-4 ${s <= punctRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Care Experience */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Treatment & Guidance</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setCareRating(s)} className="p-0.5">
                      <Star className={`w-4 h-4 ${s <= careRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Feedback & Comments (Optional)
              </label>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                rows={3}
                placeholder="Share how your consultation went..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Anonymous Option */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none p-1">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-600 font-medium">Submit review anonymously (hide my name)</span>
            </label>

            <div className="pt-2">
              <Button type="submit" fullWidth className="bg-[#166B32] text-white font-bold">
                Submit Review
              </Button>
            </div>
          </form>
        </BottomSheet>

        {/* 2. VIEW YOUR REVIEW MODAL */}
        <BottomSheet isOpen={activeModal === 'view_review'} onClose={() => setActiveModal(null)} title="Your Review">
          <div className="space-y-4 pb-4">
            <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="flex justify-center gap-1.5 mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star 
                    key={s} 
                    className={`w-6 h-6 ${s <= (existingReview?.rating || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <p className="text-xl font-black text-slate-900">{existingReview?.rating || rating}.0 / 5.0</p>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">Verified Patient Consultation</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Reviewer:</span>
                <span className="font-bold text-slate-900">{existingReview?.patientName || (isAnonymous ? 'Anonymous' : currentUser.name)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date:</span>
                <span className="font-bold text-slate-900">{existingReview?.date || 'Today'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Doctor:</span>
                <span className="font-bold text-slate-900">{provider?.name || 'Dr. Ayesha Khan'}</span>
              </div>
            </div>

            {existingReview?.comment && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Your Comment</span>
                <p className="text-xs text-slate-700 italic">"{existingReview.comment}"</p>
              </div>
            )}

            <Button fullWidth variant="outline" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </div>
        </BottomSheet>

        {/* 3. CONSULTATION SUMMARY MODAL */}
        <BottomSheet isOpen={activeModal === 'summary'} onClose={() => setActiveModal(null)} title="Consultation Summary">
          <div className="space-y-4 pb-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-900">{provider?.name || 'Dr. Ayesha Khan'}</p>
                <p className="text-slate-500">{provider?.specialty || 'General Physician'}</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[11px]">
                Completed
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 border border-slate-200 rounded-xl">
                <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">Chief Complaint & Diagnosis</span>
                <p className="font-semibold text-slate-900">{booking.reason || 'Acute Seasonal Allergy & Tension Headache'}</p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl">
                <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">Clinical Assessment</span>
                <p className="text-slate-700 leading-relaxed">
                  Patient presented with mild fever and nasal congestion. Vitals stable (Temp: 98.6°F, BP: 120/80 mmHg). No signs of lower respiratory distress.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl">
                <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1 text-[10px]">Doctor's Advice & Plan</span>
                <p className="text-slate-700 leading-relaxed">
                  Hydrate frequently with warm fluids. Rest for 48 hours. If fever exceeds 101°F or persists after 3 days, return for blood work review.
                </p>
              </div>
            </div>

            <Button fullWidth onClick={() => setActiveModal(null)} className="bg-[#166B32] text-white">
              Done
            </Button>
          </div>
        </BottomSheet>

        {/* 4. DIGITAL PRESCRIPTION MODAL */}
        <BottomSheet isOpen={activeModal === 'rx'} onClose={() => setActiveModal(null)} title="Digital Prescription (Rx)">
          <div className="space-y-4 pb-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-start text-xs">
              <div>
                <p className="text-[14px] font-bold text-[#166B32]">{provider?.name || 'Dr. Ayesha Khan'}</p>
                <p className="text-slate-500">{provider?.specialty || 'General Physician'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PMDC: 12345-S</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">Patient: {currentUser.name || 'Ali Raza'}</p>
                <p className="text-slate-500 text-[11px]">{appointmentDate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Tab. Panadol 500mg</p>
                  <p className="text-[11px] text-slate-600">1 tablet 3 times a day (after meals)</p>
                  <p className="text-[10px] text-slate-400">Duration: 3 Days (SOS)</p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Cap. Surbex-Z</p>
                  <p className="text-[11px] text-slate-600">1 capsule daily in the morning</p>
                  <p className="text-[10px] text-slate-400">Duration: 10 Days</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Electronically signed and verified by licensed physician</span>
            </div>

            <Button fullWidth onClick={() => setActiveModal(null)} className="bg-[#166B32] text-white">
              Done
            </Button>
          </div>
        </BottomSheet>

        {/* 5. RESCHEDULE MODAL */}
        <BottomSheet isOpen={activeModal === 'reschedule'} onClose={() => setActiveModal(null)} title="Reschedule Appointment">
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600">
              Select an alternative date and time for your consultation with {provider?.name || 'the doctor'}.
            </p>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proposed New Slot</p>
              <p className="text-sm font-bold text-[#166B32]">Tomorrow, 13 Oct at 11:00 AM</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <Button fullWidth onClick={handleReschedule} className="bg-[#166B32] text-white font-bold">
                Confirm Reschedule
              </Button>
              <Button variant="outline" fullWidth onClick={() => setActiveModal(null)}>
                Keep Current Slot
              </Button>
            </div>
          </div>
        </BottomSheet>

        {/* 6. CANCEL CONFIRMATION MODAL (Requirement 5: Red is ONLY inside here!) */}
        <BottomSheet isOpen={activeModal === 'cancel'} onClose={() => setActiveModal(null)} title="Cancel Appointment">
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel your appointment with <strong className="text-slate-800">{provider?.name || 'the doctor'}</strong> on <strong>{appointmentDate}</strong> at <strong>{appointmentTime}</strong>?
            </p>
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800">
              No cancellation fees apply for requests made at least 1 hour in advance.
            </div>
            <div className="flex flex-col gap-2.5">
              <Button variant="danger" fullWidth onClick={handleCancel}>
                Confirm Cancellation
              </Button>
              <Button variant="outline" fullWidth onClick={() => setActiveModal(null)}>
                Keep Appointment
              </Button>
            </div>
          </div>
        </BottomSheet>

        {/* 7. UPLOAD RECORDS MODAL */}
        <BottomSheet isOpen={activeModal === 'upload'} onClose={() => setActiveModal(null)} title="Upload Medical Records">
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600">Select a lab report or document to attach to this appointment.</p>
            <div className="p-6 border border-dashed border-slate-300 rounded-2xl text-center bg-slate-50">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-900">demo-report.pdf</p>
              <p className="text-[11px] text-slate-500">1.2 MB</p>
            </div>
            <Button fullWidth onClick={() => setActiveModal(null)} className="bg-[#166B32] text-white">
              Attach to Appointment
            </Button>
          </div>
        </BottomSheet>

        {/* 8. PHOTO MATCH MODAL */}
        <BottomSheet isOpen={activeModal === 'photo_match'} onClose={() => setActiveModal(null)} title="Identity Verification">
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600">
              For security, quick facial verification confirms identity before connecting to the tele-health session.
            </p>
            <div className="w-full h-48 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
              <UserCheck className="w-16 h-16 text-emerald-400 animate-pulse" />
            </div>
            <Button fullWidth onClick={handleVerifyPhotoAndJoin} icon={<Video className="w-5 h-5" />} className="bg-[#166B32] text-white font-bold">
              Verify & Join Call
            </Button>
          </div>
        </BottomSheet>

      </div>
    </MobileAppShell>
  );
};
