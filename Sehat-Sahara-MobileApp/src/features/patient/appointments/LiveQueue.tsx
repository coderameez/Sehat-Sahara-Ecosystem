import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button, BottomSheet } from '../../../components';
import { 
  ChevronLeft, Clock, Users, BellRing, CheckCircle, 
  User, Star, Pill, FastForward, Play, Pause, ArrowRight
} from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { Review } from '../../../models';
import { useAppBack } from '../../../utils/navigation';

type QueueStep = 
  | 'issued' 
  | 'waiting' 
  | 'approaching' 
  | 'your_turn' 
  | 'in_consultation' 
  | 'completed' 
  | 'summary' 
  | 'review';

const STEP_ORDER: QueueStep[] = [
  'issued',
  'waiting',
  'approaching',
  'your_turn',
  'in_consultation',
  'completed',
  'summary',
  'review'
];

export const LiveQueue: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();
  const { id } = useParams<{ id: string }>();
  
  const [storeSnapshot, setStoreSnapshot] = useState(PrototypeStore.getSnapshot());
  
  useEffect(() => {
    return PrototypeStore.subscribe(() => {
      setStoreSnapshot(PrototypeStore.getSnapshot());
    });
  }, []);

  // Look for either a matching QueueToken or a Booking
  const token = id ? storeSnapshot.queueTokens.find(t => t.id === id) : storeSnapshot.queueTokens[0];
  const booking = id ? storeSnapshot.bookings.find(b => b.id === id) : storeSnapshot.bookings[0];

  const provider = token?.providerId
    ? (storeSnapshot.providers.find(p => p.id === token.providerId) || storeSnapshot.providers[0])
    : booking?.providerId
    ? (storeSnapshot.providers.find(p => p.id === booking.providerId) || storeSnapshot.providers[0])
    : storeSnapshot.providers[0];

  const facility = token?.facilityId
    ? storeSnapshot.facilities.find(f => f.id === token.facilityId)
    : booking?.facilityId
    ? storeSnapshot.facilities.find(f => f.id === booking.facilityId)
    : null;

  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  const providerOrFacilityName = provider?.name || facility?.name || 'Dr. Ayesha Khan';

  // Queue simulation step
  const [currentStep, setCurrentStep] = useState<QueueStep>('issued');
  const [isAutoAdvancing, setIsAutoAdvancing] = useState<boolean>(true);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  // Review state
  const [rating, setRating] = useState<number>(5);
  const [commRating, setCommRating] = useState<number>(5);
  const [punctRating, setPunctRating] = useState<number>(5);
  const [careRating, setCareRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Sync stage to PrototypeStore
  const syncStoreForStep = (step: QueueStep) => {
    const tokenId = token?.id || 'TOK-DEMO-1';
    if (step === 'issued' || step === 'waiting') {
      PrototypeStore.updateQueueToken(tokenId, { status: 'IN_QUEUE', estimatedWaitMinutes: step === 'issued' ? 15 : 10 });
    } else if (step === 'approaching') {
      PrototypeStore.updateQueueToken(tokenId, { status: 'IN_QUEUE', estimatedWaitMinutes: 3 });
    } else if (step === 'your_turn') {
      PrototypeStore.updateQueueToken(tokenId, { status: 'CALLED', estimatedWaitMinutes: 0 });
    } else if (step === 'in_consultation') {
      PrototypeStore.updateQueueToken(tokenId, { status: 'SERVING', estimatedWaitMinutes: 0 });
      if (booking?.id) {
        PrototypeStore.updateBooking(booking.id, { status: 'in_progress' as any });
      }
    } else if (step === 'completed' || step === 'summary' || step === 'review') {
      PrototypeStore.updateQueueToken(tokenId, { status: 'COMPLETED', estimatedWaitMinutes: 0 });
      if (booking?.id) {
        PrototypeStore.updateBooking(booking.id, { status: 'completed' as any });
      }
    }
  };

  const advanceStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const next = STEP_ORDER[currentIndex + 1];
      setCurrentStep(next);
      syncStoreForStep(next);
    }
  };

  // Auto-advance timer (3.5 seconds per step up to summary)
  useEffect(() => {
    if (!isAutoAdvancing) return;
    if (currentStep === 'summary' || currentStep === 'review') return;

    const timer = setTimeout(() => {
      advanceStep();
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentStep, isAutoAdvancing]);

  const handleCancelConfirm = () => {
    if (token) {
      PrototypeStore.updateQueueToken(token.id, { status: 'CANCELLED' });
    }
    if (booking) {
      PrototypeStore.updateBooking(booking.id, { status: 'cancelled' });
    }
    setShowCancelModal(false);
    navigate('/patient/care/my-care', { replace: true });
  };

  const handleSubmitReview = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (rating === 0) return;

    const newRev: Review = {
      id: `REV-${Date.now()}`,
      appointmentId: booking?.id || 'BKG-MOCK-1',
      providerId: provider?.id || 'd1',
      patientName: isAnonymous ? 'Anonymous Patient' : (currentUser.name || 'Ali Raza'),
      rating,
      communication: commRating,
      punctuality: punctRating,
      careExperience: careRating,
      comment: reviewComment.trim() || 'Prompt consultation, clear explanation and friendly guidance.',
      isAnonymous,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    PrototypeStore.addReview(newRev);
    setReviewSubmitted(true);
  };

  const stepIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* Top Simulation Header Banner */}
        <div className="bg-slate-900 text-white px-4 py-2 pt-safe text-xs flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold tracking-wide text-emerald-300 uppercase text-[11px]">Demo queue simulation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoAdvancing(!isAutoAdvancing)}
              className="p-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 flex items-center gap-1"
              title={isAutoAdvancing ? 'Pause timer' : 'Resume timer'}
            >
              {isAutoAdvancing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isAutoAdvancing ? 'Auto' : 'Paused'}
            </button>
            {stepIndex < STEP_ORDER.length - 1 && (
              <button
                onClick={advanceStep}
                className="px-2 py-1 rounded bg-[#166B32] hover:bg-[#125828] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-transform"
              >
                <FastForward className="w-3 h-3" />
                Next Step
              </button>
            )}
          </div>
        </div>

        {/* Screen Header */}
        <header className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => goBack('/patient/care/my-care')} 
              className="p-1 -ml-1 rounded-full active:bg-slate-100 text-slate-700"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-[16px] font-bold text-slate-900 leading-tight">Live Queue Tracker</h1>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{providerOrFacilityName}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Token #{token?.tokenNumber || 14}
          </span>
        </header>

        {/* Progress Bar through 8 stages */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0">
          <div 
            className="bg-[#166B32] h-1.5 transition-all duration-500 ease-out" 
            style={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }} 
          />
        </div>

        {/* Step Indicator Badges */}
        <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 overflow-x-auto gap-2 no-scrollbar">
          {STEP_ORDER.map((s, idx) => (
            <span
              key={s}
              className={`whitespace-nowrap transition-colors ${
                idx === stepIndex 
                  ? 'text-[#166B32] font-black' 
                  : idx < stepIndex 
                  ? 'text-emerald-700' 
                  : 'text-slate-300'
              }`}
            >
              {idx + 1}. {s.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Dynamic Content Body based on currentStep */}
        <div className="app-scroll flex-1 p-5 flex flex-col items-center justify-center text-center">

          {/* 1. ISSUED */}
          {currentStep === 'issued' && (
            <div className="w-full max-w-sm">
              <div className="w-36 h-36 rounded-full bg-white border-6 border-[#166B32] shadow-lg flex flex-col items-center justify-center mx-auto mb-5 animate-pulse">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Token Issued</span>
                <span className="text-4xl font-black text-[#166B32]">#{token?.tokenNumber || 14}</span>
                <span className="text-[11px] text-slate-500 font-medium">3 Patients Ahead</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">Queue Spot Confirmed</h2>
              <p className="text-xs text-slate-500 mb-5">Your live token has been registered in the clinic schedule.</p>
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left mb-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-bold text-slate-900">{providerOrFacilityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room:</span>
                  <span className="font-bold text-slate-900">Consultation Room 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Wait:</span>
                  <span className="font-bold text-emerald-700">~15 minutes</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. WAITING */}
          {currentStep === 'waiting' && (
            <div className="w-full max-w-sm">
              <div className="w-36 h-36 rounded-full bg-amber-50 border-6 border-amber-500 shadow-md flex flex-col items-center justify-center mx-auto mb-5">
                <Clock className="w-8 h-8 text-amber-600 mb-1" />
                <span className="text-3xl font-black text-amber-700">~10m</span>
                <span className="text-[11px] text-amber-800 font-bold">Waiting Queue</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">Waiting for Turn</h2>
              <p className="text-xs text-slate-500 mb-5">Current patient in consultation. Please stay in the waiting lobby.</p>

              <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Now Serving</span>
                  <span className="text-base font-black text-slate-900">Token #11</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Your Position</span>
                  <span className="text-base font-black text-[#166B32]">Token #{token?.tokenNumber || 14}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. APPROACHING */}
          {currentStep === 'approaching' && (
            <div className="w-full max-w-sm">
              <div className="w-36 h-36 rounded-full bg-blue-50 border-6 border-blue-500 shadow-md flex flex-col items-center justify-center mx-auto mb-5 animate-bounce">
                <Users className="w-8 h-8 text-blue-600 mb-1" />
                <span className="text-3xl font-black text-blue-700">1 Ahead</span>
                <span className="text-[11px] text-blue-800 font-bold">Approaching</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">You Are Next in Line!</h2>
              <p className="text-xs text-slate-500 mb-5">Please proceed to outside Consultation Room 1.</p>

              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-left mb-6">
                <p className="text-xs font-bold text-blue-900 mb-1">Nurse Call Alert Ready</p>
                <p className="text-[11px] text-blue-700">Prepare your ID card and past medical files if applicable.</p>
              </div>
            </div>
          )}

          {/* 4. YOUR TURN */}
          {currentStep === 'your_turn' && (
            <div className="w-full max-w-sm">
              <div className="w-36 h-36 rounded-full bg-emerald-600 text-white shadow-xl flex flex-col items-center justify-center mx-auto mb-5 animate-pulse">
                <BellRing className="w-12 h-12 mb-1" />
                <span className="text-xs font-black uppercase tracking-widest">CALLING NOW</span>
              </div>
              <h2 className="text-2xl font-black text-emerald-800 mb-1">It's Your Turn!</h2>
              <p className="text-xs text-slate-600 mb-5">
                Token <strong className="text-slate-900 text-sm">#{token?.tokenNumber || 14}</strong> is being called by {providerOrFacilityName}.
              </p>

              <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl mb-6 shadow-sm">
                <p className="text-sm font-black text-emerald-950 mb-0.5">Please Enter Room 1</p>
                <p className="text-xs text-emerald-800">The physician is ready to begin your examination.</p>
              </div>
            </div>
          )}

          {/* 5. IN CONSULTATION */}
          {currentStep === 'in_consultation' && (
            <div className="w-full max-w-sm">
              <div className="w-36 h-36 rounded-full bg-emerald-50 border-6 border-emerald-600 shadow-md flex flex-col items-center justify-center mx-auto mb-5">
                <User className="w-10 h-10 text-emerald-700 mb-1" />
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Serving</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">Consultation in Progress</h2>
              <p className="text-xs text-slate-500 mb-5">{providerOrFacilityName} is reviewing history and prescribing care.</p>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-left shadow-xs mb-6 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4" /> Vitals Checked (BP 120/80, Temp 98.6°F)
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4" /> Diagnosis & Symptom Discussion
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <span className="w-4 h-4 rounded-full border border-slate-300 inline-block" /> Generating digital prescription...
                </div>
              </div>
            </div>
          )}

          {/* 6. COMPLETED */}
          {currentStep === 'completed' && (
            <div className="w-full max-w-sm">
              <div className="w-36 h-36 rounded-full bg-[#166B32] text-white shadow-xl flex flex-col items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-14 h-14" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Visit Completed!</h2>
              <p className="text-xs text-slate-500 mb-6">
                Your consultation has successfully concluded. Clinical notes and prescription are ready.
              </p>

              <div className="space-y-2.5 w-full mb-6">
                <Button fullWidth onClick={() => setCurrentStep('summary')} className="bg-[#166B32] text-white font-bold">
                  View Summary & Prescription
                </Button>
                <Button variant="outline" fullWidth onClick={() => setCurrentStep('review')}>
                  Leave Doctor Review
                </Button>
              </div>
            </div>
          )}

          {/* 7. SUMMARY & PRESCRIPTION */}
          {currentStep === 'summary' && (
            <div className="w-full max-w-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-slate-900">Consultation Summary</h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">Verified</span>
              </div>

              {/* Assessment card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-3.5 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis</span>
                  <p className="font-bold text-slate-900">Acute Seasonal Allergy & Tension Headache</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctor's Advice</span>
                  <p className="text-slate-600 leading-relaxed">
                    Take rest, avoid cold air triggers, hydrate well. Follow up in 3 days if symptoms persist.
                  </p>
                </div>
              </div>

              {/* Prescription card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-5 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issued Medicines (Rx)</span>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Tab. Panadol 500mg</p>
                    <p className="text-[11px] text-slate-500">1 tablet 3 times a day (3 days)</p>
                  </div>
                  <Pill className="w-4 h-4 text-blue-600" />
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Cap. Surbex-Z</p>
                    <p className="text-[11px] text-slate-500">1 capsule daily after breakfast (10 days)</p>
                  </div>
                  <Pill className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              <Button fullWidth onClick={() => setCurrentStep('review')} className="bg-[#166B32] text-white font-bold">
                Rate Your Consultation <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}

          {/* 8. REVIEW */}
          {currentStep === 'review' && (
            <div className="w-full max-w-sm text-left">
              {reviewSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mb-1">Review Submitted!</h2>
                  <p className="text-xs text-slate-500 mb-6">
                    Thank you! Your feedback has updated {providerOrFacilityName}'s rating in the live directory.
                  </p>
                  <Button fullWidth onClick={() => navigate('/patient/care/my-care', { replace: true })} className="bg-[#166B32] text-white font-bold">
                    Return to My Care
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-lg font-black text-slate-900 mb-0.5">Rate Your Consultation</h2>
                    <p className="text-xs text-slate-500">With {providerOrFacilityName}</p>
                    
                    <div className="flex justify-center gap-2 my-3">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="p-1 active:scale-110 transition-transform"
                        >
                          <Star className={`w-7 h-7 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Doctor Communication</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} type="button" onClick={() => setCommRating(s)}>
                            <Star className={`w-3.5 h-3.5 ${s <= commRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Queue & Punctuality</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} type="button" onClick={() => setPunctRating(s)}>
                            <Star className={`w-3.5 h-3.5 ${s <= punctRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Overall Care Guidance</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} type="button" onClick={() => setCareRating(s)}>
                            <Star className={`w-3.5 h-3.5 ${s <= careRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    rows={2}
                    placeholder="Brief feedback (optional)..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />

                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={e => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600"
                    />
                    <span>Submit anonymously</span>
                  </label>

                  <Button type="submit" fullWidth className="bg-[#166B32] text-white font-bold">
                    Submit Review & Finish
                  </Button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer Low-Emphasis Cancel Action */}
        {(currentStep === 'issued' || currentStep === 'waiting' || currentStep === 'approaching') && (
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 text-center">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-xs font-semibold text-slate-400 hover:text-red-500 py-1 transition-colors"
            >
              Cancel queue spot
            </button>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <BottomSheet isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Queue Spot">
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your queue token for {providerOrFacilityName}? You will forfeit this slot.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button variant="danger" fullWidth onClick={handleCancelConfirm}>
                Yes, Cancel Spot
              </Button>
              <Button variant="outline" fullWidth onClick={() => setShowCancelModal(false)}>
                Keep Waiting
              </Button>
            </div>
          </div>
        </BottomSheet>

      </div>
    </MobileAppShell>
  );
};
