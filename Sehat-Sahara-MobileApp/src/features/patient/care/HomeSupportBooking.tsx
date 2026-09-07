import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Provider, Booking } from '../../../models';
import { CounterpartEngine } from '../../../services/prototype/CounterpartEngine';
import { ChevronLeft, Calendar, CheckCircle } from 'lucide-react';

export const HomeSupportBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('2_hours');
  const [address, setAddress] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const state = PrototypeStore.getSnapshot();
    const doc = state.providers.find(p => p.id === id);
    if (doc) setProvider(doc);
  }, [id]);

  if (!provider) return null;

  const handleBook = () => {
    const newBooking: Booking = {
      id: `BKG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientId: 'USR-PATIENT-DEMO',
      providerId: provider.id,
      careType: 'home_care_support',
      status: 'confirmed',
      scheduledDate: date,
      scheduledTime: duration, // We'll store duration in scheduledTime for prototype simplicity
      fee: provider.fees.home_care_support || 0,
      paymentPolicy: 'cash_after_home_visit'
    };

    PrototypeStore.updateState({
      bookings: [newBooking, ...PrototypeStore.getSnapshot().bookings]
    });
    
    CounterpartEngine.scheduleBookingConfirmation(newBooking.id);

    setStep(3);
    setBookingSuccess(true);
  };

  if (step === 3 && bookingSuccess) {
    return (
      <MobileAppShell>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC', padding: '24px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <CheckCircle width={40} height={40} color="#4F46E5" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px', textAlign: 'center' }}>Booking Confirmed</h1>
          <p style={{ fontSize: '15px', color: '#64748B', textAlign: 'center', margin: '0 0 32px', lineHeight: 1.5 }}>
            Your home care support with {provider.name} is booked for {date}.
          </p>
          <button
            onClick={() => navigate('/patient/care')}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#4F46E5', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
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
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#fff', 
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button onClick={() => step > 1 ? setStep((step - 1) as any) : navigate('/patient/care/home-support')} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft width={28} height={28} color="#0F172A" />
          </button>
          <div style={{ marginLeft: '12px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Book Support</h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{provider.name}</p>
          </div>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '20px' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ height: '4px', flex: 1, borderRadius: '2px', backgroundColor: s <= step ? '#4F46E5' : '#E2E8F0' }} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar width={20} height={20} color="#4F46E5" />
                Schedule & Address
              </h2>
              
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Start Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', marginBottom: '20px', outline: 'none', fontFamily: 'inherit' }}
              />

              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Duration needed</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', marginBottom: '20px', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fff' }}
              >
                <option value="2_hours">2 Hours</option>
                <option value="4_hours">4 Hours</option>
                <option value="8_hours">8 Hours (Full Shift)</option>
                <option value="24_hours">24 Hours</option>
              </select>

              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Home Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House #, Street, Area"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', outline: 'none' }}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Review Booking</h2>
              
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>Provider</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{provider.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>Role</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px', textTransform: 'capitalize' }}>{provider.providerType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>Start Date</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B', fontSize: '14px' }}>Duration</span>
                  <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '14px' }}>{duration.replace('_', ' ')}</span>
                </div>
                <div style={{ width: '100%', height: '1px', backgroundColor: '#E2E8F0', margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '16px' }}>Total Fee</span>
                  <span style={{ fontWeight: 800, color: '#4F46E5', fontSize: '16px' }}>Rs. {provider.fees.home_care_support}</span>
                </div>
              </div>
              
            </div>
          )}

        </div>

        <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #E2E8F0' }}>
          {step === 1 && (
            <button
              disabled={!date || !address}
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: (date && address) ? '#4F46E5' : '#CBD5E1', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: (date && address) ? 'pointer' : 'not-allowed' }}
            >
              Continue to Review
            </button>
          )}
          {step === 2 && (
            <button
              onClick={handleBook}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#4F46E5', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Confirm Booking
            </button>
          )}
        </div>

      </div>
    </MobileAppShell>
  );
};
