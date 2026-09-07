import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { 
  ChevronLeft, 
  Droplet, 
  MapPin, 
  Clock, 
  Search, 
  Heart, 
  Plus, 
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { ProviderStore } from '../../../services/ProviderStore';
import { BloodRequest } from '../../../models';
import { getBloodLabels } from './bloodI18n';

const BLOOD_GROUPS = ['All', 'Any Group', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const BloodRequests: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const basePath = isDoctor ? '/doctor/community/blood' : '/patient/community/blood';
  const parentPath = isDoctor ? '/doctor/community' : PATIENT_ROUTES.COMMUNITY;

  const initialTab = searchParams.get('tab') === 'PLEDGES' ? 'PLEDGES' : 'NEARBY';
  const [activeTab, setActiveTab] = useState<'NEARBY' | 'PLEDGES'>(initialTab);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(
    searchParams.get('newRequestId') ? `Request ${searchParams.get('newRequestId')} submitted successfully! Donors have been alerted.` : null
  );

  const [allRequests, setAllRequests] = useState<BloodRequest[]>(PrototypeStore.getSnapshot().bloodRequests);
  const userSnapshot = OnboardingStore.getSnapshot();
  const currentUser = userSnapshot.profile || FALLBACK_PROFILE;
  const doctorIdentity = ProviderStore.getSnapshot().identity;
  const currentActorName = isDoctor ? (doctorIdentity.name || 'Dr. Ayesha Khan') : currentUser.name;
  const currentActorId = isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO';
  const labels = getBloodLabels(userSnapshot.language);
  const isUrdu = (userSnapshot.language || '').toLowerCase() === 'ur';

  useEffect(() => {
    const unsub = PrototypeStore.subscribe(() => {
      setAllRequests(PrototypeStore.getSnapshot().bloodRequests);
    });
    return unsub;
  }, []);

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Recent';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recent';
    const now = new Date();
    const diffHours = Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Nearby requests exclude items created by the current user
  const nearbyRequests = allRequests.filter(req => 
    req.requesterId !== currentActorId && req.requesterName !== currentActorName
  );
  
  // My Requests includes items created by the user OR requests where the user pledged
  const myPledgedRequests = allRequests.filter(req => 
    req.requesterId === currentActorId ||
    req.requesterName === currentActorName || 
    (req.donorResponses && req.donorResponses.some(r => 
      r.donorId === currentActorId || 
      r.donorName === currentActorName || 
      (isDoctor && r.donorRole === 'doctor')
    ))
  );

  const displayedList = activeTab === 'NEARBY' ? nearbyRequests : myPledgedRequests;

  const filtered = displayedList.filter(req => {
    if (activeFilter === 'Any Group') {
      if (req.bloodGroup !== 'Any') return false;
    } else if (activeFilter !== 'All') {
      if (req.bloodGroup !== activeFilter && req.bloodGroup !== 'Any') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchHospital = (req.hospitalName || '').toLowerCase().includes(q);
      const matchLocation = (req.location || '').toLowerCase().includes(q);
      const matchPatient = (req.requesterName || '').toLowerCase().includes(q);
      if (!matchHospital && !matchLocation && !matchPatient) return false;
    }
    return true;
  });

  return (
    <MobileAppShell>
      <div className={`flex flex-col h-full bg-[#F8FAFC] relative overflow-hidden ${isUrdu ? 'rtl' : 'ltr'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="px-4 pt-3 pb-3 pt-safe bg-white border-b border-slate-200 shrink-0 z-10 sticky top-0 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <button 
              onClick={() => navigate(parentPath, { replace: true })} 
              className="w-10 h-10 min-w-[40px] flex items-center justify-center -ml-1 rounded-full active:bg-slate-100 text-slate-700 transition-colors" 
              aria-label="Go back"
            >
              <ChevronLeft className={`w-7 h-7 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-slate-900 leading-tight truncate">{labels.bloodRequests}</h1>
              <p className="text-xs text-slate-500 truncate">
                {isDoctor ? labels.providerSubtitle : labels.communitySubtitle}
              </p>
            </div>
          </div>

          {/* Primary Action Buttons: Donate Blood (Green) & Request Blood (Red) */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <button 
              onClick={() => navigate(`${basePath}/pledge`)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
            >
              <Droplet className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">{labels.donateBlood}</span>
            </button>
            <button 
              onClick={() => navigate(`${basePath}/create`)}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span className="truncate">{labels.requestBlood}</span>
            </button>
          </div>

          {/* Clean Single Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
            <button
              onClick={() => setActiveTab('NEARBY')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'NEARBY' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {labels.nearbyRequests} ({nearbyRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('PLEDGES')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'PLEDGES' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {labels.myRequests} ({myPledgedRequests.length})
            </button>
          </div>

          {/* Blood Group Filter Chips (Visually hidden scrollbar, padded, no clipping) */}
          <div className="flex gap-2 overflow-x-auto px-1 py-1 -mx-1 no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden scroll-smooth">
            {BLOOD_GROUPS.map(grp => (
              <button
                key={grp}
                onClick={() => setActiveFilter(grp)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                  activeFilter === grp 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grp === 'All' ? labels.all : grp === 'Any Group' ? labels.anyGroup : grp}
              </button>
            ))}
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="app-scroll flex-1 p-4 space-y-3.5 pb-24 overflow-y-auto">
          
          {/* Confirmation Notice Banner */}
          {confirmationNotice && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start justify-between gap-2 text-xs text-emerald-800 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{confirmationNotice}</span>
              </div>
              <button 
                onClick={() => setConfirmationNotice(null)} 
                className="text-emerald-600 hover:text-emerald-900 p-0.5"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Search Field */}
          <div className="relative">
            <Search className={`w-4 h-4 text-slate-400 absolute ${isUrdu ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
            <input 
              type="text"
              placeholder={labels.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full ${isUrdu ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs transition-all`}
            />
          </div>

          {/* Request Cards List */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center my-4">
              <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-slate-900 font-bold text-sm mb-1">{labels.noRequestsFound}</h3>
              <p className="text-slate-500 text-xs">{labels.noRequestsDesc}</p>
            </div>
          ) : (
            filtered.map(req => {
              const hasPledged = Boolean(
                req.donorResponses && req.donorResponses.some(r => 
                  r.donorId === currentActorId || 
                  r.donorName === currentActorName || 
                  (isDoctor && r.donorRole === 'doctor')
                )
              );

              return (
                <div 
                  key={req.id} 
                  onClick={() => navigate(`${basePath}/${req.id}`)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-red-200 shadow-sm p-4 cursor-pointer active:scale-[0.99] transition-all group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') navigate(`${basePath}/${req.id}`); }}
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Blood Group Badge */}
                    <div className="w-13 h-13 min-w-[52px] bg-red-50 rounded-xl border border-red-100 flex flex-col items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                      <Droplet className="w-4 h-4 text-red-600 fill-current mb-0.5" />
                      <span className="font-black text-red-700 text-sm leading-none">
                        {req.bloodGroup || 'Any'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5 gap-2">
                        <h3 className="font-bold text-slate-900 text-[15px] truncate">
                          {req.hospitalName || 'Hospital'}
                        </h3>
                        {req.urgency === 'URGENT' && (
                          <span className="bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0">
                            {labels.urgent}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-700 mb-2 truncate">
                        {req.unitsRequired} {req.unitsRequired === 1 ? labels.unit : labels.units} {labels.requiredFor} {req.requesterName || 'Patient'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 truncate max-w-[170px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{req.location || 'Location specified'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{formatTime(req.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pledge Banner & View Details CTA */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    {hasPledged ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        <span>{labels.youPledged}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        {labels.tapToView}
                      </span>
                    )}
                    <span className="text-red-600 font-bold text-[12px] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      {labels.viewDetails}
                      <ChevronRight className={`w-3.5 h-3.5 ${isUrdu ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </MobileAppShell>
  );
};
