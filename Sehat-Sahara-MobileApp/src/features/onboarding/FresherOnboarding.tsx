import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { OnboardingStore } from '../../services/OnboardingStore';

export const FresherOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pmdcNumber: '',
    qualification: '',
    college: '',
    graduation: '',
    currentRole: '',
    hospital: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    OnboardingStore.updateState({ 
      isAuthenticated: true,
      onboardingComplete: true,
      role: 'Doctor',
      activeRole: 'doctor',
      activeAccountId: 'USR-FRESH-DEMO',
      providerJourney: 'fresh_doctor',
      providerGroup: 'student_fresher',
      verificationStatus: 'PMDC Verified',
      verificationOutcome: 'PMDC Verified',
      lastStep: '/doctor/home',
      profile: {
        name: formData.name || 'Dr. Ali Raza',
        phone: formData.phone || '03112223333',
        email: formData.email || 'ali.raza@example.com',
        city: formData.location || 'Karachi',
        area: 'Cantonment',
      }
    });
    navigate('/doctor/home', { replace: true });
  };

  const handleDemoFill = () => {
    setFormData({
      name: 'Dr. Ali Raza',
      phone: '03112223333',
      email: 'ali.raza@example.com',
      pmdcNumber: '99887-P',
      qualification: 'MBBS',
      college: 'Jinnah Sindh Medical University',
      graduation: '2023',
      currentRole: 'House Officer',
      hospital: 'Jinnah Postgraduate Medical Centre',
      location: 'Karachi',
    });
    setTimeout(() => {
      OnboardingStore.updateState({ 
        isAuthenticated: true,
        onboardingComplete: true,
        role: 'Doctor',
        activeRole: 'doctor',
        activeAccountId: 'USR-FRESH-DEMO',
        providerJourney: 'fresh_doctor',
        providerGroup: 'student_fresher',
        verificationStatus: 'PMDC Verified',
        verificationOutcome: 'PMDC Verified',
        lastStep: '/doctor/home',
        profile: {
          name: 'Dr. Ali Raza',
          phone: '03112223333',
          email: 'ali.raza@example.com',
          city: 'Karachi',
          area: 'Cantonment',
        }
      });
      navigate('/doctor/home', { replace: true });
    }, 100);
  };

  return (
    <InnerScreenLayout title="Fresh Doctor Profile">
      <div className="flex flex-col h-full bg-slate-50 relative">
        <div className="app-scroll flex-1 px-5 pb-28 pt-5">
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            Set up your profile to discover early-career opportunities and start consulting.
          </p>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Personal Info</h3>
            <div className="flex flex-col gap-3">
              <Input 
                label="Full Name"
                name="name"
                placeholder="e.g. Dr. Ali Raza"
                value={formData.name}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="03XX XXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input 
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Academic & PMDC */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Credentials</h3>
            <div className="flex flex-col gap-3">
              <Input 
                label="PMDC Number (Provisional or Full)"
                name="pmdcNumber"
                placeholder="e.g. 99887-P"
                value={formData.pmdcNumber}
                onChange={handleChange}
              />
              <Input 
                label="Qualification"
                name="qualification"
                placeholder="e.g. MBBS"
                value={formData.qualification}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Medical College"
                  name="college"
                  placeholder="e.g. JSMU"
                  value={formData.college}
                  onChange={handleChange}
                />
                <Input 
                  label="Graduation Year"
                  name="graduation"
                  type="number"
                  placeholder="YYYY"
                  value={formData.graduation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Current Status</h3>
            <div className="flex flex-col gap-3">
              <div className="w-full flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 leading-none">Current Role</label>
                <select 
                  name="currentRole" 
                  value={formData.currentRole} 
                  onChange={handleChange} 
                  className="w-full bg-white text-slate-900 text-sm rounded-xl border border-surface-border h-11 px-3.5 focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600"
                >
                  <option value="">Select</option>
                  <option value="House Officer">House Officer</option>
                  <option value="Medical Officer (MO)">Medical Officer (MO)</option>
                  <option value="General Physician (GP)">General Physician (GP)</option>
                  <option value="Postgraduate Trainee">Postgraduate Trainee</option>
                </select>
              </div>
              <Input 
                label="Hospital / Clinic"
                name="hospital"
                placeholder="e.g. JPMC"
                value={formData.hospital}
                onChange={handleChange}
              />
              <Input 
                label="City"
                name="location"
                placeholder="e.g. Karachi"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <button 
            onClick={handleDemoFill}
            className="mt-1 text-[#1B7F4C] text-sm font-semibold underline text-center block w-full py-2"
          >
            Use Demo Information & Continue
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-gray-100 pb-safe z-50">
          <Button onClick={handleSubmit}>
            Submit for Verification
          </Button>
        </div>
      </div>
    </InnerScreenLayout>
  );
};
