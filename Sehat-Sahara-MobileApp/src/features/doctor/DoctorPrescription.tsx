import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { ChevronLeft, Pill, Languages, Send, ShieldCheck, ShieldAlert } from 'lucide-react';
import { PrototypeStore } from '../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../services/OnboardingStore';
import { ProviderStore } from '../../services/ProviderStore';
import { MedicineCourse } from '../../models';

export const DoctorPrescription: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showUrdu, setShowUrdu] = useState(false);

  const providerState = ProviderStore.getSnapshot();
  const isStudent = providerState.journey === 'medical_student';

  const doctor = PrototypeStore.getSnapshot().providers.find(p => p.id === 'd1') || PrototypeStore.getSnapshot().providers[0];
  const patientName = OnboardingStore.getSnapshot().profile?.name || FALLBACK_PROFILE.name;

  const medicines = [
    {
      id: '1',
      name: 'Tab. Panadol 500mg',
      instructionEn: 'Take 1 tablet 3 times a day (after meals for fever/pain).',
      instructionUr: 'دن میں 3 دفعہ۔ بخار یا درد کی صورت میں کھانے کے بعد لیں۔',
      duration: '3 Days'
    },
    {
      id: '2',
      name: 'Cap. Surbex-Z',
      instructionEn: 'Take 1 capsule daily after breakfast.',
      instructionUr: 'روزانہ صبح ناشتے کے بعد ایک کیپسول لیں۔',
      duration: '10 Days'
    }
  ];

  const handleIssuePrescription = () => {
    if (isStudent) return;
    const state = PrototypeStore.getSnapshot();

    // 1. Update appointment to completed
    PrototypeStore.updateBooking(id || 'BKG-MOCK-1', {
      status: 'completed' as any
    });

    // 2. Add issued medicines to patient medicine courses
    const newCourses: MedicineCourse[] = medicines.map((m, idx) => ({
      id: `MED-CRS-NEW-${Date.now()}-${idx}`,
      patientId: 'USR-PATIENT-DEMO',
      name: m.name,
      strength: m.name.includes('500mg') ? '500mg' : '1 cap',
      form: m.name.toLowerCase().includes('cap') ? 'Capsule' : 'Tablet',
      frequency: 'DAILY',
      startDate: new Date().toISOString().split('T')[0],
      mealRelation: 'AFTER_MEAL',
      status: 'ACTIVE',
      exactTimes: ['09:00', '21:00'],
      notes: m.instructionEn
    }));

    PrototypeStore.updateState({
      medicineCourses: [...newCourses, ...state.medicineCourses]
    });

    // 3. Notify patient
    PrototypeStore.addNotification({
      id: `NOTIF-RX-${Date.now()}`,
      userId: 'USR-PATIENT-DEMO',
      type: 'GENERAL',
      title: 'Digital Prescription Issued',
      body: `Dr. Ayesha Khan issued your prescription and consultation outcomes. Tap to view and review!`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/appointments/${id}`
    });

    navigate(`/doctor/appointments/${id || ''}`, { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(`/doctor/consultation/${id || ''}/ai-note`, { replace: true })} 
              className="mr-3 p-1 -ml-1 rounded-full active:bg-slate-100" 
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900">Digital Prescription (Rx)</h1>
          </div>
          <button 
            onClick={() => setShowUrdu(!showUrdu)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              showUrdu ? 'bg-[#166B32] text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Languages className="w-3.5 h-3.5" /> Urdu Rx
          </button>
        </header>

        <div className="app-scroll flex-1 px-5 py-5 pb-24 space-y-4">
          
          {isStudent && (
            <div className="bg-amber-50 p-3.5 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 font-medium">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Supervised Account: Prescribing authority restricted to licensed physician.</span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Header of Prescription */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-[#166B32]">{doctor?.name || 'Dr. Ayesha Khan'}</h2>
                <p className="text-xs text-slate-500">{doctor?.specialty || 'General Physician'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PMDC License: 12345-S</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">Patient: {patientName}</p>
                <p className="text-[11px] text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-[10px] text-slate-400">Age: 32 | Wt: 60kg</p>
              </div>
            </div>

            <div className="p-4">
              
              <div className="mb-4 border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Clinical Diagnosis</span>
                <p className="text-xs font-semibold text-slate-900">Viral Fever, Tension Headache, Seasonal Allergy</p>
              </div>

              {/* Medicines List */}
              <div className="space-y-3 mb-5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rx Medication</span>
                
                {medicines.map(med => (
                  <div key={med.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900">{med.name}</h4>
                      {showUrdu ? (
                        <p className="text-xs text-[#166B32] font-urdu leading-relaxed mt-0.5" dir="rtl">
                          {med.instructionUr}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-600 mt-0.5">{med.instructionEn}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">Duration: {med.duration}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Electronic Signature */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-slate-600 font-medium">PMDC Electronic Signature</span>
                </div>
                <div className="text-right">
                  <span className="font-serif italic font-bold text-emerald-800 text-sm">Dr. Ayesha Khan</span>
                  <p className="text-[9px] text-slate-400">Cryptographically Signed</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Action Bottom */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-safe">
          <Button 
            onClick={handleIssuePrescription}
            size="lg" 
            fullWidth 
            disabled={isStudent}
            className="bg-[#166B32] text-white font-bold flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Sign & Issue Prescription
          </Button>
        </div>

      </div>
    </MobileAppShell>
  );
};
