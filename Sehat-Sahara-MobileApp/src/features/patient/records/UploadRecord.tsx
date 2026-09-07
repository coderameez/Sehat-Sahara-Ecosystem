import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button, Input } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Camera, FileUp, CheckCircle, File as FileIcon, Scan, Pill, ArrowRight } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';

export const UploadRecord: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('Lab Report');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctor, setDoctor] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState<'IDLE' | 'SCANNING' | 'DETECTED'>('IDLE');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      if (f.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
    }
  };

  useEffect(() => {
    if (isUploading) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsSuccess(true);
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  useEffect(() => {
    if (scanPhase === 'SCANNING') {
      const t = setTimeout(() => setScanPhase('DETECTED'), 4000);
      return () => clearTimeout(t);
    }
  }, [scanPhase]);

  const handleSave = () => {
    setIsUploading(true);
    setProgress(0);
  };

  const finishUpload = () => {
    (PrototypeStore as any).addRecord({
      id: `rec-${Date.now()}`,
      title: title.trim() || file?.name || 'Untitled Record',
      type: folder,
      date,
      doctor: doctor.trim() || 'Added by you',
      facility: '',
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
      fileUrl: preview || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    });
    
    let folderId = 'f-5';
    if (folder === 'Lab Report') folderId = 'f-1';
    else if (folder === 'Scan') folderId = 'f-2';
    else if (folder === 'Prescription') folderId = 'f-3';
    else if (folder === 'Consultation') folderId = 'f-4';
    
    navigate(`/patient/records/folder/${folderId}`, { replace: true });
  };

  const startAIScan = () => {
    setIsScanning(true);
    setScanPhase('SCANNING');
  };

  if (isScanning) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-slate-900 relative">
          <header className="px-4 py-4 flex items-center justify-between z-20">
            <button onClick={() => setIsScanning(false)} className="p-1 active:bg-slate-800 rounded-full text-white">
              <ChevronLeft className="w-7 h-7" />
            </button>
            <span className="text-white font-bold text-[15px]">AI Scanner</span>
            <div className="w-7"></div>
          </header>

          {scanPhase === 'SCANNING' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center" />
              
              <div className="w-64 h-80 border-2 border-emerald-500 rounded-3xl relative overflow-hidden z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-[scan_2s_ease-in-out_infinite]" />
              </div>

              <div className="mt-8 z-10 flex flex-col items-center">
                <Scan className="w-8 h-8 text-emerald-400 mb-3 animate-pulse" />
                <p className="text-white font-bold text-lg">Scanning Prescription...</p>
                <p className="text-slate-400 text-sm mt-1">Keep the document steady</p>
              </div>
            </div>
          )}

          {scanPhase === 'DETECTED' && (
            <div className="flex-1 flex flex-col p-6 relative z-10 bg-slate-900 justify-end pb-32 animate-in slide-in-from-bottom-8 duration-500">
              
              <div className="flex justify-center mb-12">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Pill className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">Prescription Detected</h3>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">AI Extraction Complete</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                  <div className="space-y-3">
                    <div className="border-b border-slate-200 pb-2">
                      <p className="text-[15px] font-semibold text-slate-900">1. Amoxicillin 500mg</p>
                      <p className="text-[13px] text-slate-500">3x daily • 7 days</p>
                    </div>
                    <div className="border-b border-slate-200 pb-2">
                      <p className="text-[15px] font-semibold text-slate-900">2. Paracetamol 500mg</p>
                      <p className="text-[13px] text-slate-500">As needed for fever</p>
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-slate-900">3. Vitamin C 1000mg</p>
                      <p className="text-[13px] text-slate-500">1x daily • 14 days</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(PATIENT_ROUTES.MEDICINES, { replace: true })}
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Save to Medicines
                </Button>
              </div>
            </div>
          )}
        </div>
      </MobileAppShell>
    );
  }

  if (isSuccess) {
    return (
      <MobileAppShell>
        <div className="flex flex-col h-full bg-white justify-center items-center px-6 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-[#1B7F4C]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Complete</h2>
          <p className="text-[15px] text-slate-500 mb-10">Your record has been securely saved.</p>
          <div className="w-full">
            <Button onClick={finishUpload}>Done</Button>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 pt-safe flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate('/patient/records', { replace: true })} className="p-1 -ml-1 active:bg-slate-100 rounded-full" aria-label="Go back">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900 ml-2">Upload Record</h1>
        </header>

        <div className="app-scroll flex-1 px-4 py-6 pb-28">
          
          <button 
            onClick={startAIScan}
            className="w-full mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-transform shadow-sm"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
              <Scan className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-extrabold text-slate-900">Scan Prescription with AI</h2>
              <p className="text-[13px] text-slate-600 mt-0.5 leading-snug">Auto-extract medicines and set reminders instantly.</p>
            </div>
          </button>

          <input 
            type="file" 
            accept="image/*,.pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
          />

          {!file ? (
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 active:bg-slate-50"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-bold text-slate-700 text-[14px]">Take Photo</span>
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 active:bg-slate-50"
              >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <FileUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-bold text-slate-700 text-[14px]">Choose File</span>
              </button>
            </div>
          ) : (
            <div className="mb-8 relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <button 
                onClick={() => setFile(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white z-10"
              >
                ✕
              </button>
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                  <FileIcon className="w-12 h-12 mb-2" />
                  <span className="font-medium">{file.name}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <Input 
              label="Title (Optional)"
              placeholder="e.g. Blood Test Results"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1">Folder / Type (Optional)</label>
              <select 
                value={folder}
                onChange={e => setFolder(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-[#1B7F4C]"
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Scan">Scan & X-Ray</option>
                <option value="Prescription">Prescription</option>
                <option value="Consultation">Consultation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input 
              label="Date (Optional)"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Input 
              label="Doctor or Facility (Optional)"
              placeholder="e.g. Dr. Ahmed Raza"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          {isUploading ? (
            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between text-[13px] font-bold text-[#1B7F4C]">
                <span>Saving securely...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1B7F4C] transition-all duration-150 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <Button onClick={handleSave} disabled={!file}>
              Save Record
            </Button>
          )}
        </div>
      </div>
    </MobileAppShell>
  );
};
