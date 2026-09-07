import React, { useState } from 'react';
import { MobileAppShell, Button, Input } from '../../../components';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { ChevronLeft, Plus, User, X } from 'lucide-react';
import { useAppBack } from '../../../utils/navigation';

export const CareProfiles: React.FC = () => {
  const goBack = useAppBack();
  const state = OnboardingStore.getSnapshot();
  const profile = state.profile;
  const careProfiles = state.careProfiles;
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newAge, setNewAge] = useState('');

  const displayProfiles = [
    { 
      id: 'self', 
      name: profile?.name || 'Patient', 
      relation: 'Self', 
      age: profile?.dob ? `${new Date().getFullYear() - new Date(profile.dob).getFullYear()} Yrs` : '34 Yrs', 
      primary: true 
    },
    ...careProfiles.filter(p => !p.isPrimary).map(p => ({
      id: p.id,
      name: p.name,
      relation: p.relation,
      age: p.age ? `${p.age} Yrs` : 'Unknown',
      primary: false
    }))
  ];

  const handleSave = () => {
    if (newName.trim() && newRelation.trim()) {
      OnboardingStore.addCareProfile({
        name: newName.trim(),
        relation: newRelation.trim(),
        age: newAge ? parseInt(newAge) : undefined,
        isPrimary: false,
        sosEnabled: false
      });
    }
    setShowAddForm(false);
    setNewName('');
    setNewRelation('');
    setNewAge('');
  };

  return (
    <MobileAppShell>
      <header className="px-5 py-4 shrink-0 bg-white border-b border-slate-100 flex items-center">
        <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Care Profiles</h1>
      </header>

      <div className="app-scroll flex-1 bg-slate-50 px-5 pb-28 pt-6 relative">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Household</h2>
          <p className="text-[15px] text-slate-600">
            Manage health records and book appointments for your family members from one account.
          </p>
        </div>

        <div className="space-y-4">
          {displayProfiles.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm active:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  p.primary ? 'bg-[#1B7F4C]/10 text-[#1B7F4C]' : 'bg-slate-100 text-slate-600'
                }`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                    {p.name}
                    {p.primary && (
                      <span className="px-2 py-0.5 bg-[#1B7F4C]/10 text-[#1B7F4C] text-[10px] uppercase font-bold rounded-full">
                        Primary
                      </span>
                    )}
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {p.relation} • {p.age}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button 
            variant="outline" 
            size="lg" 
            fullWidth 
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowAddForm(true)}
          >
            Add Dependent
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="absolute inset-0 bg-slate-900/40 z-50 flex items-end animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[32px] p-6 pb-safe animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Add Dependent</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 -mr-2 bg-slate-100 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <Input
                label="Full Name"
                placeholder="e.g. Ayesha Raza"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                label="Relationship"
                placeholder="e.g. Mother, Son"
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
              />
              <Input
                label="Age"
                placeholder="e.g. 58"
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} size="lg" fullWidth>
              Save Profile
            </Button>
          </div>
        </div>
      )}
    </MobileAppShell>
  );
};
