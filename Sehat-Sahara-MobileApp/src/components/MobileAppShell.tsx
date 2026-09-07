import React from 'react';
import './MobileAppShell.css';

export interface MobileAppShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MobileAppShell — the innermost wrapper for every screen.
 * Renders inside DesktopDeviceFrame > .sehat-app-content.
 * 
 * Uses flex column with min-h-0 so children can scroll.
 * Individual screens decide their own overflow behavior.
 */
export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col flex-1 w-full min-h-0 relative bg-white ${className}`}>
      {children}
    </div>
  );
};
