import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';

export const ProviderPostOpportunity: React.FC = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [facility, setFacility] = useState('');
  const [location, setLocation] = useState('');
  const [compensation, setCompensation] = useState('');
  const [schedule, setSchedule] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('');

  const handlePost = () => {
    if (!title || !facility || !location) return;
    
    const opp = {
      id: `opp-${Math.random().toString(36).substr(2, 9)}`,
      title,
      facility,
      location,
      compensation,
      schedule,
      requirements,
      deadline: deadline || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      status: 'Open' as const,
      applicantsCount: 0
    };
    
    PrototypeStore.addOpportunity(opp);
    navigate('/doctor/opportunities', { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <header className="px-4 py-4 pt-safe bg-white flex items-center border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate('/doctor/opportunities', { replace: true })} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 shrink-0" aria-label="Go back">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">Post Opportunity</h1>
          </div>
        </header>

        <div className="app-scroll flex-1 px-5 py-6 space-y-6 pb-28">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Job Title / Role</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Locum GP for Night Shift" className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Facility Name</label>
            <input type="text" value={facility} onChange={e => setFacility(e.target.value)} placeholder="e.g. City Care Clinic" className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Gulshan-e-Iqbal, Karachi" className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Compensation</label>
            <input type="text" value={compensation} onChange={e => setCompensation(e.target.value)} placeholder="e.g. Rs. 2500 / hr" className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Schedule</label>
            <input type="text" value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="e.g. 8 PM - 8 AM (Weekends)" className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Requirements</label>
            <textarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="e.g. Valid PMDC, 1 yr experience..." className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deadline (YYYY-MM-DD)</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          <Button onClick={handlePost} disabled={!title || !facility || !location}>
            Post Opportunity
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
