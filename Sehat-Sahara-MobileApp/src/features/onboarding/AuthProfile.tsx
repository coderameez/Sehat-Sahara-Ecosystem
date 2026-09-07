import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, LocationSelector, LocationData } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { Camera, User } from 'lucide-react';
import { OnboardingStore } from '../../services/OnboardingStore';

export const AuthProfile: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState<LocationData | undefined>();
  const [bloodGroup, setBloodGroup] = useState('');
  const [phone] = useState('03001234567'); // Pre-filled from Auth (mocked)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhoto(url);
    }
  };

  const handleContinue = () => {
    // Validations removed as per user request to allow empty fields.
    const finalName = name.trim() || 'Patient';
    const finalCity = location?.city || 'Unknown City';
    const finalArea = location?.area || 'Unknown Area';

    OnboardingStore.updateCareProfile('USR-PATIENT-DEMO', { 
      name: finalName,
      bloodGroup: bloodGroup || undefined
    });
    OnboardingStore.updateState({ 
      profile: { name: finalName, phone, city: finalCity, area: finalArea, email: '' },
      lastStep: '/auth/care-scope'
    });

    navigate('/auth/care-scope', { replace: true });
  };

  const handleDemoFill = () => {
    setName('Ayesha Yousuf');
    setLocation({ city: 'Karachi', area: 'Gulshan-e-Iqbal', address: 'Gulshan-e-Iqbal, Karachi', lat: 24.9180, lng: 67.0971 });
    setBloodGroup('O+');
    setErrors({});
    
    setTimeout(() => {
      OnboardingStore.updateCareProfile('USR-PATIENT-DEMO', { 
        name: 'Ayesha Yousuf',
        bloodGroup: 'O+'
      });
      OnboardingStore.updateState({ 
        profile: { name: 'Ayesha Yousuf', phone, city: 'Karachi', area: 'Gulshan-e-Iqbal', email: '' },
        lastStep: '/auth/care-scope'
      });
      navigate('/auth/care-scope', { replace: true });
    }, 100);
  };

  return (
    <InnerScreenLayout title="Create Profile" onBack={() => navigate('/auth/verify', { replace: true })} bottomPadding={false}>
      <div className="flex flex-col min-h-full bg-slate-50 relative justify-between">
        <div className="px-5 pt-6 pb-28">
          
          <div className="flex justify-center mb-8">
            <div 
              className="relative w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-white shadow-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-slate-400" />
              )}
              <div className="absolute bottom-0 w-full h-8 bg-black/40 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Input 
                label="Full Name"
                placeholder="e.g. Ayesha Yousuf"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors(prev => ({...prev, name: ''})) }}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            <Input 
              label="Phone Number"
              value={phone}
              disabled
            />

            <LocationSelector
              label="Location"
              placeholder="Search city or area..."
              value={location}
              onChange={(loc) => { setLocation(loc); setErrors(prev => ({...prev, location: ''})) }}
              error={errors.location}
            />

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1">Blood Group</label>
              <select 
                value={bloodGroup}
                onChange={e => { setBloodGroup(e.target.value); setErrors(prev => ({...prev, bloodGroup: ''})) }}
                className={`w-full p-4 rounded-xl border bg-white text-[15px] outline-none focus:border-[#1B7F4C] ${errors.bloodGroup ? 'border-red-500' : 'border-slate-200'}`}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              {errors.bloodGroup && <p className="text-red-500 text-xs mt-1 ml-1">{errors.bloodGroup}</p>}
            </div>
            
            <button 
              onClick={handleDemoFill}
              className="mt-2 text-[#1B7F4C] text-sm font-semibold underline text-center block w-full py-2"
            >
              Use Demo Information & Continue
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 px-4 py-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 pb-safe z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] mt-auto">
          <Button onClick={handleContinue} fullWidth size="lg">
            Continue
          </Button>
        </div>
      </div>
    </InnerScreenLayout>
  );
};
