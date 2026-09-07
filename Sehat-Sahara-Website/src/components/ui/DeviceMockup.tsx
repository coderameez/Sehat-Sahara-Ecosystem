import React, { useState } from 'react';
import { Smartphone, Image as ImageIcon } from 'lucide-react';

interface DeviceMockupProps {
  imageSrc: string;
  alt: string;
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  priority?: boolean;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  imageSrc,
  alt,
  title,
  subtitle = 'Replace with App Screenshot',
  badge = 'Mobile App View',
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative mx-auto w-full max-w-[320px] sm:max-w-[340px] md:max-w-[360px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-darkbg-800 shadow-xl hover:shadow-2xl border border-slate-200/90 dark:border-darkbg-border transition-all duration-300 transform hover:-translate-y-1.5 group select-none ${className}`}
    >
      {/* Screen container without artificial iOS mock */}
      <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-darkbg-800 flex flex-col">
        {/* Replaceable screenshot image */}
        {!imageError && (
          <img
            src={imageSrc}
            alt={alt}
            className={`w-full h-auto object-contain block transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Fallback placeholder if actual screenshot file is not available */}
        {(!imageLoaded || imageError) && (
          <div className="w-full aspect-[9/18] flex flex-col justify-between p-5 bg-gradient-to-b from-brand-50/70 via-white to-slate-50 dark:from-darkbg-card dark:via-darkbg-800 dark:to-darkbg-900 text-left">
            {/* Header simulated bar */}
            <div className="pt-4 flex items-center justify-between border-b border-slate-200/60 dark:border-darkbg-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-600/15 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                  {badge}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                Preview
              </span>
            </div>

            {/* Middle preview card */}
            <div className="my-auto py-4 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-3 bg-brand-100/70 dark:bg-brand-900/50 border border-brand-200/60 dark:border-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 shadow-sm">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 px-2">
                {title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 px-3 line-clamp-2">
                {subtitle}
              </p>
            </div>

            {/* Bottom replaceable label */}
            <div className="mt-auto pt-3 border-t border-dashed border-slate-300 dark:border-slate-700/80 text-center">
              <span className="inline-block text-[11px] font-mono font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {imageSrc}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceMockup;
