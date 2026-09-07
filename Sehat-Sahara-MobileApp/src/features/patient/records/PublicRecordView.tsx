import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, SehatSaharaLogo } from '../../../components';
import { Lock, FileText, Image as ImageIcon, Pill, Download, Eye, Clock, AlertCircle } from 'lucide-react';

const MOCK_SHARED_RECORDS = [
  { id: '1', title: 'Complete Blood Count', type: 'Lab Report', date: '12 Oct 2026', size: '1.2 MB' },
  { id: '2', title: 'Chest X-Ray', type: 'Scan', date: '10 Oct 2026', size: '4.5 MB' }
];

export const PublicRecordView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  
  const [pin, setPin] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [error, setError] = useState('');

  // Handle fake status simulation
  if (token === 'expired') return <ErrorState type="expired" />;
  if (token === 'revoked') return <ErrorState type="revoked" />;
  if (token === 'invalid') return <ErrorState type="invalid" />;

  const handleChange = (index: number, value: string) => {
    const newPin = [...pin];
    const char = value.slice(-1);
    newPin[index] = char;
    setPin(newPin);
    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleView = () => {
    const entered = pin.join('');
    if (entered.length < 4) {
      setError('Please enter all 4 digits');
      return;
    }
    // Accept any 4 digits for demo
    setIsUnlocked(true);
    setError('');
  };

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Lab Report': return <FileText className="w-6 h-6 text-red-500" />;
      case 'Scan': return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'Prescription': return <Pill className="w-6 h-6 text-emerald-500" />;
      default: return <FileText className="w-6 h-6 text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'Lab Report': return 'bg-red-50';
      case 'Scan': return 'bg-blue-50';
      case 'Prescription': return 'bg-emerald-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative font-sans w-full max-w-[480px] mx-auto border-x border-slate-200">
      
      <header className="px-4 py-4 flex flex-col items-center justify-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
        <SehatSaharaLogo variant="lightBackground" className="w-10 h-10 mb-2"  />
        <h1 className="text-[16px] font-extrabold text-[#1B7F4C] tracking-wide">SEHAT SAHARA</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-8 pb-32">
        
        {!isUnlocked ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Secure Medical Records</h2>
            <p className="text-[14px] text-slate-500 mb-6">Shared by <span className="font-bold text-slate-700">Ayesha Yousuf</span></p>
            
            <p className="text-[14px] font-medium text-slate-700 mb-4">Enter the 4-digit PIN to view these records</p>
            
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="password"
                  inputMode="numeric"
                  value={pin[index]}
                  onChange={e => handleChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-[#1B7F4C] focus:outline-none"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-[13px] mb-4 font-medium">{error}</p>}

            <Button onClick={handleView}>View Records</Button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Shared Records</h2>
                <p className="text-[13px] text-slate-500">From Ayesha Yousuf</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#1B7F4C]" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {MOCK_SHARED_RECORDS.map(rec => (
                <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getBgColor(rec.type)}`}>
                      {getIconForType(rec.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-[15px] truncate mb-1">{rec.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{rec.type}</span>
                        <span className="text-[12px] text-slate-400">•</span>
                        <span className="text-[12px] text-slate-500">{rec.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100">
                    <Button variant="secondary" icon={<Eye className="w-4 h-4" />}>View</Button>
                    <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Download</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center text-[13px] text-slate-500 mt-8 font-medium">Access expires in 23h 47m</p>
          </div>
        )}

      </div>
    </div>
  );
};

const ErrorState = ({ type }: { type: 'expired' | 'revoked' | 'invalid' }) => {
  let title = '';
  let msg = '';
  let icon = <AlertCircle className="w-10 h-10 text-red-500" />;
  
  if (type === 'expired') {
    title = 'Link Expired';
    msg = 'This link has expired. Please request a new one from the patient.';
    icon = <Clock className="w-10 h-10 text-orange-500" />;
  } else if (type === 'revoked') {
    title = 'Access Revoked';
    msg = 'Access to these records has been revoked.';
  } else {
    title = 'Invalid Link';
    msg = 'This link is not valid.';
  }

  return (
    <div className="flex flex-col h-screen bg-white justify-center items-center px-6 text-center max-w-[480px] mx-auto border-x border-slate-200">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${type === 'expired' ? 'bg-orange-100' : 'bg-red-100'}`}>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-[15px] text-slate-500 mb-10">{msg}</p>
    </div>
  );
};
