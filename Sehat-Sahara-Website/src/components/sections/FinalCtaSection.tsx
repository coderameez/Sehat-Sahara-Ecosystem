import React from 'react';
import { Download, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { productLinks } from '../../data/links';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-[#0B351E] via-[#072414] to-[#04140B] text-white border-t border-emerald-800/40">
      {/* Ambient background soft glow effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transforming Healthcare Delivery Across Pakistan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            A More Connected Healthcare <br className="hidden sm:inline" />
            Experience Starts Here.
          </h2>

          <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of patients, certified medical practitioners, and leading healthcare facilities advancing patient access through Sehat Sahara.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Primary Action: Pill Shaped */}
            <a
              href={productLinks.downloadApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold !text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="!text-slate-900 font-bold">Download Sehat Sahara</span>
            </a>

            {/* Secondary Action: Pill Shaped */}
            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Hospital Secondary Link: Pill Shaped */}
            <a
              href="#partner-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-medium text-emerald-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Partner as a Hospital / Clinic</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
