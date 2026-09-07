import React from 'react';
import { Logo } from '../ui/Logo';
import { productLinks } from '../../data/links';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#04140B] text-slate-200 pt-16 pb-12 border-t border-emerald-950/80 overflow-hidden">
      {/* Soft top gradient accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-950/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo variant="dark" imgClassName="h-10 w-auto" />
            </div>
            <p className="text-sm text-slate-300/90 max-w-sm leading-relaxed">
              Sehat Sahara is Pakistan&apos;s unified healthcare platform, connecting patients, doctors, and healthcare facilities through accessible digital tools and intelligent triage assistance.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Built for Pakistan&apos;s Digital Healthcare Future</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-slate-300 hover:text-white transition-colors">
                  Healthcare Services
                </a>
              </li>
              <li>
                <a href="#apps" className="text-slate-300 hover:text-white transition-colors">
                  Digital Applications
                </a>
              </li>
              <li>
                <a href="#ai" className="text-slate-300 hover:text-white transition-colors">
                  AI Assistance
                </a>
              </li>
              <li>
                <a href="#hospitals" className="text-slate-300 hover:text-white transition-colors">
                  Hospitals & Clinics
                </a>
              </li>
              <li>
                <a href="#scope" className="text-slate-300 hover:text-white transition-colors">
                  MVP Scope
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Access */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#patient-experience"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Patient Experience
                </a>
              </li>
              <li>
                <a
                  href="#doctor-experience"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Doctor Experience
                </a>
              </li>
              <li>
                <a
                  href={productLinks.hospitalLogin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Hospital / Clinic Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href={productLinks.downloadApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Download Mobile App</span>
                </a>
              </li>
              <li>
                <a href="#partner-form" className="text-slate-300 hover:text-white transition-colors">
                  Facility Onboarding
                </a>
              </li>
            </ul>
          </div>

          {/* About & Support */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">
              Organization
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="text-slate-300 hover:text-white transition-colors">
                  Why Sehat Sahara
                </a>
              </li>
              <li>
                <a href="#coverage" className="text-slate-300 hover:text-white transition-colors">
                  Prototype Locations
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-300 hover:text-white transition-colors">
                  Get in Touch
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} Sehat Sahara. All rights reserved.
          </p>
          <p className="text-center sm:text-right max-w-lg text-[11px] text-slate-400/90">
            Sehat Sahara is an integrated digital healthcare prototype initiative for Pakistan. AI guidance supports triage information and does not replace certified professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
