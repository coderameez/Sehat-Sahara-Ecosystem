import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { OnboardingStore } from '../../services/OnboardingStore';

export const ConsultantOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pmdcNumber: '',
    specialty: '',
    subSpecialty: '',
    qualification: '',
    fellowships: '',
    experience: '',
    hospital: '',
    clinic: '',
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
      activeAccountId: 'USR-CONSULTANT-DEMO',
      providerJourney: 'consultant_specialist',
      providerGroup: 'professional',
      verificationStatus: 'PMDC Verified',
      verificationOutcome: 'PMDC Verified',
      lastStep: '/doctor/home',
      profile: {
        name: formData.name || 'Dr. Tariq Mahmood',
        phone: formData.phone || '03005556666',
        email: formData.email || 'tariq.mahmood@example.com',
        city: 'Karachi',
        area: 'DHA',
      }
    });
    navigate('/doctor/home', { replace: true });
  };

  const handleDemoFill = () => {
    setFormData({
      name: 'Dr. Tariq Mahmood',
      phone: '03005556666',
      email: 'tariq.mahmood@example.com',
      pmdcNumber: '45678-S',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      qualification: 'MBBS, FCPS (Cardiology), MRCP',
      fellowships: 'FACC (USA)',
      experience: '15',
      hospital: 'National Institute of Cardiovascular Diseases',
      clinic: 'Heart Care Clinic, DHA',
      fees: '3500',
    });
    setTimeout(() => {
      OnboardingStore.updateState({ 
        isAuthenticated: true,
        onboardingComplete: true,
        role: 'Doctor',
        activeRole: 'doctor',
        activeAccountId: 'USR-CONSULTANT-DEMO',
        providerJourney: 'consultant_specialist',
        providerGroup: 'professional',
        verificationStatus: 'PMDC Verified',
        verificationOutcome: 'PMDC Verified',
        lastStep: '/doctor/home',
        profile: {
          name: 'Dr. Tariq Mahmood',
          phone: '03005556666',
          email: 'tariq.mahmood@example.com',
          city: 'Karachi',
          area: 'DHA',
        }
      });
      navigate('/doctor/home', { replace: true });
    }, 100);
  };

  return (
    <InnerScreenLayout title="Consultant Profile">
      <div className="flex flex-col h-full bg-slate-50 relative">
        <div className="app-scroll flex-1 px-5 pb-28 pt-5">
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            Set up your specialist profile to manage your advanced practice and consultations.
          </p>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Personal Info</h3>
            <div className="flex flex-col gap-3">
              <Input 
                label="Full Name"
                name="name"
                placeholder="e.g. Dr. Tariq Mahmood"
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

          {/* Specialization */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Specialization & Credentials</h3>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Specialty"
                  name="specialty"
                  placeholder="e.g. Cardiology"
                  value={formData.specialty}
                  onChange={handleChange}
                />
                <Input 
                  label="PMDC Number"
                  name="pmdcNumber"
                  placeholder="e.g. 45678-S"
                  value={formData.pmdcNumber}
                  onChange={handleChange}
                />
              </div>
              <Input 
                label="Sub-Specialty (Optional)"
                name="subSpecialty"
                placeholder="e.g. Interventional Cardiology"
                value={formData.subSpecialty}
                onChange={handleChange}
              />
              <Input 
                label="Qualifications"
                name="qualification"
                placeholder="e.g. MBBS, FCPS, MRCP"
                value={formData.qualification}
                onChange={handleChange}
              />
              <Input 
                label="Fellowships / Memberships"
                name="fellowships"
                placeholder="e.g. FACC"
                value={formData.fellowships}
                onChange={handleChange}
              />
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
                  placeholder="e.g. 15"
                  value={formData.experience}
                  onChange={handleChange}
                />
                <Input 
                  label="Consultation Fee (PKR)"
                  name="fees"
                  type="number"
                  placeholder="e.g. 3500"
                  value={formData.fees}
                  onChange={handleChange}
                />
              </div>
              <Input 
                label="Primary Hospital"
                name="hospital"
                placeholder="e.g. NICVD"
                value={formData.hospital}
                onChange={handleChange}
              />
              <Input 
                label="Private Clinic"
                name="clinic"
                placeholder="e.g. Heart Care Clinic"
                value={formData.clinic}
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
