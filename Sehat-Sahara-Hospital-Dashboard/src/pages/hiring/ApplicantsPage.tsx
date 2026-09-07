import { useState, useSyncExternalStore } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Filter, CheckCircle2, AlertTriangle, XCircle, BriefcaseMedical } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { store } from '../../store';
import clsx from 'clsx';

export function ApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  
  const job = state.jobs.find(j => j.id === jobId);
  const allApplicants = state.applicants.filter(a => a.jobId === jobId);
  
  const [activeTab, setActiveTab] = useState<'All' | 'Eligible' | 'Shortlisted' | 'Rejected'>('All');
  const [search, setSearch] = useState('');

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-txt-primary">Job Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/hiring')}>Back to Hiring</Button>
      </div>
    );
  }

  // Calculate tab counts
  const counts = {
    All: allApplicants.length,
    Eligible: allApplicants.filter(a => a.status === 'Eligible').length,
    Shortlisted: allApplicants.filter(a => a.status === 'Review' || a.status === 'Under Review').length,
    Rejected: allApplicants.filter(a => a.status === 'Rejected').length,
  };

  const filteredApplicants = allApplicants.filter(a => {
    // Tab filter
    if (activeTab === 'Eligible' && a.status !== 'Eligible') return false;
    if (activeTab === 'Shortlisted' && !(a.status === 'Review' || a.status === 'Under Review')) return false;
    if (activeTab === 'Rejected' && a.status !== 'Rejected') return false;
    
    // Search filter
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  });

  const getMatchIcon = (match: string) => {
    if (match === 'Excellent Match' || match === 'Good Match') return <CheckCircle2 size={16} className="text-emerald-500" />;
    if (match === 'Partial Match') return <AlertTriangle size={16} className="text-amber-500" />;
    return <XCircle size={16} className="text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Eligible':
        return <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Eligible</span>;
      case 'Review':
      case 'Under Review':
        return <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Review</span>;
      case 'Rejected':
        return <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Rejected</span>;
      case 'Accepted':
        return <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">Accepted</span>;
      default:
        return <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ═══════ Breadcrumb & Header ═══════ */}
      <div className="flex items-center justify-between border-b border-surface-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-txt-secondary mb-1">
            <Link to="/hiring" className="hover:text-brand-600 transition-colors">Hiring</Link>
            <ChevronRight size={16} />
            <span className="font-medium text-txt-primary">Applicants</span>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BriefcaseMedical size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-txt-primary">{job.title} – {job.shiftDate.split(' ')[0]}</h1>
              <p className="text-sm text-txt-secondary mt-1">{counts.All} Applicants</p>
            </div>
          </div>
        </div>
        <Button variant="outline">
          View Job Details
        </Button>
      </div>

      {/* ═══════ Search & Filters ═══════ */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['All', 'Eligible', 'Shortlisted', 'Rejected'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                  activeTab === tab 
                    ? "bg-brand-600 text-white" 
                    : "bg-white border border-surface-border text-txt-secondary hover:text-txt-primary hover:bg-slate-50"
                )}
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
              <input
                type="text"
                placeholder="Search applicants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <Button variant="outline" icon={<Filter size={16} />}>
              Filters
            </Button>
          </div>
        </div>

        {/* ═══════ Applicants Table ═══════ */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Provider Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Verification</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Specialty Match</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Applied On</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-txt-muted">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-txt-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="border-b border-surface-border last:border-b-0 hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex gap-3 items-center">
                        <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                           <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name)}&background=random`} alt={applicant.name} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-txt-primary">{applicant.name}</p>
                          <p className="text-xs text-txt-secondary mt-0.5">{applicant.qualifications}</p>
                          <p className="text-xs text-txt-muted mt-0.5">PMDC: {applicant.pmdcNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-txt-primary">{applicant.role}</p>
                      <p className="text-xs text-txt-secondary mt-1">{applicant.shift}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-txt-primary flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-brand-500" />
                        {applicant.verification}
                      </p>
                      <p className="text-xs text-txt-secondary mt-1 ml-5">PMDC Verified</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-txt-primary flex items-center gap-1.5">
                        {getMatchIcon(applicant.specialtyMatch)}
                        {applicant.specialtyMatch}
                      </p>
                      <p className="text-xs text-txt-secondary mt-1 ml-5">{job.specialty}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-txt-primary">{applicant.experienceYears}</p>
                      <p className="text-xs text-txt-secondary mt-1">{applicant.experienceDetails}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-txt-primary">{applicant.appliedDate}</p>
                      <p className="text-xs text-txt-secondary mt-1">{applicant.appliedTime}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(applicant.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="outline" 
                        className="w-full justify-center text-brand-700 border-brand-200 bg-brand-50 hover:bg-brand-100"
                        onClick={() => navigate(`/hiring/${jobId}/applicants/${applicant.id}`)}
                      >
                        View Candidate
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-txt-secondary">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={32} className="text-slate-300 mb-3" />
                        <p className="text-base font-medium text-txt-primary">No applicants found</p>
                        <p className="text-sm mt-1">We couldn't find any applicants matching the criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-surface-border p-4 flex items-center justify-between">
            <p className="text-sm text-txt-muted">Showing 1 to {filteredApplicants.length} of {filteredApplicants.length} applicants</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="px-2 py-1 text-txt-muted">{'<'}</Button>
              <Button variant="primary" className="px-3 py-1">1</Button>
              <Button variant="outline" className="px-2 py-1 text-txt-muted">{'>'}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
