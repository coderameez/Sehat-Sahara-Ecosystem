import { useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { store } from '../store';

function AddPatientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cnic: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addPatient({
      ...formData,
      age: parseInt(formData.age, 10) || 0,
      assignedDoctor: 'Unassigned',
      lastVisit: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      consentStatus: 'Pending',
      records: []
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-txt-primary">Add New Patient</h2>
          <button onClick={onClose} className="text-txt-muted hover:text-txt-primary">
            <Plus size={24} className="rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-txt-primary">Patient Name</label>
            <input required type="text" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">Mobile</label>
              <input required type="text" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="03XX-XXXXXXX" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">CNIC</label>
              <input required type="text" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} placeholder="XXXXX-XXXXXXX-X" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">Age</label>
              <input required type="number" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="Years" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">Gender</label>
              <select className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">Blood Group</label>
              <select className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Add Patient</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PatientsPage() {
  const navigate = useNavigate();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredPatients = state.patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.cnic.includes(search) || 
      p.phone.includes(search);
    const matchesStatus = !filterStatus || p.consentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = Array.from(new Set(state.patients.map(p => p.consentStatus)));

  return (
    <div className="space-y-6">
      {/* ═══════ Header ═══════ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Patients</h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Manage patient records and access shared data
          </p>
        </div>
      </div>

      {/* ═══════ Search & Filters ═══════ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
            <input
              type="text"
              placeholder="Search by name, CNIC or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-surface-border bg-white px-3 py-2 pr-8 text-sm text-txt-secondary outline-none focus:border-brand-500 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
          >
            <option value="">All Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>
          Add Patient
        </Button>
      </div>

      {/* ═══════ Patients Table ═══════ */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Patient Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">CNIC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Mobile Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Last Visit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Assigned Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Consent Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-txt-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="cursor-pointer border-b border-surface-border last:border-b-0 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-txt-primary">{patient.name}</p>
                    <p className="text-xs text-txt-muted">{patient.age} Years / {patient.gender}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-txt-primary">
                    {patient.cnic}
                  </td>
                  <td className="px-6 py-4 text-sm text-txt-secondary">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-txt-secondary">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-txt-primary">{patient.assignedDoctor}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={patient.consentStatus} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="rounded-lg p-1.5 text-txt-muted hover:bg-slate-100 hover:text-txt-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Optional popover
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-txt-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-slate-300 mb-3" />
                      <p className="text-base font-medium text-txt-primary">No patients found</p>
                      <p className="text-sm mt-1">We couldn't find any patients matching "{search}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-surface-border p-4 flex items-center justify-between">
          <p className="text-sm text-txt-muted">Showing 1 to {filteredPatients.length} of 48 patients</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="px-2 py-1 text-txt-muted">{'<'}</Button>
            <Button variant="primary" className="px-3 py-1">1</Button>
            <Button variant="outline" className="px-3 py-1">2</Button>
            <Button variant="outline" className="px-3 py-1">3</Button>
            <span className="text-txt-muted">...</span>
            <Button variant="outline" className="px-3 py-1">6</Button>
            <Button variant="outline" className="px-2 py-1 text-txt-muted">{'>'}</Button>
          </div>
        </div>
      </Card>
      
      <AddPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
