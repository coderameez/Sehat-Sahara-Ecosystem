import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Search, Filter, Star, Clock } from 'lucide-react';
import { MOCK_DOCTORS } from './mockData';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { ActiveCareRecipientChip } from '../../../components/ActiveCareRecipientChip';
import { useAppBack } from '../../../utils/navigation';

export const DoctorSearch: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();
  const location = useLocation();
  const triageContext = location.state as { symptom?: string; priority?: string; recommendedSpecialty?: string } | null;
  
  const profile = OnboardingStore.getSnapshot().profile;
  const isFemale = profile?.gender?.toLowerCase() === 'female';
  
  const [searchQuery, setSearchQuery] = useState(() => sessionStorage.getItem('ds_searchQuery') || '');
  const [activeFilter, setActiveFilter] = useState(() => sessionStorage.getItem('ds_activeFilter') || triageContext?.recommendedSpecialty || 'All');
  const [genderFilter, setGenderFilter] = useState<'Any' | 'Female' | 'Male'>(() => (sessionStorage.getItem('ds_genderFilter') as any) || (isFemale ? 'Female' : 'Any'));

  React.useEffect(() => {
    sessionStorage.setItem('ds_searchQuery', searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    sessionStorage.setItem('ds_activeFilter', activeFilter);
  }, [activeFilter]);

  React.useEffect(() => {
    sessionStorage.setItem('ds_genderFilter', genderFilter);
  }, [genderFilter]);

  const filters = ['All', 'General', 'Cardiologist', 'Dermatologist', 'Pediatrician'];

  const filteredDoctors = MOCK_DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || doc.specialty.includes(activeFilter);
    const matchesGender = genderFilter === 'Any' || doc.gender === genderFilter;
    return matchesSearch && matchesFilter && matchesGender;
  });

  return (
    <MobileAppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
        
        {/* Header */}
        <header style={{ padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <button onClick={() => goBack()} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', marginRight: '16px' }}>
              <ChevronLeft width={28} height={28} color="#0F172A" />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Find Doctor</h1>
          </div>

          <div className="-mx-4 mb-4">
            <ActiveCareRecipientChip />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search width={20} height={20} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '12px' }} />
              <input 
                type="text" 
                placeholder="Search doctors, specialties..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>
            <button style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#166B32', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Filter width={20} height={20} color="#fff" />
            </button>
          </div>

          {/* Gender Toggles */}
          <div className="flex gap-2 mt-4 bg-slate-50 p-1 rounded-xl border border-slate-200">
            {['Any', 'Female', 'Male'].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g as any)}
                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${genderFilter === g ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Triage Context Banner */}
          {triageContext?.recommendedSpecialty && (
            <div style={{ padding: '12px 16px', backgroundColor: '#EBF5EF', borderRadius: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#166B32' }} />
              <p style={{ fontSize: '13px', color: '#166B32', margin: 0, fontWeight: 600 }}>
                Recommended from your assessment: <span style={{ fontWeight: 700 }}>{triageContext.recommendedSpecialty}</span>
              </p>
            </div>
          )}

          {/* Filters */}
          <div className="app-scroll" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginTop: '16px', whiteSpace: 'nowrap' }}>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: activeFilter === filter ? '#166B32' : '#F1F5F9',
                  color: activeFilter === filter ? '#fff' : '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </header>

        {/* Doctor List */}
        <div className="app-scroll" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredDoctors.map(doc => {
            const modes = doc.bookingModes || ['fixed_time', 'queue_token'];
            const isDual = modes.includes('fixed_time') && modes.includes('queue_token');
            const isTokenOnly = modes.length === 1 && modes[0] === 'queue_token';
            const isFixedOnly = modes.length === 1 && modes[0] === 'fixed_time';

            return (
              <div 
                key={doc.id}
                onClick={() => navigate(PATIENT_ROUTES.DOCTOR_DETAIL.replace(':id', doc.id), { state: triageContext })}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  <img src={doc.avatarUrl} alt={doc.name} style={{ width: '76px', height: '76px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                    {triageContext?.recommendedSpecialty && doc.specialty.includes(triageContext.recommendedSpecialty) && (
                      <div style={{ position: 'absolute', top: '-6px', right: 0, backgroundColor: '#EBF5EF', color: '#166B32', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                        Smart Match
                      </div>
                    )}
                    <h3 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{doc.name}</h3>
                    
                    <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#166B32', fontWeight: 600 }}>{doc.specialty}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star width={13} height={13} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{doc.rating}</span>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>({doc.reviews})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock width={13} height={13} color="#64748B" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#166B32' }}>Rs. {doc.fee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Mode Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid #F1F5F9' }}>
                  <div>
                    {isDual && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Fixed-Time & Live Token
                      </span>
                    )}
                    {isFixedOnly && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Fixed-Time Appointment
                      </span>
                    )}
                    {isTokenOnly && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Walk-in Live Token
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                    {doc.nextAvailable}
                  </span>
                </div>

                {/* Actions: View & Book */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(PATIENT_ROUTES.DOCTOR_DETAIL.replace(':id', doc.id), { state: triageContext })}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      color: '#334155',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      if (isTokenOnly) {
                        navigate(PATIENT_ROUTES.BOOKING.replace(':id', doc.id), { 
                          state: { ...triageContext, prefilledBookingMode: 'queue_token', prefilledVisitType: 'clinic' } 
                        });
                      } else if (isFixedOnly) {
                        navigate(PATIENT_ROUTES.BOOKING.replace(':id', doc.id), { 
                          state: { ...triageContext, prefilledBookingMode: 'fixed_time', prefilledVisitType: 'clinic' } 
                        });
                      } else {
                        navigate(PATIENT_ROUTES.BOOKING.replace(':id', doc.id), { 
                          state: triageContext 
                        });
                      }
                    }}
                    style={{
                      flex: 1.5,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#166B32',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isTokenOnly ? 'Get Token' : isFixedOnly ? 'Book Appointment' : 'Book'}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredDoctors.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
              <p>No doctors found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
      
    </MobileAppShell>
  );
};
