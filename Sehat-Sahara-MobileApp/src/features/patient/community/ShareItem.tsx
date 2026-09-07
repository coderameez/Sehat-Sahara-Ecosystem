import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, LocationSelector } from '../../../components';
import { PATIENT_ROUTES } from '../../../constants/routes';
import { ChevronLeft, ChevronRight, Package, Camera, Tag, MapPin, CheckCircle2 } from 'lucide-react';
import { PrototypeService } from '../../../services/PrototypeService';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';
const isValidText = (text: string) => {
  const trimmed = text.trim();
  if (trimmed.length < 3) return false;
  const letters = trimmed.match(/[a-zA-Z]/g);
  if (!letters || letters.length < 2) return false;
  if (/^\d+$/.test(trimmed)) return false;
  if (/^(.)\1+$/.test(trimmed)) return false;
  return true;
};

type WizardStep = 1 | 2 | 3;

export const ShareItem: React.FC = () => {
  const navigate = useNavigate();
  const prototypeService = new PrototypeService();
  const currentUser = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;
  
  const [step, setStep] = useState<WizardStep>(1);
  
  // Step 1: Item Details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wheelchair');
  const [description, setDescription] = useState('');
  
  // Step 2: Condition & Duration
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [availableDays, setAvailableDays] = useState('14');
  
  // Step 3: Location
  const [location, setLocation] = useState(currentUser.area);

  const isStep1Valid = isValidText(title) && category.trim() !== '';
  const isStep2Valid = condition.trim() !== '' && parseInt(availableDays, 10) > 0;
  const isStep3Valid = isValidText(location);

  const handleNext = () => {
    if (step === 1 && isStep1Valid) setStep(2);
    else if (step === 2 && isStep2Valid) setStep(3);
  };

  const handlePublish = async () => {
    await prototypeService.createSharedItem({
      title,
      category: category as any,
      condition,
      location,
      ownerName: currentUser.name,
      description,
      state: 'AVAILABLE',
      availableDays: parseInt(availableDays, 10),
    });
    
    // In a real app we might pass a param to activeTab=MY_ITEMS, for now navigate
    navigate(PATIENT_ROUTES.COMMUNITY_THINGS);
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* ─── HEADER ─── */}
        <header className="px-4 py-4 bg-white border-b border-slate-200 flex-shrink-0 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => step > 1 ? setStep((s) => (s - 1) as WizardStep) : navigate(PATIENT_ROUTES.COMMUNITY_THINGS)} 
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Share Item</h1>
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Step {step} of 3</p>
            </div>
          </div>
        </header>

        {/* ─── CONTENT ─── */}
        <div className="app-scroll flex-1 overflow-y-auto p-4 pb-24">
          
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Item Details</h2>
                    <p className="text-xs text-slate-500">What are you sharing?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Photo Placeholder */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Add Photos</label>
                    <div className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-500 active:bg-slate-100 transition-colors">
                      <Camera className="w-8 h-8 mb-2 text-slate-400" />
                      <span className="text-sm font-bold">Tap to add photos</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all ${!isValidText(title) && title.length > 0 ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-brand-500'}`}
                      placeholder="e.g., Folding Wheelchair"
                    />
                    {!isValidText(title) && title.length > 0 && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid title</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold text-slate-800"
                    >
                      {['Wheelchair', 'Crutches', 'Oxygen', 'Walking Frame', 'Hospital Bed', 'Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none h-24"
                      placeholder="Add details about the item..."
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Condition & Duration</h2>
                    <p className="text-xs text-slate-500">How long can someone borrow it?</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Condition</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Excellent', 'Good', 'Fair'].map(cond => (
                        <button 
                          key={cond}
                          onClick={() => setCondition(cond as any)}
                          className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                            condition === cond ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Maximum Borrow Duration</label>
                    <select 
                      value={availableDays} 
                      onChange={(e) => setAvailableDays(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all font-semibold text-slate-800"
                    >
                      <option value="7">1 Week</option>
                      <option value="14">2 Weeks</option>
                      <option value="30">1 Month</option>
                      <option value="60">2 Months</option>
                      <option value="90">3 Months</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Location & Publish</h2>
                    <p className="text-xs text-slate-500">Where can they pick it up?</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Pickup Area</label>
                    <div className="relative">
                      <LocationSelector
                        value={{ address: location, city: '', area: '' }}
                        onChange={(l) => setLocation(l.address)}
                        placeholder="e.g., Gulshan-e-Iqbal, Block 4"
                      />
                    </div>
                    {!isValidText(location) && location.length > 0 && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid location</p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Item Summary</h3>
                    <div className="space-y-2 text-sm text-slate-700 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Item:</span>
                        <span className="font-bold">{title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Category:</span>
                        <span>{category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Condition:</span>
                        <span>{condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <span>{availableDays} Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ─── FOOTER ─── */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe">
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98] transition-all"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={!isStep3Valid}
              className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              Publish Item
            </button>
          )}
        </div>

      </div>
    </MobileAppShell>
  );
};
