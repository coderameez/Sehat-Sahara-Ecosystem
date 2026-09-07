import { useState } from 'react';
import { Lock, FileText, Download, Eye, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { store } from '../../store';
import type { Patient } from '../../types';

interface SharedRecordsTabProps {
  patient: Patient;
}

export function SharedRecordsTab({ patient }: SharedRecordsTabProps) {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (pin.join('') === '123456') {
        store.updatePatientConsent(patient.id, 'Active');
        setShowPinModal(false);
      } else {
        setError('Invalid PIN code. Please try again.');
      }
      setIsVerifying(false);
    }, 1000);
  };

  if (patient.consentStatus !== 'Active') {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-6 relative">
          <ShieldAlert size={40} />
          <div className="absolute -bottom-2 -right-2 bg-red-100 text-red-600 rounded-full p-1.5 border-4 border-white">
            <Lock size={16} />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-txt-primary mb-2">Access Restricted</h3>
        <p className="text-sm text-txt-secondary mb-6">
          Patient consent is required to view shared medical records. A 6-digit PIN will be sent to the patient's registered mobile number ({patient.phone}).
        </p>
        
        <Button 
          variant="primary" 
          className="w-full justify-center py-2.5 text-base"
          onClick={() => setShowPinModal(true)}
        >
          Request Access PIN
        </Button>

        {showPinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold text-txt-primary">Enter Access PIN</h4>
                <p className="text-sm text-txt-secondary mt-1">
                  Sent to {patient.phone}
                </p>
              </div>
              
              <div className="flex gap-2 justify-center mb-6">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    id={`pin-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-surface-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                  />
                ))}
              </div>
              
              {error && (
                <p className="text-sm text-red-500 text-center mb-4">{error}</p>
              )}

              <div className="flex flex-col gap-3">
                <Button 
                  variant="primary" 
                  className="w-full justify-center py-2.5"
                  onClick={handleVerify}
                  disabled={isVerifying || pin.some(d => !d)}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Access Records'}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-txt-secondary"
                  onClick={() => setShowPinModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Consent - Show Records
  const files = [
    { id: 'f1', name: 'Blood_Test_Report_May2025.pdf', type: 'PDF', size: '2.4 MB', date: '10 May 2025', source: 'Chughtai Lab' },
    { id: 'f2', name: 'Chest_Xray_April.jpg', type: 'Image', size: '4.1 MB', date: '15 Apr 2025', source: 'Sehat Sahara Radiology' },
    { id: 'f3', name: 'Prescription_May10.pdf', type: 'PDF', size: '1.1 MB', date: '10 May 2025', source: 'Dr. Ahmed Raza' },
  ];

  const [previewFile, setPreviewFile] = useState<typeof files[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={24} className="text-emerald-600" />
          <div>
            <h4 className="font-semibold text-emerald-900">Access Granted</h4>
            <p className="text-sm text-emerald-700">You have active consent to view this patient's shared records.</p>
          </div>
        </div>
        <Button variant="outline" className="text-emerald-700 border-emerald-300 hover:bg-emerald-100" onClick={() => store.updatePatientConsent(patient.id, 'Expired')}>
          Revoke Access
        </Button>
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <Card key={file.id} className="flex items-center justify-between p-4 hover:border-brand-300 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                <FileText size={24} />
              </div>
              <div>
                <h5 className="font-semibold text-txt-primary group-hover:text-brand-700 transition-colors">{file.name}</h5>
                <div className="flex items-center gap-2 text-xs text-txt-muted mt-1">
                  <span className="font-medium">{file.type}</span>
                  <span>•</span>
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.date}</span>
                  <span>•</span>
                  <span>{file.source}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" className="p-2 text-txt-secondary hover:text-brand-600" onClick={() => setPreviewFile(file)}>
                <Eye size={18} />
              </Button>
              <Button variant="ghost" className="p-2 text-txt-secondary hover:text-brand-600 opacity-50 cursor-not-allowed" title="Demo file not available for download">
                <Download size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl flex flex-col h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-surface-border">
              <h3 className="font-bold text-txt-primary">{previewFile.name}</h3>
              <button onClick={() => setPreviewFile(null)} className="text-txt-muted hover:text-txt-primary">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
              <div className="text-center max-w-md">
                <FileText size={64} className="mx-auto text-slate-300 mb-6" />
                <p className="text-xl font-medium text-txt-primary mb-2">Secure Document Preview</p>
                <p className="text-sm text-txt-secondary leading-relaxed">
                  This is a mock representation of <strong>{previewFile.name}</strong>. In a live environment, the actual PDF or Image viewer would render the document here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
