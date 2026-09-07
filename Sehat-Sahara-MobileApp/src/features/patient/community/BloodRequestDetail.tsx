import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell, Button, BottomSheet } from '../../../components';
import { 
  ChevronLeft, Droplet, Building2, Clock, 
  AlertCircle, MessageSquare, CheckCircle2
} from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { ProviderStore } from '../../../services/ProviderStore';
import { BloodDonorResponse } from '../../../models';
import { getBloodLabels } from './bloodI18n';

export const BloodRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const mainPath = isDoctor ? '/doctor/community/blood' : '/patient/community/blood';
  const chatPath = isDoctor ? '/doctor/community/chat' : '/patient/community/chat';

  const [storeSnapshot, setStoreSnapshot] = useState(PrototypeStore.getSnapshot());
  useEffect(() => {
    return PrototypeStore.subscribe(() => {
      setStoreSnapshot(PrototypeStore.getSnapshot());
    });
  }, []);

  const request = storeSnapshot.bloodRequests.find(r => r.id === id);

  const userSnapshot = OnboardingStore.getSnapshot();
  const currentUser = userSnapshot.profile || FALLBACK_PROFILE;
  const doctorIdentity = ProviderStore.getSnapshot().identity;
  const currentActorName = isDoctor ? (doctorIdentity.name || 'Dr. Ayesha Khan') : currentUser.name;
  const currentActorId = isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO';
  const labels = getBloodLabels(userSnapshot.language);
  const isUrdu = (userSnapshot.language || '').toLowerCase() === 'ur';

  const [confirmPledgeModal, setConfirmPledgeModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);

  // Recovery UI for invalid ID (Specification: show "This blood request is no longer available" + Back to Blood Requests)
  if (!request) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-[#F8FAFC]">
          <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 flex items-center">
            <button 
              onClick={() => navigate(mainPath, { replace: true })} 
              className="p-1 -ml-1 rounded-full active:bg-slate-100 mr-2 text-slate-800"
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-[17px] font-bold text-slate-900">{labels.requestNotFound}</h1>
          </header>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">{labels.requestUnavailable}</h2>
            <p className="text-xs text-slate-500 mb-6 max-w-xs leading-relaxed">
              This request may have been fulfilled, removed, or the link has expired.
            </p>
            <Button 
              onClick={() => navigate(mainPath, { replace: true })} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {labels.backToRequests}
            </Button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  const isMyRequest = request.requesterId === currentActorId || request.requesterName === currentActorName;
  const donorResponses = request.donorResponses || [];
  const myPledge = donorResponses.find(r => r.donorId === currentActorId || r.donorName === currentActorName);
  const hasPledged = Boolean(myPledge);

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

  const handleConfirmPledge = () => {
    const newResponse: BloodDonorResponse = {
      id: `RESP-${Date.now()}`,
      requestId: request.id,
      donorId: currentActorId,
      donorName: currentActorName,
      donorRole: isDoctor ? 'doctor' : 'patient',
      status: 'ACCEPTED',
      respondedAt: new Date().toISOString()
    };

    PrototypeStore.addBloodDonorResponse(request.id, newResponse);
    setConfirmPledgeModal(false);
  };

  const handleWithdrawPledge = () => {
    PrototypeStore.withdrawBloodDonorResponse(request.id, currentActorId);
    setWithdrawModal(false);
  };

  const handleOpenChat = (otherParty: string) => {
    navigate(chatPath, {
      state: {
        type: 'BLOOD',
        contextTitle: `Blood Donation: ${request.bloodGroup}`,
        otherPartyName: otherParty,
        locationInfo: request.hospitalName
      }
    });
  };

  return (
    <MobileAppShell>
      <div className={`flex flex-col h-full bg-[#F8FAFC] ${isUrdu ? 'rtl' : 'ltr'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(mainPath, { replace: true })} 
              className="mr-3 p-1 -ml-1 rounded-full active:bg-slate-100 text-slate-800 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className={`w-7 h-7 ${isUrdu ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="text-[17px] font-bold text-slate-900 leading-tight">{labels.viewDetails}</h1>
              <p className="text-[11px] text-slate-500">{request.id}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            request.state === 'FULFILLED' ? 'bg-emerald-100 text-emerald-800' :
            request.state === 'RESPONDED' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {request.state}
          </span>
        </header>

        <div className="app-scroll flex-1 p-5 pb-28 space-y-4 overflow-y-auto">
          
          {/* Main Hero Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <div className="w-18 h-18 bg-red-50 rounded-2xl border-2 border-red-100 flex flex-col items-center justify-center mx-auto mb-3">
              <Droplet className="w-7 h-7 text-red-600 fill-current mb-0.5" />
              <span className="font-black text-red-700 text-xl leading-none">{request.bloodGroup || 'Any'}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {request.unitsRequired} {request.unitsRequired === 1 ? labels.unit : labels.units} {labels.requiredFor} {request.requesterName}
            </h2>
            <p className="text-xs text-slate-500 mb-4">{request.hospitalName || 'Hospital Center'}</p>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              request.urgency === 'URGENT' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {request.urgency === 'URGENT' ? labels.urgent : 'Standard Schedule'}
            </div>

            <div className="grid grid-cols-2 gap-3 text-left border-t border-slate-100 pt-4 mt-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Care Recipient</span>
                <p className="font-bold text-slate-900 truncate">{request.requesterName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Location Area</span>
                <p className="font-bold text-slate-900 truncate">{request.location || 'Karachi'}</p>
              </div>
            </div>
          </div>

          {/* Active Donor Response Banner (if current user pledged) */}
          {hasPledged && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{labels.pledgeActive}</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {labels.pledgeActiveDesc}
              </p>
              <div className="flex gap-2 pt-1">
                <Button 
                  size="sm" 
                  fullWidth 
                  onClick={() => handleOpenChat(request.requesterName)}
                  className="bg-[#166B32] text-white text-xs font-bold"
                  icon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  {labels.chatWithRequester}
                </Button>
                <button 
                  onClick={() => setWithdrawModal(true)}
                  className="px-3 py-2 bg-white border border-rose-200 text-rose-700 text-xs font-bold rounded-xl active:bg-rose-50"
                >
                  {labels.withdraw}
                </button>
              </div>
            </div>
          )}

          {/* Donor Responses List (Visible to Requester and Community) */}
          {donorResponses.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                {labels.pledgedDonors} ({donorResponses.length})
              </h3>
              
              {donorResponses.map(res => (
                <div key={res.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {res.donorRole === 'doctor' ? 'Dr' : res.donorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {res.donorName}
                        {res.donorRole === 'doctor' && (
                          <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded text-[9px] font-extrabold">Physician</span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400">Pledged {formatTime(res.respondedAt)}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenChat(res.donorName)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hospital & Location Details */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{labels.hospitalAndCenter}</h3>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{request.hospitalName || 'Hospital Center'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{request.location || 'Location'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
              <strong>General Safety Information:</strong> Medical eligibility must be confirmed by qualified medical staff at the blood donation center. Donors should be 18–60 years old, ≥50kg, and free of active infection.
            </div>
          </div>

        </div>

        {/* Footer Action */}
        {!isMyRequest && !hasPledged && (
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-safe shadow-lg">
            <Button 
              size="lg" 
              fullWidth 
              onClick={() => setConfirmPledgeModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2"
            >
              <Droplet className="w-4 h-4 fill-current" />
              {labels.iCanDonate}
            </Button>
          </div>
        )}

        {/* Pledge Confirmation Modal */}
        <BottomSheet isOpen={confirmPledgeModal} onClose={() => setConfirmPledgeModal(false)} title={labels.confirmPledgeTitle}>
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you willing to donate <strong className="text-slate-900">{request.bloodGroup} Blood</strong> for <strong className="text-slate-900">{request.requesterName}</strong> at <strong>{request.hospitalName}</strong>?
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              Your pledge as <strong>{currentActorName}</strong> will be immediately visible to the requester.
            </div>
            <div className="flex flex-col gap-2">
              <Button fullWidth onClick={handleConfirmPledge} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                {labels.confirmSubmit}
              </Button>
              <Button variant="outline" fullWidth onClick={() => setConfirmPledgeModal(false)}>
                {labels.cancel}
              </Button>
            </div>
          </div>
        </BottomSheet>

        {/* Withdraw Confirmation Modal */}
        <BottomSheet isOpen={withdrawModal} onClose={() => setWithdrawModal(false)} title={labels.withdrawPledgeTitle}>
          <div className="pb-4 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to withdraw your pledge to donate for <strong>{request.requesterName}</strong>?
            </p>
            <div className="flex flex-col gap-2">
              <Button variant="danger" fullWidth onClick={handleWithdrawPledge}>
                {labels.confirmWithdraw}
              </Button>
              <Button variant="outline" fullWidth onClick={() => setWithdrawModal(false)}>
                {labels.keepPledge}
              </Button>
            </div>
          </div>
        </BottomSheet>

      </div>
    </MobileAppShell>
  );
};
