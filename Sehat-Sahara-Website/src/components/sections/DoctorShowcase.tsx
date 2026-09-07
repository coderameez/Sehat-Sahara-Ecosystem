import React from 'react';
import {
  UserCheck,
  CalendarDays,
  Building,
  Briefcase,
  Sliders,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { DeviceMockup } from '../ui/DeviceMockup';
import { productLinks } from '../../data/links';

export const DoctorShowcase: React.FC = () => {
  const doctorFeatures = [
    {
      icon: UserCheck,
      title: 'PMDC-Verified Profile',
      desc: 'Showcase qualifications, certifications, clinic hours, and verified specialties to prospective patients.',
    },
    {
      icon: CalendarDays,
      title: 'Appointment Management',
      desc: 'Approve, reschedule, or manage consultation slots with real-time patient status sync.',
    },
    {
      icon: Building,
      title: 'Multi-Facility Association',
      desc: 'Seamlessly link multiple clinic and hospital consultation rosters from one single dashboard.',
    },
    {
      icon: Briefcase,
      title: 'Professional Opportunities',
      desc: 'Access verified institutional openings, hospital panel invitations, and academic collaborative boards.',
    },
    {
      icon: Sliders,
      title: 'Consultation Workflow',
      desc: 'Review pre-consultation patient intake summaries and preliminary triage notes before visit onset.',
    },
    {
      icon: ShieldCheck,
      title: 'Protected Communication',
      desc: 'Maintain safe, ethical, and structured communication channels without disclosing personal phone numbers.',
    },
  ];

  return (
    <section
      id="doctor-experience"
      className="py-20 md:py-28 bg-[#F8FAFC] dark:bg-[#071A10] border-t border-slate-200/80 dark:border-darkbg-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800 text-xs font-bold text-brand-800 dark:text-brand-300 uppercase tracking-wider mb-3">
            Doctor Experience
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Modern Healthcare Professionals
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Empowering Pakistani clinicians and specialists with digital efficiency, verified identity prestige, and structured appointment operations across private practice and hospital affiliations.
          </p>
        </div>

        {/* 3 Mobile Screenshot Mockups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16 items-center justify-center">
          {/* Screenshot 01: Doctor Profile & Credentials */}
          <div className="flex flex-col items-center">
            <DeviceMockup
              imageSrc="/screenshots/17.png"
              alt="Sehat Sahara Doctor Profile Screen"
              title="Doctor Screenshot 01"
              subtitle="Verified PMDC profile and consultation credentials."
              badge="Doctor Profile"
            />
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Professional Profile</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified credentials & clinic timings</p>
            </div>
          </div>

          {/* Screenshot 02: Appointment & Patient Queue */}
          <div className="flex flex-col items-center transform md:-translate-y-4">
            <DeviceMockup
              imageSrc="/screenshots/doctor-appointments.png"
              alt="Sehat Sahara Doctor Appointments and Queue Management"
              title="Doctor Screenshot 02"
              subtitle="Daily consultation schedule and patient queue."
              badge="Appointment Console"
            />
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Consultation Queue</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time schedule & patient flow</p>
            </div>
          </div>

          {/* Screenshot 03: Opportunities & Hospital Panels */}
          <div className="flex flex-col items-center">
            <DeviceMockup
              imageSrc="/screenshots/doctor-opportunities.png"
              alt="Sehat Sahara Doctor Opportunities and Shifts"
              title="Doctor Screenshot 03"
              subtitle="Hospital affiliation and professional opportunity board."
              badge="Hospital Network"
            />
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Network Connections</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hospital panels and career openings</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-200/80 dark:border-darkbg-border">
          {doctorFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-200/60 dark:border-darkbg-border shadow-xs hover:border-brand-400 dark:hover:border-emerald-500/60 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-darkbg-800 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Doctor Portal Action */}
        <div className="mt-12 text-center">
          <a
            href={productLinks.doctorApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-darkbg-card hover:bg-slate-50 dark:hover:bg-darkbg-800 border border-slate-300 dark:border-darkbg-border shadow-sm hover:shadow transition-all"
          >
            <span>Launch Doctor Portal</span>
            <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DoctorShowcase;
