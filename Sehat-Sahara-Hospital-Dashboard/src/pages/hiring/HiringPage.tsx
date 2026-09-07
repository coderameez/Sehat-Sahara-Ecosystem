import { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, UserCheck, Plus, MoreHorizontal, CheckCircle2, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { store } from '../../store';
import clsx from 'clsx';

export function HiringPage() {
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [activeTab, setActiveTab] = useState<'Active' | 'Draft' | 'Closed'>('Active');

  const filteredJobs = state.jobs.filter(job => job.status === activeTab);

  return (
    <div className="space-y-6">
      
      {/* ═══════ Header & Tabs ═══════ */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-8">
          <div className="flex gap-6">
            {(['Active', 'Draft', 'Closed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "pb-4 text-sm font-semibold transition-colors relative -mb-[17px]",
                  activeTab === tab 
                    ? "text-brand-600" 
                    : "text-txt-secondary hover:text-txt-primary"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => navigate('/hiring/new')}
        >
          Create Job
        </Button>
      </div>

      {/* ═══════ KPI Cards ═══════ */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="flex items-center p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Briefcase size={24} />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-txt-secondary">Active Jobs</p>
            <p className="text-2xl font-bold text-txt-primary">{state.jobs.filter(j => j.status === 'Active').length}</p>
            <p className="text-xs text-txt-muted mt-1">8 published • 4 closing soon</p>
          </div>
        </Card>
        
        <Card className="flex items-center p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Users size={24} />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-txt-secondary">New Applicants</p>
            <p className="text-2xl font-bold text-txt-primary">48</p>
            <p className="text-xs text-txt-muted mt-1">In last 7 days</p>
          </div>
        </Card>
        
        <Card className="flex items-center p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserCheck size={24} />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-txt-secondary">Filled This Month</p>
            <p className="text-2xl font-bold text-txt-primary">5</p>
            <p className="text-xs text-txt-muted mt-1">May 2025</p>
          </div>
        </Card>
      </div>

      {/* ═══════ Jobs Table ═══════ */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Provider Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Specialty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Shift Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Pay</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-txt-muted">Applications</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-txt-muted">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => navigate(`/hiring/${job.id}/applicants`)}
                  className="cursor-pointer border-b border-surface-border last:border-b-0 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-txt-primary">{job.title}</p>
                    <p className="text-xs text-txt-secondary mt-1">Job ID: {job.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      {job.providerRole}
                    </span>
                    <p className="text-xs text-emerald-700 flex items-center gap-1 mt-1.5 font-medium">
                      <CheckCircle2 size={12} /> Eligible for Verification
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-txt-primary font-medium">
                    {job.specialty}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-txt-primary">{job.shiftDate}</p>
                    <p className="text-xs text-txt-secondary mt-1">{job.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-txt-primary">{job.pay.split(' /')[0]}</p>
                    <p className="text-xs text-txt-secondary">/{job.pay.split(' /')[1]}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-bold text-txt-primary">{job.applicationsCount}</p>
                    {job.newApplicationsCount > 0 && (
                      <p className="text-xs font-medium text-brand-600 mt-0.5">({job.newApplicationsCount} New)</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {job.status}
                    </span>
                    <p className="text-xs text-txt-muted mt-1.5">Closes: {job.closesOn}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="rounded-lg p-1.5 text-txt-muted hover:bg-slate-100 hover:text-txt-primary transition-colors border border-surface-border"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-txt-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-slate-300 mb-3" />
                      <p className="text-base font-medium text-txt-primary">No jobs found</p>
                      <p className="text-sm mt-1">We couldn't find any {activeTab.toLowerCase()} jobs.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-surface-border p-4 flex items-center justify-between">
          <p className="text-sm text-txt-muted">Showing 1 to {filteredJobs.length} of {filteredJobs.length} jobs</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="px-2 py-1 text-txt-muted">{'<'}</Button>
            <Button variant="primary" className="px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="px-3 py-1">3</Button>
            <Button variant="outline" className="px-2 py-1 text-txt-muted">{'>'}</Button>
          </div>
        </div>
      </Card>
      
    </div>
  );
}
