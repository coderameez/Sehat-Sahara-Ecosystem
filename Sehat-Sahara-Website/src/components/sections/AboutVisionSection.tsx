import React from 'react';
import { Target, Users, HeartHandshake, ShieldCheck } from 'lucide-react';

export const AboutVisionSection: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Bridging Fragmented Journeys',
      desc: 'In Pakistan, patients frequently endure hours navigating uncoordinated clinics, while doctors handle manual waitlists. We replace fragmented steps with connected digital workflows.',
    },
    {
      icon: Users,
      title: 'Human-Centered Accessibility',
      desc: 'Digital healthcare must serve everyone—not just the tech-savvy. With Urdu audio readiness and intuitive interfaces, Sehat Sahara ensures no family is left behind.',
    },
    {
      icon: HeartHandshake,
      title: 'Community Mutual-Aid',
      desc: 'Healthcare extends beyond hospital corridors into neighborhoods. Our emergency blood coordination enables citizens to support one another in critical moments.',
    },
    {
      icon: ShieldCheck,
      title: 'Trust & Legitimacy',
      desc: 'By validating PMDC credentials for physicians and verifying hospital partnerships, we protect patient safety and maintain clinical integrity.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#F8FAFC] dark:bg-[#071A10] border-t border-slate-200/80 dark:border-darkbg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-emerald-400 mb-2 block">
            Our Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Sehat Sahara Exists
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Making healthcare more accessible, connected, and understandable for Pakistan.
          </p>
        </div>

        {/* Story Narrative Box */}
        <div className="max-w-4xl mx-auto mb-16 p-8 sm:p-10 rounded-3xl bg-white dark:bg-darkbg-card border border-slate-200/90 dark:border-darkbg-border shadow-xs">
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
            Healthcare experiences across Pakistan can be deeply fragmented. Patients face uncertain wait times and confusing medical terms. Dedicated doctors struggle with chaotic queues, and hospital administrators lack real-time visibility into daily patient flow.
          </p>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Sehat Sahara was conceived to bring these journeys together. By pairing dependable appointment management and verified practitioner profiles with practical, multilingual AI triage, we create a healthcare environment rooted in transparency, mutual support, and dignity for every citizen.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-darkbg-800 text-brand-700 dark:text-brand-300 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutVisionSection;
