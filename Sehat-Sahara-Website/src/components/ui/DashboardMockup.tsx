import React, { useState } from 'react';
import {
  Activity,
  Users,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface DashboardMockupProps {
  imageSrc?: string;
  className?: string;
}

export const DashboardMockup: React.FC<DashboardMockupProps> = ({
  imageSrc = '/screenshots/hospital-dashboard.png',
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-darkbg-border bg-white dark:bg-darkbg-800 transition-all duration-300 ${className}`}
    >
      {/* Top Window Chrome */}
      <div className="bg-slate-100 dark:bg-darkbg-900 px-4 py-3 border-b border-slate-200 dark:border-darkbg-border flex items-center justify-between gap-4">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-400 dark:bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-400 dark:bg-emerald-500/80" />
        </div>

        {/* Address bar simulator */}
        <div className="flex-1 max-w-md mx-auto hidden sm:flex items-center justify-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-darkbg-800 border border-slate-200 dark:border-darkbg-border text-xs text-slate-500 dark:text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span>hospital.sehatsahara.pk/dashboard</span>
        </div>

        {/* Status tag */}
        <div className="flex items-center gap-1.5 text-xs text-brand-700 dark:text-brand-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Operational Console</span>
        </div>
      </div>

      {/* Main Body: Real image if available, else rich healthcare product UI */}
      <div className={`relative w-full bg-slate-50 dark:bg-darkbg-800 overflow-hidden ${!imageLoaded || imageError ? 'min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]' : ''}`}>
        {!imageError && (
          <img
            src={imageSrc}
            alt="Hospital Dashboard Preview"
            className={`w-full h-auto block object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 hidden'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Polished Hospital Operations Interface Simulation */}
        {(!imageLoaded || imageError) && (
          <div className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
            {/* Top Dashboard bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-darkbg-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Jinnah General Hospital — Central Command
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Department of Outpatient & Emergency Coordination
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Healthcare Facility
                </span>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Doctors</span>
                  <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">34</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> In-duty across 8 departments
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Today Appointments</span>
                  <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">128</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  92 Completed • 36 Scheduled
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Digital Triage Inflow</span>
                  <Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">52</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  Assisted via Sehat AI
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-darkbg-card border border-slate-200/80 dark:border-darkbg-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Queue Wait Time</span>
                  <Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">14 min</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  -28% vs standard walk-in
                </div>
              </div>
            </div>

            {/* Workflow Table preview */}
            <div className="rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card overflow-hidden">
              <div className="px-4 py-3 bg-slate-50/70 dark:bg-darkbg-900/60 border-b border-slate-200 dark:border-darkbg-border flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Recent Appointment Requests & Clinic Routing</span>
                <span className="text-slate-400 dark:text-slate-500 font-normal">Real-time sync</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-darkbg-border text-xs">
                <div className="p-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-darkbg-800/50">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">OPD Consultation #3842</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500 dark:text-slate-400">Cardiology — Dr. Tariq Mansoor</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium">
                    Confirmed
                  </span>
                </div>
                <div className="p-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-darkbg-800/50">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Triage Intake #3841</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500 dark:text-slate-400">General Medicine — Urgent care review</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-medium">
                    In Review
                  </span>
                </div>
              </div>
            </div>

            {/* Replaceable Notice Banner */}
            <div className="p-3 rounded-lg bg-brand-50/80 dark:bg-brand-900/30 border border-brand-200/80 dark:border-brand-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-medium text-brand-800 dark:text-brand-200">
                Hospital Dashboard Preview Container
              </span>
              <code className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-darkbg-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Replace with image: {imageSrc}
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMockup;
