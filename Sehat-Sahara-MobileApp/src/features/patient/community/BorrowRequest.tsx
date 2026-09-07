import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { ProviderStore } from '../../../services/ProviderStore';

export const BorrowRequest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const listPath = isDoctor ? '/doctor/community/things' : '/patient/community/things';
  const detailPath = isDoctor ? '/doctor/community/things/' : '/patient/community/things/';

  const itemId = (location.state as any)?.itemId as string;
  const item = PrototypeStore.getSnapshot().sharedItems.find(i => i.id === itemId);

  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('7');

  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  const doctorIdentity = ProviderStore.getSnapshot().identity;
  const currentActorName = isDoctor ? (doctorIdentity.name || 'Dr. Ayesha Khan') : currentUser.name;
  const currentActorId = isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO';

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
            <h1 className="text-[17px] font-bold text-slate-900">Error</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Item Not Found</h2>
            <p className="text-xs text-slate-500 mb-6">Equipment ID was missing or the listing is no longer active.</p>
            <Button onClick={() => navigate(listPath, { replace: true })} className="bg-blue-600 text-white font-bold">
              Back to Things Sharing
            </Button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const handleSubmit = () => {
    PrototypeStore.updateSharedItem(item.id, { 
      state: 'REQUESTED' as any,
      borrowerName: currentActorName,
      borrowerId: currentActorId
    });

    // Notify Lender
    PrototypeStore.addNotification({
      id: `NOTIF-BORROW-${Date.now()}`,
      userId: item.ownerId,
      type: 'GENERAL',
      title: 'New Borrow Request',
      body: `${currentActorName} requested to borrow "${item.title}".`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `${detailPath}${item.id}`
    });
    
    // Navigate to Things Sharing with My Borrows tab
    navigate(listPath, { replace: true, state: { tab: 'MY_BORROWS' } });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(`${detailPath}${item.id}`, { replace: true })} 
              className="p-1 -ml-1 rounded-full active:bg-slate-100 text-slate-800"
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900">Request Equipment</h1>
          </div>
        </header>

        {/* Content */}
        <div className="app-scroll flex-1 p-5 pb-28 space-y-4">
          
          {/* Target Item Summary */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-6 h-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 text-xs truncate mb-0.5">{item.title}</h2>
              <p className="text-[11px] text-slate-500 truncate">{item.category} • Owner: {item.ownerName}</p>
              <span className="text-[10px] font-bold text-emerald-700 mt-1 inline-block">Free Community Lending</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Borrower Name
              </label>
              <input
                type="text"
                disabled
                value={currentActorName}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Duration Needed (Days)
              </label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="3">3 Days</option>
                <option value="7">7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks)</option>
                <option value="30">30 Days (1 Month)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Medical Purpose / Notes (Optional)
              </label>
              <textarea
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                rows={3}
                placeholder="Brief reason or mobility condition (e.g., recovery after knee surgery)..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            By submitting, you agree to coordinate collection and return the equipment in good condition to {item.ownerName}.
          </div>

        </div>

        {/* Footer Submit */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-safe shadow-lg">
          <Button 
            size="lg" 
            fullWidth 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Submit Borrow Request
          </Button>
        </div>

      </div>
    </MobileAppShell>
  );
};
