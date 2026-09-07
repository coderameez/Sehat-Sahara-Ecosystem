import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Info, Eye, Send, MapPin, Calendar, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { store } from '../../store';

export function CreateJobPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    providerRole: 'Doctor',
    specialty: 'General Medicine',
    facility: 'Sehat Sahara Medical & Diagnostic Center, Lahore',
    datePosted: '23 May 2025',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    compensation: '',
    description: '',
    shiftExpectations: 'Full-time',
    shiftPattern: '6 Days a Week'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    store.addJob({
      title: formData.title || 'Untitled Draft',
      providerRole: formData.providerRole,
      specialty: formData.specialty,
      shiftDate: formData.datePosted + ' (Morning)',
      time: `${formData.startTime} - ${formData.endTime}`,
      pay: formData.compensation ? `PKR ${formData.compensation} /month` : 'Not specified',
      closesOn: 'Draft'
    });
    navigate('/hiring');
  };

  const handlePublish = () => {
    // Basic validation
    if (!formData.title || !formData.compensation) {
      setErrorMsg("Please fill in Job Title and Compensation.");
      return;
    }
    setErrorMsg('');

    store.addJob({
      title: formData.title,
      providerRole: formData.providerRole,
      specialty: formData.specialty,
      shiftDate: formData.datePosted + ' (Morning)', // Simplified mapping
      time: `${formData.startTime} - ${formData.endTime}`,
      pay: `PKR ${formData.compensation} /month`,
      closesOn: '30 May 2025' // mock
    });
    
    navigate('/hiring');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* ═══════ Breadcrumb & Header ═══════ */}
      <div className="border-b border-surface-border pb-4">
        <div className="flex items-center gap-2 text-sm text-txt-secondary mb-1">
          <Link to="/hiring" className="hover:text-brand-600 transition-colors">Hiring</Link>
          <ChevronRight size={16} />
          <span className="font-medium text-txt-primary">Create Job</span>
        </div>
        <h1 className="text-2xl font-bold text-txt-primary">Create Job</h1>
      </div>
      
      {errorMsg && (
        <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl text-sm border border-rose-200 flex items-center gap-2">
          <Info size={16} />
          {errorMsg}
        </div>
      )}

      <div className="flex gap-6 items-start">
        
        {/* ═══════ Left Column: Form ═══════ */}
        <div className="flex-1 space-y-6">
          <h2 className="text-lg font-bold text-txt-primary">Job Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">Job Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Medical Officer (General Physician)"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">Provider Role <span className="text-red-500">*</span></label>
              <select
                value={formData.providerRole}
                onChange={(e) => handleInputChange('providerRole', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Specialist">Specialist</option>
              </select>
              <p className="text-xs text-txt-muted">Doctors must have valid PMDC registration.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">Specialty / Basic Requirement <span className="text-red-500">*</span></label>
              <select
                value={formData.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
              <p className="text-xs text-txt-muted">Select the specialty or basic requirement for this role.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">Facility <span className="text-red-500">*</span></label>
              <select
                value={formData.facility}
                onChange={(e) => handleInputChange('facility', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Sehat Sahara Medical & Diagnostic Center, Lahore">Sehat Sahara Medical & Diagnostic Center, Lahore</option>
                <option value="Sehat Poly Clinic, Peshawar">Sehat Poly Clinic, Peshawar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">Date Posted <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.datePosted}
                onChange={(e) => handleInputChange('datePosted', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">Start Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                value="09:00"
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-txt-secondary">End Time <span className="text-red-500">*</span></label>
              <input
                type="time"
                value="17:00"
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-txt-secondary">Compensation (PKR) <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. 80,000"
              value={formData.compensation}
              onChange={(e) => handleInputChange('compensation', e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <p className="text-xs text-txt-muted">Enter monthly compensation in PKR.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-txt-secondary">Job Description <span className="text-red-500">*</span></label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="We are looking for..."
              className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <p className="text-xs text-txt-muted text-right">240 / 1000</p>
          </div>

          <div className="space-y-1.5 border-b border-surface-border pb-6">
            <label className="text-sm font-medium text-txt-secondary">Shift Expectations <span className="text-red-500">*</span></label>
            <select
              value={formData.shiftExpectations}
              onChange={(e) => handleInputChange('shiftExpectations', e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-txt-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
            
            <p className="text-xs text-txt-muted mt-2">Select the expected shift pattern.</p>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-txt-primary">
                <input type="radio" name="shift" className="text-brand-600 focus:ring-brand-500 h-4 w-4" defaultChecked />
                6 Days a Week
              </label>
              <label className="flex items-center gap-2 text-sm text-txt-primary">
                <input type="radio" name="shift" className="text-brand-600 focus:ring-brand-500 h-4 w-4" />
                Weekly Off: Sunday
              </label>
              <label className="flex items-center gap-2 text-sm text-txt-primary">
                <input type="radio" name="shift" className="text-brand-600 focus:ring-brand-500 h-4 w-4" />
                1st Shift: 09:00 AM - 05:00 PM
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" className="text-txt-secondary" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button variant="outline" icon={<Eye size={16} />} onClick={() => setIsPreviewOpen(true)}>
              Preview
            </Button>
            <Button variant="primary" icon={<Send size={16} />} onClick={handlePublish}>
              Publish Job
            </Button>
          </div>
        </div>

        {/* ═══════ Right Column: Eligibility & Summary ═══════ */}
        <div className="w-80 shrink-0 space-y-6">
          <Card className="p-5 border-emerald-200 bg-emerald-50/30">
            <h3 className="font-bold text-txt-primary flex items-center gap-2 border-b border-emerald-100 pb-3 mb-4">
              <CheckCircle2 size={20} className="text-emerald-600" />
              Eligibility Preview
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-sm text-txt-primary flex items-center gap-1.5 mb-1">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Role Verification
                </p>
                <p className="text-sm font-medium text-txt-secondary ml-5">{formData.providerRole}</p>
                <p className="text-xs text-txt-muted ml-5 mt-1">✓ Valid role. PMDC registered doctors are eligible.</p>
              </div>
              
              <div>
                <p className="font-semibold text-sm text-txt-primary flex items-center gap-1.5 mb-1">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Specialty Verification
                </p>
                <p className="text-sm font-medium text-txt-secondary ml-5">{formData.specialty}</p>
                <p className="text-xs text-txt-muted ml-5 mt-1">✓ Valid specialty. Matches our requirement.</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-2">
                <Info size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800">
                  Only verified candidates matching the above role and specialty will be shown for this job.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-txt-primary border-b border-surface-border pb-3 mb-4">Posting Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Job Title</span>
                <span className="font-medium text-txt-primary text-right">{formData.title || '-'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Provider Role</span>
                <span className="text-txt-primary text-right">{formData.providerRole}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Specialty</span>
                <span className="text-txt-primary text-right">{formData.specialty}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Facility</span>
                <span className="text-txt-primary text-right line-clamp-2">{formData.facility}</span>
              </div>
              <div className="h-px bg-surface-border my-2" />
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Posted On</span>
                <span className="text-txt-primary text-right">{formData.datePosted}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Timing</span>
                <span className="text-txt-primary text-right">{formData.startTime} - {formData.endTime}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Compensation</span>
                <span className="text-txt-primary text-right">{formData.compensation ? `PKR ${formData.compensation} (Monthly)` : '-'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-txt-muted">Shift</span>
                <span className="text-txt-primary text-right line-clamp-2">{formData.shiftExpectations} ({formData.shiftPattern})</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <h3 className="text-xl font-bold text-txt-primary">Job Preview</h3>
              <button onClick={() => setIsPreviewOpen(false)} className="text-txt-muted hover:text-txt-primary">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="border-b border-surface-border pb-6">
                <h2 className="text-2xl font-bold text-txt-primary mb-2">{formData.title || 'Untitled Job'}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-txt-secondary">
                  <span className="flex items-center gap-1"><MapPin size={16}/> {formData.facility}</span>
                  <span className="flex items-center gap-1"><Calendar size={16}/> Posted: {formData.datePosted}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-sm text-txt-muted">Role</p>
                   <p className="font-medium text-txt-primary">{formData.providerRole}</p>
                 </div>
                 <div>
                   <p className="text-sm text-txt-muted">Specialty</p>
                   <p className="font-medium text-txt-primary">{formData.specialty}</p>
                 </div>
                 <div>
                   <p className="text-sm text-txt-muted">Compensation</p>
                   <p className="font-medium text-txt-primary">{formData.compensation ? `PKR ${formData.compensation} /month` : '-'}</p>
                 </div>
                 <div>
                   <p className="text-sm text-txt-muted">Timing</p>
                   <p className="font-medium text-txt-primary">{formData.startTime} - {formData.endTime}</p>
                 </div>
                 <div className="col-span-2">
                   <p className="text-sm text-txt-muted">Shift Pattern</p>
                   <p className="font-medium text-txt-primary">{formData.shiftExpectations} ({formData.shiftPattern})</p>
                 </div>
              </div>
              <div>
                <h4 className="font-bold text-txt-primary mb-2">Description</h4>
                <p className="text-txt-secondary text-sm whitespace-pre-wrap">{formData.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="p-6 border-t border-surface-border bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
               <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
               <Button variant="primary" onClick={() => { setIsPreviewOpen(false); handlePublish(); }}>Publish Job</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
