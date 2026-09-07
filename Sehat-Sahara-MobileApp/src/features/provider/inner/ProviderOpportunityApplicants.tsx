import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, User, Check, X } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
// Using any for now to resolve types


export const ProviderOpportunityApplicants: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opp, setOpp] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    const store = PrototypeStore.getSnapshot();
    const opportunity = store.opportunities.find(o => o.id === id);
    if (opportunity) {
      setOpp(opportunity);
      // Get dummy applicants or actual ones
      let apps = store.applications.filter(a => a.opportunityId === id);
      
      // If none, inject some dummy ones for demo if applicantsCount > 0
      if (apps.length === 0 && opportunity.applicantsCount) {
        apps = Array.from({ length: opportunity.applicantsCount }).map((_, i) => ({
          id: `app-dummy-${i}`,
          opportunityId: id || '',
          providerId: `USR-DOC-DUMMY-${i}`,
          providerName: `Dr. Candidate ${i + 1}`,
          status: i === 0 ? 'Interviewing' : 'Submitted',
          appliedAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString()
        }));
      }
      setApplicants(apps);
    }
  }, [id]);

  if (!opp) return null;

  const handleUpdateStatus = (appId: string, newStatus: string) => {
    // We update local state for the demo
    setApplicants(apps => apps.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    // If it was a real app in store, update it
    PrototypeStore.updateApplication(appId, { status: newStatus as any });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <header className="px-4 py-4 pt-safe bg-white flex items-center border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate('/doctor/opportunities', { replace: true })} className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 shrink-0" aria-label="Go back">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2 flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">Applicants</h1>
            <p className="text-[13px] text-slate-500 truncate">{opp.title}</p>
          </div>
        </header>

        <div className="app-scroll flex-1 px-5 py-6 space-y-4">
          {applicants.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              No applicants yet.
            </div>
          ) : (
            applicants.map(app => (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-slate-900">{app.providerName || 'Ali Raza'}</h3>
                    <p className="text-[13px] text-slate-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'Interviewing' ? 'bg-purple-100 text-purple-700' :
                      app.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'Declined' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">View Profile</Button>
                  
                  {app.status === 'Submitted' && (
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => handleUpdateStatus(app.id, 'Interviewing')}>
                      Interview
                    </Button>
                  )}
                  
                  {app.status === 'Interviewing' && (
                    <>
                      <button onClick={() => handleUpdateStatus(app.id, 'Accepted')} className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleUpdateStatus(app.id, 'Declined')} className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 border border-red-100">
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MobileAppShell>
  );
};
