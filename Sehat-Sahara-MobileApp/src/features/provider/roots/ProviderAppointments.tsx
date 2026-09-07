import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProviderRootLayout } from '../components/ProviderRootLayout';
import { ProviderStore } from '../../../services/ProviderStore';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Button } from '../../../components';
import { Calendar as CalendarIcon, Clock, MapPin, Search } from 'lucide-react';

export const ProviderAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [storeState, setStoreState] = useState(ProviderStore.getSnapshot());

  useEffect(() => {
    const update = () => setStoreState(ProviderStore.getSnapshot());
    const unsub = PrototypeStore.subscribe(update);
    return unsub;
  }, []);

  const { appointments, journey } = storeState;
  const [activeTab, setActiveTab] = useState<'All' | 'Requested' | 'Today' | 'Upcoming' | 'Active' | 'Completed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' }) + ', ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  const filteredAppointments = appointments.filter(a => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = a.patientName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeTab === 'All') return true;
    if (activeTab === 'Requested') return a.status === 'Requested';
    if (activeTab === 'Today') return a.date === 'Today' || a.date === todayStr || a.date === new Date().toISOString().split('T')[0];
    if (activeTab === 'Upcoming') return a.status === 'Upcoming';
    if (activeTab === 'Active') return a.status === 'Active' || a.status === 'Waiting';
    if (activeTab === 'Completed') return a.status === 'Completed';
    if (activeTab === 'Cancelled') return a.status === 'Cancelled';
    return true;
  });

  const getActionText = (status: string, mode: string) => {
    if (status === 'Requested') return 'Review Request';
    if (status === 'Waiting') return 'View Queue';
    if (mode === 'Video' && status === 'Upcoming') return 'Consultation Details';
    if (status === 'Completed') return 'View Summary & Rx';
    if (status === 'Cancelled') return 'View Details';
    return 'Appointment Details';
  };

  return (
    <ProviderRootLayout activeTab="appointments">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-5 pt-4 pb-2 bg-white border-b border-slate-200 shrink-0 pt-safe">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
            {journey === 'medical_student' ? 'Sessions & Training' : 'Appointments'}
          </h1>
          <p className="text-sm text-slate-500 mb-4">
            {journey === 'medical_student' 
              ? 'Manage your supervised sessions and clinical observerships.' 
              : 'Manage patient consultations, visit requests, and queue.'}
          </p>
          
          {/* Scrollable Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar -mx-5 px-5 gap-5">
            {[
              { key: 'All', label: `All (${appointments.length})` },
              { key: 'Requested', label: `Requested (${appointments.filter(a => a.status === 'Requested').length})` },
              { key: 'Today', label: `Today` },
              { key: 'Upcoming', label: `Upcoming (${appointments.filter(a => a.status === 'Upcoming').length})` },
              { key: 'Active', label: `Active (${appointments.filter(a => a.status === 'Active' || a.status === 'Waiting').length})` },
              { key: 'Completed', label: `Completed (${appointments.filter(a => a.status === 'Completed').length})` },
              { key: 'Cancelled', label: `Cancelled (${appointments.filter(a => a.status === 'Cancelled').length})` }
            ].map(tab => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3 text-[14px] font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* List */}
        <div className="flex-1 min-h-0 app-scroll p-5 space-y-4">
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
              placeholder="Search by patient name, ID, or symptom..."
            />
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center mt-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-1">No {activeTab.toLowerCase()} appointments</h3>
              <p className="text-slate-500 text-sm">You don't have any records in this category.</p>
            </div>
          ) : (
            filteredAppointments.map(appt => (
              <div 
                key={appt.id} 
                onClick={() => navigate(`/doctor/appointments/${appt.id}`)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:border-emerald-300 active:scale-[0.99] transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700 shrink-0">
                      {appt.patientInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        {appt.patientName}
                        {appt.unreadMessage && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-brand-700 mt-0.5">
                        <span className="bg-brand-50 px-2 py-0.5 rounded text-xs">{appt.mode}</span>
                        {appt.paymentStatus === 'Paid' && (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">Paid</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    appt.status === 'Requested' ? 'bg-amber-100 text-amber-800' :
                    appt.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                    appt.status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                    appt.status === 'Waiting' ? 'bg-orange-100 text-orange-700' :
                    appt.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {appt.status}
                  </div>
                </div>

                <div className="space-y-1.5 text-[13px] text-slate-500 font-medium mb-4 pl-[60px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{appt.facility}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{appt.date} at {appt.time}</span>
                  </div>
                  <div className="truncate text-slate-600 bg-slate-50 p-2 rounded-lg mt-2">
                    <span className="font-bold text-slate-700">Reason:</span> {appt.reason}
                  </div>
                </div>

                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <Button variant="secondary" className="flex-1 text-xs" onClick={() => navigate('/doctor/patients')}>
                    Patient Records
                  </Button>
                  <Button 
                    variant={appt.status === 'Completed' ? 'secondary' : appt.status === 'Cancelled' ? 'secondary' : 'primary'} 
                    className="flex-[2] text-xs" 
                    onClick={() => navigate(`/doctor/appointments/${appt.id}`)}
                  >
                    {getActionText(appt.status, appt.mode)}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProviderRootLayout>
  );
};
