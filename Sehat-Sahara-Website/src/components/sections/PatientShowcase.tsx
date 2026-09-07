import React from 'react';
import {
  Search,
  Calendar,
  Sparkles,
  Droplet,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { DeviceMockup } from '../ui/DeviceMockup';
import { productLinks } from '../../data/links';

export const PatientShowcase: React.FC = () => {
  const patientFeatures = [
    {
      icon: Search,
      title: 'Discover Trusted Doctors',
      desc: 'Find verified specialists by clinic vicinity, hospital affiliation, and consultation fees.',
    },
    {
      icon: Calendar,
      title: 'Seamless Digital Booking',
      desc: 'Select preferred time slots, avoid lengthy clinic queues, and receive timely visit reminders.',
    },
    {
      icon: Sparkles,
      title: 'AI Health Triage Assistance',
      desc: 'Describe symptoms in conversational Urdu or English to understand urgency and suitable next steps.',
    },
    {
      icon: Droplet,
      title: 'Emergency Blood Support',
      desc: 'Submit or respond to urgent blood donor calls across regional hospital networks.',
    },
    {
      icon: FileText,
      title: 'Unified Health Records',
      desc: 'Safely preserve digital prescriptions, diagnostic summaries, and physician notes in one place.',
    },
    {
      icon: Clock,
      title: 'Live OPD Queue Tracking',
      desc: 'Monitor real-time token progression and arrive right before your scheduled consultation.',
    },
  ];

  return (
    <section
      id="patient-experience"
      className="py-20 md:py-28 bg-white dark:bg-darkbg-900 border-t border-slate-200/80 dark:border-darkbg-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-3">
            Patient Experience
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Healthcare Support in Your Pocket
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The Sehat Sahara Patient App puts essential healthcare access right where it belongs: accessible on any smartphone, intuitive for all generations, and localized for Pakistan.
          </p>
        </div>

        {/* 3 Mobile Screenshot Mockups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mb-16 items-center justify-center">
          {/* Screenshot 01: Doctor Discovery & Appointments */}
          <div className="flex flex-col items-center">
            <DeviceMockup
              imageSrc="/screenshots/21.png"
              alt="Sehat Sahara Patient Home & Doctor Search"
              title="Patient Screenshot 01"
              subtitle="Specialist discovery and appointment scheduling screen."
              badge="Patient Discovery"
            />
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Doctor Discovery</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Location-aware provider catalog</p>
            </div>
          </div>

          {/* Screenshot 02: AI Conversational Triage */}
          <div className="flex flex-col items-center transform md:-translate-y-4">
            <DeviceMockup
              imageSrc="/screenshots/16.png"
              alt="Sehat Sahara AI Health Assistant"
              title="Patient Screenshot 02"
              subtitle="Urdu/English conversational health triage screen."
              badge="AI Health Guidance"
            />
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Conversational Triage</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Bilingual intelligent guidance</p>
            </div>
          </div>

          {/* Screenshot 03: Community Blood & Emergency */}
          <div className="flex flex-col items-center">
            <DeviceMockup
              imageSrc="/screenshots/20.png"
              alt="Sehat Sahara Community & Blood Network"
              title="Patient Screenshot 03"
              subtitle="Urgent blood request and donor network view."
              badge="Community Network"
            />
            <div className="mt-4 text-center">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Community Blood Aid</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Rapid donor broadcast system</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-200/80 dark:border-darkbg-border">
          {patientFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-darkbg-card border border-slate-200/60 dark:border-darkbg-border hover:bg-white dark:hover:bg-darkbg-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-100/70 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
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

        {/* App Action bar */}
        <div className="mt-12 text-center">
          <a
            href={productLinks.patientApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Open Patient Web App</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PatientShowcase;
