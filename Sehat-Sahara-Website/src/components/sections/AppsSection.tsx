import React from 'react';
import {
  Smartphone,
  Stethoscope,
  Building2,
  ArrowUpRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { productLinks } from '../../data/links';

export const AppsSection: React.FC = () => {
  const apps = [
    {
      name: 'Patient App',
      category: 'Public Access',
      description:
        'The mobile portal for citizens to discover doctors, book visits, consult bilingual AI triage, and coordinate emergency blood requests.',
      icon: Smartphone,
      status: 'Public',
      statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      ctaText: 'Open Patient App',
      url: productLinks.patientApp,
      isPrimary: true,
    },
    {
      name: 'Doctor App',
      category: 'Provider Access',
      description:
        'Professional application for clinicians to manage OPD queues, approve consultations, link hospital rosters, and discover career opportunities.',
      icon: Stethoscope,
      status: 'Public / Provider Access',
      statusColor: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800',
      ctaText: 'Open Doctor App',
      url: productLinks.doctorApp,
      isPrimary: false,
    },
    {
      name: 'Hospital / Clinic Dashboard',
      category: 'Private Institutional Access',
      description:
        'Operational console for hospitals and clinics to orchestrate doctor rosters, coordinate department appointments, and monitor facility throughput.',
      icon: Building2,
      status: 'Private Access',
      statusColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      ctaText: 'Hospital / Clinic Login',
      url: productLinks.hospitalLogin,
      isPrimary: false,
    },
  ];

  return (
    <section id="apps" className="py-20 md:py-28 bg-[#F8FAFC] dark:bg-[#071A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-emerald-400 mb-2 block">
            Digital Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Applications Built for the Health Network
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Every application within the Sehat Sahara suite is purposefully tailored for its specific operational role, sharing a synchronized data layer.
          </p>
        </div>

        {/* 3 Main Product App Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.name}
                className="p-7 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-darkbg-800 text-brand-600 dark:text-emerald-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${app.statusColor}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    {app.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {app.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-darkbg-border">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-semibold transition-all ${
                      app.isPrimary
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow'
                        : 'bg-slate-100 dark:bg-darkbg-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{app.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Dashboard: STRICTLY INTERNAL & VISUALLY SECONDARY */}
        <div className="p-5 rounded-3xl bg-slate-100/70 dark:bg-darkbg-900/60 border border-slate-200 dark:border-darkbg-border flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-darkbg-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  Sehat Sahara Central Admin
                </h4>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-darkbg-800 text-slate-600 dark:text-slate-400">
                  Internal / Authorized Only
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Restricted operational system for ecosystem moderation, facility approval, and audit logs. Not a consumer service.
              </p>
            </div>
          </div>

          <a
            href={productLinks.adminDashboard}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-darkbg-800 shrink-0 inline-flex items-center gap-1 transition-colors"
          >
            <span>Authorized Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default AppsSection;
