import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, FileText, Image as ImageIcon, Pill, File, CheckSquare, Square, Share2, FolderInput } from 'lucide-react';
import { MOCK_RECORDS } from './mockData';

const FOLDERS = [
  { id: 'f-1', name: 'Lab Reports', type: 'Lab Report' },
  { id: 'f-2', name: 'Scans & X-Rays', type: 'Scan' },
  { id: 'f-3', name: 'Prescriptions', type: 'Prescription' },
  { id: 'f-4', name: 'Consultations', type: 'Consultation' },
  { id: 'f-5', name: 'Other', type: 'Other' },
];

export const FolderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const folder = FOLDERS.find(f => f.id === folderId) || FOLDERS[0];
  
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const records = MOCK_RECORDS.filter(r => 
    r.type === folder.type || (folder.type === 'Other' && !['Lab Report', 'Scan', 'Prescription', 'Consultation'].includes(r.type))
  );

  const getIconForType = (type: string) => {
    switch(type) {
      case 'Lab Report': return { icon: <FileText className="w-5 h-5 text-red-600" />, bg: 'bg-red-50' };
      case 'Scan': return { icon: <ImageIcon className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' };
      case 'Prescription': return { icon: <Pill className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' };
      default: return { icon: <File className="w-5 h-5 text-slate-600" />, bg: 'bg-slate-50' };
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    if (isSelectMode) {
      toggleSelect(id, e);
    } else {
      navigate(PATIENT_ROUTES.RECORD_DETAIL.replace(':id', id));
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className="px-4 py-4 pt-safe flex items-center justify-between bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
          <div className="flex items-center">
            <button onClick={() => navigate('/patient/records', { replace: true })} className="p-1 -ml-1 active:bg-slate-100 rounded-full" aria-label="Go back">
              <ChevronLeft className="w-7 h-7 text-slate-900" />
            </button>
            <h1 className="text-[18px] font-bold text-slate-900 ml-2">{folder.name}</h1>
          </div>
          <button 
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              setSelectedIds(new Set());
            }}
            className="text-[15px] font-bold text-[#1B7F4C]"
          >
            {isSelectMode ? 'Cancel' : 'Select'}
          </button>
        </header>

        <div className="app-scroll flex-1 px-4 py-6 pb-32">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <File className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Empty Folder</h3>
              <p className="text-slate-500 text-[14px]">No records found in this folder.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {records.map(rec => {
                const { icon, bg } = getIconForType(rec.type);
                const isSelected = selectedIds.has(rec.id);
                
                return (
                  <button
                    key={rec.id}
                    onClick={(e) => handleRowClick(rec.id, e)}
                    className={`p-4 bg-white rounded-2xl border-2 shadow-sm flex items-center gap-4 text-left transition-colors ${
                      isSelected ? 'border-[#1B7F4C] bg-emerald-50/30' : 'border-slate-100 active:bg-slate-50'
                    }`}
                  >
                    {isSelectMode && (
                      <div className="shrink-0 mr-1">
                        {isSelected ? (
                          <CheckSquare className="w-6 h-6 text-[#1B7F4C]" />
                        ) : (
                          <Square className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      {icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-[15px] truncate mb-1">{rec.title}</h3>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[12px] text-slate-500">{rec.date}</span>
                        <span className="text-[12px] text-slate-400">•</span>
                        <span className="text-[12px] text-slate-500">{(rec as any).size}</span>
                      </div>
                      <p className="text-[12px] text-slate-500 truncate">{rec.doctor || rec.facility}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {isSelectMode && selectedIds.size > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 flex gap-3 pb-safe z-50">
            <Button 
              variant="secondary"
              onClick={() => {}}
              icon={<FolderInput className="w-5 h-5" />}
            >
              Move
            </Button>
            <Button 
              onClick={() => navigate('/patient/records/share')}
              icon={<Share2 className="w-5 h-5" />}
            >
              Share ({selectedIds.size})
            </Button>
          </div>
        )}
      </div>
    </MobileAppShell>
  );
};
