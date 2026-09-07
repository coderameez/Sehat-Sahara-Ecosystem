import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Plus, Package, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { ProviderStore } from '../../../services/ProviderStore';
import { SharedItem } from '../../../models';

const CATEGORIES = ['All', 'Wheelchair', 'Crutches', 'Oxygen', 'Walking Frame', 'Hospital Bed', 'Other'];

type TabState = 'EXPLORE' | 'MY_ITEMS' | 'MY_BORROWS';

export const ThingsSharing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const basePath = isDoctor ? '/doctor/community/things' : '/patient/community/things';
  const parentPath = isDoctor ? '/doctor/community' : PATIENT_ROUTES.COMMUNITY;

  const initialTab = ((location.state as any)?.tab as TabState) || 'EXPLORE';
  const [activeTab, setActiveTab] = useState<TabState>(initialTab);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [allItems, setAllItems] = useState<SharedItem[]>(PrototypeStore.getSnapshot().sharedItems);
  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  const doctorIdentity = ProviderStore.getSnapshot().identity;
  const currentActorName = isDoctor ? (doctorIdentity.name || 'Dr. Ayesha Khan') : currentUser.name;
  const currentActorId = isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO';

  useEffect(() => {
    if ((location.state as any)?.tab) {
      setActiveTab((location.state as any).tab);
    }
  }, [location.state]);

  useEffect(() => {
    const unsub = PrototypeStore.subscribe(() => {
      setAllItems(PrototypeStore.getSnapshot().sharedItems);
    });
    return unsub;
  }, []);

  const handleBack = () => {
    if (activeTab === 'MY_BORROWS' || activeTab === 'MY_ITEMS') {
      setActiveTab('EXPLORE');
    } else {
      navigate(parentPath, { replace: true });
    }
  };

  const exploreItems = allItems.filter(item => item.ownerName !== currentActorName && (item.state === 'AVAILABLE' || item.state === 'REQUESTED'));
  const myItems = allItems.filter(item => item.ownerName === currentActorName);
  const myBorrows = allItems.filter(item => 
    item.borrowerName === currentActorName || 
    item.borrowerId === currentActorId ||
    (isDoctor && item.borrowerName?.includes('Dr.'))
  );

  const filteredExplore = exploreItems.filter(item => {
    if (activeCategory !== 'All' && item.category !== activeCategory) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC] relative">
        
        {/* Header */}
        <header className="px-4 py-4 pt-safe bg-white border-b border-slate-200 flex-shrink-0 z-10 sticky top-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBack} 
                className="w-10 h-10 min-w-[40px] flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700" 
                aria-label="Go back"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Things Sharing</h1>
                <p className="text-xs text-slate-500">{isDoctor ? 'Provider Equipment Sharing' : 'Community Equipment'}</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate(`${basePath}/add`)}
              className="bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Item</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
            <button
              onClick={() => setActiveTab('EXPLORE')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'EXPLORE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Explore ({exploreItems.length})
            </button>
            <button
              onClick={() => setActiveTab('MY_BORROWS')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'MY_BORROWS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              My Borrows ({myBorrows.length})
            </button>
            <button
              onClick={() => setActiveTab('MY_ITEMS')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'MY_ITEMS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              My Shared ({myItems.length})
            </button>
          </div>

          {/* Categories */}
          {activeTab === 'EXPLORE' && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategory === cat ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="app-scroll flex-1 p-4 space-y-4 pb-20">
          
          {activeTab === 'EXPLORE' && (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search wheelchair, crutches, oxygen..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {filteredExplore.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => navigate(`${basePath}/${item.id}`, { state: { fromTab: 'EXPLORE' } })}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer flex flex-col"
                  >
                    <div className="h-28 bg-slate-100 relative overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded text-[10px] font-bold text-slate-700">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1">{item.title}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-emerald-700 font-bold">{item.condition}</span>
                        <span className="text-blue-600 font-bold">Details →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'MY_BORROWS' && (
            <div className="space-y-3">
              {myBorrows.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center mt-4">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-slate-900 font-bold text-sm mb-1">No active borrow requests</h3>
                  <p className="text-slate-500 text-xs mb-4">Browse equipment listings to borrow medical supplies.</p>
                  <button 
                    onClick={() => setActiveTab('EXPLORE')} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Browse Equipment
                  </button>
                </div>
              ) : (
                myBorrows.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => navigate(`${basePath}/${item.id}`, { state: { fromTab: 'MY_BORROWS' } })}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm cursor-pointer hover:border-blue-300 active:scale-[0.99] transition-all flex items-center gap-3.5"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{item.title}</h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold uppercase tracking-wider">
                          {item.state}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mb-1.5">Lender: {item.ownerName}</p>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tap to view lifecycle status & handover</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'MY_ITEMS' && (
            <div className="space-y-3">
              {myItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center mt-4">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-slate-900 font-bold text-sm mb-1">No items shared yet</h3>
                  <p className="text-slate-500 text-xs mb-4">Lend spare equipment or aids to community members.</p>
                  <button 
                    onClick={() => navigate(`${basePath}/add`)} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    + Add New Item
                  </button>
                </div>
              ) : (
                myItems.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => navigate(`${basePath}/${item.id}`, { state: { fromTab: 'MY_ITEMS' } })}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm cursor-pointer hover:border-blue-300 active:scale-[0.99] transition-all flex items-center gap-3.5"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{item.title}</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                          {item.state}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{item.category} • {item.condition}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </MobileAppShell>
  );
};
