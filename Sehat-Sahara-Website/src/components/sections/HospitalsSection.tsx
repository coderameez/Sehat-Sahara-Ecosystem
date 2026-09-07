import React from 'react';
import {
  Building2,
  CheckCircle,
  FileText,
  PhoneCall,
  Sliders,
  KeyRound,
  Lock,
} from 'lucide-react';
import { DashboardMockup } from '../ui/DashboardMockup';

export const HospitalsSection: React.FC = () => {
  const benefits = [
    'Dedicated, isolated facility management dashboard',
    'Comprehensive doctor schedule and duty roster control',
    'Streamlined patient appointment and OPD queue workflows',
    'Real-time operational visibility and throughput telemetry',
    'Custom facility-specific department configuration',
    'Direct integration with the nationwide Sehat Sahara patient network',
  ];

  const onboardingSteps = [
    {
      num: '01',
      title: 'Submit Request',
      desc: 'Hospital or clinic submits an onboarding verification request through our secure form.',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Team Contact',
      desc: 'The dedicated Sehat Sahara operations team contacts organization administrators.',
      icon: PhoneCall,
    },
    {
      num: '03',
      title: 'Requirements Review',
      desc: 'Facility requirements, department setups, and doctor licensing quotas are validated.',
      icon: Sliders,
    },
    {
      num: '04',
      title: 'Dashboard Setup',
      desc: 'The custom facility tenant is configured with tailored specialties and access tiers.',
      icon: Building2,
    },
    {
      num: '05',
      title: 'Credentials Issued',
      desc: 'Authorized, cryptographically secured administrative login credentials are provided.',
      icon: KeyRound,
    },
  ];

  return (
    <section
      id="hospitals"
      className="py-20 md:py-28 bg-white dark:bg-darkbg-900 border-t border-slate-200/80 dark:border-darkbg-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-darkbg-card border border-brand-200/80 dark:border-darkbg-border text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Institutional Healthcare Operations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bring Your Hospital or Clinic Into the Sehat Sahara Network
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Hospitals and clinics do <span className="font-semibold text-slate-900 dark:text-white">not</span> self-register publicly. To ensure clinical compliance and institutional legitimacy, facility onboarding is individually reviewed and controlled by the Sehat Sahara team.
          </p>
        </div>

        {/* Desktop Dashboard Preview */}
        <div className="mb-20">
          <div className="text-center mb-4">
            <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-darkbg-800 text-slate-600 dark:text-slate-400">
              Hospital Dashboard Preview
            </span>
          </div>
          <DashboardMockup />
        </div>

        {/* Benefits Grid */}
        <div className="mb-20 bg-[#F8FAFC] dark:bg-darkbg-card p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-darkbg-border">
          <div className="max-w-3xl mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Operational Advantages for Participating Facilities
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Digitize everyday patient flow, eliminate chaotic paper rosters, and reduce lobby overcrowding with synchronized queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Controlled 5-Step Onboarding Process */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              <Lock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Verified Governance Flow</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Controlled Onboarding Process
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              A 5-step regulated procedure to ensure patient privacy and institutional credibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {onboardingSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-5 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-mono font-extrabold text-brand-600 dark:text-emerald-400">
                        {step.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-darkbg-800 text-brand-700 dark:text-brand-300 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {step.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {idx < onboardingSteps.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-slate-200 dark:bg-darkbg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalsSection;
