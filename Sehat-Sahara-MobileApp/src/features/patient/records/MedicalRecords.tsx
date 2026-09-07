import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Search, FileText, Image as ImageIcon, Pill, Stethoscope, File, UploadCloud, FolderPlus } from 'lucide-react';
import { MOCK_RECORDS } from './mockData';
import { ActiveCareRecipientChip } from '../../../components/ActiveCareRecipientChip';

const FOLDERS = [
  { id: 'f-1', name: 'Lab Reports', type: 'Lab Report', icon: <FileText className="w-8 h-8 text-red-500" />, bg: 'bg-red-50' },
  { id: 'f-2', name: 'Scans & X-Rays', type: 'Scan', icon: <ImageIcon className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50' },
  { id: 'f-3', name: 'Prescriptions', type: 'Prescription', icon: <Pill className="w-8 h-8 text-emerald-500" />, bg: 'bg-emerald-50' },
  { id: 'f-4', name: 'Consultations', type: 'Consultation', icon: <Stethoscope className="w-8 h-8 text-green-500" />, bg: 'bg-green-50' },
  { id: 'f-5', name: 'Other', type: 'Other', icon: <File className="w-8 h-8 text-slate-500" />, bg: 'bg-slate-50' },
];

export const MedicalRecords: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const recentRecords = MOCK_RECORDS.slice(0, 5); // top 5

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Lab Report': return { icon: <FileText className="w-5 h-5 text-red-600" />, bg: 'bg-red-50' };
      case 'Scan': return { icon: <ImageIcon className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' };
      case 'Prescription': return { icon: <Pill className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' };
      default: return { icon: <File className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-50' };
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        
        <header className="px-4 py-4 flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate(PATIENT_ROUTES.HOME)} className="p-1 -ml-1 active:bg-slate-100 rounded-full">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900 ml-2">My Records</h1>
        </header>

        <ActiveCareRecipientChip />

        <div className="app-scroll flex-1 px-4 py-6 pb-28">
          
          <div className="mb-6">
            <Button 
              onClick={() => navigate('/patient/records/upload')}
              icon={<UploadCloud className="w-5 h-5" />}
            >
              Upload Record
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-[#1B7F4C]"
            />
          </div>

          {/* Folder Grid */}
          <div className="mb-8">
            <h2 className="text-[16px] font-bold text-slate-900 mb-4 px-1">Folders</h2>
            <div className="grid grid-cols-2 gap-3">
              {FOLDERS.map(folder => {
                const count = MOCK_RECORDS.filter(r => r.type === folder.type || (folder.type === 'Other' && !['Lab Report', 'Scan', 'Prescription'].includes(r.type))).length;
                return (
                  <button
                    key={folder.id}
                    onClick={() => navigate(`/patient/records/folder/${folder.id}`)}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start active:bg-slate-50 text-left transition-colors"
                  >
                    <div className={`w-14 h-14 rounded-xl ${folder.bg} flex items-center justify-center mb-3`}>
                      {folder.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 text-[14px] leading-tight mb-1">{folder.name}</h3>
                    <p className="text-[12px] text-slate-500">{count} items</p>
                  </button>
                )
              })}
              <button
                className="p-4 bg-transparent rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center active:bg-slate-100 transition-colors"
              >
                <FolderPlus className="w-8 h-8 text-slate-400 mb-2" />
                <h3 className="font-bold text-slate-500 text-[14px]">New Folder</h3>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-slate-900 mb-4 px-1">Recent Records</h2>
            <div className="flex flex-col gap-3">
              {recentRecords.map(rec => {
                const { icon, bg } = getIconForType(rec.type);
                return (
                  <button
                    key={rec.id}
                    onClick={() => navigate(PATIENT_ROUTES.RECORD_DETAIL.replace(':id', rec.id))}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 active:bg-slate-50 text-left"
                  >
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-bold text-slate-900 text-[15px] truncate mb-1">{rec.title}</h3>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{rec.type}</span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-[12px] text-slate-500">{rec.date}</span>
                      </div>
                      <p className="text-[12px] text-slate-500 truncate">{rec.doctor || rec.facility}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
