import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileAppShell, Button, Input, LocationSelector } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, AlertTriangle, Plus, Trash2, User, Calendar } from 'lucide-react';
import { PrototypeService } from '../../../services/PrototypeService';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
import { ProviderStore } from '../../../services/ProviderStore';

type WizardStep = 1 | 2 | 3;

export const CreateBloodRequest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prototypeService = new PrototypeService();
  
  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const bloodBasePath = isDoctor ? '/doctor/community/blood' : PATIENT_ROUTES.COMMUNITY_BLOOD;

  const stateSnapshot = OnboardingStore.getSnapshot();
  const currentUser = stateSnapshot.profile || FALLBACK_PROFILE;
  const careProfiles = stateSnapshot.careProfiles || [];
  const doctorIdentity = ProviderStore.getSnapshot().identity;
  const currentActorName = isDoctor ? (doctorIdentity.name || 'Dr. Ayesha Khan') : currentUser.name;
  
  const [step, setStep] = useState<WizardStep>(1);
  
  // Step 1 Form State
  const [recipient, setRecipient] = useState<string>('Just Myself');
  const [patientName, setPatientName] = useState(currentActorName);
  const [bloodGroupMode, setBloodGroupMode] = useState<'any' | 'specific'>('any');
  const [bloodGroups, setBloodGroups] = useState<string[]>([]);
  const [units, setUnits] = useState('1');
  
  // Step 2 Form State
  const [urgency, setUrgency] = useState<'STANDARD' | 'URGENT'>('URGENT');
  const [requiredDate, setRequiredDate] = useState('Immediately / Today');
  const [locations, setLocations] = useState([{ id: Date.now(), hospital: 'Jinnah Hospital, Karachi', area: 'Cantt, Karachi' }]);

  // Step 3 Form State
  const [description, setDescription] = useState('');
  const [contactPreference, setContactPreference] = useState<'PHONE' | 'WHATSAPP' | 'APP'>('PHONE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationChange = (id: number, field: 'hospital' | 'area', value: string) => {
    setLocations(locations.map(loc => loc.id === id ? { ...loc, [field]: value } : loc));
  };

  const addLocation = () => {
    if (locations.length < 3) {
      setLocations([...locations, { id: Date.now(), hospital: '', area: '' }]);
    }
  };

  const removeLocation = (id: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handlePublish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const primaryLoc = locations[0];
      const locString = primaryLoc.area.trim() || 'Karachi';
      const hospitalString = primaryLoc.hospital.trim() || 'Jinnah Hospital, Karachi';
      const resolvedPatientName = patientName.trim() || currentActorName;
      const groupString = bloodGroupMode === 'any' ? 'Any' : (bloodGroups.length > 0 ? bloodGroups.join(', ') : 'Any');

      const newReq = await prototypeService.createBloodRequest({
        requesterId: isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO',
        requesterName: resolvedPatientName,
        bloodGroup: groupString,
        unitsRequired: parseInt(units, 10) || 1,
        urgency,
        hospitalName: hospitalString,
        location: locString,
        state: 'OPEN',
      });
      
      // Navigate to Blood Requests on the My Requests tab with confirmation parameter
      navigate(`${bloodBasePath}?tab=PLEDGES&newRequestId=${newReq.id}`, { replace: true });
    } catch {
      navigate(bloodBasePath, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* Header */}
        <header className="px-4 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => step > 1 ? setStep((s) => (s - 1) as WizardStep) : navigate(bloodBasePath)} 
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Request Blood</h1>
              <p className="text-xs font-semibold text-[#1B7F4C] uppercase tracking-wider">Step {step} of 3</p>
            </div>
          </div>
        </header>

        {/* Form Body */}
        <div className="app-scroll flex-1 overflow-y-auto p-4 pb-32">
          
          {/* STEP 1: Recipient & Blood Group */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Who needs blood?</h2>
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    onClick={() => { setRecipient('Just Myself'); setPatientName(currentActorName); }}
                    className={`flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                      recipient === 'Just Myself' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4 text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900">Just Myself ({currentActorName})</h3>
                    </div>
                  </button>
                  {careProfiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setRecipient(p.name); setPatientName(p.name); }}
                      className={`flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                        recipient === p.name ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4 text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                        <p className="text-[12px] text-slate-500">{p.relation}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => { setRecipient('Someone Else'); setPatientName(''); }}
                    className={`flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                      recipient === 'Someone Else' ? 'border-[#1B7F4C] bg-emerald-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mr-4 text-slate-500">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900">Someone Else</h3>
                    </div>
                  </button>
                </div>

                <div className="mb-6">
                  <Input 
                    label="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter full name of recipient"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Blood Requirement</label>
                  <div className="flex gap-3 mb-3">
                    <button 
                      onClick={() => { setBloodGroupMode('any'); setBloodGroups([]); }}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        bloodGroupMode === 'any' ? 'bg-emerald-50 border-[#1B7F4C] text-[#1B7F4C] shadow-sm' : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      Any eligible donor
                    </button>
                    <button 
                      onClick={() => setBloodGroupMode('specific')}
                      className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        bloodGroupMode === 'specific' ? 'bg-emerald-50 border-[#1B7F4C] text-[#1B7F4C] shadow-sm' : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      Specific group
                    </button>
                  </div>

                  {bloodGroupMode === 'specific' && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                        <button
                          key={g}
                          onClick={() => setBloodGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                          className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                            bloodGroups.includes(g) ? 'bg-[#1B7F4C] border-[#1B7F4C] text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Units Needed</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setUnits(n.toString())}
                        className={`shrink-0 w-16 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          units === n.toString() ? 'bg-[#1B7F4C] border-[#1B7F4C] text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Urgency, Date & Location */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Urgency Level</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setUrgency('URGENT')}
                    className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                      urgency === 'URGENT' ? 'bg-red-50 border-red-500 shadow-sm' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={`w-4 h-4 ${urgency === 'URGENT' ? 'text-red-600' : 'text-slate-400'}`} />
                      <span className={`font-bold ${urgency === 'URGENT' ? 'text-red-700' : 'text-slate-900'}`}>Urgent</span>
                    </div>
                    <span className={`block text-xs ${urgency === 'URGENT' ? 'text-red-600' : 'text-slate-500'}`}>(within 24 hours)</span>
                  </button>
                  <button 
                    onClick={() => setUrgency('STANDARD')}
                    className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                      urgency === 'STANDARD' ? 'bg-emerald-50 border-[#1B7F4C] shadow-sm' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className={`block font-bold mb-1 ${urgency === 'STANDARD' ? 'text-[#1B7F4C]' : 'text-slate-900'}`}>Routine</span>
                    <span className={`block text-xs ${urgency === 'STANDARD' ? 'text-emerald-600' : 'text-slate-500'}`}>(within a few days)</span>
                  </button>
                </div>
              </div>

              {/* Required Date */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Required By</span>
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {['Immediately / Today', 'Tomorrow', 'Within 3 Days', 'Flexible'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRequiredDate(d)}
                      className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-left ${
                        requiredDate === d ? 'border-[#1B7F4C] bg-emerald-50 text-[#1B7F4C]' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Donation Location */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900">Hospital & Center</h2>
                </div>

                <div className="space-y-4">
                  {locations.map((loc, index) => (
                    <div key={loc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative">
                      {locations.length > 1 && (
                        <button 
                          onClick={() => removeLocation(loc.id)}
                          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 bg-white rounded-lg border border-slate-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        {index === 0 ? 'Primary Hospital / Lab' : `Alternative Location ${index + 1}`}
                      </h3>
                      
                      <div className="space-y-3">
                        <Input 
                          label="Hospital / Lab Name"
                          value={loc.hospital}
                          onChange={(e) => handleLocationChange(loc.id, 'hospital', e.target.value)}
                          placeholder="e.g., Jinnah Hospital, Karachi"
                        />
                        <LocationSelector
                          label="Area / City"
                          value={{ address: loc.area, city: 'Karachi', area: loc.area }}
                          onChange={(l) => handleLocationChange(loc.id, 'area', l.address)}
                          placeholder="e.g., Cantt, Karachi"
                        />
                      </div>
                    </div>
                  ))}

                  {locations.length < 3 && (
                    <button 
                      onClick={addLocation}
                      className="w-full py-3.5 border-2 border-dashed border-slate-300 rounded-xl text-[#1B7F4C] font-bold text-[13px] flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add alternative hospital
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Notes, Privacy Preference & Review */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                
                <div className="mb-6">
                  <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Short Note / Medical Details</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all resize-none h-24 focus:border-[#1B7F4C] focus:ring-1 focus:ring-[#1B7F4C] text-sm"
                    placeholder="Provide any relevant diagnosis, case number, or instructions for donors..."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-[14px] font-bold text-slate-700 mb-1.5">Contact Preference</label>
                  <div className="flex flex-col gap-2">
                    {['PHONE', 'WHATSAPP', 'APP'].map(pref => (
                      <button
                        key={pref}
                        onClick={() => setContactPreference(pref as any)}
                        className={`py-3.5 px-4 rounded-xl border-2 text-[13px] font-bold transition-all text-left ${
                          contactPreference === pref ? 'bg-emerald-50 border-[#1B7F4C] text-[#1B7F4C]' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {pref === 'PHONE' ? 'Phone Call' : pref === 'WHATSAPP' ? 'WhatsApp' : 'In-App Chat Only'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Request Summary</h3>
                  <div className="space-y-2 text-[13px] text-slate-700 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Patient:</span>
                      <span className="font-bold text-slate-900">{patientName || currentActorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Requirement:</span>
                      <span className="font-bold text-red-600">{bloodGroupMode === 'any' ? 'Any group' : (bloodGroups.length ? bloodGroups.join(', ') : 'Any')}, {units} {parseInt(units) === 1 ? 'Unit' : 'Units'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hospital:</span>
                      <span className="text-right font-medium">{locations[0].hospital || 'Jinnah Hospital, Karachi'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Area:</span>
                      <span className="text-right font-medium">{locations[0].area || 'Karachi'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Urgency:</span>
                      <span className={`font-bold ${urgency === 'URGENT' ? 'text-red-600' : 'text-slate-700'}`}>
                        {urgency === 'URGENT' ? 'Urgent (24h)' : 'Routine'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Required Date:</span>
                      <span>{requiredDate}</span>
                    </div>
                  </div>
                </div>
                
              </div>

            </div>
          )}

        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="sticky bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-slate-200 pb-safe z-30 shadow-lg">
          {step < 3 ? (
            <Button onClick={handleNext} fullWidth size="lg">
              Continue to Step {step + 1}
            </Button>
          ) : (
            <Button onClick={handlePublish} fullWidth size="lg" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white font-bold">
              {isSubmitting ? 'Publishing Request...' : 'Publish Blood Request'}
            </Button>
          )}
        </div>

      </div>
    </MobileAppShell>
  );
};
