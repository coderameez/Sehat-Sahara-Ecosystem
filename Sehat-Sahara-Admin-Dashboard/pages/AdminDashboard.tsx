import React from 'react';
import {
  Users,
  Stethoscope,
  Building2,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  Activity,
  MessageSquareWarning,
  UserPlus,
  Hospital,
  Flag,
  Bot,
  Target,
  Timer,
} from 'lucide-react';
import {
  kpiCards,
  doctorVerifications,
  recentActivity,
  pendingActions,
  communityReports,
  aiVerificationSummary,
} from '../data/mockData';
import type { DoctorVerificationItem, RecentActivityItem, PendingActionItem, CommunityReportItem } from '../data/mockData';

// ─── Icon resolver for KPI cards ─────────────────────────────────────────────
const kpiIconMap: Record<string, React.FC<{ className?: string }>> = {
  Users,
  Stethoscope,
  Building2,
  ShieldCheck,
};

// ─── Activity icon resolver ──────────────────────────────────────────────────
const activityIconMap: Record<string, { icon: React.FC<{ className?: string }>; bg: string; color: string }> = {
  user_registered:    { icon: UserPlus, bg: 'bg-blue-50', color: 'text-blue-600' },
  doctor_verified:    { icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  hospital_onboarded: { icon: Hospital, bg: 'bg-purple-50', color: 'text-purple-600' },
  content_flagged:    { icon: Flag, bg: 'bg-amber-50', color: 'text-amber-600' },
  report_submitted:   { icon: AlertCircle, bg: 'bg-rose-50', color: 'text-rose-600' },
  doctor_rejected:    { icon: XCircle, bg: 'bg-rose-50', color: 'text-rose-600' },
};

// ─── Status badge helper ─────────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  'pending':      'bg-amber-50 text-amber-700 border border-amber-200',
  'in-review':    'bg-sky-50 text-sky-700 border border-sky-200',
  'approved':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'rejected':     'bg-rose-50 text-rose-700 border border-rose-200',
  'open':         'bg-amber-50 text-amber-700 border border-amber-200',
  'under-review': 'bg-sky-50 text-sky-700 border border-sky-200',
  'resolved':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'dismissed':    'bg-slate-100 text-slate-600 border border-slate-200',
};

