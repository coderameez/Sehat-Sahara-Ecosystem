import React from 'react';

interface SehatSaharaLogoProps {
  variant: 'lightBackground' | 'darkBackground';
  compact?: boolean;
  className?: string;
  alt?: string;
}

export const SehatSaharaLogo: React.FC<SehatSaharaLogoProps> = ({
  variant,
  compact = false,
  className = '',
  alt = 'Sehat Sahara Logo',
}) => {
  // Use the transparent logo as a fallback if the specific one is not found
  const imgSrc = variant === 'darkBackground' 
    ? '/brand/sehat-sahara-logo-transparent.png' 
    : '/brand/sehat-sahara-logo-header.png';
    
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        style={{ 
          height: compact ? '32px' : '48px', 
          width: 'auto', 
          display: 'block', 
          flexShrink: 0,
          objectFit: 'contain'
        }}
        onError={(e) => {
          const t = e.currentTarget;
          if (!t.src.endsWith('.png.png')) {
            t.src = '/brand/sehat-sahara-logo-transparent.png.png';
          }
        }}
      />
    </div>
  );
};
