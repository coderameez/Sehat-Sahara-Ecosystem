import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { Booking, CareRequest, QueueToken, ProviderQuote, Provider, Facility } from '../../../models';
import { ChevronLeft, Calendar, FileText, Ticket, Clock, Video, Users, Star } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';

export const MyCare: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'tokens' | 'requests'>('upcoming');
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<CareRequest[]>([]);
  const [tokens, setTokens] = useState<QueueToken[]>([]);
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  
  const [fakeQuotes, setFakeQuotes] = useState<ProviderQuote[]>([]);

  useEffect(() => {
    loadData();
    const unsub = PrototypeStore.subscribe(loadData);
    return unsub;
  }, []);

  const loadData = () => {
    const state = PrototypeStore.getSnapshot();
    setBookings(state.bookings.filter((b: Booking) => b.patientId === 'USR-PATIENT-DEMO'));
    setRequests(state.careRequests.filter((r: CareRequest) => r.patientId === 'USR-PATIENT-DEMO'));
    setTokens(state.queueTokens.filter((t: QueueToken) => t.patientId === 'USR-PATIENT-DEMO'));
    setProviders(state.providers);
    setFacilities(state.facilities);
    
    // Quotes for open requests
    const quotes: ProviderQuote[] = [];
    state.careRequests.forEach((req: CareRequest) => {
      if (req.status === 'published' || req.status === 'quotes_received') {
        const eligibleProviders = state.providers.filter((p: Provider) => p.providerType === req.requestedRole.toLowerCase().replace(' ', '_'));
        const p = eligibleProviders[0] || state.providers[1];
        quotes.push({
          id: `QOT-${req.id}`,
          requestId: req.id,
          providerId: p.id,
          proposedPrice: 1500,
          arrivalTime: '11:00 AM',
          travelIncluded: true,
          estimatedDuration: '2 hours',
          message: 'I am available and nearby.',
          validUntil: new Date().toISOString(),
          status: 'PENDING'
        });
      }
    });
    setFakeQuotes(quotes);
  };

  const getProvider = (id?: string) => providers.find(p => p.id === id) || providers[0];
  const getProviderName = (id?: string) => getProvider(id)?.name || 'Dr. Ayesha Khan';
  const getFacilityName = (id?: string) => facilities.find(f => f.id === id)?.name || 'Care Facility';

  const getTitle = (b: Booking) => {
    if (b.careType === 'facility_service') return b.reason || 'Facility Service';
    if (b.providerId) return getProviderName(b.providerId);
    return b.careType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAcceptQuote = (quote: ProviderQuote, req: CareRequest) => {
    const updatedReqs = requests.map(r => r.id === req.id ? { ...r, status: 'confirmed' as any } : r);
    PrototypeStore.updateState({ careRequests: updatedReqs });
    setRequests(updatedReqs);
    
    const newBooking: Booking = {
      id: `BKG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientId: 'USR-PATIENT-DEMO',
      providerId: quote.providerId,
      careType: 'home_care_support',
      status: 'confirmed',
      scheduledDate: req.preferredDate,
      fee: quote.proposedPrice,
      paymentPolicy: 'cash_after_home_visit',
      reason: req.symptoms
    };
    
    const updatedBookings = [newBooking, ...bookings];
    PrototypeStore.updateState({ bookings: updatedBookings as any });
    setBookings(updatedBookings as any);
    setActiveTab('upcoming');
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'requested' || b.status === 'in_progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* Header */}
        <header className="px-5 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <div className="flex items-center mb-3">
            <button onClick={() => navigate('/patient/care', { replace: true })} className="p-1 -ml-1 rounded-full active:bg-slate-100 mr-2" aria-label="Go back">
              <ChevronLeft className="w-7 h-7 text-slate-800" />
            </button>
            <div>
              <h1 className="text-[18px] font-bold text-slate-900 leading-tight">My Care</h1>
              <p className="text-[12px] text-slate-500">Appointments, tokens & consultations</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: 'upcoming', label: `Upcoming (${upcomingBookings.length})` },
              { key: 'completed', label: `Completed (${completedBookings.length})` },
              { key: 'cancelled', label: `Cancelled (${cancelledBookings.length})` },
              { key: 'tokens', label: `Tokens (${tokens.length})` }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#166B32] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="app-scroll flex-1 px-5 py-5 pb-20">
          
          {/* UPCOMING / COMPLETED / CANCELLED BOOKINGS */}
          {(activeTab === 'upcoming' || activeTab === 'completed' || activeTab === 'cancelled') && (
            <div className="space-y-4">
              {(activeTab === 'upcoming' 
                ? upcomingBookings 
                : activeTab === 'completed' 
                ? completedBookings 
                : cancelledBookings
              ).map(b => {
                const prov = getProvider(b.providerId);
                const isVideo = b.careType === 'online_consultation';
                const isHome = b.careType === 'direct_home_visit';

                return (
                  <div 
                    key={b.id} 
                    onClick={() => navigate(PATIENT_ROUTES.APPOINTMENT_DETAIL.replace(':id', b.id))} 
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm cursor-pointer active:scale-[0.99] transition-all hover:border-emerald-200"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        b.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-green-100 text-[#166B32]'
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{b.id}</span>
                    </div>

                    <div className="flex items-center gap-3.5 mb-3">
                      <img 
                        src={prov?.avatarUrl || "https://ui-avatars.com/api/?name=Dr+Khan&background=166B32&color=fff"} 
                        alt={getTitle(b)}
                        className="w-13 h-13 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-slate-900 leading-tight truncate">
                          {getTitle(b)}
                        </h3>
                        <p className="text-[12px] text-[#166B32] font-semibold truncate">
                          {prov?.specialty || b.reason || 'Consultation'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {isVideo ? 'Online Video Consult' : isHome ? 'In-Home Visit' : 'In-Clinic Appointment'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{b.scheduledDate || 'Today'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{b.scheduledTime || '10:00 AM'}</span>
                      </div>
                    </div>

                    {/* Card CTA */}
                    <div className="pt-1">
                      {b.status === 'completed' ? (
                        <div className="w-full py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          View Outcomes & Review
                        </div>
                      ) : b.status === 'cancelled' ? (
                        <div className="w-full py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold text-center border border-slate-200">
                          Cancelled • View Details
                        </div>
                      ) : (
                        <div className="w-full py-2 bg-[#166B32] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs">
                          {isVideo ? <Video className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                          {isVideo ? 'Join Consultation' : isHome ? 'Track Provider' : 'View Appointment Details'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {(activeTab === 'upcoming' ? upcomingBookings : activeTab === 'completed' ? completedBookings : cancelledBookings).length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm mt-4">
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">No {activeTab} appointments</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    You do not have any {activeTab} consultations at this time.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {requests.map(req => {
                const quote = fakeQuotes.find(q => q.requestId === req.id);
                return (
                  <div key={req.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                        {req.status}
                      </span>
                      <span className="text-[11px] text-slate-400">{req.preferredDate}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">Need: {req.requestedRole}</h3>
                    <p className="text-xs text-slate-600 mb-3">{req.symptoms}</p>
                    
                    {quote && req.status !== 'confirmed' && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-[#166B32] mb-1">Quote from {getProviderName(quote.providerId)}</h4>
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-sm font-bold text-slate-900">Rs. {quote.proposedPrice}</span>
                          <span className="text-xs text-slate-500">Available {quote.arrivalTime}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAcceptQuote(quote, req); }}
                          className="w-full py-2 bg-[#166B32] text-white text-xs font-bold rounded-lg active:scale-98 transition-transform"
                        >
                          Accept & Book
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {requests.length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm mt-4">
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">No care requests</h3>
                  <p className="text-xs text-slate-500">You haven't posted any care requests yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TOKENS */}
          {activeTab === 'tokens' && (
            <div className="space-y-4">
              {tokens.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => navigate(PATIENT_ROUTES.QUEUE.replace(':id', t.id))} 
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm cursor-pointer active:scale-[0.99] transition-all hover:border-amber-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>{t.status.replace('_', ' ')}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">Tap to track live</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Token Number</p>
                      <h3 className="text-3xl font-black text-amber-600 leading-none mt-1">#{t.tokenNumber}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{getFacilityName(t.facilityId)}</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">~{t.estimatedWaitMinutes} mins wait</p>
                    </div>
                  </div>
                </div>
              ))}
              {tokens.length === 0 && (
                <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-2xl border border-slate-200 shadow-sm mt-4">
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                    <Ticket className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">No walk-in tokens</h3>
                  <p className="text-xs text-slate-500">You don't have any active walk-in tokens.</p>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </MobileAppShell>
  );
};
