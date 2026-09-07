import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../components';
import { PATIENT_ROUTES } from '../../constants/routes';
import {
  Stethoscope,
  FileText,
  HeartPulse,
  Users,
  Droplets,
  Layers,
  Mic,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Illustration components ──────────────────────────────────────────────────
// Clean SVG illustrations derived from Sehat Sahara brand language.
// No external images required.

const IllustrationWelcome: React.FC = () => (
  <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[180px]">
    {/* Background circles */}
    <circle cx="130" cy="100" r="80" fill="#EBF5EF" />
    <circle cx="130" cy="100" r="55" fill="#D1EBD9" />
    {/* Heart */}
    <path d="M130 130 C100 110 85 90 85 75 C85 60 97 52 110 58 C118 61 125 68 130 75 C135 68 142 61 150 58 C163 52 175 60 175 75 C175 90 160 110 130 130Z"
      fill="#166B32" />
    {/* Stethoscope arc */}
    <path d="M105 80 Q100 110 120 120" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <circle cx="120" cy="120" r="6" fill="none" stroke="#ffffff" strokeWidth="3" />
    {/* Small dots decoration */}
    <circle cx="60" cy="55" r="5" fill="#A3D7B3" />
    <circle cx="200" cy="55" r="5" fill="#A3D7B3" />
    <circle cx="45" cy="120" r="3.5" fill="#D1EBD9" />
    <circle cx="215" cy="120" r="3.5" fill="#D1EBD9" />
    <circle cx="80" cy="165" r="4" fill="#A3D7B3" />
    <circle cx="185" cy="165" r="4" fill="#A3D7B3" />
  </svg>
);

const IllustrationAI: React.FC = () => (
  <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[180px]">
    <circle cx="130" cy="100" r="80" fill="#EBF5EF" />
    <circle cx="130" cy="100" r="55" fill="#D1EBD9" />
    {/* Phone shape */}
    <rect x="105" y="62" width="50" height="76" rx="8" fill="#166B32" />
    <rect x="109" y="70" width="42" height="52" rx="4" fill="#EBF5EF" />
    {/* Chat bubbles */}
    <rect x="112" y="74" width="26" height="8" rx="4" fill="#A3D7B3" />
    <rect x="122" y="86" width="26" height="8" rx="4" fill="#166B32" />
    <rect x="112" y="98" width="20" height="8" rx="4" fill="#A3D7B3" />
    {/* Mic circle */}
    <circle cx="130" cy="130" r="6" fill="#D1EBD9" />
    <rect x="128" y="125" width="4" height="8" rx="2" fill="#166B32" />
    {/* Pulse line */}
    <path d="M68 100 L85 100 L92 82 L100 118 L108 88 L115 108 L192 108" stroke="#166B32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="60" cy="60" r="4" fill="#A3D7B3" />
    <circle cx="200" cy="60" r="4" fill="#A3D7B3" />
  </svg>
);

const IllustrationCommunity: React.FC = () => (
  <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[180px]">
    <circle cx="130" cy="100" r="80" fill="#EBF5EF" />
    <circle cx="130" cy="100" r="55" fill="#D1EBD9" />
    {/* Three person icons */}
    <circle cx="100" cy="85" r="14" fill="#A3D7B3" />
    <path d="M76 120 Q76 104 100 104 Q124 104 124 120" fill="#A3D7B3" />
    <circle cx="130" cy="78" r="16" fill="#166B32" />
    <path d="M104 116 Q104 98 130 98 Q156 98 156 116" fill="#166B32" />
    <circle cx="160" cy="85" r="14" fill="#A3D7B3" />
    <path d="M136 120 Q136 104 160 104 Q184 104 184 120" fill="#A3D7B3" />
    {/* Heart above center */}
    <path d="M130 65 C127 61 122 60 119 63 C116 66 116 70 122 74 L130 80 L138 74 C144 70 144 66 141 63 C138 60 133 61 130 65Z" fill="#EBF5EF" />
    {/* Droplet for blood donation */}
    <circle cx="65" cy="148" r="10" fill="#FFE1E3" />
    <path d="M65 135 Q65 135 72 145 Q75 150 65 155 Q55 150 58 145 Q65 135 65 135Z" fill="#E6192B" />
    {/* Wheelchair for things sharing */}
    <circle cx="195" cy="152" r="8" fill="#D1EBD9" stroke="#166B32" strokeWidth="2" />
    <circle cx="185" cy="148" r="5" fill="none" stroke="#166B32" strokeWidth="2" />
    <path d="M185 143 L188 136 L195 136 L195 143" stroke="#166B32" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

// ─── Step definitions ─────────────────────────────────────────────────────────
interface Step {
  illustration: React.ReactNode;
  tag: string;
  title: string;
  subtitle: string;
  benefits: { icon: React.ReactNode; text: string }[];
}

const STEPS: Step[] = [
  {
    illustration: <IllustrationWelcome />,
    tag: 'Pakistan\'s Healthcare Companion',
    title: 'Your Health,\nYour Community',
    subtitle:
      'Sehat Sahara connects you to verified doctors, your health records, and a caring community — all in one place.',
    benefits: [],
  },
  {
    illustration: <IllustrationAI />,
    tag: 'AI-Powered Guidance',
    title: 'Smart Health\nAt Your Fingertips',
    subtitle: 'Describe your symptoms and get instant triage. Book consultations with PMDC-verified doctors by video or clinic visit.',
    benefits: [
      { icon: <Mic className="w-4 h-4" />,          text: 'Voice or text AI triage — always private' },
      { icon: <Stethoscope className="w-4 h-4" />,   text: 'Browse and book verified doctors nearby' },
      { icon: <FileText className="w-4 h-4" />,      text: 'Secure medical records with PIN sharing' },
    ],
  },
  {
    illustration: <IllustrationCommunity />,
    tag: 'Community & Care',
    title: 'Together We\nStay Healthier',
    subtitle: 'Track appointments, donate blood to those in urgent need, and share medical equipment with your neighbours.',
    benefits: [
      { icon: <HeartPulse className="w-4 h-4" />,   text: 'Live queue tracking for clinic appointments' },
      { icon: <Droplets className="w-4 h-4" />,     text: 'Real-time blood donation requests nearby' },
      { icon: <Layers className="w-4 h-4" />,       text: 'Borrow & lend medical equipment locally' },
    ],
  },
];

// ─── Onboarding Screen ────────────────────────────────────────────────────────
export const PatientOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const advance = () => {
    if (isLast) {
      navigate(PATIENT_ROUTES.HOME, { replace: true });
    } else {
      setStep((s) => s + 1);
    }
  };

  const skip = () => navigate(PATIENT_ROUTES.HOME, { replace: true });

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-white" style={{ minHeight: '100%' }}>

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-2">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm font-semibold text-slate-600 focus:outline-none"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div className="w-16" />
          )}
          <button
            onClick={skip}
            className="text-sm font-semibold text-slate-400 focus:outline-none"
          >
            Skip
          </button>
        </div>

        {/* ── Illustration ─────────────────────────────────────────── */}
        <div className="shrink-0 px-8 pt-4 pb-2">
          {current.illustration}
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col px-6 pt-2 pb-6">
          {/* Tag */}
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">
            {current.tag}
          </span>

          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-3" style={{ whiteSpace: 'pre-line' }}>
            {current.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-500 leading-relaxed mb-5">
            {current.subtitle}
          </p>

          {/* Benefits list */}
          {current.benefits.length > 0 && (
            <div className="space-y-3 mb-5">
              {current.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                    {b.icon}
                  </div>
                  <p className="text-sm text-slate-700 leading-snug pt-1">{b.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="transition-all duration-300 rounded-full"
                style={{
                  width:  i === step ? '20px' : '8px',
                  height: '8px',
                  backgroundColor: i === step ? '#166B32' : '#D1EBD9',
                }}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={isLast ? <Users className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={advance}
          >
            {isLast ? 'Get Started' : 'Continue'}
          </Button>

          {/* SehatSaharaLogo on first step only */}
          {step === 0 && (
            <div className="flex justify-center mt-5">
              <img
                src="/brand/sehat-sahara-logo-transparent.png"
                alt="Sehat Sahara"
                style={{ height: '28px', width: 'auto', opacity: 0.55 }}
                onError={(e) => {
                  const t = e.currentTarget;
                  if (!t.src.endsWith('.png.png')) t.src = '/brand/sehat-sahara-logo-transparent.png.png';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </MobileAppShell>
  );
};
