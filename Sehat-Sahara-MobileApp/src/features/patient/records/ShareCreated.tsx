import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { CheckCircle, Copy, Check, MessageCircle, Mail, Share2 } from 'lucide-react';

export const ShareCreated: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  
  const [linkCopied, setLinkCopied] = useState(false);
  const [pinCopied, setPinCopied] = useState(false);

  const fullLink = `sehatsahara.app/shared/records/${token}`;
  const pin = "8413";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${fullLink}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pin);
    setPinCopied(true);
    setTimeout(() => setPinCopied(false), 2000);
  };

  const shareText = `Secure Medical Records\nLink: https://${fullLink}\nPIN: ${pin}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=Medical Records&body=${encodeURIComponent(shareText)}`, '_self');
  };

  const handleMore = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Secure Medical Records',
        text: shareText,
        url: `https://${fullLink}`
      });
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-white relative">
        <div className="app-scroll flex-1 px-5 py-8 pb-32">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-[#1B7F4C]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Secure link created</h1>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
            
            <div className="mb-6">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Shareable Link</label>
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <span className="text-[14px] text-slate-900 font-medium truncate">{fullLink}</span>
                <button 
                  onClick={handleCopyLink}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[13px] font-bold text-slate-700 transition-colors"
                >
                  {linkCopied ? <Check className="w-4 h-4 text-[#1B7F4C]" /> : <Copy className="w-4 h-4" />}
                  {linkCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Access PIN</label>
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {pin.split('').map((digit, i) => (
                    <div key={i} className="w-10 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xl font-bold text-slate-900 shadow-sm">
                      {digit}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleCopyPin}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[13px] font-bold text-slate-700 transition-colors"
                >
                  {pinCopied ? <Check className="w-4 h-4 text-[#1B7F4C]" /> : <Copy className="w-4 h-4" />}
                  {pinCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-emerald-50 text-[#1B7F4C] text-[13px] p-3 rounded-lg font-medium mb-4">
              Share the link and PIN separately for safety.
            </div>

            <div className="text-[13px] text-slate-500">
              Expires in 24 hours • 2 records • View only
            </div>
          </div>

          <div>
            <h2 className="text-[14px] font-bold text-slate-900 mb-3 ml-1">Share via</h2>
            <div className="grid grid-cols-4 gap-3">
              <button onClick={handleWhatsApp} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[12px] font-medium text-slate-600">WhatsApp</span>
              </button>
              <button onClick={handleSMS} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[12px] font-medium text-slate-600">SMS</span>
              </button>
              <button onClick={handleEmail} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-[12px] font-medium text-slate-600">Email</span>
              </button>
              <button onClick={handleMore} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Share2 className="w-6 h-6" />
                </div>
                <span className="text-[12px] font-medium text-slate-600">More</span>
              </button>
            </div>
          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          <Button onClick={() => navigate(PATIENT_ROUTES.RECORDS, { replace: true })}>
            Done
          </Button>
        </div>
      </div>
    </MobileAppShell>
  );
};
