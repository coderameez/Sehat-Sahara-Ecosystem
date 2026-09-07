import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { OnboardingStore } from '../../services/OnboardingStore';

export const DoctorOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pmdcNumber: '',
    qualification: '',
    college: '',
    graduation: '',
    specialty: '',
    experience: '',
    facilities: '',
    languages: '',
    visitModes: '',
    availability: '',
    fees: '',
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
      activeAccountId: 'USR-DOCTOR-DEMO',
      providerJourney: 'practicing_doctor',
      providerGroup: 'professional',
      verificationStatus: 'PMDC Verified',
      verificationOutcome: 'PMDC Verified',
      lastStep: '/doctor/home',
      profile: {
        name: formData.name || 'Dr. Sarah Ahmed',
        phone: formData.phone || '03009876543',
        email: formData.email || 'drsarah@example.com',
        city: 'Karachi',
        area: 'Clifton',
      }
    });
    navigate('/doctor/home', { replace: true });
  };

  const handleDemoFill = () => {
    setFormData({
      name: 'Dr. Sarah Ahmed',
      phone: '03009876543',
      email: 'drsarah@example.com',
      pmdcNumber: '78901-P',
      qualification: 'MBBS, FCPS',
      college: 'Aga Khan University',
      graduation: '2015',
      specialty: 'General Physician',
      experience: '8',
      facilities: 'City Care Clinic',
      languages: 'English, Urdu',
      visitModes: 'In-person, Video',
      availability: 'Mon-Fri 4PM-8PM',
      fees: '1500',
    });
    setTimeout(() => {
      OnboardingStore.updateState({ 
        isAuthenticated: true,
        onboardingComplete: true,
        role: 'Doctor',
        activeRole: 'doctor',
        activeAccountId: 'USR-DOCTOR-DEMO',
        providerJourney: 'practicing_doctor',
        providerGroup: 'professional',
        verificationStatus: 'PMDC Verified',
        verificationOutcome: 'PMDC Verified',
        lastStep: '/doctor/home',
        profile: {
          name: 'Dr. Sarah Ahmed',
          phone: '03009876543',
          email: 'drsarah@example.com',
          city: 'Karachi',
          area: 'Clifton',
        }
      });
      navigate('/doctor/home', { replace: true });
    }, 100);
  };

  return (
    <InnerScreenLayout title="Doctor Profile">
      <div className="flex flex-col h-full bg-slate-50 relative">
        <div className="app-scroll flex-1 px-5 pb-28 pt-5">
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            Set up your professional profile to start consulting with patients.
          </p>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Personal Info</h3>
            <div className="flex flex-col gap-3">
              <Input 
                label="Full Name"
                name="name"
                placeholder="e.g. Dr. Sarah Ahmed"
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

          {/* Professional Credentials */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Professional Credentials</h3>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="PMDC Number"
                  name="pmdcNumber"
                  placeholder="e.g. 78901-P"
                  value={formData.pmdcNumber}
                  onChange={handleChange}
                />
                <Input 
                  label="Specialty"
                  name="specialty"
                  placeholder="e.g. General Physician"
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </div>
              <Input 
                label="Qualification"
                name="qualification"
                placeholder="e.g. MBBS, FCPS"
                value={formData.qualification}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Medical College"
                  name="college"
                  placeholder="e.g. AKU"
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

          {/* Practice Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Practice Details</h3>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Experience (Years)"
                  name="experience"
                  type="number"
                  placeholder="e.g. 5"
                  value={formData.experience}
                  onChange={handleChange}
                />
                <Input 
                  label="Fee (PKR)"
                  name="fees"
                  type="number"
                  placeholder="e.g. 1500"
                  value={formData.fees}
                  onChange={handleChange}
                />
              </div>
              <Input 
                label="Facilities / Clinics"
                name="facilities"
                placeholder="e.g. City Care Clinic"
                value={formData.facilities}
                onChange={handleChange}
              />
              <Input 
                label="Languages Spoken"
                name="languages"
                placeholder="e.g. English, Urdu"
                value={formData.languages}
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
