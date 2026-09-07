import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button, Input } from '../../../components';
import { ChevronLeft } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const ShareRecord: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();
  
  const [permission, setPermission] = useState('view');
  const [expiry, setExpiry] = useState('24h');
  const [recipient, setRecipient] = useState('');

  const handleGenerate = () => {
    // Navigate to created with some random token
    navigate(`/patient/records/share/a7f3k9/created`, { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => goBack()} className="p-1 -ml-1 active:bg-slate-100 rounded-full">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900 ml-2">Share Securely</h1>
        </header>

        <div className="app-scroll flex-1 px-4 py-6 pb-28">
          
          <div className="mb-6">
            <h2 className="text-[14px] font-bold text-slate-900 mb-3 ml-1">Access Permission</h2>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setPermission('view')}
                className={`p-4 rounded-2xl border-2 text-left transition-colors ${permission === 'view' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${permission === 'view' ? 'border-[#1B7F4C]' : 'border-slate-300'}`}>
                    {permission === 'view' && <div className="w-2.5 h-2.5 rounded-full bg-[#1B7F4C]" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">View only</span>
                    <span className="text-[13px] text-slate-500">Recipient can view but not download</span>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => setPermission('download')}
                className={`p-4 rounded-2xl border-2 text-left transition-colors ${permission === 'download' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${permission === 'download' ? 'border-[#1B7F4C]' : 'border-slate-300'}`}>
                    {permission === 'download' && <div className="w-2.5 h-2.5 rounded-full bg-[#1B7F4C]" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">View & Download</span>
                    <span className="text-[13px] text-slate-500">Recipient can download the file</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-[14px] font-bold text-slate-900 mb-3 ml-1">Link Expires In</h2>
            <div className="flex gap-3">
              {['1h', '24h', '7d'].map(time => (
                <button
                  key={time}
                  onClick={() => setExpiry(time)}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold transition-colors ${
                    expiry === time ? 'border-[#1B7F4C] bg-emerald-50 text-[#1B7F4C]' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {time === '1h' ? '1 hour' : time === '24h' ? '24 hours' : '7 days'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Input 
              label="Recipient (Optional)"
              placeholder="e.g. Dr. Ahmed Raza, Cardiologist"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          <Button onClick={handleGenerate}>
            Generate Secure Link
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
