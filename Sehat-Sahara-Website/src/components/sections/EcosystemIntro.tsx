import React from 'react';
import { User, Stethoscope, Building2, ArrowUpRight } from 'lucide-react';

export const EcosystemIntro: React.FC = () => {
  const audiences = [
    {
      title: 'Patients',
      subtitle: 'Accessible Care For Every Citizen',
      description: 'Find and access healthcare more easily. Discover nearby doctors, schedule consultations, request emergency blood support, and receive bilingual AI triage assistance.',
      icon: User,
      link: '#patient-experience',
      linkText: 'Explore Patient App',
      tag: 'Public Access',
      accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      accentText: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      title: 'Doctors',
      subtitle: 'Modern Healthcare Professionals',
      description: 'Connect with patients, facilities and professional opportunities. Streamline outpatient schedules, review clinical intakes, and link with accredited healthcare networks.',
      icon: Stethoscope,
      link: '#doctor-experience',
      linkText: 'Explore Doctor App',
      tag: 'Provider Access',
      accentBg: 'bg-brand-50 dark:bg-brand-950/40',
      accentText: 'text-brand-700 dark:text-brand-300',
    },
    {
      title: 'Hospitals & Clinics',
      subtitle: 'Controlled Facility Operations',
      description: 'Manage digital healthcare operations through dedicated tools. Optimize OPD queues, coordinate affiliated doctors, and streamline patient arrivals with centralized control.',
      icon: Building2,
      link: '#hospitals',
      linkText: 'Facility Solutions',
      tag: 'Institutional Access',
      accentBg: 'bg-teal-50 dark:bg-teal-950/40',
      accentText: 'text-teal-700 dark:text-teal-300',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-darkbg-900 border-y border-slate-200/80 dark:border-darkbg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-brand-400 mb-2 block">
            Integrated Network
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            One Healthcare Ecosystem. <br className="hidden sm:inline" />
            Built Around People.
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Sehat Sahara bridges the digital divide in Pakistan&apos;s healthcare infrastructure by uniting key stakeholders under a cohesive, secure, and user-friendly platform.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <div
                key={audience.title}
                className="group relative rounded-2xl p-6 sm:p-7 bg-[#F8FAFC] dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${audience.accentBg} ${audience.accentText}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-darkbg-800 text-slate-700 dark:text-slate-300">
                      {audience.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {audience.title}
                  </h3>
                  <div className="text-xs font-semibold text-brand-700 dark:text-brand-400 mb-3">
                    {audience.subtitle}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {audience.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/70 dark:border-darkbg-border">
                  <a
                    href={audience.link}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-300 group-hover:text-brand-800 dark:group-hover:text-white transition-colors"
                  >
                    <span>{audience.linkText}</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EcosystemIntro;
