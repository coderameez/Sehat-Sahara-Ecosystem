import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootScreenLayout } from '../../../components/layouts';
import { Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { 
  Search, Video, Building2, Home, Star, ShieldCheck, Calendar, 
  Clock, Stethoscope, ClipboardList
} from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { MOCK_DOCTORS } from '../doctors/mockData';

type Tab = 'discover' | 'my-care';

export const CareHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [bookings, setBookings] = useState<any[]>([]);

  React.useEffect(() => {
    const loadData = () => {
      const state = PrototypeStore.getSnapshot();
      setBookings(state.bookings.filter((b: any) => b.patientId === 'USR-PATIENT-DEMO' && b.status !== 'cancelled'));
    };
    loadData();
    const unsub = PrototypeStore.subscribe(loadData);
    return unsub;
  }, []);

  const renderDiscover = () => (
    <div className="animate-in fade-in duration-300">
      
      {/* Search */}
      <div className="px-5 pt-4 pb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
            placeholder="Search doctors, specialties, clinics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto hide-scrollbar px-5 py-3 gap-2 mb-2">
        <button className="whitespace-nowrap px-4 py-2 bg-brand-600 text-white rounded-full text-[13px] font-bold shadow-sm shrink-0">
          All
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-[13px] font-semibold shrink-0">
          General Physician
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-[13px] font-semibold shrink-0">
          Cardiologist
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-[13px] font-semibold shrink-0">
          Dermatologist
        </button>
        <button className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-[13px] font-semibold shrink-0">
          Pediatrician
        </button>
      </div>

      <div className="px-5 pb-8 space-y-6">
        
        {/* Recommended Doctors Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-extrabold text-slate-900">Recommended Doctors</h2>
            <button className="text-[13px] font-bold text-brand-600">See All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {MOCK_DOCTORS.map(doctor => (
              <div key={doctor.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img src={doctor.avatarUrl} alt={doctor.name} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5">
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-[16px] font-bold text-slate-900 truncate mb-1">{doctor.name}</h3>
                    <div className="flex items-center text-[13px] text-brand-700 font-semibold mb-1">
                      <Stethoscope className="w-3.5 h-3.5 mr-1" />
                      {doctor.specialty}
                    </div>
                    <div className="flex items-center text-[12px] text-slate-500 mb-2">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                      <span className="font-bold text-slate-700 mr-1">{doctor.rating}</span>
                      ({doctor.reviews} reviews) • {doctor.experience}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600">
                    <Building2 className="w-3.5 h-3.5" /> In-Clinic
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600">
                    <Video className="w-3.5 h-3.5" /> Video
                  </div>
                  {doctor.id === 'd1' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-600">
                      <Home className="w-3.5 h-3.5" /> Home
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center text-[12px] text-slate-600">
                    <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
                    Next: <span className="font-bold ml-1 text-slate-900">{doctor.nextAvailable}</span>
                  </div>
                  <div className="text-[15px] font-black text-brand-700">
                    Rs. {doctor.fee}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate(PATIENT_ROUTES.DOCTOR_DETAIL.replace(':id', doctor.id))}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(PATIENT_ROUTES.BOOKING.replace(':id', doctor.id))}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-[16px] font-extrabold text-slate-900 mb-4">Other Services</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/patient/care/facilities')} className="flex flex-col bg-white border border-slate-200 rounded-2xl p-4 items-start shadow-sm active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-1">Hospitals</h3>
              <p className="text-[12px] text-slate-500 text-left line-clamp-2">Find clinics and large facilities</p>
            </button>
            
            <button onClick={() => navigate('/patient/care/home-support')} className="flex flex-col bg-white border border-slate-200 rounded-2xl p-4 items-start shadow-sm active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-[14px] font-bold text-slate-900 mb-1">Home Support</h3>
              <p className="text-[12px] text-slate-500 text-left line-clamp-2">Nurses and physios at home</p>
            </button>
          </div>
        </div>
        
        {/* Find Top Doctors CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[#166B32] mb-3">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-[16px] font-bold text-slate-900 mb-2">Need a Consultation Today?</h3>
          <p className="text-[13px] text-slate-600 mb-4">Browse verified doctors, view available slots, and book instant video or clinic visits.</p>
          <Button variant="primary" onClick={() => navigate(PATIENT_ROUTES.DOCTORS)}>
            Search Verified Doctors
          </Button>
        </div>

      </div>
    </div>
  );

  const renderMyCare = () => (
    <div className="animate-in fade-in duration-300 p-5">
      {bookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bookings.map(b => (
            <div key={b.id} onClick={() => navigate(PATIENT_ROUTES.APPOINTMENT_DETAIL.replace(':id', b.id))} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm cursor-pointer active:scale-95 transition-transform">
              <div className="flex justify-between items-center mb-2">
                <div className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold uppercase">{b.status.replace('_', ' ')}</div>
                <span className="text-xs text-slate-500">{b.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{b.careType.replace(/_/g, ' ')}</h3>
              <div className="flex gap-4 text-sm text-slate-600 mb-2">
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {b.scheduledDate || 'Any Date'}</div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {b.scheduledTime || 'TBD'}</div>
              </div>
            </div>
          ))}
          <Button variant="secondary" onClick={() => navigate('/patient/care/my-care')}>
            View All History
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-[16px] font-bold text-slate-900 mb-2">No Active Bookings</h3>
          <p className="text-[14px] text-slate-500 mb-6">Your upcoming appointments and home visits will appear here.</p>
          <Button variant="primary" onClick={() => setActiveTab('discover')}>
            Find a Doctor
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <RootScreenLayout activeTab="find-care">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* Sticky Root Header with Tabs */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shrink-0">
          <div className="px-5 pt-6 pb-2">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Find Care</h1>
            <p className="text-sm text-slate-500">Book appointments, home visits, and more.</p>
          </div>
          
          <div className="flex px-5 mt-2 gap-6">
            <button 
              onClick={() => setActiveTab('discover')}
              className={`pb-3 text-[14px] font-bold border-b-2 transition-colors ${activeTab === 'discover' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500'}`}
            >
              Discover
            </button>
            <button 
              onClick={() => setActiveTab('my-care')}
              className={`pb-3 text-[14px] font-bold border-b-2 transition-colors ${activeTab === 'my-care' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500'}`}
            >
              My Care
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="app-scroll flex-1 pb-24">
          {activeTab === 'discover' && renderDiscover()}
          {activeTab === 'my-care' && renderMyCare()}
        </div>

      </div>
    </RootScreenLayout>
  );
};
