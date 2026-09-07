import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { OnboardingStore } from '../../services/OnboardingStore';
import { ChevronLeft, GraduationCap, ShieldCheck, Check } from 'lucide-react';

type ProviderGroup = 'student_fresher' | 'professional' | '';
type ProviderJourney = 'medical_student' | 'fresh_doctor' | 'practicing_doctor' | 'consultant_specialist' | '';

interface JourneyOption {
  id: ProviderJourney;
  label: string;
  desc: string;
}

const STUDENT_JOURNEYS: JourneyOption[] = [
  {
    id: 'medical_student',
    label: 'Medical Student / Intern',
    desc: 'University verification, supervised learning, logbook & OSCE training.',
  },
  {
    id: 'fresh_doctor',
    label: 'Fresh Doctor / House Officer / GP / MO',
    desc: 'PMDC verification, early-career jobs, basic consultations & home visits.',
  },
];

const PROFESSIONAL_JOURNEYS: JourneyOption[] = [
  {
    id: 'practicing_doctor',
    label: 'Practicing Doctor / General Physician',
    desc: 'Clinic, video & home availability, appointments & professional tools.',
  },
  {
    id: 'consultant_specialist',
    label: 'Consultant / Specialist',
    desc: 'Verified specialty, specialist consultations & Provider AI Copilot.',
  },
];

const JOURNEY_ROUTES: Record<string, string> = {
  medical_student: '/onboarding/student',
  fresh_doctor: '/onboarding/fresher',
  practicing_doctor: '/onboarding/doctor',
  consultant_specialist: '/onboarding/consultant',
};

