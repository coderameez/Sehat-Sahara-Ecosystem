import React, { useState } from 'react';
import {
  SehatSaharaLogo,
  Button,
  IconButton,
  Input,
  Badge,
  Card,
  Modal,
  BottomSheet,
  LoadingState,
  EmptyState,
  ErrorState,
  BottomNav,
  MobileAppShell,
} from '../components';
import {
  Bell,
  Search,
  CheckCircle2,
  Star,
  AlertTriangle,
  HeartPulse,
  Phone,
  ChevronRight,
  Stethoscope,
  Droplets,
  Layers,
  Wifi,
} from 'lucide-react';

type DevState = 'default' | 'loading' | 'empty' | 'error';

/**
 * DevMobileShellPreview
 *
 * A development-only shell-calibration preview.
 * NOT P-01, NOT a feature screen.
 * Purpose: validate the MobileAppShell geometry, responsive contract, and
 * Sehat Sahara visual system against the Build Guide references.
 *
 * Shows: logo header, one hero card, one doctor card, one primary button,
 * one input, status chips, and BottomNav.
 * Overlays (Modal, BottomSheet) accessible via tap for testing.
 * State switcher is dev-only and will not appear in production screens.
 */
export const DevMobileShellPreview: React.FC = () => {
  const [activeNav, setActiveNav] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [devState, setDevState] = useState<DevState>('default');
  const [search, setSearch] = useState('');

  return (
    <MobileAppShell>

      {/* ── App Header ────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-white border-b border-surface-border px-5 flex items-center justify-between" style={{ height: '56px' }}>
        <SehatSaharaLogo variant="lightBackground"   />
        <div className="flex items-center gap-1">
          <IconButton
            icon={<Bell className="w-5 h-5" />}
            size="md"
            badgeCount={2}
            label="Notifications"
            variant="ghost"
          />
        </div>
      </header>

      {/* ── Scrollable content region ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-0 bg-surface-page app-scroll">

        {/* Dev-only state switcher strip */}
        <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide shrink-0">Shell State:</span>
          {(['default', 'loading', 'empty', 'error'] as DevState[]).map((s) => (
            <button
              key={s}
              onClick={() => setDevState(s)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                devState === s
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Modal
          </button>
          <button
            onClick={() => setIsSheetOpen(true)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Sheet
          </button>
        </div>

        {/* ── State-conditional content ─────────────────────────────── */}
        {devState === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <LoadingState message="Loading your health dashboard…" size="md" />
          </div>
        )}

        {devState === 'empty' && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={<Stethoscope className="w-7 h-7" />}
              title="No appointments yet"
              description="Book your first consultation to see your health timeline here."
              actionLabel="Find a Doctor"
              onAction={() => setActiveNav('search')}
            />
          </div>
        )}

        {devState === 'error' && (
          <div className="flex-1 flex flex-col">
            <div className="p-4">
              <ErrorState
                variant="banner"
                message="Could not connect to server. Check your network."
                onRetry={() => setDevState('default')}
              />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ErrorState
                title="Network Error"
                message="Your health data couldn't be loaded. Tap to retry."
                onRetry={() => setDevState('default')}
              />
            </div>
          </div>
        )}

        {devState === 'default' && (
          <div className="px-4 py-4 space-y-4 pb-4">

            {/* ── Hero greeting card — brand-dark treatment ─────────── */}
            <Card variant="brand-dark" noPad className="px-4 py-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[11px] font-medium text-brand-200 mb-0.5">Good morning</p>
                  <h1 className="text-lg font-bold text-white leading-tight">Ali Ahmed</h1>
                </div>
                <div className="w-11 h-11 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="verified" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                  Profile complete
                </Badge>
                <Badge variant="neutral" size="sm">
                  Karachi
                </Badge>
              </div>
            </Card>

            {/* ── Quick-action row ─────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: <Stethoscope className="w-5 h-5" />, label: 'Doctors',   color: 'text-brand-600 bg-brand-50' },
                { icon: <HeartPulse  className="w-5 h-5" />, label: 'Records',   color: 'text-green-600 bg-green-50' },
                { icon: <Droplets    className="w-5 h-5" />, label: 'Blood',     color: 'text-sos-600   bg-rose-50'   },
                { icon: <Layers      className="w-5 h-5" />, label: 'Community', color: 'text-sky-600   bg-sky-50'    },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 p-2 focus:outline-none"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 leading-none">{item.label}</span>
                </button>
              ))}
            </div>

            {/* ── Search input ─────────────────────────────────────── */}
            <Input
              placeholder="Search doctors, specialties…"
              leadingIcon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* ── Status chips row ─────────────────────────────────── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              <Badge variant="verified" icon={<CheckCircle2 className="w-3 h-3" />}>PMDC Verified</Badge>
              <Badge variant="pending">Queue #4</Badge>
              <Badge variant="sos" icon={<AlertTriangle className="w-3 h-3" />}>SOS Active</Badge>
              <Badge variant="info">Video</Badge>
            </div>

            {/* ── Doctor card — representative interactive card ──────── */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-2.5">Nearby Doctors</h2>

              <Card variant="interactive" noPad onClick={() => setIsSheetOpen(true)}>
                <div className="flex items-center gap-3 p-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                    <span className="text-base font-bold text-brand-700">AK</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-bold text-slate-900 leading-tight truncate">Dr. Ayesha Khan</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-500 truncate">General Physician • 8 yrs</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-semibold text-slate-700">4.9</span>
                        <span className="text-[11px] text-slate-400">(128)</span>
                      </div>
                      <span className="text-slate-200">|</span>
                      <span className="text-[11px] font-semibold text-brand-700">PKR 1,500</span>
                    </div>
                  </div>
                  {/* Chevron */}
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
                {/* Available today strip */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 border-t border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-700">Available today — next slot 3:30 PM</span>
                </div>
              </Card>
            </div>

            {/* ── SOS strip ────────────────────────────────────────── */}
            <Card variant="sos" noPad>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-none mb-0.5">Emergency SOS</p>
                  <p className="text-[11px] text-rose-100">Blood donors • Ambulance dispatch</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="shrink-0 bg-white text-sos-700 font-bold text-xs px-3 py-1.5 rounded-full"
                >
                  Test
                </button>
              </div>
            </Card>

            {/* ── Primary action button ────────────────────────────── */}
            <Button variant="primary" size="lg" fullWidth icon={<Stethoscope className="w-4 h-4" />}>
              Book a Consultation
            </Button>

            {/* ── Connectivity strip ─────────────────────────────── */}
            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center pb-2">
              <Wifi className="w-3.5 h-3.5" />
              <span>Shell verified — static/demo service mode active</span>
            </div>

          </div>
        )}
      </main>

      {/* ── Bottom Navigation ─────────────────────────────────────────── */}
      <BottomNav activeId={activeNav} onChange={setActiveNav} />

      {/* ── Modal (overlay test) ─────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm SOS Broadcast"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="danger"   size="sm" onClick={() => setIsModalOpen(false)}>Broadcast SOS</Button>
          </>
        }
      >
        <p>
          This will alert verified donors and emergency responders within a 15&nbsp;km radius.
          All responses are logged.
        </p>
      </Modal>

      {/* ── Bottom Sheet (overlay test) ──────────────────────────────── */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Dr. Ayesha Khan"
        footer={
          <Button fullWidth onClick={() => setIsSheetOpen(false)}>
            Book Appointment
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-section rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
              AK
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dr. Ayesha Khan</p>
              <p className="text-xs text-slate-500">General Physician • PKR 1,500</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Escrow payment holds funds until consultation is complete. You may cancel up to 2&nbsp;hours before the slot.
          </p>
        </div>
      </BottomSheet>

    </MobileAppShell>
  );
};
