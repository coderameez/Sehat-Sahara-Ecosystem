import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { CareRequest } from '../../../models';
import { CounterpartEngine } from '../../../services/prototype/CounterpartEngine';
import { ChevronLeft, UserPlus, FileText, Clock, CheckCircle } from 'lucide-react';

export const OpenCareRequest: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [role, setRole] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent'>('Standard');
  const [location, setLocation] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const roles = [
    { id: 'nurse', label: 'Nurse' },
    { id: 'caregiver', label: 'Caregiver' },
    { id: 'physiotherapist', label: 'Physiotherapist' },
    { id: 'student', label: 'Medical Student (Supervised)' }
  ];

  const handleConfirm = () => {
    const req: CareRequest = {
      id: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      patientId: 'USR-PATIENT-DEMO',
      patientName: 'Demo Patient',
      status: 'published',
      requestedRole: role,
      symptoms,
      urgency,
      location,
      preferredDate: date || new Date().toISOString().split('T')[0],
      timeWindow: 'Anytime',
      createdAt: new Date().toISOString()
    };

    PrototypeStore.updateState({
      careRequests: [req, ...PrototypeStore.getSnapshot().careRequests]
    });
    CounterpartEngine.scheduleProviderOffers(req.id);
    setStep(4);
  };

  if (step === 4) {
    return (
      <MobileAppShell>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC', padding: '24px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <CheckCircle width={40} height={40} color="#2563EB" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px', textAlign: 'center' }}>Request Broadcasted</h1>
          <p style={{ fontSize: '15px', color: '#64748B', textAlign: 'center', margin: '0 0 32px', lineHeight: 1.5 }}>
            Your care request has been sent to eligible providers. You will be notified when they send their quotes.
          </p>
          <button
            onClick={() => navigate('/patient/care')}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#2563EB', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
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
          <button 
            onClick={() => step > 1 ? setStep((step - 1) as any) : navigate('/patient/care')} 
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft width={28} height={28} color="#0F172A" />
          </button>
          <div style={{ marginLeft: '12px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Open Care Request</h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Get quotes from providers</p>
          </div>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ height: '4px', flex: 1, borderRadius: '2px', backgroundColor: s <= step ? '#2563EB' : '#E2E8F0' }} />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus width={20} height={20} color="#2563EB" />
                Who do you need?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.label)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: role === r.label ? '#EFF6FF' : '#fff',
                      border: `1.5px solid ${role === r.label ? '#2563EB' : '#E2E8F0'}`,
                      color: role === r.label ? '#2563EB' : '#0F172A',
                      fontSize: '15px',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText width={20} height={20} color="#2563EB" />
                Describe your requirements
              </h2>
              <textarea
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="E.g. Need post-op wound dressing for 3 days..."
                rows={5}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', fontFamily: 'inherit', resize: 'none', outline: 'none' }}
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock width={20} height={20} color="#2563EB" />
                Location & Timing
              </h2>
              
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Service Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="House #, Street, Area"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', marginBottom: '20px', outline: 'none' }}
              />

              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Preferred Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '15px', marginBottom: '20px', outline: 'none', fontFamily: 'inherit' }}
              />

              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Urgency</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setUrgency('Standard')}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1.5px solid ${urgency === 'Standard' ? '#2563EB' : '#E2E8F0'}`, backgroundColor: urgency === 'Standard' ? '#EFF6FF' : '#fff', color: urgency === 'Standard' ? '#2563EB' : '#64748B', fontWeight: 600, cursor: 'pointer' }}
                >
                  Standard
                </button>
                <button
                  onClick={() => setUrgency('Urgent')}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1.5px solid ${urgency === 'Urgent' ? '#EF4444' : '#E2E8F0'}`, backgroundColor: urgency === 'Urgent' ? '#FEF2F2' : '#fff', color: urgency === 'Urgent' ? '#EF4444' : '#64748B', fontWeight: 600, cursor: 'pointer' }}
                >
                  Urgent
                </button>
              </div>
            </div>
          )}

        </div>

        <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #E2E8F0' }}>
          {step === 1 && (
            <button
              disabled={!role}
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: role ? '#2563EB' : '#CBD5E1', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: role ? 'pointer' : 'not-allowed' }}
            >
              Continue
            </button>
          )}
          {step === 2 && (
            <button
              disabled={symptoms.length < 10}
              onClick={() => setStep(3)}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: symptoms.length >= 10 ? '#2563EB' : '#CBD5E1', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: symptoms.length >= 10 ? 'pointer' : 'not-allowed' }}
            >
              Continue
            </button>
          )}
          {step === 3 && (
            <button
              disabled={!location || !date}
              onClick={handleConfirm}
              style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: (location && date) ? '#2563EB' : '#CBD5E1', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: (location && date) ? 'pointer' : 'not-allowed' }}
            >
              Submit Request
            </button>
          )}
        </div>

      </div>
    </MobileAppShell>
  );
};
