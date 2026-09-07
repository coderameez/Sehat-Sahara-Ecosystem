import React, { useState } from 'react';
import { MobileAppShell, Button } from '../../../components';
import { ChevronLeft, Clock } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { MedicineCourse } from '../../../models';
import { useAppBack } from '../../../utils/navigation';

export const AddMedicine: React.FC = () => {
  const goBack = useAppBack();
  
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('');
  const [doseQuantity, setDoseQuantity] = useState('1');
  const [frequency, setFrequency] = useState('1');
  const [times, setTimes] = useState<string[]>(['08:00']);

  const getFrequencyLabel = (numTimes: number) => {
    switch(numTimes) {
      case 1: return 'ONCE DAILY';
      case 2: return 'TWICE DAILY';
      case 3: return 'THRICE DAILY';
      case 4: return 'FOUR TIMES DAILY';
      default: return `${numTimes} TIMES DAILY`;
    }
  };

  const handleFrequencyChange = (newFreq: string) => {
    setFrequency(newFreq);
    const count = parseInt(newFreq) || 1;
    if (count > times.length) {
      setTimes([...times, ...Array(count - times.length).fill('08:00')]);
    } else if (count < times.length) {
      setTimes(times.slice(0, count));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourseId = `MED-CRS-${Date.now()}`;
    
    const newCourse: MedicineCourse = {
      id: newCourseId,
      patientId: 'USR-PATIENT-DEMO',
      name: name.trim(),
      strength,
      form: 'Tablet',
      frequency: parseInt(frequency) === 1 ? 'ONCE' : parseInt(frequency) > 1 ? 'DAILY' : 'CUSTOM',
      startDate: new Date().toISOString(),
      mealRelation: 'ANYTIME',
      status: 'ACTIVE',
      exactTimes: times,
      notes: `Take ${doseQuantity} dose(s) ${getFrequencyLabel(parseInt(frequency)).toLowerCase()}`
    };

    const state = PrototypeStore.getSnapshot();
    PrototypeStore.updateState({
      medicineCourses: [newCourse, ...state.medicineCourses]
    });

    goBack();
  };

  return (
    <MobileAppShell>
      <form onSubmit={handleSave} className="flex flex-col h-full bg-[#F8FAFC]">
        
        {/* ─── HEADER ─── */}
        <header className="px-4 py-4 bg-white border-b border-slate-200 flex-shrink-0 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => goBack()} 
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Add Medicine</h1>
          </div>
        </header>

        {/* ─── CONTENT ─── */}
        <div className="app-scroll flex-1 overflow-y-auto pb-32">
          
          <div className="p-6">
            
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Medicine Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                placeholder="e.g., Panadol"
                required
              />
            </div>

            {/* Strength & Dose */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Strength</label>
                <input 
                  type="text" 
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  placeholder="e.g., 500mg"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Dose</label>
                <select 
                  value={doseQuantity}
                  onChange={(e) => setDoseQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all appearance-none"
                >
                  <option value="0.5">Half (1/2)</option>
                  <option value="1">1 Pill / Spoon</option>
                  <option value="2">2 Pills / Spoons</option>
                  <option value="3">3 Pills / Spoons</option>
                </select>
              </div>
            </div>

            <hr className="border-slate-200 mb-8" />

            {/* Schedule */}
            <div className="mb-6">
              <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide flex justify-between items-center">
                <span>Frequency</span>
                <span className="text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-[11px]">
                  {getFrequencyLabel(parseInt(frequency))}
                </span>
              </label>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleFrequencyChange(num.toString())}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      parseInt(frequency) === num 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'bg-slate-50 border border-slate-200 text-slate-600 active:bg-slate-100'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Times</label>
              <div className="grid gap-3">
                {times.map((t, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <input 
                      type="time" 
                      value={t}
                      onChange={(e) => {
                        const newTimes = [...times];
                        newTimes[index] = e.target.value;
                        setTimes(newTimes);
                      }}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ─── FOOTER ─── */}
        <div className="px-4 pt-3 pb-6 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button 
              type="submit" 
              fullWidth
            >
              Add Medicine
            </Button>
        </div>

      </form>
    </MobileAppShell>
  );
};
