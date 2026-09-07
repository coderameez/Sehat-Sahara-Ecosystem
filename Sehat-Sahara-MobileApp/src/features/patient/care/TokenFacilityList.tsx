import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Facility } from '../../../models';
import { ChevronLeft, Building2, Search, Ticket } from 'lucide-react';

export const TokenFacilityList: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const state = PrototypeStore.getSnapshot();
    // Filter facilities that support tokens
    const eligible = state.facilities.filter(f => f.branches.some(b => b.tokenSupport));
    setFacilities(eligible);
  }, []);

  const filtered = facilities.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase())
  );

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
            <button onClick={() => navigate('/patient/care')} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft width={28} height={28} color="#0F172A" />
            </button>
            <div style={{ marginLeft: '12px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Walk-in Tokens</h1>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Join OPD queue digitally</p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Search width={20} height={20} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search facilities..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F1F5F9',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map((fac) => (
              <button
                key={fac.id}
                onClick={() => navigate(`/patient/care/token/${fac.id}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {fac.logoUrl ? (
                      <img src={fac.logoUrl} alt={fac.name} style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                    ) : (
                      <Building2 width={28} height={28} color="#94A3B8" />
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{fac.name}</h3>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 8px' }}>{fac.branches[0]?.address}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
                      <Ticket width={14} height={14} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Live Tokens Available</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                No facilities offering walk-in tokens found.
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
