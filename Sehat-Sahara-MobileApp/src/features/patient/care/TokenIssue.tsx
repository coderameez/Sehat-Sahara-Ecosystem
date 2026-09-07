import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Facility, QueueToken } from '../../../models';
import { CounterpartEngine } from '../../../services/prototype/CounterpartEngine';
import { ChevronLeft, Ticket, Users, Clock, CheckCircle, User, Paperclip, FolderInput, UploadCloud } from 'lucide-react';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { useAppBack } from '../../../utils/navigation';

type BookingStep = 'recipient' | 'reason' | 'records' | 'review' | 'confirmed';

export const TokenIssue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goBack = useAppBack();
  
  const [facility, setFacility] = useState<Facility | null>(null);
  const [step, setStep] = useState<BookingStep>('recipient');
  
  const [recipient, setRecipient] = useState<string>('Just Myself');
  const [reason, setReason] = useState<string>('');
  const [issuedToken, setIssuedToken] = useState<QueueToken | null>(null);

  const careProfiles = OnboardingStore.getSnapshot().careProfiles;

  useEffect(() => {
    const state = PrototypeStore.getSnapshot();
    const fac = state.facilities.find(f => f.id === id);
    if (fac) setFacility(fac);
  }, [id]);

  if (!facility) return null;

  const branch = facility.branches[0];

  const handleNext = () => {
    if (step === 'recipient') setStep('reason');
    else if (step === 'reason') setStep('records');
    else if (step === 'records') setStep('review');
    else if (step === 'review') handleConfirm();
  };

  const handleBack = () => {
    if (step === 'review') setStep('records');
    else if (step === 'records') setStep('reason');
    else if (step === 'reason') setStep('recipient');
    else goBack();
  };

  const handleConfirm = () => {
    const newToken: QueueToken = {
      id: `TOK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientId: 'USR-PATIENT-DEMO',
      facilityId: facility.id,
      branchId: branch.id,
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
  };

  if (step === 'confirmed' && issuedToken) {
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
                <span className="text-xs text-slate-500">Location</span>
                <span className="text-[15px] font-bold text-slate-900 truncate max-w-[120px]">{facility.name}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-sm mt-8">
            <Button onClick={() => navigate('/patient/care', { replace: true })}>
              Done
            </Button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const renderStepIndicator = () => {
    const stepOrder = ['recipient', 'reason', 'records', 'review'];
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
            <h1 className="text-lg font-bold text-slate-900 truncate">Get Token</h1>
            <p className="text-[13px] text-slate-500 truncate">{facility.name}</p>
          </div>
        </header>

        {renderStepIndicator()}

        <div className="app-scroll flex-1 px-5 py-6 pb-28">
          
          {step === 'recipient' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Who is this for?</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setRecipient('Just Myself')}
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
                    onClick={() => setRecipient(p.name)}
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
              <h2 className="text-xl font-bold text-slate-900 mb-6">Review & Confirm</h2>
              
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center mb-6 shadow-sm">
                <Ticket className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Join OPD Queue</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Get a live walk-in token for {facility.name}.
                </p>
                
                <div className="flex gap-3 justify-center">
                  <div className="flex flex-col items-center bg-slate-50 px-6 py-3 rounded-xl">
                    <Users className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-xs text-slate-500 mb-1">In Queue</span>
                    <span className="text-base font-bold text-slate-900">14</span>
                  </div>
                  <div className="flex flex-col items-center bg-slate-50 px-6 py-3 rounded-xl">
                    <Clock className="w-5 h-5 text-slate-500 mb-1" />
                    <span className="text-xs text-slate-500 mb-1">Est. Wait</span>
                    <span className="text-base font-bold text-slate-900">~30m</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
                <div className="flex flex-col">
                  <div className="flex p-4 border-b border-slate-100">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Care Recipient</p>
                      <p className="text-[15px] font-semibold text-slate-900">Care for: {recipient || 'Just Myself'}</p>
                    </div>
                    <button onClick={() => setStep('recipient')} className="text-[#1B7F4C] text-sm font-bold p-2 h-fit">Edit</button>
                  </div>

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
            {step === 'review' ? 'Generate Token' : 'Continue'}
          </Button>
        </div>

      </div>
    </MobileAppShell>
  );
};
