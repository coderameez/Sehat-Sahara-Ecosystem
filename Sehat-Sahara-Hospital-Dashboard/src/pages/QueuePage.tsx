import { useSyncExternalStore, useState } from 'react';
import { Search, MapPin, Plus, User, Phone, MapPin as MapPinIcon, Stethoscope, Users, UserCheck, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { store } from '../store';
import { cn } from '../lib/utils';
import { facilities } from '../data/demo-data';

export function QueuePage() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const activeFacility = facilities.find(f => f.id === state.session.activeFacilityId) || facilities[0];
  const activeBranch = activeFacility.branches.find(b => b.id === state.session.activeBranchId) || activeFacility.branches[0];
  
  const nowServingToken = state.tokens.find(t => t.status === 'Now Serving');
  const waitingTokens = state.tokens.filter(t => t.status === 'Waiting');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [newWalkIn, setNewWalkIn] = useState({
    patientName: '',
    patientPhone: '',
    department: 'General Medicine',
    doctorName: '',
  });

  const handleCreateToken = () => {
    if (!newWalkIn.patientName || !newWalkIn.department || !newWalkIn.doctorName) {
      return; // rudimentary validation
    }
    
    // Determine new token number
    const todayTokens = state.tokens.filter(t => t.departmentId === newWalkIn.department);
    const numStr = (todayTokens.length + 1).toString().padStart(3, '0');
    const deptPrefix = newWalkIn.department.substring(0, 3).toUpperCase();
    const tokenNumber = `${deptPrefix}-${numStr}`;

    store.addToken({
      tokenNumber,
      patientName: newWalkIn.patientName,
      patientCnic: 'N/A', // Not required for simple walk-in
      patientAgeGender: 'N/A',
      patientPhone: newWalkIn.patientPhone,
      departmentId: newWalkIn.department,
      doctorName: newWalkIn.doctorName,
    });

    setShowWalkInModal(false);
    setNewWalkIn({
      patientName: '',
      patientPhone: '',
      department: 'General Medicine',
      doctorName: '',
    });
  };

  const filteredTokens = state.tokens.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.patientName && t.patientName.toLowerCase().includes(q)) ||
      (t.tokenNumber && t.tokenNumber.toLowerCase().includes(q)) ||
      (t.patientCnic && t.patientCnic.toLowerCase().includes(q)) ||
      (t.patientPhone && t.patientPhone.toLowerCase().includes(q))
    );
  });

  const displayedToken = selectedTokenId ? state.tokens.find(t => t.id === selectedTokenId) : nowServingToken;

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="flex h-full gap-6">
      <div className="flex-1 space-y-6">
        
        {/* ═══════ Header ═══════ */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-txt-primary">H-06 Live Token / Reception</h1>
            </div>
            <p className="mt-1 text-sm text-txt-secondary">
              Saturday, 24 May 2025
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-txt-secondary">
              <MapPin size={16} className="text-txt-muted" />
              <span>{activeBranch?.name}, {activeBranch?.address.split(',').pop()?.trim()}</span>
            </div>
          </div>
        </div>

        {/* ═══════ Search & Add ═══════ */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
            <input
              type="text"
              placeholder="Search patient by name, CNIC or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-white py-2 pl-10 pr-4 text-sm text-txt-primary placeholder:text-txt-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <Button 
            variant="primary" 
            icon={<Plus size={18} />}
            onClick={() => setShowWalkInModal(true)}
          >
            Add Walk-in
          </Button>
        </div>

        {/* ═══════ KPI Cards ═══════ */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="flex items-center gap-4 p-6 border-brand-200 bg-brand-50/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-txt-secondary">Now Serving</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-brand-700">{nowServingToken ? nowServingToken.tokenNumber : '--'}</h3>
              </div>
              <p className="text-xs text-txt-muted mt-0.5">{nowServingToken ? nowServingToken.doctorName : 'Waiting'}</p>
            </div>
          </Card>
          
          <Card className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-txt-secondary">Waiting</p>
              <h3 className="text-3xl font-bold text-txt-primary">{waitingTokens.length}</h3>
              <p className="text-xs text-txt-muted mt-0.5">Patients in queue</p>
            </div>
          </Card>
          
          <Card className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-txt-secondary">Average Wait</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold text-amber-600">18</h3>
                <span className="text-sm font-medium text-amber-600">min</span>
              </div>
              <p className="text-xs text-txt-muted mt-0.5">Today</p>
            </div>
          </Card>
        </div>

        {/* ═══════ Queue Table ═══════ */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/50">
                  <th className="w-12 px-4 py-4 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-txt-muted">Token</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-txt-muted">Patient</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-txt-muted">Doctor</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-txt-muted">Time</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-txt-muted">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-txt-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((token) => (
                  <tr
                    key={token.id}
                    onClick={() => setSelectedTokenId(token.id)}
                    className={cn(
                      "cursor-pointer border-b border-surface-border last:border-b-0 hover:bg-slate-50/80 transition-colors",
                      token.status === 'Now Serving' && "bg-brand-50/20",
                      selectedTokenId === token.id && "bg-slate-100"
                    )}
                  >
                    <td className="w-12 px-4 py-4 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        defaultChecked={token.status === 'Now Serving'}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-txt-primary">
                      {token.tokenNumber}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-txt-primary">{token.patientName}</p>
                      <p className="text-xs text-txt-muted">CNIC: {token.patientCnic}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-txt-primary">{token.doctorName}</p>
                      <p className="text-xs text-txt-muted">General Physician</p>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-txt-primary">
                      {token.time}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={token.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {token.status === 'Waiting' && (
                          <Button 
                            variant="primary" 
                            className="bg-brand-600 hover:bg-brand-700 py-1.5 px-3 text-xs w-24 justify-center"
                            onClick={(e) => { e.stopPropagation(); store.updateTokenStatus(token.id, 'Now Serving'); }}
                          >
                            Call Next
                          </Button>
                        )}
                        {token.status === 'Now Serving' && (
                          <Button 
                            variant="outline" 
                            className="py-1.5 px-3 text-xs w-24 justify-center border-brand-200 text-brand-700 hover:bg-brand-50"
                            onClick={(e) => { e.stopPropagation(); store.updateTokenStatus(token.id, 'Completed'); }}
                          >
                            Complete
                          </Button>
                        )}
                        {token.status === 'No-show' && (
                          <Button 
                            variant="ghost" 
                            className="py-1.5 px-3 text-xs w-24 justify-center"
                            onClick={(e) => { e.stopPropagation(); store.updateTokenStatus(token.id, 'Waiting'); }}
                          >
                            Mark Seen
                          </Button>
                        )}
                        {token.status === 'Completed' && (
                          <span className="text-txt-muted font-medium w-24 text-center">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTokens.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-txt-secondary">
                      <div className="flex flex-col items-center justify-center">
                        <Users size={32} className="text-slate-300 mb-3" />
                        <p className="text-base font-medium text-txt-primary">No tokens found</p>
                        <p className="text-sm mt-1">The queue is currently empty.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-surface-border p-4 flex items-center justify-between">
            <p className="text-sm text-txt-muted">Showing 1 to {filteredTokens.length} of {state.tokens.length} entries</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="px-2 py-1 text-txt-muted">{'<'}</Button>
              <Button variant="primary" className="px-3 py-1">1</Button>
              <Button variant="outline" className="px-2 py-1 text-txt-muted">{'>'}</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* ═══════ Side Panel (Details) ═══════ */}
      <div className="w-80 border-l border-surface-border bg-white flex flex-col relative">
        {feedback && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {feedback}
          </div>
        )}
        <div className="flex items-center justify-between p-4 border-b border-surface-border bg-slate-50/50">
          <h2 className="font-semibold text-txt-primary">Patient Check-in</h2>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={() => setSelectedTokenId(null)}>
            <X size={16} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {displayedToken ? (
            <>
              {/* Identity Token */}
              <div className="flex gap-4 p-4 rounded-xl border border-surface-border bg-brand-50/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 font-bold">
                  {displayedToken.patientName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-txt-primary">{displayedToken.patientName}</h3>
                  <p className="text-xs text-txt-secondary mt-0.5">CNIC: {displayedToken.patientCnic}</p>
                  <p className="text-xs text-txt-secondary mt-0.5">Mobile: {displayedToken.patientPhone || '0300-1234567'}</p>
                </div>
                <div className="ml-auto flex h-6 items-center justify-center rounded bg-brand-100 px-2 text-xs font-bold text-brand-700">
                  {displayedToken.tokenNumber}
                </div>
              </div>

              {/* Patient Basics */}
              <div className="space-y-3 px-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-txt-muted">
                    <User size={14} />
                    <span>Age / Gender</span>
                  </div>
                  <span className="font-medium text-txt-primary">{displayedToken.patientAgeGender || '34 Years / Male'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-txt-muted">
                    <Phone size={14} />
                    <span>Contact</span>
                  </div>
                  <span className="font-medium text-txt-primary">{displayedToken.patientPhone || '0300-1234567'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-txt-muted">
                    <MapPinIcon size={14} />
                    <span>Address</span>
                  </div>
                  <span className="font-medium text-txt-primary text-right w-32 truncate">Model Town, Lahore</span>
                </div>
              </div>

              <div className="h-px w-full bg-surface-border" />

              {/* Visit Details */}
              <div className="px-2">
                <h4 className="font-semibold text-txt-primary mb-3">Visit Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-txt-muted">Visit Type</span>
                    <span className="font-medium text-txt-primary">Walk-in</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-txt-muted">Registered</span>
                    <span className="font-medium text-txt-primary">24 May 2025, 10:30 AM</span>
                  </div>
                  <div className="flex justify-between items-start mt-4">
                    <span className="text-txt-muted">Doctor</span>
                    <div className="text-right">
                      <span className="font-medium text-txt-primary block">{displayedToken.doctorName}</span>
                      <span className="text-xs text-txt-secondary">General Physician</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-txt-muted">Reason for Visit</span>
                    <span className="font-medium text-txt-primary">Fever and body ache</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-txt-muted">Notes</span>
                    <span className="font-medium text-txt-primary">—</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <UserCheck size={32} />
              </div>
              <p className="text-sm font-medium text-txt-primary">No Patient Selected</p>
              <p className="text-xs text-txt-muted mt-1">Select a patient from the queue or call the next patient to view details here.</p>
            </div>
          )}
        </div>

        {/* Action Buttons (Footer) */}
        {displayedToken && displayedToken.status !== 'Completed' && (
          <div className="p-4 border-t border-surface-border bg-slate-50/50 space-y-3">
            {displayedToken.status === 'Waiting' && (
              <Button 
                variant="primary" 
                className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 py-3" 
                icon={<Stethoscope size={18} />}
                onClick={() => {
                  store.updateTokenStatus(displayedToken.id, 'Now Serving');
                  triggerFeedback(`Calling ${displayedToken.tokenNumber}...`);
                }}
              >
                Call Now
              </Button>
            )}
            
            {displayedToken.status === 'Now Serving' && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-center py-3"
                  onClick={() => triggerFeedback(`Recalling ${displayedToken.tokenNumber}...`)}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recall
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-center py-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  onClick={() => {
                    store.updateTokenStatus(displayedToken.id, 'No-show');
                    triggerFeedback('Marked as No-show');
                  }}
                >
                  <User size={16} className="mr-2" />
                  Mark No-show
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ═══════ Walk-in Modal ═══════ */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
              <h2 className="text-lg font-bold text-txt-primary">Add Walk-in Patient</h2>
              <button onClick={() => setShowWalkInModal(false)} className="rounded-lg p-2 text-txt-muted hover:bg-slate-50 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-txt-primary">Patient Name <span className="text-sos-500">*</span></label>
                <input 
                  type="text" 
                  value={newWalkIn.patientName}
                  onChange={e => setNewWalkIn({...newWalkIn, patientName: e.target.value})}
                  className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" 
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-txt-primary">Phone Number</label>
                <input 
                  type="text" 
                  value={newWalkIn.patientPhone}
                  onChange={e => setNewWalkIn({...newWalkIn, patientPhone: e.target.value})}
                  className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" 
                  placeholder="03XX-XXXXXXX"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-txt-primary">Department <span className="text-sos-500">*</span></label>
                <select 
                  value={newWalkIn.department}
                  onChange={e => setNewWalkIn({...newWalkIn, department: e.target.value})}
                  className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {activeBranch.departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-txt-primary">Doctor <span className="text-sos-500">*</span></label>
                <select 
                  value={newWalkIn.doctorName}
                  onChange={e => setNewWalkIn({...newWalkIn, doctorName: e.target.value})}
                  className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">Select Doctor</option>
                  <option value="Dr. Ahmed Raza">Dr. Ahmed Raza</option>
                  <option value="Dr. Fatima Noor">Dr. Fatima Noor</option>
                  <option value="Dr. Hassan Ali">Dr. Hassan Ali</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-txt-primary">Visit Reason (Optional)</label>
                <textarea 
                  className="w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" 
                  placeholder="Brief notes..."
                  rows={2}
                />
              </div>
            </div>

            <div className="border-t border-surface-border bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <Button variant="outline" onClick={() => setShowWalkInModal(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={handleCreateToken}
                disabled={!newWalkIn.patientName || !newWalkIn.department || !newWalkIn.doctorName}
              >
                Create Token
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