const priorityStyles: Record<string, string> = {
  high:   'bg-rose-50 text-rose-700 border border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  low:    'bg-slate-100 text-slate-600 border border-slate-200',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${statusStyles[status] || statusStyles.pending}`}>
    {status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
  </span>
);

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${priorityStyles[priority] || priorityStyles.low}`}>
    {priority.charAt(0).toUpperCase() + priority.slice(1)}
  </span>
);

// ─── AI Score bar ────────────────────────────────────────────────────────────
const AIScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 85 ? 'bg-emerald-500' : score >= 65 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] font-semibold text-slate-600">{score}%</span>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═════════════════════════════════════════════════════════════════════════════
export const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-[1440px] mx-auto space-y-6">

      {/* ─── KPI Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpiIconMap[kpi.icon] || Users;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-surface-border shadow-card p-5 flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-slate-500 mb-1 truncate">{kpi.label}</p>
                <p className="text-[22px] font-extrabold text-slate-900 leading-tight">{kpi.value}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {kpi.changeType === 'up' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                  {kpi.changeType === 'down' && <TrendingDown className="w-3 h-3 text-rose-600" />}
                  {kpi.changeType === 'neutral' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                  <span className={`text-[11px] font-semibold ${
                    kpi.changeType === 'up' ? 'text-emerald-600' :
                    kpi.changeType === 'down' ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Main Grid: Left (2/3) + Right (1/3) ────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ════════════ LEFT COLUMN (2/3 width) ════════════ */}
        <div className="xl:col-span-2 space-y-6">

          {/* ── Doctor Verification Queue ──────────────────────────── */}
          <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-slate-900">Doctor Verification Queue</h2>
                  <p className="text-[11px] text-slate-500 font-medium">{doctorVerifications.length} pending reviews</p>
                </div>
              </div>
              <button className="text-[12px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-page">
                    <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Specialty</th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">City</th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AI Score</th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {doctorVerifications.map((doc: DoctorVerificationItem) => (
                    <tr key={doc.id} className="hover:bg-surface-page/60 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[12px] font-bold shrink-0">
                            {doc.name.split(' ').slice(-1)[0].charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-900 truncate">{doc.name}</p>
                            <p className="text-[11px] text-slate-500">{doc.documentsCount} docs submitted</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-slate-700">{doc.specialty}</td>
                      <td className="px-5 py-3 text-[13px] text-slate-700">{doc.city}</td>
                      <td className="px-5 py-3"><AIScoreBar score={doc.aiScore} /></td>
                      <td className="px-5 py-3"><StatusBadge status={doc.status} /></td>
                      <td className="px-5 py-3">
                        <button className="w-8 h-8 rounded-lg border border-surface-border bg-white flex items-center justify-center hover:bg-surface-page transition-colors">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Pending Admin Actions ──────────────────────────────── */}
          <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-slate-900">Pending Admin Actions</h2>
                  <p className="text-[11px] text-slate-500 font-medium">{pendingActions.length} items need attention</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-surface-border">
              {pendingActions.map((action: PendingActionItem) => {
                const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
                  verification: ShieldCheck,
                  moderation: MessageSquareWarning,
                  hospital: Building2,
                  report: Flag,
                };
                const categoryBg: Record<string, string> = {
                  verification: 'bg-amber-50',
                  moderation: 'bg-purple-50',
                  hospital: 'bg-blue-50',
                  report: 'bg-rose-50',
                };
                const categoryColor: Record<string, string> = {
                  verification: 'text-amber-600',
                  moderation: 'text-purple-600',
                  hospital: 'text-blue-600',
                  report: 'text-rose-600',
                };
                const CatIcon = categoryIcons[action.category] || AlertCircle;

                return (
                  <div key={action.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-surface-page/60 transition-colors">
                    <div className={`w-9 h-9 rounded-lg ${categoryBg[action.category] || 'bg-slate-50'} flex items-center justify-center shrink-0`}>
                      <CatIcon className={`w-4 h-4 ${categoryColor[action.category] || 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 truncate">{action.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{action.description}</p>
                    </div>
                    <PriorityBadge priority={action.priority} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Community Reports ──────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <MessageSquareWarning className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-slate-900">Community Reports</h2>
                  <p className="text-[11px] text-slate-500 font-medium">{communityReports.length} open reports</p>
                </div>
              </div>
              <button className="text-[12px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-surface-border">
              {communityReports.map((report: CommunityReportItem) => (
                <div key={report.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-surface-page/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-slate-900 truncate">{report.reportedContent}</p>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>By: {report.reportedBy}</span>
                      <span>•</span>
                      <span className="capitalize">{report.contentType.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{report.reason}</span>
                    </div>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT COLUMN (1/3 width) ════════════ */}
        <div className="space-y-6">

          {/* ── AI Verification & Moderation Summary ──────────────── */}
          <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-border">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-slate-900">AI Verification Summary</h2>
                <p className="text-[11px] text-slate-500 font-medium">Automated processing stats</p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Processed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <span className="text-[12px] font-medium text-slate-600">Total Processed</span>
                </div>
                <span className="text-[14px] font-bold text-slate-900">{aiVerificationSummary.totalProcessed}</span>
              </div>
              {/* Auto-Approved */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[12px] font-medium text-slate-600">Auto-Approved</span>
                </div>
                <span className="text-[14px] font-bold text-emerald-700">{aiVerificationSummary.autoApproved}</span>
              </div>
              {/* Flagged for Review */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center">
                    <Flag className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span className="text-[12px] font-medium text-slate-600">Flagged for Review</span>
                </div>
                <span className="text-[14px] font-bold text-amber-700">{aiVerificationSummary.flaggedForReview}</span>
              </div>
              {/* Auto-Rejected */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-rose-50 flex items-center justify-center">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <span className="text-[12px] font-medium text-slate-600">Auto-Rejected</span>
                </div>
                <span className="text-[14px] font-bold text-rose-700">{aiVerificationSummary.autoRejected}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-surface-border" />

              {/* Accuracy & Speed */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-brand-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-brand-600" />
                    <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider">Accuracy</span>
                  </div>
                  <p className="text-[18px] font-extrabold text-brand-700">{aiVerificationSummary.accuracyRate}%</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Timer className="w-3 h-3 text-sky-600" />
                    <span className="text-[10px] font-semibold text-sky-600 uppercase tracking-wider">Avg Time</span>
                  </div>
                  <p className="text-[18px] font-extrabold text-sky-700">{aiVerificationSummary.avgProcessingTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Activity Feed ──────────────────────────────── */}
          <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-[14px] font-bold text-slate-900">Recent Activity</h2>
              </div>
            </div>
            <div className="divide-y divide-surface-border">
              {recentActivity.map((item: RecentActivityItem) => {
                const meta = activityIconMap[item.type] || activityIconMap.user_registered;
                const ActIcon = meta.icon;
                return (
                  <div key={item.id} className="px-5 py-3 flex items-start gap-3 hover:bg-surface-page/60 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <ActIcon className={`w-4 h-4 ${meta.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-medium text-slate-800 leading-snug">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10.5px] text-slate-400 font-medium">{item.timestamp}</span>
                        <span className="text-[10.5px] text-slate-400">•</span>
                        <span className="text-[10.5px] text-slate-500 font-medium">{item.actor}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Platform Quick Stats ──────────────────────────────── */}
          <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
            <h2 className="text-[14px] font-bold text-slate-900 mb-4">Platform Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">Active Consultations</span>
                <span className="text-[13px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">89</span>
              </div>
              <div className="border-t border-surface-border" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">Community Posts</span>
                <span className="text-[13px] font-bold text-slate-700">4,621</span>
              </div>
              <div className="border-t border-surface-border" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">Flagged Content</span>
                <span className="text-[13px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">12</span>
              </div>
              <div className="border-t border-surface-border" />
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">Hospitals Onboarded</span>
                <span className="text-[13px] font-bold text-slate-700">186</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
