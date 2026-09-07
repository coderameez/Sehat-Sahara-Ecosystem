import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Facility, Provider } from '../../../models';
import { CounterpartEngine } from '../../../services/prototype/CounterpartEngine';
import { ChevronLeft, User, Activity, ChevronRight, CheckCircle } from 'lucide-react';

export const FacilityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [facility, setFacility] = useState<Facility | null>(null);
  const [doctors, setDoctors] = useState<Provider[]>([]);
  const [activeTab, setActiveTab] = useState<'doctors' | 'services'>('doctors');
  
  // Quick booking state
  const [bookingService, setBookingService] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const state = PrototypeStore.getSnapshot();
    const fac = state.facilities.find(f => f.id === id);
    if (fac) {
      setFacility(fac);
      
      const branchDoctors = fac.branches[0]?.doctors || [];
      const docs = state.providers.filter(p => branchDoctors.includes(p.id));
      setDoctors(docs);
    }
  }, [id]);

  if (!facility) return null;

  const branch = facility.branches[0];

  const handleBookService = (service: any) => {
    // Directly confirm service for prototype
    const newBooking = {
      id: `BKG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientId: 'USR-PATIENT-DEMO',
      facilityId: facility.id,
      branchId: branch.id,
      careType: 'facility_service',
      status: 'confirmed', 
      scheduledDate: new Date().toISOString().split('T')[0], // Today
      scheduledTime: '10:00 AM',
      fee: service.price,
      paymentPolicy: 'pay_at_counter',
      reason: service.name
    };
    
    PrototypeStore.updateState({
      bookings: [newBooking, ...PrototypeStore.getSnapshot().bookings] as any
    });
    
    CounterpartEngine.scheduleBookingConfirmation(newBooking.id);
    
    setBookingService(service);
    setBookingSuccess(true);
  };

  if (bookingSuccess) {
    return (
      <MobileAppShell>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC', padding: '24px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <CheckCircle width={40} height={40} color="#E11D48" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px', textAlign: 'center' }}>Service Booked</h1>
          <p style={{ fontSize: '15px', color: '#64748B', textAlign: 'center', margin: '0 0 32px', lineHeight: 1.5 }}>
            Your request for {bookingService?.name} at {facility.name} is confirmed. Please pay at the counter.
          </p>
          <button
            onClick={() => navigate('/patient/care')}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#E11D48', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Back to Care Hub
          </button>
        </div>
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
        
        <header style={{ 
          padding: '16px', 
          backgroundColor: '#fff', 
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <button onClick={() => navigate('/patient/care/facilities')} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft width={28} height={28} color="#0F172A" />
            </button>
            <div style={{ marginLeft: '12px', flex: 1 }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{facility.name}</h1>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{branch.address}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('doctors')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', 
                backgroundColor: activeTab === 'doctors' ? '#FFF1F2' : '#F1F5F9',
                color: activeTab === 'doctors' ? '#E11D48' : '#64748B',
                border: `1px solid ${activeTab === 'doctors' ? '#E11D48' : 'transparent'}`,
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <User width={16} height={16} /> Doctors
            </button>
            <button
              onClick={() => setActiveTab('services')}
              style={{
                flex: 1, padding: '10px', borderRadius: '8px', 
                backgroundColor: activeTab === 'services' ? '#FFF1F2' : '#F1F5F9',
                color: activeTab === 'services' ? '#E11D48' : '#64748B',
                border: `1px solid ${activeTab === 'services' ? '#E11D48' : 'transparent'}`,
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Activity width={16} height={16} /> Services
            </button>
          </div>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '20px' }}>
          
          {activeTab === 'doctors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {doctors.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => navigate(`/patient/care/in-clinic/${doc.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px',
                    backgroundColor: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <img src={doc.avatarUrl} alt={doc.name} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', marginRight: '16px' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{doc.name}</h3>
                    <p style={{ fontSize: '13px', color: '#E11D48', fontWeight: 600, margin: '0 0 4px' }}>{doc.specialty}</p>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Rs. {doc.fees.facility_named_doctor || doc.fees.in_clinic_doctor || 0}</p>
                  </div>
                  <ChevronRight width={20} height={20} color="#94A3B8" />
                </button>
              ))}
              {doctors.length === 0 && <p style={{ textAlign: 'center', color: '#64748B', marginTop: '20px' }}>No doctors listed.</p>}
            </div>
          )}

          {activeTab === 'services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {branch.services.map(svc => (
                <div key={svc.id} style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{svc.name}</h3>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#E11D48' }}>Rs. {svc.price}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px', lineHeight: 1.4 }}>{svc.description}</p>
                  <button
                    onClick={() => handleBookService(svc)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#FFF1F2', color: '#E11D48', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Book Service
                  </button>
                </div>
              ))}
              {branch.services.length === 0 && <p style={{ textAlign: 'center', color: '#64748B', marginTop: '20px' }}>No services listed.</p>}
            </div>
          )}
          
        </div>
      </div>
    </MobileAppShell>
  );
};
