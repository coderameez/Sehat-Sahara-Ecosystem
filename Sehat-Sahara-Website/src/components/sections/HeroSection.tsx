import React from 'react';
import { ArrowRight, Download, LogIn, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { productLinks } from '../../data/links';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white dark:from-[#0A2415] dark:via-[#071A10] dark:to-[#071A10]"
    >
      {/* Background soft ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* National Healthcare Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-darkbg-card border border-brand-200/80 dark:border-darkbg-border shadow-xs text-xs font-semibold text-brand-700 dark:text-brand-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Digital Healthcare Infrastructure for Pakistan</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Healthcare, Connected <br className="hidden sm:inline" />
              <span className="text-brand-600 dark:text-emerald-400">for Everyone.</span>
            </h1>

            {/* Supporting Message */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Sehat Sahara brings patients, doctors, and healthcare facilities together through accessible digital healthcare tools, intelligent assistance, and connected services across Pakistan.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href={productLinks.downloadApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-md hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Sehat Sahara</span>
              </a>

              <a
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-darkbg-card hover:bg-slate-50 dark:hover:bg-darkbg-800 border border-slate-200 dark:border-darkbg-border transition-all"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex w-full sm:w-auto justify-center sm:justify-start gap-3 mt-2 sm:mt-0">
                <a
                  href={productLinks.hospitalLogin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-medium text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-white bg-brand-50/70 dark:bg-darkbg-card border border-brand-200/60 dark:border-darkbg-border hover:bg-brand-100/60 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Hospital / Clinic Login</span>
                </a>

                <a
                  href={productLinks.adminDashboard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100/60 dark:bg-darkbg-card border border-slate-200/60 dark:border-darkbg-border transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Login as Admin</span>
                </a>
              </div>
            </div>

            {/* Trust Micro-Badges */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-darkbg-border flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified PMDC Practitioners</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Controlled Hospital Onboarding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Multilingual AI Triage Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mobile Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-12 lg:mt-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] py-6 flex justify-center">
              {/* Primary Mobile Mockup (Home App) */}
              <div className="relative z-20 w-[85%] sm:w-full transform transition-transform hover:-translate-y-1">
                <img 
                  src="/screenshots/16.png" 
                  alt="Sehat Sahara Home Screen" 
                  className="w-full h-auto drop-shadow-2xl rounded-[2.5rem] sm:rounded-[3rem]"
                />
              </div>

              {/* Offset Secondary Mobile Mockup (My Files) */}
              <div className="absolute -right-12 sm:-right-16 top-1/4 z-10 w-[65%] sm:w-[75%] opacity-90 hover:opacity-100 transition-all hover:z-30 transform rotate-6 hover:rotate-0">
                <img 
                  src="/screenshots/29.png" 
                  alt="Sehat Sahara My Files Screen" 
                  className="w-full h-auto drop-shadow-xl rounded-[2rem] sm:rounded-[2.5rem]"
                />
              </div>

              {/* Ambient Floating Micro-badge */}
              <div className="absolute -bottom-4 -left-6 z-30 hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-darkbg-card border border-slate-200/90 dark:border-darkbg-border shadow-xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">AI Health Triage</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">English • اردو • Roman Urdu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
