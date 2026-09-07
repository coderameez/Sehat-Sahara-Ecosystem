import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { Provider } from '../../../models';
import { ChevronLeft, Star, Video } from 'lucide-react';

export const OnlineConsultList: React.FC = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const state = PrototypeStore.getSnapshot();
    const eligible = state.providers.filter(p => 
      p.providerType === 'independent_doctor' && 
      p.careTypes.includes('online_consultation')
    );
    setProviders(eligible);
  }, []);

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
          <button onClick={() => navigate('/patient/care')} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft width={28} height={28} color="#0F172A" />
          </button>
          <div style={{ marginLeft: '12px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Online Consultations</h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>Select a verified doctor for a video call</p>
          </div>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {providers.map((doc) => (
              <button
                key={doc.id}
                onClick={() => navigate(`/patient/care/online/${doc.id}`)}
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
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={doc.avatarUrl} 
                      alt={doc.name} 
                      style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', backgroundColor: '#fff', borderRadius: '50%', padding: '2px' }}>
                      <div style={{ backgroundColor: '#10B981', width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #fff' }} />
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>{doc.name}</h3>
                    <p style={{ fontSize: '14px', color: '#8B5CF6', fontWeight: 600, margin: '0 0 4px' }}>{doc.specialty}</p>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 8px' }}>{doc.qualification}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star width={14} height={14} color="#EAB308" fill="#EAB308" />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{doc.rating}</span>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>({doc.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #F1F5F9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B5CF6', backgroundColor: '#F5F3FF', padding: '4px 8px', borderRadius: '6px' }}>
                    <Video width={14} height={14} />
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>Video Consult</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                    Rs. {doc.fees.online_consultation}
                  </div>
                </div>
              </button>
            ))}

            {providers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                No online doctors available at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
