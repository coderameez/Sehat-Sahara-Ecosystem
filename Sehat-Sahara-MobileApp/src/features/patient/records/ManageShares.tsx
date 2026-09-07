import React, { useState } from 'react';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, Copy, Check, Lock, ExternalLink } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

const SHARES = [
  { id: '1', recipient: 'Dr. Ahmed Raza', records: 2, created: 'Today 2:10 PM', expiry: '23h 47m', status: 'Active', token: 'a7f3k9', pin: '8413' },
  { id: '2', recipient: 'Ziauddin Hospital', records: 5, created: 'Oct 10, 2026', expiry: 'Expired', status: 'Expired', token: 'expired', pin: '1122' },
  { id: '3', recipient: 'Anyone with link', records: 1, created: 'Oct 05, 2026', expiry: 'Revoked', status: 'Revoked', token: 'revoked', pin: '0000' }
];

export const ManageShares: React.FC = () => {
  const goBack = useAppBack();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    // Simple alert for demo
    alert(`Copied: ${text}`);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Expired') return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 flex items-center justify-between bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <div className="flex items-center">
            <button onClick={() => goBack()} className="p-1 -ml-1 active:bg-slate-100 rounded-full">
              <ChevronLeft className="w-7 h-7 text-slate-900" />
            </button>
            <h1 className="text-[18px] font-bold text-slate-900 ml-2">My Shares</h1>
          </div>
        </header>

        <div className="app-scroll flex-1 px-4 py-6 pb-28">
          
          <div className="flex flex-col gap-4">
            {SHARES.map(share => (
              <div key={share.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <button 
                  onClick={() => setExpandedId(expandedId === share.id ? null : share.id)}
                  className="w-full p-4 text-left flex items-start justify-between active:bg-slate-50 transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-[15px] mb-1">{share.recipient}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] text-slate-500">{share.records} records</span>
                      <span className="text-[12px] text-slate-400">•</span>
                      <span className="text-[13px] text-slate-500">{share.created}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(share.status)}`}>
                      {share.status}
                    </span>
                  </div>
                  {share.status === 'Active' && (
                    <div className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {share.expiry}
                    </div>
                  )}
                </button>

                {expandedId === share.id && (
                  <div className="p-4 pt-0 border-t border-slate-100 mt-2 bg-slate-50/50">
                    <div className="mt-4 mb-4">
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Shareable Link</p>
                      <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-3">
                        <span className="text-[13px] text-slate-900 font-medium truncate">sehatsahara.app/shared/records/{share.token}</span>
                        <button 
                          onClick={(e) => handleCopy(`https://sehatsahara.app/shared/records/${share.token}`, e)}
                          className="shrink-0 p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Access PIN</p>
                      <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-3">
                        <span className="text-[16px] text-slate-900 font-bold tracking-[0.2em]">{share.pin}</span>
                        <button 
                          onClick={(e) => handleCopy(share.pin, e)}
                          className="shrink-0 p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Access Log</p>
                      <div className="text-[13px] text-slate-700 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Opened by recipient — Today 2:14 PM
                      </div>
                    </div>

                    {share.status === 'Active' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          onClick={() => window.open(`/shared/records/${share.token}`, '_blank')}
                          icon={<ExternalLink className="w-4 h-4" />}
                        >
                          Preview
                        </Button>
                        <Button variant="danger" icon={<Lock className="w-4 h-4" />}>
                          Revoke Access
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </MobileAppShell>
  );
};
