import React from 'react';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';

export const ScopeSection: React.FC = () => {
  const scopeAreas = [
    {
      title: 'Patient Experience',
      badge: 'Active MVP Focus',
      description:
        'Equipping citizens with localized tools to navigate Pakistan’s healthcare landscape transparently and without excessive physical travel.',
      items: [
        { name: 'Healthcare & Specialist Discovery', status: 'mvp' },
        { name: 'Direct Appointment Booking & Reminders', status: 'mvp' },
        { name: 'Conversational Urdu / English AI Triage', status: 'mvp' },
        { name: 'Community Blood Support & Emergency Aid', status: 'mvp' },
        { name: 'Digital Prescription & Record Archival', status: 'roadmap' },
      ],
    },
    {
      title: 'Doctor Experience',
      badge: 'Provider Framework',
      description:
        'Streamlining clinical practice management, verified credentials, and institutional linkages for practitioners.',
      items: [
        { name: 'Verified PMDC Professional Presence', status: 'mvp' },
        { name: 'Daily Outpatient Appointment Scheduling', status: 'mvp' },
        { name: 'Hospital & Clinic Facility Connections', status: 'mvp' },
        { name: 'Professional Practice Opportunities', status: 'mvp' },
        { name: 'Integrated Telehealth Video Linkage', status: 'roadmap' },
      ],
    },
    {
      title: 'Hospital & Clinic Operations',
      badge: 'Institutional Pillar',
      description:
        'Digitizing physical waiting lobbies, OPD token streams, and doctor duty rosters with enterprise stability.',
      items: [
        { name: 'Centralized Facility Command Console', status: 'mvp' },
        { name: 'Doctor Rosters & Specialty Assignment', status: 'mvp' },
        { name: 'Real-Time Appointment & Queue Routing', status: 'mvp' },
        { name: 'Supervised Onboarding & Access Control', status: 'mvp' },
        { name: 'Multi-Department EHR Data Integration', status: 'roadmap' },
      ],
    },
    {
      title: 'Shared Intelligence & Community',
      badge: 'Core Infrastructure',
      description:
        'Providing common AI triage and community mutual-aid pipelines that benefit all ecosystem actors uniformly.',
      items: [
        { name: 'AI Health Assistance (Non-diagnostic)', status: 'mvp' },
        { name: 'Multilingual Support: Urdu, Roman Urdu & English', status: 'mvp' },
        { name: 'Emergency Blood Donor Coordination', status: 'mvp' },
        { name: 'Verified Healthcare Facility Information', status: 'mvp' },
        { name: 'Regional Epidemic Surveillance Telemetry', status: 'roadmap' },
      ],
    },
  ];

  return (
    <section id="scope" className="py-20 md:py-28 bg-white dark:bg-darkbg-900 border-t border-slate-200/80 dark:border-darkbg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture & Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Scope of Sehat Sahara
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Sehat Sahara connects multiple parts of healthcare through one unified architecture. We distinguish clearly between what is live in our current MVP scope and upcoming feature milestones.
          </p>
        </div>

        {/* Scope Areas 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {scopeAreas.map((area) => (
            <div
              key={area.title}
              className="rounded-2xl p-7 bg-[#F8FAFC] dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {area.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-darkbg-800 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-darkbg-border">
                    {area.badge}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {area.description}
                </p>

                <div className="space-y-3">
                  {area.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-darkbg-800/80 border border-slate-200/60 dark:border-darkbg-border text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.status === 'mvp' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span
                          className={`font-medium ${
                            item.status === 'mvp'
                              ? 'text-slate-800 dark:text-slate-100'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.status === 'mvp'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-darkbg-900 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.status === 'mvp' ? 'Current MVP' : 'Planned'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MVP Clarity Callout */}
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border text-center max-w-2xl mx-auto">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong className="text-slate-800 dark:text-slate-200">Engineering Transparency:</strong> Features labeled <span className="text-emerald-600 dark:text-emerald-400 font-semibold">&apos;Current MVP&apos;</span> constitute the verified scope built for the Sehat Sahara platform demonstration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScopeSection;
