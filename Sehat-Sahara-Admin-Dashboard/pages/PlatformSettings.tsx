import React, { useState, useEffect } from 'react';
import {
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Bell,
  FlaskConical,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Clock,
  Check,
  X,
  Minus,
  Plus,
} from 'lucide-react';
import {
  platformSettingsStore,
  PlatformSettingsState,
  ServiceMode,
} from '../data/platformSettingsMockData';

export const PlatformSettings: React.FC = () => {
  // Local state initialized from store
  const [formState, setFormState] = useState<PlatformSettingsState>(() =>
    platformSettingsStore.getSettings()
  );

  // Subscribe to external store changes
  useEffect(() => {
    const unsub = platformSettingsStore.subscribe(() => {
      setFormState(platformSettingsStore.getSettings());
    });
    return unsub;
  }, []);

  // Save feedback notification
  const [savedToast, setSavedToast] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Handle updates to local form state
  const handleGeneralChange = <K extends keyof PlatformSettingsState>(
    key: K,
    value: PlatformSettingsState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleFacilityTypeToggle = (
    key: keyof PlatformSettingsState['allowedFacilityTypes']
  ) => {
    setFormState((prev) => ({
      ...prev,
      allowedFacilityTypes: {
        ...prev.allowedFacilityTypes,
        [key]: !prev.allowedFacilityTypes[key],
      },
    }));
  };

  const handleNotificationToggle = (
    key: keyof PlatformSettingsState['notifications']
  ) => {
    setFormState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleSave = () => {
    platformSettingsStore.saveSettings(formState);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 4000);
  };

  const handleReset = () => {
    platformSettingsStore.resetToDefaults();
    setFormState(platformSettingsStore.getSettings());
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">

      {/* ─── Save Confirmation Toast ─────────────────────────────────── */}
      {savedToast && (
        <div className="fixed bottom-5 right-5 z-[110] flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[13px] font-semibold">
            Platform settings saved successfully.
          </span>
          <button
            onClick={() => setSavedToast(false)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Breadcrumb & Top Header (Matching PDF Page 13) ─────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mb-1">
            <span>Settings</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-800 font-semibold">A-09 Platform Settings</span>
          </div>
          <h1 className="text-[20px] font-bold text-slate-900 leading-tight">
            Platform Settings
          </h1>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5">
            Configure core platform policies, verification rules, community safety, notifications and demo mode.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500 bg-white border border-surface-border px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last updated: {formState.lastUpdated}</span>
        </div>
      </div>

      {/* ─── 6-Card Settings Grid (Matching PDF Page 13) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* ── 1. General ──────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-surface-border shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-brand-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900">General</h2>
          </div>

          <div className="space-y-3.5 text-[12.5px]">
            {/* Platform Timezone */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Platform Timezone
              </label>
              <select
                value={formState.platformTimezone}
                onChange={(e) => handleGeneralChange('platformTimezone', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
              >
                <option value="(GMT+05:00) Asia/Karachi">(GMT+05:00) Asia/Karachi</option>
                <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                <option value="(GMT+04:00) Asia/Dubai">(GMT+04:00) Asia/Dubai</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Date Format
              </label>
              <select
                value={formState.dateFormat}
                onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
              >
                <option value="May 20, 2025 (MMM DD, YYYY)">May 20, 2025 (MMM DD, YYYY)</option>
                <option value="20/05/2025 (DD/MM/YYYY)">20/05/2025 (DD/MM/YYYY)</option>
                <option value="2025-05-20 (YYYY-MM-DD)">2025-05-20 (YYYY-MM-DD)</option>
              </select>
            </div>

            {/* Default Language */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Default Language
              </label>
              <select
                value={formState.defaultLanguage}
                onChange={(e) => handleGeneralChange('defaultLanguage', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu (اردو)</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Items Per Page (Admin)
              </label>
              <select
                value={formState.itemsPerPageAdmin}
                onChange={(e) => handleGeneralChange('itemsPerPageAdmin', Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── 2. Verification Rules ───────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-surface-border shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-brand-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900">Verification Rules</h2>
          </div>

          <div className="space-y-4 text-[12.5px]">
            {/* Doctor Verification SLA */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Doctor Verification SLA
                  <span title="Doctors not verified within SLA will be auto-escalated." className="cursor-help text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </span>
                <span className="text-[11.5px] text-slate-500 font-medium">Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="12"
                  max="168"
                  value={formState.doctorVerificationSlaHours}
                  onChange={(e) => handleGeneralChange('doctorVerificationSlaHours', Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg border border-surface-border bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
                <span className="text-slate-500 font-medium shrink-0">Hours</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Doctors not verified within SLA will be auto-escalated.
              </p>
            </div>

            {/* OCR / AI Assist Toggle */}
            <div className="pt-2 border-t border-surface-border/60">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    OCR / AI Assist
                    <span title="AI will assist in document reading and data extraction." className="cursor-help text-slate-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    AI will assist in document reading and data extraction.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleGeneralChange('ocrAiAssistEnabled', !formState.ocrAiAssistEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    formState.ocrAiAssistEnabled ? 'bg-brand-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      formState.ocrAiAssistEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Human Decision Mandatory Callout */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-[12px] text-emerald-950 block">
                  Human Decision Mandatory
                </span>
                <p className="text-[11px] text-emerald-800 leading-snug mt-0.5">
                  All verifications are reviewed and approved by our team. AI assists with OCR and mismatch flags only.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Community Safety ─────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-surface-border shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-brand-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900">Community Safety</h2>
          </div>

          <div className="space-y-3 text-[12.5px]">
            {/* Blood Requests - Expiry */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                Blood Requests – Expiry (Days)
                <span title="Days after which open blood appeals auto-expire." className="cursor-help text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </span>
              <input
                type="number"
                min="1"
                max="90"
                value={formState.bloodRequestsExpiryDays}
                onChange={(e) => handleGeneralChange('bloodRequestsExpiryDays', Number(e.target.value))}
                className="w-16 h-8 text-center rounded-lg border border-surface-border bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
            </div>

            {/* Things Requests - Expiry */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                Things Requests – Expiry (Days)
                <span title="Days after which borrow requests auto-expire." className="cursor-help text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </span>
              <input
                type="number"
                min="1"
                max="180"
                value={formState.thingsRequestsExpiryDays}
                onChange={(e) => handleGeneralChange('thingsRequestsExpiryDays', Number(e.target.value))}
                className="w-16 h-8 text-center rounded-lg border border-surface-border bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
            </div>

            {/* Auto Close Inactive Requests */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                Auto Close Inactive Requests (Days)
                <span title="Automatic archive threshold for inactive records." className="cursor-help text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </span>
              <input
                type="number"
                min="30"
                max="365"
                value={formState.autoCloseInactiveDays}
                onChange={(e) => handleGeneralChange('autoCloseInactiveDays', Number(e.target.value))}
                className="w-16 h-8 text-center rounded-lg border border-surface-border bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
            </div>

            {/* Report Review Threshold */}
            <div className="space-y-1 pt-2 border-t border-surface-border/60">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Report Review Threshold
                  <span title="Severity threshold required to escalate to the queue." className="cursor-help text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </span>
                <select
                  value={formState.reportReviewThreshold}
                  onChange={(e) => handleGeneralChange('reportReviewThreshold', e.target.value as 'Low' | 'Medium' | 'High')}
                  className="h-8 px-2.5 rounded-lg border border-surface-border bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400">
                Reports meeting or exceeding this threshold will be reviewed.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. Allowed Hospital Facility Types ──────────────────────── */}
        <section className="bg-white rounded-xl border border-surface-border shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-brand-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900">
              Allowed Hospital Facility Types
            </h2>
          </div>

          <div className="space-y-2.5 text-[12.5px]">
            <p className="text-[11.5px] text-slate-500 font-medium">
              Select facility types that can be registered on the platform:
            </p>

            <div className="space-y-2 pt-1">
              {[
                { key: 'hospital', label: 'Hospital' },
                { key: 'clinic', label: 'Clinic' },
                { key: 'diagnosticCenter', label: 'Diagnostic Center' },
                { key: 'laboratory', label: 'Laboratory' },
                { key: 'bloodBank', label: 'Blood Bank' },
                { key: 'rehabilitationCenter', label: 'Rehabilitation Center' },
              ].map(({ key, label }) => {
                const isChecked = formState.allowedFacilityTypes[key as keyof PlatformSettingsState['allowedFacilityTypes']];
                return (
                  <label
                    key={key}
                    onClick={() => handleFacilityTypeToggle(key as keyof PlatformSettingsState['allowedFacilityTypes'])}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer select-none"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isChecked
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="font-semibold text-slate-700 text-[13px]">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. Notifications ────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-surface-border shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-brand-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900">Notifications</h2>
          </div>

          <div className="space-y-3 text-[12.5px]">
            {[
              {
                key: 'newDoctorRegistration',
                label: 'New Doctor Registration',
                hint: 'Notify when a new provider registers.',
              },
              {
                key: 'doctorVerificationUpdates',
                label: 'Doctor Verification Updates',
                hint: 'Alerts on SLA escalation and review completions.',
              },
              {
                key: 'bloodThingsRequests',
                label: 'Blood / Things Requests',
                hint: 'Alerts on urgent SOS appeals and item exchanges.',
              },
              {
                key: 'communityReports',
                label: 'Community Reports',
                hint: 'Real-time alert when new content is flagged.',
              },
              {
                key: 'systemAnnouncements',
                label: 'System Announcements',
                hint: 'Platform maintenance notices and scheduled events.',
              },
            ].map(({ key, label, hint }) => {
              const isEnabled = formState.notifications[key as keyof PlatformSettingsState['notifications']];
              return (
                <div key={key} className="flex items-center justify-between py-1">
                  <div className="space-y-0.5 pr-2">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      {label}
                      <span title={hint} className="cursor-help text-slate-400">
                        <HelpCircle className="w-3 h-3" />
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNotificationToggle(key as keyof PlatformSettingsState['notifications'])}
                    className={`w-10 h-5.5 rounded-full transition-colors relative shrink-0 ${
                      isEnabled ? 'bg-brand-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform transform ${
                        isEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 6. Demo Mode ────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-surface-border shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-border/80 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-brand-700 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h2 className="text-[14px] font-bold text-slate-900">Demo Mode</h2>
          </div>

          <div className="space-y-4 text-[12.5px]">
            {/* Service Mode Segmented Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Service Mode
                  <span title="Static seed data, automated demo scenarios, or live API." className="cursor-help text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-surface-page p-1 rounded-lg border border-surface-border">
                {(['STATIC', 'DEMO', 'API'] as ServiceMode[]).map((mode) => {
                  const isActive = formState.serviceMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleGeneralChange('serviceMode', mode)}
                      className={`py-1.5 rounded-md text-[11.5px] font-bold transition-colors ${
                        isActive
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Banner */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-[12px] text-amber-900">
              <span className="font-bold block">
                {formState.serviceMode} mode is active.
              </span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {formState.serviceMode === 'DEMO'
                  ? 'Automated responses will be used for demo operations.'
                  : formState.serviceMode === 'STATIC'
                  ? 'Local deterministic seed data without simulated transitions.'
                  : 'Real backend implementation through service interface.'}
              </p>
            </div>

            {/* Seeded Delay */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  Seeded Delay (Seconds)
                  <span title="Synthetic delay for simulated background tasks." className="cursor-help text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleGeneralChange(
                      'seededDelaySeconds',
                      Math.max(1, formState.seededDelaySeconds - 1)
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-surface-border bg-surface-page flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-12 text-center text-[15px] font-bold text-slate-900 font-mono">
                  {formState.seededDelaySeconds}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleGeneralChange(
                      'seededDelaySeconds',
                      Math.min(10, formState.seededDelaySeconds + 1)
                    )
                  }
                  className="w-8 h-8 rounded-lg border border-surface-border bg-surface-page flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ─── Bottom Actions & Audit Strip (Matching PDF Page 13) ──────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          {/* Save Changes Button (Lime green) */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Changes</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-slate-600 bg-white border border-surface-border hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Audit Note */}
        <div className="flex items-center gap-2 text-[11.5px] text-slate-500 bg-white border border-surface-border px-3.5 py-2 rounded-xl shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            All changes are logged for audit purposes. Last saved by{' '}
            <strong className="text-slate-700">{formState.lastSavedBy}</strong> on{' '}
            {formState.lastUpdated}
          </span>
        </div>
      </div>

      {/* ─── Reset Confirmation Modal ───────────────────────────────── */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-[400px] w-full p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">
                  Reset Platform Settings?
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  This will restore all configuration options back to default baseline values.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-[13px] font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PlatformSettings;
