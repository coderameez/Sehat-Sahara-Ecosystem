import React, { useState } from 'react';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, Lock, Shield, EyeOff } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const PrivacyContact: React.FC = () => {
  const goBack = useAppBack();
  const [allowDataSharing, setAllowDataSharing] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
    }, 2000);
  };

  return (
    <MobileAppShell>
      <header className="px-5 py-4 shrink-0 bg-white border-b border-slate-100 flex items-center">
        <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Privacy & Contact</h1>
      </header>

      <div className="app-scroll flex-1 px-5 pb-8 pt-6 bg-slate-50">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Privacy Settings</h2>
          <p className="text-[15px] text-slate-600">Control your data and who can contact you.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="font-semibold text-slate-900 text-[15px]">Profile Visibility</h3>
                <p className="text-[12px] text-slate-500">Only visible to connected doctors</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="font-semibold text-slate-900 text-[15px]">Data Sharing</h3>
                <p className="text-[12px] text-slate-500">Help improve community features</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setAllowDataSharing(!allowDataSharing)}
              className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                allowDataSharing ? 'bg-brand-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                allowDataSharing ? 'transform translate-x-5' : ''
              }`} />
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="font-semibold text-slate-900 text-[15px]">Blocked Contacts</h3>
                <p className="text-[12px] text-slate-500">0 blocked</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <h3 className="font-semibold text-slate-900 text-[15px] mb-2">Download Your Data</h3>
          <p className="text-[13px] text-slate-600 mb-4">Request a copy of all your medical records, chat history, and platform data.</p>
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading || downloaded} 
            variant={downloaded ? 'secondary' : 'primary'}
            fullWidth
          >
            {isDownloading ? 'Processing...' : downloaded ? 'Data Emailed to You' : 'Request Data Export'}
          </Button>
        </div>

        <Button onClick={() => goBack()} size="lg" fullWidth>
          Save Changes
        </Button>
      </div>
    </MobileAppShell>
  );
};
