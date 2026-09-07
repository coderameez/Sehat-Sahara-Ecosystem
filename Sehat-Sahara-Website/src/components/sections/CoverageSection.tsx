import React from 'react';
import { MapPin, Info } from 'lucide-react';

export const CoverageSection: React.FC = () => {
  const locations = [
    {
      city: 'Karachi',
      province: 'Sindh',
      focus: 'Tertiary hospitals, emergency networks, and high-density OPD clinics',
      status: 'Active Prototype Hub',
    },
    {
      city: 'Lahore',
      province: 'Punjab',
      focus: 'Specialist medical centers and community blood donation initiatives',
      status: 'Active Prototype Hub',
    },
    {
      city: 'Islamabad',
      province: 'Federal Capital',
      focus: 'Institutional hospital pilots and digital triage integration',
      status: 'Active Prototype Hub',
    },
    {
      city: 'Rawalpindi',
      province: 'Punjab',
      focus: 'Twin-city clinical corridors and polyclinic queue coordination',
      status: 'Active Prototype Hub',
    },
  ];

  return (
    <section id="coverage" className="py-16 md:py-20 bg-white dark:bg-darkbg-900 border-t border-slate-200/80 dark:border-darkbg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 dark:text-emerald-400 mb-2 block">
            Regional Framework
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Prototype Service Locations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Initial architectural testing and facility simulation benchmarks across major metropolitan healthcare zones.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {locations.map((loc) => (
            <div
              key={loc.city}
              className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-darkbg-800 text-brand-600 dark:text-emerald-400 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {loc.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {loc.city}
                </h3>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">
                  {loc.province}
                </span>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {loc.focus}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Required Prototype Disclaimer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-center">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Locations shown are for prototype/demo presentation purposes.</span>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
