import React, { useState } from 'react';
import {
  X,
  Droplets,
  Package,
  AlertTriangle,
  User,
  MapPin,
  Phone,
  FileText,
  CheckCircle2,
  EyeOff,
  Trash2,
  Sparkles,
} from 'lucide-react';
import type { CommunityReportRecord, ModerationStatus } from '../data/communityMockData';

interface CommunityReportDetailDrawerProps {
  report: CommunityReportRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onDecide: (id: string, decision: ModerationStatus, reason?: string) => void;
}

export const CommunityReportDetailDrawer: React.FC<CommunityReportDetailDrawerProps> = ({
  report,
  isOpen,
  onClose,
  onDecide,
}) => {
  // Confirmation / reason modal state for Hide / Remove
  const [pendingAction, setPendingAction] = useState<ModerationStatus | null>(null);
  const [reasonNote, setReasonNote] = useState('');

  if (!isOpen || !report) return null;

  const isBlood = report.type === 'Blood';

  const handleActionClick = (decision: ModerationStatus) => {
    if (decision === 'Kept') {
      onDecide(report.id, 'Kept');
    } else {
      // Open reason modal for Hide or Remove
      setPendingAction(decision);
      setReasonNote('');
    }
  };

  const handleConfirmDecision = () => {
    if (pendingAction) {
      onDecide(report.id, pendingAction, reasonNote);
      setPendingAction(null);
      setReasonNote('');
    }
  };

  return (
    <>
      {/* ─── Backdrop ──────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* ─── Slide-over Drawer Panel (Matching Admin Pattern) ─────────── */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-white shadow-2xl z-50 flex flex-col border-l border-surface-border overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-surface-border flex items-center justify-between bg-surface-page/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isBlood ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-brand-700'
              }`}
            >
              {isBlood ? <Droplets className="w-4 h-4" /> : <Package className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-slate-900 leading-tight">
                Reported Item Details
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-slate-500">
                <span
                  className={`font-semibold ${
                    isBlood ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  • {isBlood ? 'Blood Request' : 'Things Sharing'}
                </span>
                <span>•</span>
                <span>Reported on {report.reportedTime}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-700 text-[13px]">
          
          {/* Current Status Pill if already moderated */}
          {report.status !== 'Pending' && (
            <div
              className={`p-3 rounded-lg border flex items-center justify-between ${
                report.status === 'Kept'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : report.status === 'Hidden'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {report.status === 'Kept' && <CheckCircle2 className="w-4 h-4" />}
                {report.status === 'Hidden' && <EyeOff className="w-4 h-4" />}
                {report.status === 'Removed' && <Trash2 className="w-4 h-4" />}
                <span className="font-semibold text-[12.5px]">
                  Current Status: {report.status === 'Kept' ? 'Approved (Visible)' : report.status === 'Hidden' ? 'Hidden from Public' : 'Permanently Removed'}
                </span>
              </div>
              <span className="text-[11px] font-medium opacity-80">Local Session</span>
            </div>
          )}

          {/* ── 1. Original Listing ────────────────────────────────────── */}
          <section className="bg-surface-page rounded-xl border border-surface-border p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border/80 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Original Listing
              </span>
              <span className="text-[11px] text-slate-400">
                Posted {report.originalListing.postedTime}
              </span>
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
                {report.originalListing.title}
              </h3>
              <p className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Posted by <strong className="text-slate-700 font-semibold">{report.originalListing.postedBy}</strong> ({report.originalListing.userId})
                </span>
              </p>
            </div>

            <p className="text-[13px] text-slate-700 bg-white p-3 rounded-lg border border-surface-border leading-relaxed">
              "{report.originalListing.description}"
            </p>

            {/* Metadata Tags */}
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="flex items-center gap-1.5 text-slate-600 bg-white p-2 rounded-lg border border-surface-border">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{report.originalListing.location}</span>
              </div>
              {report.originalListing.contactNumber && (
                <div className="flex items-center gap-1.5 text-slate-600 bg-white p-2 rounded-lg border border-surface-border">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11.5px] truncate">
                    {report.originalListing.contactNumber}
                  </span>
                </div>
              )}
              {isBlood && report.originalListing.bloodGroup && (
                <div className="flex items-center gap-1.5 text-slate-600 bg-white p-2 rounded-lg border border-surface-border">
                  <Droplets className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>
                    Group: <strong className="text-red-700 font-bold">{report.originalListing.bloodGroup}</strong> ({report.originalListing.unitsNeeded || 1} units)
                  </span>
                </div>
              )}
              {!isBlood && report.originalListing.condition && (
                <div className="flex items-center gap-1.5 text-slate-600 bg-white p-2 rounded-lg border border-surface-border">
                  <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Condition: <strong>{report.originalListing.condition}</strong></span>
                </div>
              )}
            </div>
          </section>

          {/* ── 2. Report & Evidence ───────────────────────────────────── */}
          <section className="bg-white rounded-xl border border-surface-border p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border/80 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Evidence & Reporter Note
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Reason: {report.reason}
              </span>
            </div>

            <div className="text-[12.5px] text-slate-600">
              <p className="font-medium text-slate-500 text-[11.5px] mb-1">
                Reported by {report.reporter.name} ({report.reporter.userId})
              </p>
              <div className="p-3 bg-amber-50/40 rounded-lg border border-amber-100 text-slate-800 italic leading-relaxed">
                "{report.evidence.reporterNotes}"
              </div>
            </div>

            {report.evidence.attachmentName && (
              <div className="flex items-center justify-between p-2.5 bg-surface-page rounded-lg border border-surface-border text-[12px]">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate font-medium text-slate-700">
                    {report.evidence.attachmentName}
                  </span>
                </div>
                <span className="text-[11px] text-brand-700 font-semibold cursor-pointer hover:underline">
                  Preview
                </span>
              </div>
            )}
          </section>

          {/* ── 3. AI Moderation Assist (Matching PDF Page 12) ─────────── */}
          <section className="bg-linear-to-b from-emerald-50/60 to-white rounded-xl border border-emerald-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] font-bold text-emerald-950">
                  AI Moderation Assist
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Advisory
              </span>
            </div>

            <div className="flex items-center justify-between bg-white/90 p-2.5 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-900 text-[13px]">
                  {report.aiModerationAssist.assessment}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                Confidence: {report.aiModerationAssist.confidenceScore}%
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Detected Signals
              </span>
              <ul className="space-y-1">
                {report.aiModerationAssist.signals.map((signal, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[12px] text-slate-700 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-500 italic pt-1 border-t border-emerald-100/60">
              * Flags/confidence only — Admin makes the final moderation decision.
            </p>
          </section>

        </div>

        {/* ─── Moderation Actions Footer (Matching PDF Page 12) ───────── */}
        <div className="p-4 border-t border-surface-border bg-white shrink-0 space-y-2">
          <div className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Moderation Action
          </div>
          <div className="grid grid-cols-3 gap-2">
            
            {/* Keep */}
            <button
              onClick={() => handleActionClick('Kept')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[12.5px] font-bold border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 transition-colors shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Keep</span>
            </button>

            {/* Hide */}
            <button
              onClick={() => handleActionClick('Hidden')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[12.5px] font-bold border border-amber-500 text-amber-700 bg-white hover:bg-amber-50 transition-colors shadow-2xs"
            >
              <EyeOff className="w-4 h-4 text-amber-600" />
              <span>Hide</span>
            </button>

            {/* Remove */}
            <button
              onClick={() => handleActionClick('Removed')}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-[12.5px] font-bold border border-red-500 text-red-700 bg-white hover:bg-red-50 transition-colors shadow-2xs"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Remove</span>
            </button>

          </div>
          <div className="flex justify-between text-[11px] text-slate-400 px-1 pt-1">
            <span>Keep visible</span>
            <span>Hide from feed</span>
            <span>Permanently delete</span>
          </div>
        </div>

      </aside>

      {/* ─── Lightweight Reason Modal for Hide / Remove ──────────────── */}
      {pendingAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-[420px] w-full p-5 space-y-4 animate-in zoom-in-95 duration-150 relative z-[101]">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  pendingAction === 'Removed'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                {pendingAction === 'Removed' ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">
                  {pendingAction === 'Removed'
                    ? 'Confirm Permanent Removal'
                    : 'Hide Listing from Public'}
                </h3>
                <p className="text-[12px] text-slate-500">
                  {pendingAction === 'Removed'
                    ? 'This will immediately take down the post from the platform.'
                    : 'The post will remain stored but hidden from general search and feeds.'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-slate-700">
                Moderation Note / Reason (Optional)
              </label>
              <textarea
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                placeholder="e.g. Unverified commercial solicitation / Policy violation..."
                rows={3}
                className="w-full p-2.5 text-[13px] border border-surface-border rounded-lg bg-surface-page focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setPendingAction(null)}
                className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold text-white shadow-xs transition-colors ${
                  pendingAction === 'Removed'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {pendingAction === 'Removed' ? 'Confirm Removal' : 'Confirm Hide'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
