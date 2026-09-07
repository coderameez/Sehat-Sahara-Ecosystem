import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Edit3,
  XCircle,
  CheckCircle2,
  Hourglass,
  Search,
  SlidersHorizontal,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  doctorVerificationStore,
  DoctorVerificationRecord,
} from '../data/verificationMockData';

type FilterTab = 'All' | 'Pending' | 'Corrections' | 'Rejected' | 'Approved';

export const DoctorVerificationQueue: React.FC = () => {
  const navigate = useNavigate();

  // Subscribe to store updates
  const [records, setRecords] = useState<DoctorVerificationRecord[]>(() =>
    doctorVerificationStore.getRecords()
  );

  useEffect(() => {
    const unsub = doctorVerificationStore.subscribe(() => {
      setRecords([...doctorVerificationStore.getRecords()]);
    });
    return unsub;
  }, []);

  // Filter & Search State
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts calculated dynamically from records
  const counts = useMemo(() => {
    return {
      all: 1415, // realistic platform count from PDF
      pending: records.filter((r) => r.status === 'Pending').length + 172,
      corrections: records.filter((r) => r.status === 'Corrections').length + 53,
      rejected: records.filter((r) => r.status === 'Rejected').length + 20,
      approved: records.filter((r) => r.status === 'Approved').length + 1161,
    };
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesTab =
        activeTab === 'All' || record.status.toLowerCase() === activeTab.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        record.doctorName.toLowerCase().includes(query) ||
        record.pmdcNumber.toLowerCase().includes(query) ||
        record.specialty.toLowerCase().includes(query) ||
        record.caseId.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [records, activeTab, searchQuery]);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">

      {/* ─── Breadcrumb & Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mb-1">
            <span>Doctor Verification</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Queue</span>
          </div>
          <h1 className="text-[20px] font-bold text-slate-900 leading-tight">
            Doctor Verification Queue
          </h1>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5">
            Manage doctor verification requests and ensure trusted, verified healthcare providers.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[12px] font-medium text-slate-600 bg-white border border-surface-border px-3.5 py-2 rounded-xl shadow-xs self-start sm:self-auto">
          <span>May 26, 2025</span>
          <span className="text-slate-300">•</span>
          <span>10:24 AM</span>
          <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center ml-1">
            SA
          </div>
        </div>
      </div>

      {/* ─── Metric KPI Cards Strip (Matching PDF Page 7) ────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Pending */}
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-card flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-slate-500">Pending</p>
            <p className="text-[20px] font-black text-slate-900 leading-tight mt-0.5">{counts.pending}</p>
            <p className="text-[10.5px] text-amber-600 font-semibold mt-1">Older than SLA: 32</p>
          </div>
        </div>

        {/* 2. Corrections */}
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-card flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-slate-500">Corrections</p>
            <p className="text-[20px] font-black text-slate-900 leading-tight mt-0.5">{counts.corrections}</p>
            <p className="text-[10.5px] text-amber-600 font-semibold mt-1">Older than SLA: 11</p>
          </div>
        </div>

        {/* 3. Rejected */}
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-card flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-slate-500">Rejected</p>
            <p className="text-[20px] font-black text-slate-900 leading-tight mt-0.5">{counts.rejected}</p>
            <p className="text-[10.5px] text-rose-600 font-semibold mt-1">Last 7 days: ↑ 8</p>
          </div>
        </div>

        {/* 4. Approved */}
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-card flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-slate-500">Approved</p>
            <p className="text-[20px] font-black text-slate-900 leading-tight mt-0.5">{counts.approved.toLocaleString()}</p>
            <p className="text-[10.5px] text-emerald-600 font-semibold mt-1">Last 30 days: ↑ 214</p>
          </div>
        </div>

        {/* 5. SLA */}
        <div className="bg-white rounded-xl border border-surface-border p-4 shadow-card flex items-start gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
            <Hourglass className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-semibold text-slate-500">SLA (Pending)</p>
            <p className="text-[20px] font-black text-slate-900 leading-tight mt-0.5">48 hrs</p>
            <p className="text-[10.5px] text-slate-500 font-semibold mt-1">Target: 48 hrs</p>
          </div>
        </div>
      </div>

      {/* ─── Filter Pills & Search Bar ───────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors shrink-0 ${
              activeTab === 'All'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
            }`}
          >
            All <span className="opacity-80 ml-1 font-normal">1,415</span>
          </button>
          <button
            onClick={() => setActiveTab('Pending')}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors shrink-0 ${
              activeTab === 'Pending'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
            }`}
          >
            Pending <span className="opacity-80 ml-1 font-normal">{counts.pending}</span>
          </button>
          <button
            onClick={() => setActiveTab('Corrections')}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors shrink-0 ${
              activeTab === 'Corrections'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
            }`}
          >
            Corrections <span className="opacity-80 ml-1 font-normal">{counts.corrections}</span>
          </button>
          <button
            onClick={() => setActiveTab('Rejected')}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors shrink-0 ${
              activeTab === 'Rejected'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
            }`}
          >
            Rejected <span className="opacity-80 ml-1 font-normal">{counts.rejected}</span>
          </button>
          <button
            onClick={() => setActiveTab('Approved')}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors shrink-0 ${
              activeTab === 'Approved'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-surface-border hover:bg-slate-50'
            }`}
          >
            Approved <span className="opacity-80 ml-1 font-normal">{counts.approved.toLocaleString()}</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PMDC Number or Doctor Name"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-surface-border bg-white text-[12.5px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
            />
          </div>
          <button className="h-9 px-3 rounded-lg border border-surface-border bg-white text-[12.5px] text-slate-700 font-semibold flex items-center gap-1.5 hover:bg-slate-50 transition-colors shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* ─── Verification Queue Table ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-page border-b border-surface-border">
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Career Stage</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Specialty</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">PMDC Number</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Submitted On ↓</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">OCR Confidence</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Risk Flag</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400 text-[13px]">
                    No doctor verification requests found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const initials = record.doctorName
                    .replace('Dr. ', '')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2);

                  return (
                    <tr
                      key={record.id}
                      onClick={() => navigate(`/admin/verification/${record.id}`)}
                      className="hover:bg-surface-page/60 cursor-pointer transition-colors"
                    >
                      {/* Doctor */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 text-[12px] font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-900 truncate">{record.doctorName}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{record.degree}</p>
                          </div>
                        </div>
                      </td>

                      {/* Career Stage */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12.5px] text-slate-700 font-medium">{record.careerStage}</span>
                      </td>

                      {/* Specialty */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12.5px] text-slate-700 font-medium">{record.specialty}</span>
                      </td>

                      {/* PMDC Number */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12.5px] font-mono text-slate-900 font-semibold">{record.pmdcNumber}</span>
                      </td>

                      {/* Submitted On */}
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-slate-600">{record.submittedOn}</span>
                      </td>

                      {/* OCR Confidence */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                            record.ocrConfidence >= 90
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : record.ocrConfidence >= 80
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {record.ocrConfidence}%
                        </span>
                      </td>

                      {/* Risk Flag */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              record.riskFlag.severity === 'high'
                                ? 'bg-rose-500'
                                : record.riskFlag.severity === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-slate-800 truncate">
                              {record.riskFlag.label}
                            </p>
                            {record.riskFlag.sublabel && (
                              <p className="text-[10.5px] text-slate-400 truncate">
                                {record.riskFlag.sublabel}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {record.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full leading-none">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        )}
                        {record.status === 'Corrections' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full leading-none">
                            <AlertCircle className="w-3 h-3 text-orange-600" />
                            Corrections
                          </span>
                        )}
                        {record.status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full leading-none">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Rejected
                          </span>
                        )}
                        {record.status === 'Approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full leading-none">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/admin/verification/${record.id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-white bg-brand-700 hover:bg-brand-800 transition-colors shadow-xs"
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

        {/* ─── Pagination Bar ─────────────────────────────────────────── */}
        <div className="px-5 py-3 bg-surface-page/50 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-600">
          <div>
            Showing <span className="font-semibold text-slate-900">1 to {filteredRecords.length}</span> of{' '}
            <span className="font-semibold text-slate-900">1,415</span> results
          </div>

          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[12px]">
              1
            </button>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              2
            </button>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              142
            </button>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              143
            </button>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-700 font-medium flex items-center justify-center text-[12px] hover:bg-slate-50">
              144
            </button>
            <button className="w-7 h-7 rounded-md border border-surface-border bg-white text-slate-600 flex items-center justify-center text-[12px] hover:bg-slate-50">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">10 per page</span>
          </div>
        </div>
      </div>

    </div>
  );
};
