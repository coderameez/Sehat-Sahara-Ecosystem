import { useState, useSyncExternalStore } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Edit, Mail, Phone, MapPin, Activity, Stethoscope, Calendar, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { store } from '../store';
import { SharedRecordsTab } from '../components/patients/SharedRecordsTab';

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  
  const patient = state.patients.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'shared-records'>('overview');

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-txt-primary">Patient Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/patients')}>Back to Patients</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ═══════ Breadcrumb & Header ═══════ */}
      <div>
        <div className="flex items-center gap-2 text-sm text-txt-secondary mb-4">
          <Link to="/patients" className="hover:text-brand-600 transition-colors">Patients</Link>
          <ChevronRight size={16} />
          <span className="font-medium text-txt-primary">{patient.name}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-txt-primary">Patient Details & Medical History</h1>
          </div>
          <Button variant="outline" icon={<Edit size={16} />}>
            Edit Patient
          </Button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        
        {/* ═══════ Left Sidebar (Patient Info) ═══════ */}
        <Card className="w-80 shrink-0 sticky top-6">
          <div className="flex flex-col items-center text-center p-6 border-b border-surface-border">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-2xl mb-4">
              {patient.name.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-txt-primary">{patient.name}</h2>
            <p className="text-sm text-txt-secondary mt-1">{patient.cnic}</p>
            <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {patient.age} Years / {patient.gender}
            </div>
          </div>
          
          <div className="p-6 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-txt-muted mt-0.5" />
              <div>
                <p className="font-medium text-txt-primary">{patient.phone}</p>
                <p className="text-xs text-txt-secondary">Mobile</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-txt-muted mt-0.5" />
              <div>
                <p className="font-medium text-txt-primary">{patient.email}</p>
                <p className="text-xs text-txt-secondary">Email</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-txt-muted mt-0.5" />
              <div>
                <p className="font-medium text-txt-primary">{patient.address}</p>
                <p className="text-xs text-txt-secondary">Address</p>
              </div>
            </div>
            
            <div className="h-px w-full bg-surface-border my-4" />
            
            <div className="flex justify-between items-center">
              <span className="text-txt-muted">Blood Group</span>
              <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{patient.bloodGroup}</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-txt-muted">Assigned Doctor</span>
              <span className="font-medium text-txt-primary">{patient.assignedDoctor}</span>
            </div>
          </div>
        </Card>

        {/* ═══════ Right Main Area ═══════ */}
        <div className="flex-1 space-y-6">
          
          {/* Tabs */}
          <div className="flex gap-8 border-b border-surface-border">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'shared-records', label: 'Shared Records' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.id 
                    ? 'text-brand-600' 
                    : 'text-txt-secondary hover:text-txt-primary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            
            {/* ─── Overview Tab ─── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Medical Summary & Vitals */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-bold text-txt-primary flex items-center gap-2 mb-4">
                      <Stethoscope size={20} className="text-brand-600" />
                      Medical Summary
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-txt-muted mb-1">Allergies</p>
                        <p className="font-medium text-txt-primary">Penicillin, Peanuts</p>
                      </div>
                      <div>
                        <p className="text-txt-muted mb-1">Chronic Conditions</p>
                        <p className="font-medium text-txt-primary">Hypertension (Diagnosed 2022)</p>
                      </div>
                      <div>
                        <p className="text-txt-muted mb-1">Past Surgeries</p>
                        <p className="font-medium text-txt-primary">Appendectomy (2015)</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6 bg-slate-50 border-transparent">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-txt-primary flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" />
                        Latest Vitals
                      </h3>
                      <span className="text-xs text-txt-muted">10 May 2025</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-xl border border-surface-border">
                        <p className="text-xs text-txt-muted mb-1">Blood Pressure</p>
                        <p className="font-bold text-txt-primary">120/80 <span className="text-xs font-normal text-txt-secondary">mmHg</span></p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-surface-border">
                        <p className="text-xs text-txt-muted mb-1">Heart Rate</p>
                        <p className="font-bold text-txt-primary">72 <span className="text-xs font-normal text-txt-secondary">bpm</span></p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-surface-border">
                        <p className="text-xs text-txt-muted mb-1">Weight</p>
                        <p className="font-bold text-txt-primary">78 <span className="text-xs font-normal text-txt-secondary">kg</span></p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-surface-border">
                        <p className="text-xs text-txt-muted mb-1">Temperature</p>
                        <p className="font-bold text-txt-primary">98.6 <span className="text-xs font-normal text-txt-secondary">°F</span></p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Medical History */}
                <Card className="p-6">
                  <h3 className="font-bold text-txt-primary mb-6">Recent Medical History</h3>
                  <div className="space-y-6">
                    
                    <div className="relative pl-6 border-l-2 border-brand-100 last:pb-0 pb-6">
                      <div className="absolute w-3 h-3 bg-brand-500 rounded-full -left-[7px] top-1" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-txt-primary">General Consultation</h4>
                          <p className="text-sm text-txt-secondary mt-1">Dr. Ahmed Raza • Sehat Sahara Medical Center</p>
                          <p className="text-sm text-txt-primary mt-3">Patient presented with mild fever and fatigue. Prescribed paracetamol and advised 3 days rest.</p>
                        </div>
                        <span className="text-xs font-medium text-txt-muted bg-slate-100 px-2 py-1 rounded">10 May 2025</span>
                      </div>
                    </div>
                    
                    <div className="relative pl-6 border-l-2 border-brand-100 last:pb-0 pb-6">
                      <div className="absolute w-3 h-3 bg-brand-200 border-2 border-white rounded-full -left-[7px] top-1" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-txt-primary">Cardiology Checkup</h4>
                          <p className="text-sm text-txt-secondary mt-1">Dr. Bilal Ahmad • Sehat Poly Clinic</p>
                          <p className="text-sm text-txt-primary mt-3">Routine BP monitoring. Medication adjusted.</p>
                        </div>
                        <span className="text-xs font-medium text-txt-muted bg-slate-100 px-2 py-1 rounded">15 Apr 2025</span>
                      </div>
                    </div>
                    
                    <div className="relative pl-6 border-transparent last:pb-0">
                      <div className="absolute w-3 h-3 bg-brand-200 border-2 border-white rounded-full -left-[7px] top-1" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-txt-primary">Lab Test (CBC)</h4>
                          <p className="text-sm text-txt-secondary mt-1">Chughtai Lab</p>
                          <p className="text-sm text-txt-primary mt-3">All parameters within normal range.</p>
                        </div>
                        <span className="text-xs font-medium text-txt-muted bg-slate-100 px-2 py-1 rounded">02 Mar 2025</span>
                      </div>
                    </div>

                  </div>
                </Card>
              </div>
            )}

            {/* ─── Appointments Tab ─── */}
            {activeTab === 'appointments' && (
              <Card className="p-0 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border bg-slate-50/50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Doctor / Department</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-txt-primary flex items-center gap-2"><Calendar size={14} className="text-txt-muted"/> 24 May 2025</p>
                        <p className="text-xs text-txt-secondary mt-1 flex items-center gap-2"><Clock size={14} className="text-txt-muted"/> 09:30 AM</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-txt-primary">Dr. Ahmed Raza</p>
                        <p className="text-xs text-txt-secondary mt-1">General Medicine</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-txt-primary">Consultation</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">Checked In</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-txt-primary flex items-center gap-2"><Calendar size={14} className="text-txt-muted"/> 10 May 2025</p>
                        <p className="text-xs text-txt-secondary mt-1 flex items-center gap-2"><Clock size={14} className="text-txt-muted"/> 11:00 AM</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-txt-primary">Dr. Ahmed Raza</p>
                        <p className="text-xs text-txt-secondary mt-1">General Medicine</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-txt-primary">Consultation</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">Completed</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-txt-primary flex items-center gap-2"><Calendar size={14} className="text-txt-muted"/> 15 Apr 2025</p>
                        <p className="text-xs text-txt-secondary mt-1 flex items-center gap-2"><Clock size={14} className="text-txt-muted"/> 10:30 AM</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-txt-primary">Dr. Bilal Ahmad</p>
                        <p className="text-xs text-txt-secondary mt-1">Cardiology</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-txt-primary">Follow-up</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            )}

            {/* ─── Shared Records Tab ─── */}
            {activeTab === 'shared-records' && (
              <SharedRecordsTab patient={patient} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