export const ProviderTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  // Restore from store on mount
  const snap = OnboardingStore.getSnapshot();
  const [group, setGroup] = useState<ProviderGroup>((snap.providerGroup as ProviderGroup) || '');
  const [journey, setJourney] = useState<ProviderJourney>((snap.providerJourney as ProviderJourney) || '');

  // When group changes, clear journey if it doesn't belong to the new group
  useEffect(() => {
    if (group === 'student_fresher' && journey !== 'medical_student' && journey !== 'fresh_doctor') {
      setJourney('');
    } else if (group === 'professional' && journey !== 'practicing_doctor' && journey !== 'consultant_specialist') {
      setJourney('');
    }
  }, [group, journey]);

  const handleGroupSelect = (g: ProviderGroup) => {
    if (group === g) return; // Already selected
    setGroup(g);
    setJourney(''); // Reset journey when switching group
  };

  const handleContinue = () => {
    if (!group || !journey) return;

    OnboardingStore.updateState({
      providerGroup: group,
      providerJourney: journey,
    });

    const route = JOURNEY_ROUTES[journey];
    if (route) {
      navigate(route, { replace: true });
    }
  };


  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        {/* Sticky header */}
        <header className="px-5 py-4 pt-safe shrink-0 flex items-center bg-white border-b border-slate-100">
          <button onClick={() => navigate('/onboarding/role', { replace: true })} className="mr-3 p-1 -ml-1 text-slate-700 active:bg-slate-100 rounded-lg transition-colors" aria-label="Go back">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[20px] font-bold text-slate-900">Choose Your Medical Journey</h1>
        </header>

        {/* Scrollable content */}
        <div className="app-scroll flex-1 px-5 py-5">
          <p className="text-[15px] text-slate-500 mb-5 leading-relaxed">
            Select the option that best matches your current career stage.
          </p>

          <div className="flex flex-col gap-3">
            {/* ── Card 1: Student & Fresher ── */}
            <div>
              <button
                onClick={() => handleGroupSelect('student_fresher')}
                className={`w-full flex items-start p-4 rounded-2xl border-2 transition-all text-left ${
                  group === 'student_fresher'
                    ? 'border-[#1B7F4C] bg-[#F0FAF4]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mr-3.5 ${
                  group === 'student_fresher' ? 'bg-[#1B7F4C] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[16px] font-bold mb-0.5 ${
                    group === 'student_fresher' ? 'text-[#1B7F4C]' : 'text-slate-900'
                  }`}>
                    Student & Fresher
                  </h3>
                  <p className={`text-[13px] leading-relaxed ${
                    group === 'student_fresher' ? 'text-green-700' : 'text-slate-500'
                  }`}>
                    For medical students, interns, house officers and doctors starting their careers.
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 mt-0.5 ${
                  group === 'student_fresher' ? 'border-[#1B7F4C] bg-[#1B7F4C]' : 'border-slate-300'
                }`}>
                  {group === 'student_fresher' && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>

              {/* Expanded journey choices */}
              {group === 'student_fresher' && (
                <div className="mt-2 ml-3 border-l-2 border-[#1B7F4C]/20 pl-4 space-y-2 pb-1">
                  {STUDENT_JOURNEYS.map(j => (
                    <button
                      key={j.id}
                      onClick={() => setJourney(j.id)}
                      className={`w-full flex items-center p-3 rounded-xl border transition-all text-left ${
                        journey === j.id
                          ? 'border-[#1B7F4C] bg-[#F0FAF4]'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Radio indicator */}
                      <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 mr-3 ${
                        journey === j.id ? 'border-[#1B7F4C]' : 'border-slate-300'
                      }`}>
                        {journey === j.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1B7F4C]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-semibold ${
                          journey === j.id ? 'text-[#1B7F4C]' : 'text-slate-800'
                        }`}>
                          {j.label}
                        </p>
                        <p className={`text-[12px] leading-relaxed mt-0.5 ${
                          journey === j.id ? 'text-green-700' : 'text-slate-400'
                        }`}>
                          {j.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Card 2: Professional ── */}
            <div>
              <button
                onClick={() => handleGroupSelect('professional')}
                className={`w-full flex items-start p-4 rounded-2xl border-2 transition-all text-left ${
                  group === 'professional'
                    ? 'border-[#1B7F4C] bg-[#F0FAF4]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mr-3.5 ${
                  group === 'professional' ? 'bg-[#1B7F4C] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-[16px] font-bold mb-0.5 ${
                    group === 'professional' ? 'text-[#1B7F4C]' : 'text-slate-900'
                  }`}>
                    Professional
                  </h3>
                  <p className={`text-[13px] leading-relaxed ${
                    group === 'professional' ? 'text-green-700' : 'text-slate-500'
                  }`}>
                    For practicing doctors, consultants and verified specialists.
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 mt-0.5 ${
                  group === 'professional' ? 'border-[#1B7F4C] bg-[#1B7F4C]' : 'border-slate-300'
                }`}>
                  {group === 'professional' && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>

              {/* Expanded journey choices */}
              {group === 'professional' && (
                <div className="mt-2 ml-3 border-l-2 border-[#1B7F4C]/20 pl-4 space-y-2 pb-1">
                  {PROFESSIONAL_JOURNEYS.map(j => (
                    <button
                      key={j.id}
                      onClick={() => setJourney(j.id)}
                      className={`w-full flex items-center p-3 rounded-xl border transition-all text-left ${
                        journey === j.id
                          ? 'border-[#1B7F4C] bg-[#F0FAF4]'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 mr-3 ${
                        journey === j.id ? 'border-[#1B7F4C]' : 'border-slate-300'
                      }`}>
                        {journey === j.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1B7F4C]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] font-semibold ${
                          journey === j.id ? 'text-[#1B7F4C]' : 'text-slate-800'
                        }`}>
                          {j.label}
                        </p>
                        <p className={`text-[12px] leading-relaxed mt-0.5 ${
                          journey === j.id ? 'text-green-700' : 'text-slate-400'
                        }`}>
                          {j.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0">
          <Button onClick={handleContinue} disabled={!group || !journey}>
            Continue
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
