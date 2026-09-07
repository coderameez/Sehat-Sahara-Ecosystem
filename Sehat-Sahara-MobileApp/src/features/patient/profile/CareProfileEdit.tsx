import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button, Input } from '../../../components';
import { ChevronLeft, User, Trash2 } from 'lucide-react';
import { OnboardingStore } from '../../../services/OnboardingStore';
import { useAppBack } from '../../../utils/navigation';

export const CareProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();
  const { id } = useParams<{ id: string }>();
  
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const state = OnboardingStore.getSnapshot();
      let profile;
      if (id === 'self') {
        const p = state.profile;
        if (p) {
          setName(p.name);
          setRelation('Self');
          if (p.dob) {
            setAge(String(new Date().getFullYear() - new Date(p.dob).getFullYear()));
          }
          setGender(p.gender || '');
          setIsPrimary(true);
        }
      } else {
        profile = state.careProfiles.find(p => p.id === id);
        if (profile) {
          setName(profile.name);
          setRelation(profile.relation);
          setAge(profile.age ? String(profile.age) : '');
          setGender(profile.gender || '');
          setBloodGroup(profile.bloodGroup || '');
          setAllergies(profile.allergies || '');
          setConditions(profile.conditions || '');
          setIsPrimary(!!profile.isPrimary);
        }
      }
    }
  }, [id]);

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!id) return;
    
    if (id !== 'self') {
      OnboardingStore.updateCareProfile(id, {
        name: name.trim() || 'Family Member',
        relation,
        age: age ? parseInt(age) : undefined,
        gender,
        bloodGroup,
        allergies,
        conditions,
      });
    } else {
      const state = OnboardingStore.getSnapshot();
      if (state.profile) {
        OnboardingStore.updateState({
          profile: { ...state.profile, name: name.trim(), gender }
        });
      }
    }
    
    goBack();
  };

  const handleRemove = () => {
    if (!id || id === 'self') return;
    OnboardingStore.removeCareProfile(id);
    navigate('/patient/profile/household', { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        <header className="px-5 py-4 shrink-0 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center">
            <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Edit Profile</h1>
          </div>
          {!isPrimary && (
            <button type="button" onClick={() => setShowRemoveConfirm(true)} className="p-2 text-red-500">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </header>

        <form onSubmit={handleSave} className="app-scroll flex-1 px-5 pt-6 pb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10" />
            </div>
            <p className="text-slate-600 text-sm">Update details for {name}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                label="Full Name"
                placeholder="e.g. Ayesha Raza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Relationship</label>
              <select 
                className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-slate-100 disabled:opacity-50" 
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                required
                disabled={isPrimary}
              >
                <option value="">Select relation...</option>
                <option value="Self">Self</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse">Spouse</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Gender</label>
                <select 
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Input
                  label="Age"
                  placeholder="e.g. 58"
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={isPrimary}
                />
              </div>
            </div>
            
            {!isPrimary && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Blood Group</label>
                  <select 
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                
                <div>
                  <Input
                    label="Known Allergies (Optional)"
                    placeholder="e.g. Penicillin, Peanuts"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
                
                <div>
                  <Input
                    label="Existing Conditions (Optional)"
                    placeholder="e.g. Diabetes, Hypertension"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </form>

        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0">
          <Button onClick={handleSave} size="lg" fullWidth>
            Save Changes
          </Button>
        </div>

        {/* In-app Remove Confirmation */}
        {showRemoveConfirm && (
          <div className="absolute inset-0 bg-slate-900/50 z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 pb-safe">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Remove Profile?</h3>
              <p className="text-[15px] text-slate-600 mb-6">
                Remove {name} from your care profiles? This cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={handleRemove} style={{ backgroundColor: '#EF4444', color: 'white', borderColor: '#EF4444' }} size="lg" fullWidth>
                  Yes, Remove
                </Button>
                <Button onClick={() => setShowRemoveConfirm(false)} variant="outline" size="lg" fullWidth>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileAppShell>
  );
};
