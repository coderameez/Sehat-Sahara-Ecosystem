import React from 'react';
import './MobileAppShell.css';

export const DesktopDeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="sehat-app-root">
      <div className="sehat-app-device-frame">
        {/* Desktop-only: iOS-style status bar area */}
        <div className="sehat-app-status-bar">
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em', width: '54px' }}>
            9:41
          </span>
          <div className="sehat-app-dynamic-island" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0F172A', width: '54px', justifyContent: 'flex-end' }}>
            <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor">
              <rect x="0" y="7" width="2.5" height="4" rx="0.5" />
              <rect x="3.5" y="4.5" width="2.5" height="6.5" rx="0.5" />
              <rect x="7" y="2" width="2.5" height="9" rx="0.5" />
              <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" opacity="0.3" />
            </svg>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M7.5 10.5h0" strokeWidth="2" />
              <path d="M5 8.2a3.5 3.5 0 0 1 5 0" />
              <path d="M2.5 5.6a7 7 0 0 1 10 0" opacity="0.6"/>
              <path d="M0 3a10.5 10.5 0 0 1 15 0" opacity="0.3"/>
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.35" />
              <rect x="2" y="2" width="13" height="7" rx="1.5" fill="currentColor" />
              <path d="M19.5 3.5v4a1.5 1.5 0 0 0 0-4z" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Inner app content area */}
        <div className="sehat-app-content">
          {children}
        </div>

        {/* Desktop-only: iOS home indicator bar */}
        <div className="sehat-app-home-indicator">
          <div style={{
            width: '130px',
            height: '4px',
            borderRadius: '999px',
            backgroundColor: '#1C1C1E',
          }} />
        </div>
      </div>
    </div>
  );
};

