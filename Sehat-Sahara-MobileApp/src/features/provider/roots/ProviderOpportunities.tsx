import React, { useState } from 'react';
import { ProviderRootLayout } from '../components/ProviderRootLayout';
import { ProviderStore } from '../../../services/ProviderStore';
import { Button } from '../../../components';
import { Briefcase, MapPin, Clock, Search, Filter, Bookmark, Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProviderOpportunities: React.FC = () => {
  const state = ProviderStore.getSnapshot();
  const { opportunities, journey } = state;
  const [activeTab, setActiveTab] = useState<'Discover' | 'Saved' | 'Applications' | 'My Posts'>('Discover');
  const navigate = useNavigate();

  const canPost = (journey as string) === 'independent_doctor' || (journey as string) === 'facility_owner';

  const filteredOpportunities = opportunities.filter(o => {
    if (activeTab === 'Discover') return o.status === 'Open' || o.status === 'Saved';
    if (activeTab === 'Saved') return o.status === 'Saved';
    if (activeTab === 'Applications') return o.status === 'Applied' || o.status === 'Interviewing';
    if (activeTab === 'My Posts') return true; // Show all dummy ones for now as their own posts
    return false;
  });

  return (
    <ProviderRootLayout activeTab="opportunities">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 pt-4 pb-2 bg-white border-b border-slate-200 shrink-0 pt-safe">
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900">Opportunities</h1>
            {canPost && (
              <button 
                onClick={() => navigate('/doctor/opportunities/post')}
                className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 active:bg-brand-100"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-4">
            {journey === 'medical_student' 
              ? 'Find internships, electives, and clinical observerships.' 
              : 'Find locums, shifts, and specialist roles.'}
          </p>
          
          <div className="flex bg-slate-100 p-1 rounded-xl mb-2">
            <button
              onClick={() => setActiveTab('Discover')}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'Discover' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('Saved')}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'Saved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Saved
            </button>
            <button
              onClick={() => setActiveTab('Applications')}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'Applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Applications
            </button>
            {canPost && (
              <button
                onClick={() => setActiveTab('My Posts')}
                className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'My Posts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                My Posts
              </button>
            )}
          </div>
        </header>

        {/* List */}
        <div className="flex-1 min-h-0 app-scroll p-5 space-y-4">
          
          {activeTab === 'Discover' && (
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search roles..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <button className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 active:bg-slate-50 flex-shrink-0">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          )}

          {filteredOpportunities.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center mt-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-1">No {activeTab.toLowerCase()} opportunities</h3>
              <p className="text-slate-500 text-sm">Check back later for new roles.</p>
            </div>
          ) : (
            filteredOpportunities.map(opp => (
              <div key={opp.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                
                <div className="flex justify-between items-start mb-3">
                  <div className="pr-4">
                    <h3 className="font-bold text-slate-900 text-[16px] leading-tight mb-1">{opp.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-brand-700 font-bold">
                      <Building2 className="w-4 h-4" />
                      {opp.facility}
                    </div>
                  </div>
                  {opp.status === 'Saved' && (
                    <button className="text-brand-600 p-1 bg-brand-50 rounded-full">
                      <Bookmark className="w-5 h-5 fill-current" />
                    </button>
                  )}
                  {(opp.status === 'Applied' || opp.status === 'Interviewing') && (
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      opp.status === 'Interviewing' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {opp.status}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-[13px] text-slate-500 font-medium mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{opp.schedule}</span>
                  </div>
                  {opp.compensation && (
                    <div className="inline-block mt-1 px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded text-xs">
                      {opp.compensation}
                    </div>
                  )}
                </div>
                
                <div className="text-[12px] text-slate-500 border-t border-slate-100 pt-3 mb-4">
                  <span className="font-bold text-slate-700">Req:</span> {opp.requirements}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Deadline: {opp.deadline}</span>
                  <div className="flex gap-2">
                    {activeTab === 'Discover' && (
                      <Button variant="primary" size="sm" className="px-6" onClick={() => navigate(`/doctor/opportunities/${opp.id}`)}>Apply</Button>
                    )}
                    {(activeTab === 'Saved' || activeTab === 'Applications') && (
                      <Button variant="secondary" size="sm" className="px-4" onClick={() => navigate(`/doctor/opportunities/${opp.id}`)}>Details</Button>
                    )}
                    {activeTab === 'My Posts' && (
                      <Button variant="primary" size="sm" className="px-4" onClick={() => navigate(`/doctor/opportunities/${opp.id}/applicants`)}>
                        Applicants {(opp as any).applicantsCount ? `(${(opp as any).applicantsCount})` : ''}
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </ProviderRootLayout>
  );
};
