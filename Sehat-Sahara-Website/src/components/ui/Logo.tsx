import React, { useState } from 'react';

interface LogoProps {
  /**
   * Theme variant of the surface where the logo will be rendered:
   * 'light' for light/white backgrounds
   * 'dark' for dark green or dark backgrounds
   * 'auto' to dynamically respond to light/dark mode
   */
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  imgClassName?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'auto',
  className = '',
  imgClassName = 'h-10 w-auto',
  showText = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Logo asset paths based on prompt specifications:
  // Dark/green backgrounds: sehat-sahara-logo-transparent.png
  // Light backgrounds: sehat-sahara-logo-color.jpeg (or transparent with proper contrast)
  const lightBgLogo = '/brand/sehat-sahara-logo-color.jpeg';
  const darkBgLogo = '/brand/sehat-sahara-logo-transparent.png';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {!imageError ? (
        <div className="relative flex items-center">
          {variant === 'auto' ? (
            <>
              {/* Light mode logo */}
              <img
                src={lightBgLogo}
                alt="Sehat Sahara Logo"
                className={`dark:hidden object-contain max-h-12 ${imgClassName}`}
                onError={() => setImageError(true)}
              />
              {/* Dark mode logo */}
              <img
                src={darkBgLogo}
                alt="Sehat Sahara Logo"
                className={`hidden dark:block object-contain max-h-12 ${imgClassName}`}
                onError={() => setImageError(true)}
              />
            </>
          ) : variant === 'dark' ? (
            <img
              src={darkBgLogo}
              alt="Sehat Sahara Logo"
              className={`object-contain max-h-12 ${imgClassName}`}
              onError={() => setImageError(true)}
            />
          ) : (
            <img
              src={lightBgLogo}
              alt="Sehat Sahara Logo"
              className={`object-contain max-h-12 ${imgClassName}`}
              onError={() => setImageError(true)}
            />
          )}
        </div>
      ) : (
        /* Clean fallback if image files are unavailable */
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            SS
          </div>
          <span className="font-bold text-xl tracking-tight text-brand-700 dark:text-brand-300">
            Sehat Sahara
          </span>
        </div>
      )}

      {showText && !imageError && (
        <span className="font-bold text-xl tracking-tight text-brand-700 dark:text-slate-100 hidden sm:inline-block">
          Sehat Sahara
        </span>
      )}
    </div>
  );
};

export default Logo;
