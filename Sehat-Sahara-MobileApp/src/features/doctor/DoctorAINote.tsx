import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { ChevronLeft, Bot, AlertTriangle, CheckCircle, FileSignature, ShieldAlert, Save } from 'lucide-react';
import { PrototypeStore } from '../../services/PrototypeStore';
import { ProviderStore } from '../../services/ProviderStore';

export const DoctorAINote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const rawNotes = sessionStorage.getItem(`doc_notes_${id}`) || '';
  
  const [subjective, setSubjective] = useState(
    rawNotes || "Patient reports fever and severe headache starting 2 days ago. Mentions slight nausea. Denies cough or shortness of breath."
  );
  const [objective, setObjective] = useState("Vitals during call: HR 82, BP 120/80, SpO2 98%. Patient appears fatigued. No visible distress.");
  const [assessment, setAssessment] = useState("Suspected viral fever / tension headache with seasonal rhinitis.");
  const [plan, setPlan] = useState("Advise oral hydration, rest for 48 hours. Prescribe symptomatic analgesics. Follow up in 3 days if symptoms persist.");
  const [draftSaved, setDraftSaved] = useState(false);

  const providerState = ProviderStore.getSnapshot();
  const isStudent = providerState.journey === 'medical_student';

  const fullNote = `Subjective:\n${subjective}\n\nObjective:\n${objective}\n\nAssessment:\n${assessment}\n\nPlan:\n${plan}`;

  const handleSaveDraft = () => {
    if (id) {
      PrototypeStore.updateBooking(id, { notes: fullNote, status: 'in_progress' as any });
    }
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleCompleteWithoutPrescription = () => {
    if (!id) return;
    PrototypeStore.updateBooking(id, { 
      notes: fullNote, 
      status: 'completed' as any,
      reason: assessment
    });

    // Notify Care Seeker
    PrototypeStore.addNotification({
      id: `NOTIF-COMP-${Date.now()}`,
      userId: 'USR-PATIENT-DEMO',
      type: 'GENERAL',
      title: 'Consultation Completed',
      body: `Dr. Ayesha Khan completed your consultation summary. Please leave a review!`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/appointments/${id}`
    });

    navigate(`/doctor/appointments/${id}`, { replace: true });
  };

  const handleProceedToPrescription = () => {
    if (id) {
      PrototypeStore.updateBooking(id, { notes: fullNote });
    }
    navigate(`/doctor/consultation/${id}/prescription`);
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(`/doctor/consultation/${id || ''}`, { replace: true })} 
              className="mr-3 p-1 -ml-1 rounded-full active:bg-slate-100"
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900 flex items-center gap-1.5">
              <Bot className="w-5 h-5 text-blue-600" /> AI Clinical Note & SOAP
            </h1>
          </div>
          {draftSaved && (
            <span className="text-xs text-emerald-700 font-bold">Draft Saved</span>
          )}
        </header>

        <div className="app-scroll flex-1 px-5 py-5 pb-24 space-y-4">
          
          {isStudent && (
            <div className="bg-amber-50 p-3.5 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Supervised Mode: Observation and learning notes only. Final completion restricted.</span>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              Auto-structured into SOAP clinical format. Review, adjust, and complete or add prescriptions.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="text-xs font-bold text-orange-900">Allergy Alert: Penicillin, Peanuts</span>
          </div>

          <div className="space-y-4">
            {/* Subjective */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subjective (History)</h3>
              <textarea
                value={subjective}
                onChange={e => setSubjective(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-medium text-slate-800"
              />
            </div>

            {/* Objective */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Objective (Vitals/Exam)</h3>
              <textarea
                value={objective}
                onChange={e => setObjective(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-medium text-slate-800"
              />
            </div>

            {/* Assessment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment (Diagnosis)</h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">AI High Confidence</span>
              </div>
              <textarea
                value={assessment}
                onChange={e => setAssessment(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-bold text-slate-900"
              />
            </div>

            {/* Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Plan (Treatment & Follow-up)</h3>
              <textarea
                value={plan}
                onChange={e => setPlan(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-medium text-slate-800"
              />
            </div>
          </div>

        </div>

        {/* Action Bottom */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-safe space-y-2">
          <Button 
            onClick={handleProceedToPrescription} 
            size="lg" 
            fullWidth 
            disabled={isStudent}
            className="bg-[#166B32] text-white font-bold flex items-center justify-center gap-2"
          >
            <FileSignature className="w-4 h-4" /> Proceed to Prescription (Rx)
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="md" 
              fullWidth 
              onClick={handleSaveDraft}
              icon={<Save className="w-4 h-4" />}
            >
              Save Draft
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              fullWidth 
              disabled={isStudent}
              onClick={handleCompleteWithoutPrescription}
            >
              Complete (No Rx)
            </Button>
          </div>
        </div>

      </div>
    </MobileAppShell>
  );
};
