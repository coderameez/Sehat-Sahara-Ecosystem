import { useSyncExternalStore } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Phone, Mail, MapPin, Lock, Download, CheckCircle2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { store } from '../../store';

export function CandidateDetailPage() {
  const { jobId, applicantId } = useParams<{ jobId: string, applicantId: string }>();
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  
  const job = state.jobs.find(j => j.id === jobId);
  const applicant = state.applicants.find(a => a.id === applicantId);

  if (!job || !applicant) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-txt-primary">Candidate Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/hiring')}>Back to Hiring</Button>
      </div>
    );
  }

  const handleAccept = () => {
    store.updateApplicantStatus(applicant.id, 'Accepted');
    navigate(`/hiring/${jobId}/applicants`);
  };

  const handleReject = () => {
    store.updateApplicantStatus(applicant.id, 'Rejected');
    navigate(`/hiring/${jobId}/applicants`);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* ═══════ Breadcrumb & Header ═══════ */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-txt-secondary mb-1">
            <Link to="/hiring" className="hover:text-brand-600 transition-colors">Hiring</Link>
            <ChevronRight size={16} />
            <Link to={`/hiring/${jobId}/applicants`} className="hover:text-brand-600 transition-colors">Candidate Detail</Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-txt-primary">Candidate Detail</h1>
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              {applicant.status === 'Review' ? 'Under Review' : applicant.status}
            </span>
          </div>
        </div>
        <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate(`/hiring/${jobId}/applicants`)}>
          Back to Candidates
        </Button>
      </div>

      {/* ═══════ Top Banner: Candidate Identity ═══════ */}
      <Card className="flex items-start gap-8 p-6">
        <div className="flex items-start gap-6 flex-1">
          <div className="h-24 w-24 rounded-full bg-slate-200 overflow-hidden shrink-0 border-4 border-white shadow-sm">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.name)}&background=random&size=128`} alt={applicant.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <h2 className="text-2xl font-bold text-txt-primary">{applicant.name}</h2>
              <p className="text-brand-700 font-medium">{applicant.role}</p>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-txt-secondary">
              <p className="flex items-center gap-2"><Phone size={14} className="text-txt-muted" /> {applicant.phone || '0300-1234567'}</p>
              <p className="flex items-center gap-2"><Mail size={14} className="text-txt-muted" /> {applicant.email || 'email@example.com'}</p>
              <p className="flex items-center gap-2"><MapPin size={14} className="text-txt-muted" /> {applicant.address || 'Lahore, Punjab'}</p>
            </div>
          </div>
        </div>
        
        <div className="w-px h-24 bg-surface-border" />
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm w-96 shrink-0">
          <div>
            <p className="text-txt-muted mb-1">Application ID</p>
            <p className="font-medium text-txt-primary">{applicant.id}</p>
          </div>
          <div>
            <p className="text-txt-muted mb-1">Application For</p>
            <p className="font-medium text-txt-primary">{job.title}</p>
          </div>
          <div>
            <p className="text-txt-muted mb-1">Applied On</p>
            <p className="font-medium text-txt-primary">{applicant.appliedDate}, {applicant.appliedTime}</p>
          </div>
          <div>
            <p className="text-txt-muted mb-1">Shift</p>
            <p className="font-medium text-txt-primary">{job.shiftDate.split(' ')[0]}</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-6 items-start">
        {/* ═══════ Left Column ═══════ */}
        <div className="flex-1 space-y-6">
          
          <Card className="p-6">
            <h3 className="font-bold text-txt-primary border-b border-surface-border pb-3 mb-4">Professional Summary</h3>
            <p className="text-sm text-txt-secondary leading-relaxed">
              Dedicated and compassionate {job.title} with a strong clinical background and excellent patient care skills. Committed to evidence-based practice and continuous learning. Experienced in handling OPD cases independently and supporting senior consultants in diagnosis and treatment.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-end border-b border-surface-border pb-3 mb-4">
              <h3 className="font-bold text-txt-primary">Experience</h3>
              <p className="text-sm text-brand-600 font-medium">Total Experience: {applicant.experienceYears}</p>
            </div>
            
            <div className="space-y-6">
              <div className="relative pl-4 border-l-2 border-brand-100">
                <div className="absolute w-2 h-2 bg-brand-500 rounded-full -left-[5px] top-1.5" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-txt-primary">{applicant.role}</h4>
                    <p className="text-sm text-txt-secondary">Al-Noor Clinic, Lahore</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-txt-primary">Jun 2023 - Apr 2025</p>
                    <p className="text-xs text-txt-muted mt-0.5">1 year 10 months</p>
                  </div>
                </div>
              </div>
              <div className="relative pl-4 border-l-2 border-brand-100">
                <div className="absolute w-2 h-2 bg-brand-500 rounded-full -left-[5px] top-1.5" />
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-txt-primary">House Officer</h4>
                    <p className="text-sm text-txt-secondary">Services Hospital, Lahore</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-txt-primary">Jan 2022 - May 2023</p>
                    <p className="text-xs text-txt-muted mt-0.5">1 year 5 months</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-bold text-txt-primary border-b border-surface-border pb-3 mb-4">Availability</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <span className="text-txt-muted">Available From</span>
              <span className="font-medium text-txt-primary">22 May 2025</span>
              
              <span className="text-txt-muted">Preferred Shift</span>
              <span className="font-medium text-txt-primary">{job.time}</span>
              
              <span className="text-txt-muted">Days Available</span>
              <span className="font-medium text-txt-primary">Monday to Saturday</span>
              
              <span className="text-txt-muted">Notice Period</span>
              <span className="font-medium text-txt-primary">7 Days</span>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-bold text-txt-primary border-b border-surface-border pb-3 mb-4">Application Note</h3>
            <p className="text-sm text-txt-secondary italic bg-slate-50 p-4 rounded-lg border border-surface-border">
              "I am enthusiastic about joining Sehat Sahara Clinic and contributing to your mission of providing quality healthcare. I assure my best clinical skills and professionalism."
            </p>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button variant="primary" className="flex-1 justify-center py-2.5 text-base" onClick={handleAccept}>
              <CheckCircle2 size={18} className="mr-2" />
              Accept Candidate
            </Button>
            <Button variant="outline" className="flex-1 justify-center py-2.5 text-base text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={handleReject}>
              <X size={18} className="mr-2" />
              Reject Candidate
            </Button>
          </div>
          
        </div>

        {/* ═══════ Right Column ═══════ */}
        <div className="w-80 shrink-0 space-y-6">
          
          <Card className="p-5 border-emerald-200 bg-emerald-50/30">
            <h3 className="font-bold text-txt-primary flex items-center gap-2 border-b border-emerald-100 pb-3 mb-4">
              <CheckCircle2 size={18} className="text-emerald-600" />
              PMDC Verification (Read-Only)
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-txt-muted">Registration No.</span>
                <span className="font-medium text-txt-primary">{applicant.pmdcNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">Registration Status</span>
                <span className="font-medium text-emerald-600">{applicant.verification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">Registration Date</span>
                <span className="font-medium text-txt-primary">12 Mar 2021</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">Valid Upto</span>
                <span className="font-medium text-txt-primary">31 Dec 2025</span>
              </div>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-2 mt-4">
              <Lock size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-800">
                Verification is managed by Sehat Sahara Admin and cannot be edited here.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-txt-primary border-b border-surface-border pb-3 mb-4">Attached CV</h3>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-border hover:bg-slate-50 cursor-pointer transition-colors group">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-red-600 font-bold text-[10px]">
                PDF
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-txt-primary group-hover:text-brand-600 transition-colors line-clamp-1">{applicant.name.replace(/ /g, '_')}_CV.pdf</p>
                <p className="text-xs text-txt-muted mt-0.5">Uploaded on {applicant.appliedDate}</p>
              </div>
              <Download size={16} className="text-txt-muted group-hover:text-brand-600 transition-colors" />
            </div>
          </Card>
          
          <Card className="p-5">
            <h3 className="font-bold text-txt-primary border-b border-surface-border pb-3 mb-4">Role & Specialty Match</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-txt-muted">Role Match</span>
                <span className="font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-txt-muted">Specialty Match</span>
                <span className="font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">100%</span>
              </div>
              <p className="text-xs text-txt-muted mt-2">Based on candidate profile and job requirements.</p>
            </div>
          </Card>
          
          <Card className="p-5">
            <h3 className="font-bold text-txt-primary border-b border-surface-border pb-3 mb-4">Activity Timeline</h3>
            <div className="space-y-6 ml-2">
              
              <div className="relative pl-6 border-l-2 border-emerald-500">
                <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-0 flex items-center justify-center text-white">
                  <CheckCircle2 size={12} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-txt-primary">Application Submitted</h4>
                  <p className="text-xs text-txt-secondary mt-1">{applicant.appliedDate}, {applicant.appliedTime}</p>
                </div>
              </div>
              
              <div className="relative pl-6 border-l-2 border-emerald-500">
                <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-[9px] top-0 flex items-center justify-center text-white">
                  <CheckCircle2 size={12} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-txt-primary">Application Received</h4>
                  <p className="text-xs text-txt-secondary mt-1">Application received in the system.</p>
                </div>
              </div>
              
              <div className="relative pl-6 border-l-2 border-surface-border">
                <div className="absolute w-4 h-4 bg-emerald-100 border-2 border-emerald-500 rounded-full -left-[9px] top-0" />
                <div>
                  <h4 className="text-sm font-bold text-txt-primary">Under Review</h4>
                  <p className="text-xs text-txt-secondary mt-1">Application is under review by hiring team.</p>
                </div>
              </div>
              
              <div className="relative pl-6 border-l-2 border-surface-border">
                <div className="absolute w-4 h-4 bg-white border-2 border-slate-300 rounded-full -left-[9px] top-0" />
                <div>
                  <h4 className="text-sm font-bold text-txt-muted">Interview</h4>
                  <p className="text-xs text-txt-muted mt-1">Yet to be scheduled.</p>
                </div>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute w-4 h-4 bg-white border-2 border-slate-300 rounded-full -left-[9px] top-0" />
                <div>
                  <h4 className="text-sm font-bold text-txt-muted">Decision</h4>
                  <p className="text-xs text-txt-muted mt-1">Pending final decision.</p>
                </div>
              </div>

            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
