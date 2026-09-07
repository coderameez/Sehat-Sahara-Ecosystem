import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { ChevronLeft, Video, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { PrototypeStore } from '../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../services/OnboardingStore';
import { ProviderStore } from '../../services/ProviderStore';

export const DoctorConsultation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(
    PrototypeStore.getSnapshot().bookings.find(b => b.id === id) || PrototypeStore.getSnapshot().bookings[0]
  );

  useEffect(() => {
    return PrototypeStore.subscribe(() => {
      setBooking(PrototypeStore.getSnapshot().bookings.find(b => b.id === id) || PrototypeStore.getSnapshot().bookings[0]);
    });
  }, [id]);

  const [notes, setNotes] = useState(booking?.notes || sessionStorage.getItem(`doc_notes_${id}`) || '');
  const [draftSaved, setDraftSaved] = useState(false);

  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  const patientName = currentUser.name || 'Ali Raza';

  const providerState = ProviderStore.getSnapshot();
  const isStudent = providerState.journey === 'medical_student';

  const meetLink = booking?.meetLink || 'https://meet.google.com/amh-eidp-oei';

  const handleSaveDraft = () => {
    sessionStorage.setItem(`doc_notes_${id}`, notes);
    if (booking) {
      PrototypeStore.updateBooking(booking.id, { notes, status: 'in_progress' as any });
    }
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleContinueToNote = () => {
    sessionStorage.setItem(`doc_notes_${id}`, notes);
    if (booking) {
      PrototypeStore.updateBooking(booking.id, { notes, status: 'in_progress' as any });
    }
    navigate(`/doctor/consultation/${id}/ai-note`);
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-900">
        
        {/* Top Video / Meet Banner */}
        <div className="p-4 pt-safe flex items-center justify-between text-white shrink-0">
          <button 
            onClick={() => navigate(`/doctor/appointments/${id || ''}`, { replace: true })} 
            className="p-1 -ml-1 rounded-full active:bg-slate-800 text-white"
            aria-label="Go back to appointment"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold truncate max-w-[200px]">Consultation: {patientName}</h1>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Session Active</span>
          </div>
          <div className="w-7" />
        </div>

        {/* Video Call Controls Area */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-emerald-600/20">
            <Video className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-lg font-bold text-white mb-1">Encrypted Tele-Health Session</h2>
          <p className="text-xs text-slate-400 mb-6 max-w-xs">
            Connect to external Google Meet room with {patientName}. You can take notes simultaneously in the workspace below.
          </p>

          <a 
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 mb-2"
          >
            <Video className="w-4 h-4" /> Open Google Meet (External)
          </a>
          <span className="text-[10px] text-slate-500">Opening Meet does not conclude the session</span>
        </div>

        {/* Doctor Workspace (Bottom Section) */}
        <div className="bg-white rounded-t-3xl flex flex-col h-[52%] shadow-2xl overflow-hidden">
          
          {isStudent && (
            <div className="bg-amber-50 p-2.5 px-4 border-b border-amber-200 flex items-center gap-2 text-xs text-amber-800 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Supervised Mode: Observation and learning notes only.</span>
            </div>
          )}

          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Observations</h3>
              <p className="text-sm font-bold text-slate-900">Live Consultation Workspace</p>
            </div>
            {draftSaved && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Draft Saved
              </span>
            )}
          </div>

          <div className="flex-1 p-4 relative">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record symptoms, exam findings, vital signs (BP, Temp), and doctor's preliminary remarks..."
              className="w-full h-full resize-none outline-none text-xs leading-relaxed text-slate-800 bg-transparent placeholder-slate-400 font-medium"
            />
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-3.5 px-5 bg-slate-50 border-t border-slate-200 flex gap-2 shrink-0 pb-safe">
            <Button 
              variant="outline" 
              size="md" 
              onClick={handleSaveDraft}
              className="flex-1 text-xs font-bold"
            >
              Save Draft
            </Button>
            <Button 
              size="md" 
              onClick={handleContinueToNote}
              disabled={isStudent}
              className="flex-[2] bg-[#166B32] text-white text-xs font-bold"
            >
              Continue to AI Note & Plan
            </Button>
          </div>

        </div>

      </div>
    </MobileAppShell>
  );
};
