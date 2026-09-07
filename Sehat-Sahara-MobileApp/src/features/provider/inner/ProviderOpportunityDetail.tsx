import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, Briefcase, MapPin, Clock, Building2, CheckCircle } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { useAppBack } from '../../../utils/navigation';

export const ProviderOpportunityDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = useAppBack();
  const [opp, setOpp] = useState<any | null>(null);
  const [applied, setApplied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const opportunity = PrototypeStore.getSnapshot().opportunities.find(o => o.id === id);
    if (opportunity) {
      setOpp(opportunity);
      // Check if current user already applied
      const application = PrototypeStore.getSnapshot().applications.find(a => a.opportunityId === id && a.providerId === 'USR-DOC-DEMO');
      if (application) {
        setApplied(true);
        setStatus(application.status);
      } else if (opportunity.status === 'Applied' || opportunity.status === 'Interviewing') {
         setApplied(true);
         setStatus(opportunity.status);
      }
    }
  }, [id]);

  if (!opp) return null;

  const handleApply = () => {
    // Generate a dummy application using current Profile as CV
    PrototypeStore.addApplication({
      id: `APP-${Math.random().toString(36).substr(2, 9)}`,
      opportunityId: opp.id,
      providerId: 'USR-DOC-DEMO', // Assume current user
      status: 'Submitted',
      appliedAt: new Date().toISOString()
    });
    setApplied(true);
    setStatus('Submitted');
    
    // For demo purposes, we also update the opportunity status if it was just "Open"
    if (opp.status === 'Open') {
      PrototypeStore.updateOpportunity(opp.id, { status: 'Applied' });
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <header className="px-4 py-4 pt-safe bg-white flex items-center border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate('/doctor/opportunities', { replace: true })} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 shrink-0" aria-label="Go back">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">Opportunity Details</h1>
          </div>
        </header>

        <div className="app-scroll flex-1 px-5 py-6 space-y-6 pb-28">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{opp.title}</h2>
            <div className="flex items-center gap-2 text-brand-700 font-bold mb-4">
              <Building2 className="w-5 h-5" />
              {opp.facility}
            </div>

            <div className="space-y-3 text-[14px] text-slate-600 mb-6 border-t border-b border-slate-100 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span>{opp.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <span>{opp.schedule}</span>
              </div>
              {opp.compensation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  <span className="font-bold text-green-700">{opp.compensation}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Requirements</h3>
              <p className="text-slate-600 text-[14px] leading-relaxed">
                {opp.requirements}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 text-[13px] text-slate-500 font-medium">
              Deadline: {opp.deadline}
            </div>
          </div>

          {applied && (
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900 mb-1">Application {status || 'Submitted'}</h3>
                <p className="text-[13px] text-emerald-700">Your profile was successfully submitted as your CV for this opportunity.</p>
              </div>
            </div>
          )}

        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          <Button onClick={applied ? () => goBack() : handleApply} variant={applied ? 'secondary' : 'primary'}>
            {applied ? 'Back to Opportunities' : 'Apply with Profile'}
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
