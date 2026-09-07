import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { 
  ChevronLeft, Package, MapPin, 
  MessageSquare, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { ProviderStore } from '../../../services/ProviderStore';

const STATUS_LIFECYCLE = [
  'REQUESTED',
  'ACCEPTED',
  'HANDOVER',
  'RECEIVED',
  'RETURN_DUE',
  'RETURNED',
  'CLOSED'
] as const;

export const SharedItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const listPath = isDoctor ? '/doctor/community/things' : '/patient/community/things';
  const borrowPath = isDoctor ? '/doctor/community/things/borrow' : '/patient/community/things/borrow';
  const chatPath = isDoctor ? '/doctor/community/chat' : '/patient/community/chat';

  const [storeSnapshot, setStoreSnapshot] = useState(PrototypeStore.getSnapshot());
  useEffect(() => {
    return PrototypeStore.subscribe(() => {
      setStoreSnapshot(PrototypeStore.getSnapshot());
    });
  }, []);

  const item = storeSnapshot.sharedItems.find(i => i.id === id);

  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  const doctorIdentity = ProviderStore.getSnapshot().identity;
  const currentActorName = isDoctor ? (doctorIdentity.name || 'Dr. Ayesha Khan') : currentUser.name;
  const currentActorId = isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO';

  const isMyItem = item?.ownerName === currentActorName;
  const isBorrowedByMe = item?.borrowerName === currentActorName || item?.borrowerId === currentActorId;

  const handleBack = () => {
    const fromTab = (location.state as any)?.fromTab;
    if (fromTab) {
      navigate(listPath, { replace: true, state: { tab: fromTab } });
    } else if (isBorrowedByMe) {
      navigate(listPath, { replace: true, state: { tab: 'MY_BORROWS' } });
    } else if (isMyItem) {
      navigate(listPath, { replace: true, state: { tab: 'MY_ITEMS' } });
    } else {
      navigate(listPath, { replace: true, state: { tab: 'EXPLORE' } });
    }
  };

  // Recovery UI for invalid ID
  if (!item) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-[#F8FAFC]">
          <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 flex items-center">
            <button 
              onClick={() => navigate(listPath, { replace: true })} 
              className="p-1 -ml-1 rounded-full active:bg-slate-100 mr-2 text-slate-800"
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900">Item Not Found</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Equipment Not Found</h2>
            <p className="text-xs text-slate-500 mb-6 max-w-xs">
              This item could not be found or has been removed from the sharing network.
            </p>
            <Button 
              onClick={() => navigate(listPath, { replace: true })} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Browse Equipment Directory
            </Button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const handleAdvanceStatus = () => {
    const currentIndex = STATUS_LIFECYCLE.indexOf(item.state as any);
    const nextIndex = (currentIndex + 1) % STATUS_LIFECYCLE.length;
    const nextState = STATUS_LIFECYCLE[nextIndex];
    PrototypeStore.updateSharedItem(item.id, { 
      state: nextState as any,
      ...(nextState === 'CLOSED' ? { borrowerName: undefined, borrowerId: undefined } : {})
    });
  };

  const handleOpenChat = () => {
    navigate(chatPath, {
      state: {
        type: 'THINGS',
        contextTitle: `Borrow: ${item.title}`,
        otherPartyName: isMyItem ? (item.borrowerName || 'Borrower') : item.ownerName,
        locationInfo: item.location
      }
    });
  };

  const handleRequestBorrow = () => {
    navigate(borrowPath, { state: { itemId: item.id } });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleBack} 
              className="mr-3 p-1 -ml-1 rounded-full active:bg-slate-100 text-slate-800" 
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <div>
              <h1 className="text-[17px] font-bold text-slate-900 leading-tight truncate max-w-[200px]">{item.title}</h1>
              <p className="text-[11px] text-slate-500">{item.category}</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
            {item.state}
          </span>
        </header>

        <div className="app-scroll flex-1 p-5 pb-28 space-y-4">
          
          {/* Image & Main Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-44 bg-slate-100 relative">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Package className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.location} ({item.distanceKm} km away)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Condition</span>
                  <p className="font-bold text-emerald-800">{item.condition || 'Excellent'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Lender / Owner</span>
                  <p className="font-bold text-slate-900 truncate">{item.ownerName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Borrow Status Banner (if borrowed by current actor) */}
          {isBorrowedByMe && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Your Borrow Request is Active</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-200 text-blue-900 font-black text-[10px] rounded uppercase">
                  {item.state}
                </span>
              </div>

              <p className="text-xs text-blue-800 leading-relaxed">
                Status progression: requested ➔ accepted ➔ handover ➔ received ➔ return_due ➔ returned.
              </p>

              <div className="flex gap-2 pt-1">
                <Button 
                  size="sm" 
                  fullWidth 
                  onClick={handleAdvanceStatus}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Advance Status (Demo)</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleOpenChat}
                  className="border-blue-300 text-blue-800 text-xs font-bold"
                  icon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Chat
                </Button>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Borrowing Policy</h3>
            <p className="text-slate-600 leading-relaxed">
              Medical equipment shared through Sehat Sahara is free of charge for community members in need. Please handle with care and return promptly when recovery is complete.
            </p>
          </div>

        </div>

        {/* Footer Action */}
        {!isMyItem && !isBorrowedByMe && (
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-safe shadow-lg">
            <Button 
              size="lg" 
              fullWidth 
              onClick={handleRequestBorrow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" /> Request to Borrow
            </Button>
          </div>
        )}

      </div>
    </MobileAppShell>
  );
};
