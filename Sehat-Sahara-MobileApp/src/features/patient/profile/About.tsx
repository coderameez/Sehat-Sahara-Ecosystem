import React from 'react';
import { MobileAppShell } from '../../../components';
import { ChevronLeft } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const About: React.FC = () => {
  const goBack = useAppBack();

  return (
    <MobileAppShell>
      <header className="px-5 py-4 shrink-0 bg-white border-b border-slate-100 flex items-center">
        <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">About</h1>
      </header>

      <div className="app-scroll flex-1 px-5 pb-8 pt-6 bg-slate-50">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center mb-6 shadow-sm">
          <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center mb-4 text-white font-extrabold text-2xl">
            SS
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sehat Sahara</h2>
          <p className="text-slate-500 font-medium mt-1">Version 1.0.0</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[15px] font-semibold text-slate-800">Terms of Service</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-[15px] font-semibold text-slate-800">Licenses</span>
          </div>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 Sehat Sahara. All rights reserved.
        </p>
      </div>
    </MobileAppShell>
  );
};
