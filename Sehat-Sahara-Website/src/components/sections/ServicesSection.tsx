import React from 'react';
import {
  Search,
  CalendarCheck,
  Bot,
  Building,
  HeartHandshake,
  Briefcase,
  ShieldAlert,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Doctor Discovery',
      description:
        'Help users discover appropriate healthcare providers by specialty, verified credentials, location, and clinic consultation timings.',
      icon: Search,
      badge: 'Verified Providers',
    },
    {
      title: 'Appointment & Booking',
      description:
        'Support easier healthcare appointment journeys with instant digital slot booking, clinic token routing, and reminder alerts.',
      icon: CalendarCheck,
      badge: 'Reduced Wait Time',
    },
    {
      title: 'AI Health Assistance',
      description:
        'Provide accessible healthcare guidance and information support in Urdu, English, and Roman Urdu to help patients understand next steps.',
      icon: Bot,
      badge: 'Bilingual Triage',
    },
    {
      title: 'Hospital & Clinic Digital Services',
      description:
        'Enable participating facilities to operate through dedicated dashboards for OPD queue control, staff coordination, and scheduling.',
      icon: Building,
      badge: 'Enterprise Console',
    },
    {
      title: 'Community Healthcare Support',
      description:
        'Include community-oriented functionality such as urgent blood donor coordination, emergency ambulance directories, and public alerts.',
      icon: HeartHandshake,
      badge: 'Blood & Aid Network',
    },
    {
      title: 'Doctor Professional Opportunities',
      description:
        'Support doctors in connecting with accredited healthcare organizations, multi-clinic schedules, and professional institutional opportunities.',
      icon: Briefcase,
      badge: 'Career & Network',
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-[#F8FAFC] dark:bg-[#071A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-emerald-400 mb-2 block">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Healthcare Services Built Around Real Needs
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Designed specifically for the Pakistani healthcare landscape, addressing patient access barriers, doctor workflow bottlenecks, and hospital coordination challenges.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="rounded-2xl p-7 bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border hover:border-brand-400 dark:hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-darkbg-800 text-brand-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold font-mono text-slate-400 dark:text-slate-500">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="inline-block text-[11px] font-semibold text-brand-700 dark:text-brand-300 bg-brand-50/80 dark:bg-darkbg-800 px-2.5 py-0.5 rounded-full mb-3">
                    {service.badge}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-emerald-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Medical Safety Disclaimer Callout */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 flex items-start sm:items-center gap-3.5 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
            <span className="font-semibold">Medical Safety Disclaimer:</span> Sehat Sahara provides informational navigation, appointment logistics, and conversational triage support. AI guidance does NOT formulate medical diagnoses or replace consultations with licensed healthcare professionals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
