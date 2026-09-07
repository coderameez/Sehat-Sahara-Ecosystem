import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, Share2, Download, FileText, Image as ImageIcon, Pill, Stethoscope, File, FolderInput, Trash2 } from 'lucide-react';
import { MOCK_RECORDS } from './mockData';

export const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const record = MOCK_RECORDS.find(r => r.id === id);

  if (!record) {
    return (
      <MobileAppShell>
        <div className="flex items-center justify-center h-full">Record not found</div>
      </MobileAppShell>
    );
  }

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Lab Report': return <FileText className="w-12 h-12 text-red-500" />;
      case 'Scan': return <ImageIcon className="w-12 h-12 text-blue-500" />;
      case 'Prescription': return <Pill className="w-12 h-12 text-emerald-500" />;
      case 'Consultation': return <Stethoscope className="w-12 h-12 text-green-500" />;
      default: return <File className="w-12 h-12 text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
      case 'Lab Report': return 'bg-red-50';
      case 'Scan': return 'bg-blue-50';
      case 'Prescription': return 'bg-emerald-50';
      case 'Consultation': return 'bg-green-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 pt-safe flex items-center bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate('/patient/records', { replace: true })} className="p-1 -ml-1 active:bg-slate-100 rounded-full" aria-label="Go back">
            <ChevronLeft className="w-7 h-7 text-slate-900" />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900 ml-2">Record Detail</h1>
        </header>

        <div className="app-scroll flex-1 px-4 py-6 pb-40">
          
          <div className={`w-full h-48 ${getBgColor(record.type)} rounded-2xl flex flex-col items-center justify-center gap-3 border border-slate-200 mb-6 shadow-sm`}>
            {getIconForType(record.type)}
            <span className="font-bold text-slate-600">No Preview Available</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{record.type}</span>
              <span className="text-[13px] text-slate-500 font-medium">{record.date}</span>
            </div>
            
            <h2 className="text-[20px] font-bold text-slate-900 mb-6 leading-tight">{record.title}</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-1">Doctor</p>
                <p className="text-[15px] font-bold text-slate-800">{record.doctor || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-1">Facility</p>
                <p className="text-[15px] font-bold text-slate-800">{record.facility || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-1">Care Recipient</p>
                <p className="text-[15px] font-bold text-slate-800">Shazia Raza (Mother)</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-1">File Size</p>
                <p className="text-[15px] font-bold text-slate-800">{(record as any).size || 'Unknown'}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-50">
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate(PATIENT_ROUTES.RECORD_SHARE.replace(':id', record.id))}
              icon={<Share2 className="w-5 h-5" />}
            >
              Share Securely
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" icon={<Download className="w-5 h-5" />}>Download</Button>
              <Button variant="secondary" icon={<FolderInput className="w-5 h-5" />}>Move</Button>
              <Button variant="danger" icon={<Trash2 className="w-5 h-5" />}>Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </MobileAppShell>
  );
};
