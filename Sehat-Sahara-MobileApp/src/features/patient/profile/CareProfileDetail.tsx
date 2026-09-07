import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileAppShell, Button, BottomSheet } from '../../../components';
import { ChevronLeft, User, Edit2, Trash2 } from 'lucide-react';
import { OnboardingStore, CareProfile } from '../../../services/OnboardingStore';
import { useAppBack } from '../../../utils/navigation';

export const CareProfileDetail: React.FC = () => {
  const navigate = useNavigate();
  const goBack = useAppBack();
  const { id } = useParams<{ id: string }>();
  const [showRemove, setShowRemove] = useState(false);
  const [profileData, setProfileData] = useState<Partial<CareProfile>>({});
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    if (id) {
      const state = OnboardingStore.getSnapshot();
      if (id === 'self') {
        const p = state.profile;
        if (p) {
          setProfileData({
            name: p.name,
            relation: 'Self',
            age: p.dob ? new Date().getFullYear() - new Date(p.dob).getFullYear() : undefined,
            gender: p.gender || 'Not specified',
          });
          setIsSelf(true);
        }
      } else {
        const p = state.careProfiles.find(cp => cp.id === id);
        if (p) {
          setProfileData(p);
          setIsSelf(!!p.isPrimary);
        }
      }
    }
  }, [id]);

  const handleRemove = () => {
    if (id && id !== 'self') {
      OnboardingStore.removeCareProfile(id);
    }
    navigate('/patient/profile/household', { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50">
        <header className="px-5 py-4 shrink-0 flex items-center bg-white border-b border-slate-100">
          <button onClick={() => goBack()} className="mr-3 p-1 -ml-1">
            <ChevronLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Profile Details</h1>
        </header>

        <div className="app-scroll flex-1 px-5 pt-6 pb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profileData.name}</h2>
            <p className="text-slate-500 font-medium mt-1">{profileData.relation}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-100 flex justify-between">
              <span className="text-slate-500 font-medium">Age</span>
              <span className="text-slate-900 font-semibold">{profileData.age ? `${profileData.age} Yrs` : 'Not specified'}</span>
            </div>
            <div className="p-4 border-b border-slate-100 flex justify-between">
              <span className="text-slate-500 font-medium">Gender</span>
              <span className="text-slate-900 font-semibold">{profileData.gender || 'Not specified'}</span>
            </div>
            {!isSelf && (
              <>
                <div className="p-4 border-b border-slate-100 flex justify-between">
                  <span className="text-slate-500 font-medium">Blood Group</span>
                  <span className="text-slate-900 font-semibold">{profileData.bloodGroup || 'Not specified'}</span>
                </div>
                <div className="p-4 border-b border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Allergies</span>
                  <span className="text-slate-900 font-semibold">{profileData.allergies || 'None listed'}</span>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Conditions</span>
                  <span className="text-slate-900 font-semibold">{profileData.conditions || 'None listed'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-5 bg-white border-t border-slate-200 pb-safe shrink-0 flex gap-3">
          <Button 
            variant="outline" 
            fullWidth 
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => navigate(`/patient/profile/household/${id}/edit`)}
          >
            Edit
          </Button>
          {!isSelf && (
            <Button 
              style={{ backgroundColor: '#EF4444', color: 'white', borderColor: '#EF4444' }} 
              fullWidth 
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => setShowRemove(true)}
            >
              Remove
            </Button>
          )}
        </div>

        <BottomSheet isOpen={showRemove} onClose={() => setShowRemove(false)} title="Remove Profile">
          <div className="pb-4 space-y-4">
            <p className="text-slate-600 text-[15px]">Are you sure you want to remove {profileData.name} from your care profiles? This cannot be undone.</p>
            <div className="flex flex-col gap-3 pt-2">
              <Button style={{ backgroundColor: '#EF4444', color: 'white', borderColor: '#EF4444' }} fullWidth onClick={handleRemove}>Yes, Remove</Button>
              <Button variant="outline" fullWidth onClick={() => setShowRemove(false)}>Cancel</Button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </MobileAppShell>
  );
};
