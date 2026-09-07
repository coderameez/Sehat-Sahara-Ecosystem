import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { ChevronLeft, Users, CheckCircle, BellRing, Clock, UserCheck } from 'lucide-react';
import { PrototypeStore } from '../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../services/OnboardingStore';
import { QueueToken } from '../../models';

export const DoctorQueue: React.FC = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<QueueToken[]>([]);

  useEffect(() => {
    const loadTokens = () => {
      const state = PrototypeStore.getSnapshot();
      setTokens(state.queueTokens.filter(t => t.status !== 'CANCELLED'));
    };
    loadTokens();
    const unsub = PrototypeStore.subscribe(loadTokens);
    return unsub;
  }, []);

  const handleUpdateStatus = (id: string, newStatus: 'CALLED' | 'SERVING' | 'COMPLETED') => {
    PrototypeStore.updateQueueToken(id, { 
      status: newStatus,
      estimatedWaitMinutes: newStatus === 'CALLED' ? 0 : 0
    });

    // If completed, ensure linked booking is also marked completed
    if (newStatus === 'COMPLETED') {
      const state = PrototypeStore.getSnapshot();
      const linkedBooking = state.bookings.find(b => b.careType === 'walk_in_token');
      if (linkedBooking) {
        PrototypeStore.updateBooking(linkedBooking.id, { status: 'completed' as any });
      }
    }
  };

  const patientName = OnboardingStore.getSnapshot().profile?.name || FALLBACK_PROFILE.name;

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/doctor/home', { replace: true })} className="mr-3 p-1 -ml-1 rounded-full active:bg-slate-100" aria-label="Go back">
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900">Live Walk-in Queue</h1>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
            Doctor Desk
          </span>
        </header>

        <div className="app-scroll flex-1 px-5 py-5 pb-24 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Patient Queue Stream</h2>
              <p className="text-[11px] text-slate-500">Call tokens and manage waiting lobby in real-time.</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#166B32] rounded-full text-xs font-bold border border-emerald-100">
              <Users className="w-3.5 h-3.5" />
              <span>{tokens.filter(t => t.status === 'IN_QUEUE' || t.status === 'CALLED').length} Waiting</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {tokens.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No walk-in tokens waiting</p>
                <p className="text-[11px] text-slate-400">Tokens issued at the clinic counter appear here automatically.</p>
              </div>
            ) : (
              tokens.map(token => {
                const isCalled = token.status === 'CALLED';
                const isServing = token.status === 'SERVING';
                const isCompleted = token.status === 'COMPLETED';

                return (
                  <div key={token.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-2xl font-black text-amber-600 leading-none">
                            #{token.tokenNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{patientName}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Room 1 • {token.facilityId || 'Sehat Care Clinic'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted ? 'bg-slate-100 text-slate-600' :
                        isServing ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                        isCalled ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {token.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {/* Action Controls */}
                    <div className="pt-1">
                      {token.status === 'IN_QUEUE' && (
                        <div className="flex gap-2">
                          <Button 
                            fullWidth 
                            size="md" 
                            onClick={() => handleUpdateStatus(token.id, 'CALLED')}
                            className="bg-[#166B32] text-white text-xs font-bold"
                            icon={<BellRing className="w-3.5 h-3.5" />}
                          >
                            Call Next / Your Turn
                          </Button>
                        </div>
                      )}

                      {isCalled && (
                        <div className="flex gap-2">
                          <Button 
                            fullWidth 
                            size="md" 
                            onClick={() => handleUpdateStatus(token.id, 'SERVING')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                            icon={<UserCheck className="w-3.5 h-3.5" />}
                          >
                            Start Consultation
                          </Button>
                        </div>
                      )}

                      {isServing && (
                        <div className="flex gap-2">
                          <Button 
                            fullWidth 
                            size="md" 
                            onClick={() => handleUpdateStatus(token.id, 'COMPLETED')}
                            className="bg-emerald-600 text-white text-xs font-bold"
                            icon={<CheckCircle className="w-3.5 h-3.5" />}
                          >
                            Complete Consultation
                          </Button>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="text-center py-1 text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Session completed. Prescription and review enabled.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
