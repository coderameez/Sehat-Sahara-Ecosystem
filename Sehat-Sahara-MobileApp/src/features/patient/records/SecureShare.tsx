import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Lock, FileText, CheckCircle2, Copy, XCircle, Clock, Users, ShieldAlert } from 'lucide-react';
import { MOCK_RECORDS } from './mockData';

type ShareState = 'setup' | 'active' | 'revoked' | 'expired';

export const SecureShare: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const record = MOCK_RECORDS.find(r => r.id === id);

  const [shareState, setShareState] = useState<ShareState>('setup');
  const [expiry, setExpiry] = useState('24h');
  const [pin, setPin] = useState('');

  if (!record) return <MobileAppShell><div style={{ padding: '24px' }}>Record not found</div></MobileAppShell>;

  const handleGeneratePin = () => {
    // Deterministic random-looking PIN based on record ID to satisfy constraints
    const deterministicPin = `84${record.id.replace(/\D/g, '').padEnd(4, '3')}`;
    setPin(deterministicPin);
    setShareState('active');
  };

  const handleRevoke = () => {
    setShareState('revoked');
  };

  return (
    <MobileAppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
        
        {/* Header */}
        <header style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0' }}>
          <button onClick={() => navigate(PATIENT_ROUTES.RECORD_DETAIL.replace(':id', record.id))} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
            <ChevronLeft width={28} height={28} color="#0F172A" />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginLeft: '12px', margin: 0 }}>Secure Sharing</h1>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* File Context */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText width={24} height={24} color="#64748B" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{record.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{record.type} • {record.date}</p>
            </div>
          </div>

          {shareState === 'setup' && (
            <>
              {/* Recipient Context */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'block' }}>Share With</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <Users width={20} height={20} color="#64748B" />
                  <span style={{ fontSize: '15px', color: '#0F172A', fontWeight: 500 }}>Any doctor with PIN</span>
                </div>
              </div>

              {/* Expiry Selection */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'block' }}>Access Expiry</label>
                <select 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', backgroundColor: '#fff', fontSize: '15px', color: '#0F172A', outline: 'none', appearance: 'none' }}
                >
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>

              {/* Permission Summary */}
              <div style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', padding: '16px', border: '1px solid #BBF7D0', display: 'flex', gap: '12px' }}>
                <ShieldAlert width={20} height={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#166534', margin: 0, lineHeight: '1.5' }}>
                  Generating a PIN will only grant access to this specific record. Your complete medical history remains private.
                </p>
              </div>
            </>
          )}

          {shareState === 'active' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '32px', backgroundColor: '#EBF5EF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 width={32} height={32} color="#166B32" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>PIN Generated</h2>
              <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 24px' }}>Share this 6-digit PIN with your doctor to grant access.</p>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', backgroundColor: '#F8FAFC', padding: '16px 24px', borderRadius: '12px', border: '1px dashed #CBD5E1', marginBottom: '24px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', letterSpacing: '4px' }}>{pin}</span>
                <button style={{ border: 'none', background: 'none', padding: '8px', cursor: 'pointer', color: '#166B32' }}>
                  <Copy width={24} height={24} />
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748B' }}>
                <Clock width={16} height={16} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>Expires in {expiry}</span>
              </div>
            </div>
          )}

          {shareState === 'revoked' && (
            <div style={{ backgroundColor: '#FEF2F2', borderRadius: '16px', border: '1px solid #FECACA', padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '32px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <XCircle width={32} height={32} color="#DC2626" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#991B1B', margin: '0 0 8px' }}>Access Revoked</h2>
              <p style={{ fontSize: '14px', color: '#7F1D1D', margin: '0 0 24px', lineHeight: '1.5' }}>The PIN for this record has been deactivated. Doctors can no longer access this file.</p>
              
              <button 
                onClick={() => setShareState('setup')}
                style={{ padding: '12px 24px', backgroundColor: '#fff', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Generate New PIN
              </button>
            </div>
          )}
          
        </div>

        {/* Footer Actions */}
        {shareState === 'setup' && (
          <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #E2E8F0', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
            <button
              onClick={handleGeneratePin}
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
              <Lock width={20} height={20} />
              Generate Secure PIN
            </button>
          </div>
        )}

        {shareState === 'active' && (
          <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderTop: '1px solid #E2E8F0', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
            <button
              onClick={handleRevoke}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#fff',
                color: '#DC2626',
                fontSize: '16px',
                fontWeight: 700,
                border: '1px solid #FECACA',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Revoke Access
            </button>
          </div>
        )}

      </div>
    </MobileAppShell>
  );
};
