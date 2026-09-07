import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RootScreenLayout } from '../../../components/layouts';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { Droplet, Package, HeartHandshake, ChevronRight } from 'lucide-react';

export const CommunityHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <RootScreenLayout activeTab="community">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#F8FAFC' }}>
        
        {/* Header */}
        <header style={{ padding: '16px', display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Community Support</h1>
        </header>

        <div className="app-scroll" style={{ flex: 1, padding: '20px 16px', paddingBottom: '80px' }}>
          
          {/* Hero Section */}
          <div
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0D5226 0%, #166B32 55%, #1E9B46 100%)',
              boxShadow: '0 8px 24px -4px rgba(13,82,38,0.28)',
              padding: '24px',
              marginBottom: '24px',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <HeartHandshake width={24} height={24} color="#A7F3D0" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sehat Sahara Community</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px', lineHeight: '1.2' }}>Help Each Other<br/>Live Healthier</h2>
              <p style={{ fontSize: '14px', color: '#BBF7D0', margin: 0, lineHeight: '1.4', maxWidth: '85%' }}>
                Connect with people nearby to donate blood, request help, or share medical equipment.
              </p>
            </div>
            {/* Background decorative circles */}
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '60px', backgroundColor: 'rgba(255,255,255,0.05)', zIndex: 0 }} />
            <div style={{ position: 'absolute', right: '40px', bottom: '-40px', width: '80px', height: '80px', borderRadius: '40px', backgroundColor: 'rgba(255,255,255,0.08)', zIndex: 0 }} />
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>How can we help?</h3>

          {/* Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Blood Donations */}
            <button
              onClick={() => navigate(PATIENT_ROUTES.COMMUNITY_BLOOD)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Droplet width={28} height={28} color="#DC2626" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Blood Donation</h4>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>Find donors or volunteer to save a life in your area.</p>
              </div>
              <ChevronRight width={20} height={20} color="#94A3B8" />
            </button>

            {/* Things Sharing */}
            <button
              onClick={() => navigate(PATIENT_ROUTES.COMMUNITY_THINGS)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package width={28} height={28} color="#2563EB" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>Things Sharing</h4>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.4' }}>Borrow or lend medical equipment like wheelchairs.</p>
              </div>
              <ChevronRight width={20} height={20} color="#94A3B8" />
            </button>

          </div>

        </div>
      </div>
    </RootScreenLayout>
  );
};
