import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Pill, Clock, Calendar as CalendarIcon, User, PlusCircle } from 'lucide-react';
import { MOCK_RECORDS } from '../records/mockData';
import { MOCK_MEDICINES } from '../records/mockData';
import { useAppBack } from '../../../utils/navigation';

export const PrescriptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goBack = useAppBack();
  
  // Try to find the prescription in MOCK_RECORDS, or fallback to a default
  const record = MOCK_RECORDS.find(r => r.id === id) || {
    title: 'General Consultation',
    date: 'Today, 10:00 AM',
    doctor: 'Dr. Sarah Ahmed',
    facility: 'Sehat Sahara Clinic'
  };

  return (
    <MobileAppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
        
        {/* Header */}
        <header style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0' }}>
          <button onClick={() => goBack()} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
            <ChevronLeft width={28} height={28} color="#0F172A" />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginLeft: '12px', margin: 0 }}>Prescription</h1>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Metadata Card */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User width={20} height={20} color="#64748B" />
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 2px' }}>Prescribed by</p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{record.doctor}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarIcon width={20} height={20} color="#64748B" />
              </div>
              <div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 2px' }}>Date</p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A', margin: 0 }}>{record.date}</p>
              </div>
            </div>
          </div>

          {/* Medicines List */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>Prescribed Medicines</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MOCK_MEDICINES.map((med, idx) => (
                <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EBF5EF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Pill width={20} height={20} color="#166B32" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{med.name}</h3>
                      <p style={{ fontSize: '14px', color: '#166B32', fontWeight: 600, margin: 0 }}>{med.dosage}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock width={16} height={16} color="#64748B" />
                      <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{med.frequency}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarIcon width={16} height={16} color="#64748B" />
                      <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>For {med.duration}</span>
                    </div>
                  </div>
                  
                  {med.instructions && (
                    <p style={{ fontSize: '13px', color: '#475569', margin: '12px 0 0', fontStyle: 'italic' }}>
                      * {med.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #E2E8F0', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
          <button
            onClick={() => navigate(PATIENT_ROUTES.MEDICINES)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#166B32',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(22,107,50,0.2)',
            }}
          >
            <PlusCircle width={20} height={20} />
            Add to Reminders
          </button>
        </div>

      </div>
    </MobileAppShell>
  );
};
