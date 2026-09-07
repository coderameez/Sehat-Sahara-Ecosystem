import React from 'react';
import { MobileAppShell } from '../../../components';
import { ChevronLeft, Mail, Phone, ExternalLink } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const HelpSupport: React.FC = () => {
  const goBack = useAppBack();

  return (
    <MobileAppShell>
      <header className="px-5 py-4 shrink-0 bg-white border-b border-slate-100 flex items-center">
        <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Help & Support</h1>
      </header>

      <div className="app-scroll flex-1 px-5 pb-8 pt-6 bg-slate-50">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">How can we help?</h2>
          <p className="text-[15px] text-slate-600">Get assistance with your app or health services.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <a href="tel:111111111" className="flex items-center gap-4 p-4 border-b border-slate-100 active:bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-[15px]">Call Support</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">Available 24/7 for urgent issues</p>
            </div>
          </a>
          <a href="mailto:support@sehatsahara.local" className="flex items-center gap-4 p-4 active:bg-slate-50">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-[15px]">Email Us</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">We reply within 24 hours</p>
            </div>
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <button className="w-full flex items-center justify-between p-4 active:bg-slate-50">
            <span className="font-semibold text-slate-800 text-[15px]">FAQs</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </MobileAppShell>
  );
};
