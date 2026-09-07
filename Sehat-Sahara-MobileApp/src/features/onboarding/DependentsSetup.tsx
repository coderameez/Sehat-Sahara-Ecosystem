import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, BottomSheet, Input } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { UserPlus, User } from 'lucide-react';
import { OnboardingStore } from '../../services/OnboardingStore';

export const DependentsSetup: React.FC = () => {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [dependents, setDependents] = useState(OnboardingStore.getSnapshot().careProfiles);

  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');

  useEffect(() => {
    const unsubscribe = OnboardingStore.subscribe(() => {
      setDependents(OnboardingStore.getSnapshot().careProfiles);
    });
    return () => { unsubscribe(); };
  }, []);

  const handleContinue = () => {
    navigate('/auth/emergency');
  };

  const handleAddMember = () => {
    if (newName.trim() && newRelation.trim()) {
      OnboardingStore.addCareProfile({
        name: newName,
        relation: newRelation,
        isPrimary: false
      });
      setNewName('');
      setNewRelation('');
      setShowAdd(false);
    }
  };

  return (
    <InnerScreenLayout title="Add Dependents">
      <div className="flex flex-col h-full bg-slate-50">
        <div className="app-scroll flex-1 px-5 pb-8 pt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Household Members</h2>
            <p className="text-[15px] text-slate-600 leading-relaxed">
              Add family members you will be managing care for.
            </p>
          </div>

          {dependents.length === 0 ? (
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center mb-6">
              <p className="text-slate-500 font-medium">No members added yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-6">
              {dependents.filter(d => !d.isPrimary).map(dep => (
                <div key={dep.id} className="p-4 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-[16px]">{dep.name}</h3>
                      <p className="text-slate-500 text-[13px] mt-0.5">{dep.relation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAdd(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 flex items-center justify-center gap-2 text-brand-600 font-bold transition-colors active:bg-brand-100"
          >
            <UserPlus className="w-5 h-5" />
            Add {dependents.length > 0 ? 'Another ' : ''}Member
          </button>
        </div>

        <div className="px-4 pt-3 pb-6 bg-white border-t border-slate-200 shrink-0">
          <Button onClick={handleContinue}>
            Continue
          </Button>
        </div>

        <BottomSheet isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Member">
          <div className="pb-4 flex flex-col gap-4">
            <Input 
              label="Full Name"
              placeholder="e.g. Shazia Raza"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Relationship</label>
              <select 
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[15px] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select Relation</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mt-4">
              <Button 
                onClick={handleAddMember} 
                disabled={!newName.trim() || !newRelation.trim()}
              >
                Save Member
              </Button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </InnerScreenLayout>
  );
};
