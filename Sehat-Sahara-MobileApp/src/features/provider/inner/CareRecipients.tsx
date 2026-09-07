import React from 'react';
import { ProviderInnerLayout } from '../components/ProviderInnerLayout';
import { ProviderStore } from '../../../services/ProviderStore';
import { Button } from '../../../components';
import { ShieldAlert, Search, FileText } from 'lucide-react';

export const CareRecipients: React.FC = () => {
  const { appointments } = ProviderStore.getSnapshot();

  // In a real app, this would be a separate list of patients. For the prototype, we extract unique patients from appointments.
  const uniquePatients = Array.from(new Map(appointments.map(a => [a.patientName, a])).values());

  return (
    <ProviderInnerLayout title="Care Recipients" subtitle="Patients & Records">
      <div className="p-5 space-y-4">
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
            placeholder="Search by name, ID, or phone..."
          />
        </div>

        {uniquePatients.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center flex flex-col items-center">
            <h3 className="text-slate-900 font-bold mb-1">No Care Recipients</h3>
            <p className="text-slate-500 text-sm">You haven't seen any patients yet.</p>
          </div>
        ) : (
          uniquePatients.map(patient => (
            <div key={patient.patientName} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                  {patient.patientInitials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{patient.patientName}</h4>
                  <p className="text-sm text-slate-500">ID: PT-{Math.floor(Math.random() * 10000)}</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-start gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                <p className="text-xs text-orange-800 font-medium">
                  Direct contact (Call/WhatsApp) is disabled unless explicitly permitted by the patient or active appointment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> Medical Records
                </Button>
                <Button variant="secondary">View History</Button>
              </div>
            </div>
          ))
        )}

      </div>
    </ProviderInnerLayout>
  );
};
