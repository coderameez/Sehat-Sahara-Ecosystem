import { useState, useSyncExternalStore } from 'react';
import { Search, Plus, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { store } from '../store';
import { DoctorDrawer } from '../components/doctors/DoctorDrawer';
import type { Provider } from '../types';

function LinkDoctorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    pmdcId: '',
    specialty: '',
    qualification: '',
    status: 'Active'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addProvider({
      ...formData,
      verificationStatus: 'PENDING',
      schedule: null,
      todayBookings: 0,
      patients: 0,
      rating: 0
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-txt-primary">Link New Doctor</h2>
          <button onClick={onClose} className="text-txt-muted hover:text-txt-primary">
            <Plus size={24} className="rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-txt-primary">Doctor Name</label>
            <input required type="text" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dr. Sarah Ahmed" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">PMDC ID</label>
              <input type="text" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.pmdcId} onChange={e => setFormData({...formData, pmdcId: e.target.value})} placeholder="e.g. 12345-P" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">Specialty</label>
              <input required type="text" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} placeholder="e.g. Cardiology" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">Qualification</label>
              <input required type="text" className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="e.g. MBBS, FCPS" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-txt-primary">Status</label>
              <select className="w-full rounded-xl border border-surface-border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Active">Active</option>
                <option value="Away">Away</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-surface-border">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit">Link Doctor</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DoctorsPage() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const [selectedDoctor, setSelectedDoctor] = useState<Provider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const filteredDoctors = state.providers.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || doc.name.toLowerCase().includes(q) || (doc.pmdcId && doc.pmdcId.toLowerCase().includes(q));
    const matchesSpecialty = !filterSpecialty || doc.specialty === filterSpecialty;
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const specialties = Array.from(new Set(state.providers.map(p => p.specialty))).filter(Boolean);
  const statuses = Array.from(new Set(state.providers.map(p => p.status))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* ═══════ Page Header ═══════ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">Doctors</h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Manage linked doctors and their availability
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsLinkModalOpen(true)}>
          Link Doctor
        </Button>
      </div>

      {/* ═══════ Filters ═══════ */}
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted"
          />
          <input
            type="text"
            placeholder="Search doctors by name or PMDC ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-surface-border bg-white px-3 py-2 pr-8 text-sm text-txt-secondary outline-none focus:border-brand-500 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
          >
            <option value="">All Specialties</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="cursor-pointer appearance-none rounded-xl border border-surface-border bg-white px-3 py-2 pr-8 text-sm text-txt-secondary outline-none focus:border-brand-500 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_8px_center] bg-no-repeat"
          >
            <option value="">All Status</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ═══════ Doctors Table ═══════ */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Specialty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Verification</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Availability</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Today Bookings</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-txt-muted">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-txt-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={cn(
                    "cursor-pointer border-b border-surface-border last:border-b-0 hover:bg-slate-50/80 transition-colors",
                    doc.status === 'Inactive' && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  {/* Doctor Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {doc.avatar ? (
                        <img src={doc.avatar} alt={doc.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                          {doc.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-txt-primary">{doc.name}</p>
                        <p className="text-xs text-txt-secondary">
                          {doc.qualification}
                          {doc.pmdcId && ` • ${doc.pmdcId}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Specialty */}
                  <td className="px-6 py-4 text-sm text-txt-secondary">
                    {doc.specialty}
                  </td>
                  
                  {/* Verification */}
                  <td className="px-6 py-4">
                    {doc.verificationStatus === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Pending
                      </span>
                    )}
                  </td>
                  
                  {/* Availability */}
                  <td className="px-6 py-4">
                    {doc.schedule ? (
                      <div>
                        <p className="text-sm text-txt-primary">{doc.schedule.hours}</p>
                        <p className="text-xs text-txt-muted">{doc.schedule.days}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-txt-muted">Not Set</p>
                    )}
                  </td>
                  
                  {/* Today Bookings */}
                  <td className="px-6 py-4 text-sm font-medium text-txt-primary">
                    {doc.todayBookings ?? '-'}
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                      doc.status === 'Active' ? 'bg-green-50 text-green-700' :
                      doc.status === 'Away' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    )}>
                      <span className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        doc.status === 'Active' ? 'bg-green-600' :
                        doc.status === 'Away' ? 'bg-amber-500' :
                        'bg-slate-400'
                      )} />
                      {doc.status || 'Offline'}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="rounded-lg p-1.5 text-txt-muted hover:bg-slate-100 hover:text-txt-primary transition-colors"
                      onClick={(e) => e.stopPropagation()} // Prevent row click if clicking action button
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-txt-secondary">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={32} className="text-slate-300 mb-3" />
                      <p className="text-base font-medium text-txt-primary">No doctors found</p>
                      <p className="text-sm mt-1">We couldn't find any doctors matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ═══════ Drawer Overlay ═══════ */}
      <DoctorDrawer
        doctor={selectedDoctor ? state.providers.find(p => p.id === selectedDoctor.id) || selectedDoctor : null}
        onClose={() => setSelectedDoctor(null)}
      />
      <LinkDoctorModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} />
    </div>
  );
}
