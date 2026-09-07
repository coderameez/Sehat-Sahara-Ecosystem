import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquareWarning,
  Droplets,
  Package,
  Search,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  ShieldCheck,
  BookOpen,
  Info,
  X,
  Sparkles,
} from 'lucide-react';
import {
  communityModerationStore,
  CommunityReportRecord,
  CommunityType,
  ModerationStatus,
} from '../data/communityMockData';
import { CommunityReportDetailDrawer } from '../components/CommunityReportDetailDrawer';

export const CommunityModeration: React.FC = () => {
  // Subscribe to store
  const [reports, setReports] = useState<CommunityReportRecord[]>(() =>
    communityModerationStore.getReports()
  );
  const [reviewedToday, setReviewedToday] = useState<number>(() =>
    communityModerationStore.getReviewedTodayCount()
  );

  useEffect(() => {
    const unsub = communityModerationStore.subscribe(() => {
      setReports([...communityModerationStore.getReports()]);
      setReviewedToday(communityModerationStore.getReviewedTodayCount());
    });
    return unsub;
  }, []);

  // Filter state
  const [activeTab, setActiveTab] = useState<CommunityType>('Blood');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [reasonFilter, setReasonFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');

  // Drawer state
  const [selectedReport, setSelectedReport] = useState<CommunityReportRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Guidelines modal state
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);

  // Feedback notification
  const [feedbackToast, setFeedbackToast] = useState<{
    message: string;
    type: 'success' | 'warning' | 'danger';
  } | null>(null);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Tab match: Blood or Things Sharing
      if (item.type !== activeTab) return false;

      // Status match
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;

      // Reason match
      if (reasonFilter !== 'All' && item.reason !== reasonFilter) return false;

      // Risk match
      if (riskFilter !== 'All' && item.risk !== riskFilter) return false;

      // Search match
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchReporter = item.reporter.name.toLowerCase().includes(q) || item.reporter.userId.toLowerCase().includes(q);
        const matchReason = item.reason.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        if (!matchTitle && !matchReporter && !matchReason && !matchId) {
          return false;
        }
      }

      return true;
    });
  }, [reports, activeTab, statusFilter, reasonFilter, riskFilter, searchQuery]);

  // Overall counts
  const pendingCount = useMemo(() => {
    return reports.filter((r) => r.status === 'Pending').length + 140; // baseline platform queue from PDF
  }, [reports]);

  const handleOpenReport = (report: CommunityReportRecord) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  const handleDecide = (id: string, decision: ModerationStatus, reason?: string) => {
    communityModerationStore.updateReportStatus(id, decision, reason);

    // Keep drawer updated with the latest item or close
    const updated = communityModerationStore.getReports().find((r) => r.id === id);
    if (updated) {
      setSelectedReport(updated);
    }

    const toastType = decision === 'Kept' ? 'success' : decision === 'Hidden' ? 'warning' : 'danger';
    const actionLabel = decision === 'Kept' ? 'approved (kept visible)' : decision === 'Hidden' ? 'hidden from public feeds' : 'permanently removed';
    
    setFeedbackToast({
      message: `Report ${id} successfully ${actionLabel}.`,
      type: toastType,
    });

    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">

      {/* ─── Feedback Toast ─────────────────────────────────────────── */}
      {feedbackToast && (
        <div
          className={`fixed bottom-5 right-5 z-[110] flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl animate-in slide-in-from-bottom-3 duration-200 ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : feedbackToast.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          {feedbackToast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {feedbackToast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
          {feedbackToast.type === 'danger' && <Trash2 className="w-4 h-4 text-red-600" />}
          <span className="text-[13px] font-semibold">{feedbackToast.message}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─── Page Title Header & Top KPIs (Matching PDF Page 12) ──────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mb-1">
            <span>Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-semibold">Community Moderation</span>
          </div>
          <h1 className="text-[20px] font-bold text-slate-900 leading-tight">
            Community Moderation
          </h1>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5">
            Review and moderate reported community content to keep the platform safe and trustworthy.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Guidelines Button */}
          <button
            onClick={() => setIsGuidelinesOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-semibold text-slate-700 bg-white border border-surface-border hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Guidelines</span>
          </button>

          {/* 3 Metric Cards matching PDF Page 12 exactly */}
          <div className="flex items-center gap-2">
            <div className="bg-white border border-surface-border px-3.5 py-1.5 rounded-lg text-center shadow-2xs min-w-[76px]">
              <div className="text-[16px] font-bold text-slate-900">{pendingCount}</div>
              <div className="text-[10.5px] font-medium text-slate-400">Pending</div>
            </div>

            <div className="bg-white border border-surface-border px-3.5 py-1.5 rounded-lg text-center shadow-2xs min-w-[76px]">
              <div className="text-[16px] font-bold text-slate-900">{reviewedToday}</div>
              <div className="text-[10.5px] font-medium text-slate-400">Reviewed Today</div>
            </div>

            <div className="bg-white border border-surface-border px-3.5 py-1.5 rounded-lg text-center shadow-2xs min-w-[76px]">
              <div className="text-[16px] font-bold text-emerald-700">92%</div>
              <div className="text-[10.5px] font-medium text-slate-400">Accuracy (AI)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Community Segmentation Tabs (Blood & Things Sharing Only) ─ */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-3">
        <button
          onClick={() => setActiveTab('Blood')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-colors ${
            activeTab === 'Blood'
              ? 'bg-brand-700 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
          }`}
        >
          <Droplets className={`w-4 h-4 ${activeTab === 'Blood' ? 'text-red-200' : 'text-red-500'}`} />
          <span>Blood</span>
          <span
            className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'Blood'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {reports.filter((r) => r.type === 'Blood' && r.status === 'Pending').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Things Sharing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-colors ${
            activeTab === 'Things Sharing'
              ? 'bg-brand-700 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
          }`}
        >
          <Package className={`w-4 h-4 ${activeTab === 'Things Sharing' ? 'text-emerald-200' : 'text-emerald-600'}`} />
          <span>Things Sharing</span>
          <span
            className={`text-[10.5px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'Things Sharing'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {reports.filter((r) => r.type === 'Things Sharing' && r.status === 'Pending').length}
          </span>
        </button>
      </div>

      {/* ─── Queue Header & Filters Bar (Matching PDF Page 12) ──────── */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-slate-900">
              Reported Content Queue
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {filteredReports.length} in queue
            </span>
          </div>
          <span className="text-[11.5px] text-slate-400">
            Showing category: <strong>{activeTab}</strong>
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, reporter name, ID, or keywords..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-surface-border bg-surface-page text-[12.5px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-surface-border bg-white text-[12.5px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Kept">Kept (Approved)</option>
            <option value="Hidden">Hidden</option>
            <option value="Removed">Removed</option>
          </select>

          {/* Reason Dropdown */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-surface-border bg-white text-[12.5px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="All">All Reasons</option>
            <option value="Misinformation">Misinformation</option>
            <option value="Spam">Spam</option>
            <option value="Incomplete Info">Incomplete Info</option>
            <option value="Irrelevant">Irrelevant</option>
            <option value="Safety Hazard">Safety Hazard</option>
          </select>

          {/* Risk Dropdown */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-surface-border bg-white text-[12.5px] text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="All">All Risks</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* ─── Reported Items Table (Matching PDF Page 12) ─────────────── */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-page border-b border-surface-border">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reporter</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    AI Flag <Info className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Risk</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reported Time ↓</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    <MessageSquareWarning className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[13px] font-semibold text-slate-600">No reported items match your filter.</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">Try resetting search or filter options.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((item) => {
                  const isItemBlood = item.type === 'Blood';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenReport(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Type */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isItemBlood ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span className="text-[12px] font-semibold text-slate-700">
                            {item.type}
                          </span>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3.5">
                        <div className="max-w-[240px]">
                          <span className="text-[13px] font-bold text-slate-900 group-hover:text-brand-700 transition-colors block truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            ID: {item.id}
                          </span>
                        </div>
                      </td>

                      {/* Reporter */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div>
                          <span className="text-[12.5px] font-semibold text-slate-800 block">
                            {item.reporter.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            {item.reporter.userId}
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[12px] text-slate-600 font-medium">
                          {item.reason}
                        </span>
                      </td>

                      {/* AI Flag */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            item.aiFlag.type === 'warning'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : item.aiFlag.type === 'danger'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          {item.aiFlag.label}
                        </span>
                      </td>

                      {/* Risk */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.risk === 'High'
                                ? 'bg-red-500'
                                : item.risk === 'Medium'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span
                            className={
                              item.risk === 'High'
                                ? 'text-red-700'
                                : item.risk === 'Medium'
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }
                          >
                            {item.risk}
                          </span>
                        </div>
                      </td>

                      {/* Reported Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-[12px] text-slate-500">
                        {item.reportedTime}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.status === 'Pending'
                              ? 'bg-amber-100/70 text-amber-800 border border-amber-200'
                              : item.status === 'Kept'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.status === 'Hidden'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReport(item);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-brand-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination Strip (Matching PDF Page 12) ──────────────── */}
        <div className="p-4 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-slate-500 bg-surface-page/30">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              defaultValue="20"
              className="px-2 py-1 border border-surface-border rounded-lg bg-white text-[12px] text-slate-700 font-medium"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div>
            Showing 1-{filteredReports.length} of {pendingCount} items
          </div>

          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-surface-border bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              ‹
            </button>
            <button className="px-2.5 py-1 rounded border border-brand-600 bg-brand-600 text-white font-bold text-[12px]">
              1
            </button>
            <button className="px-2.5 py-1 rounded border border-surface-border bg-white text-slate-600 hover:bg-slate-50 text-[12px]">
              2
            </button>
            <button className="px-2.5 py-1 rounded border border-surface-border bg-white text-slate-600 hover:bg-slate-50 text-[12px]">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded border border-surface-border bg-white text-slate-600 hover:bg-slate-50 text-[12px]">
              8
            </button>
            <button className="px-2 py-1 rounded border border-surface-border bg-white text-slate-600 hover:bg-slate-50">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ─── Detail Drawer ──────────────────────────────────────────── */}
      <CommunityReportDetailDrawer
        report={selectedReport}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDecide={handleDecide}
      />

      {/* ─── Community Guidelines Modal ─────────────────────────────── */}
      {isGuidelinesOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border shadow-2xl max-w-[500px] w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-[16px] font-bold text-slate-900">
                  Community Moderation Policy
                </h3>
              </div>
              <button
                onClick={() => setIsGuidelinesOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-[12.5px] text-slate-600 max-h-[360px] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-red-500" />
                  Blood Donation Charter
                </h4>
                <p>
                  Blood donation on Sehat Sahara is 100% altruistic and non-commercial. Any post asking for or offering financial remuneration, external commercial brokerages, or duplicate spam posts must be removed immediately.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-[13px] flex items-center gap-1.5 mb-1">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  Things Sharing Charter
                </h4>
                <p>
                  Medical equipment (wheelchairs, crutches, hospital beds, nebulizers) can be shared for free mutual solidarity. Commercial rental advertising, damaged/hazardous life-support machines, and prescription medications are strictly forbidden.
                </p>
              </div>

              <div className="p-3 bg-surface-page rounded-xl border border-surface-border">
                <span className="font-semibold text-slate-800 block mb-1">
                  Moderator Principles:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>AI assist flags provide probabilistic hints — human admin makes the call.</li>
                  <li>In life-threatening emergency blood appeals, favor verification over immediate deletion unless confirmed fraud.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsGuidelinesOpen(false)}
                className="px-4 py-2 rounded-lg text-[13px] font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunityModeration;
