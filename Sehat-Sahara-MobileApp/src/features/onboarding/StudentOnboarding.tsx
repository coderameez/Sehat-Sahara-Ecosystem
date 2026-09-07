import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components';
import { InnerScreenLayout } from '../../components/layouts';
import { OnboardingStore } from '../../services/OnboardingStore';

export const StudentOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    university: '',
    studentId: '',
    program: '',
    year: '',
    hospital: '',
    interests: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    OnboardingStore.updateState({ 
      isAuthenticated: true,
      onboardingComplete: true,
      role: 'Doctor',
      activeRole: 'doctor',
      activeAccountId: 'USR-STUDENT-DEMO',
      providerJourney: 'medical_student',
      providerGroup: 'student_fresher',
      verificationStatus: 'Supervised Student',
      verificationOutcome: 'Supervised Student',
      lastStep: '/doctor/home',
      profile: {
        name: formData.name || 'Sara Ahmed',
        phone: formData.phone || '03211234567',
        email: formData.email || 'sara.student@aku.edu.pk',
        city: formData.location || 'Karachi',
        area: 'Saddar',
      }
    });
    navigate('/doctor/home', { replace: true });
  };

  const handleDemoFill = () => {
    setFormData({
      name: 'Sara Ahmed',
      phone: '03211234567',
      email: 'sara.student@aku.edu.pk',
      university: 'Aga Khan University Medical College',
      studentId: 'STU-2024-0892',
      program: 'MBBS',
      year: '4th',
      hospital: 'Aga Khan University Hospital',
      interests: 'Clinical Research, Internal Medicine',
      location: 'Karachi',
    });
    setTimeout(() => {
      OnboardingStore.updateState({ 
        isAuthenticated: true,
        onboardingComplete: true,
        role: 'Doctor',
        activeRole: 'doctor',
        activeAccountId: 'USR-STUDENT-DEMO',
        providerJourney: 'medical_student',
        providerGroup: 'student_fresher',
        verificationStatus: 'Supervised Student',
        verificationOutcome: 'Supervised Student',
        lastStep: '/doctor/home',
        profile: {
          name: 'Sara Ahmed',
          phone: '03211234567',
          email: 'sara.student@aku.edu.pk',
          city: 'Karachi',
          area: 'Saddar',
        }
      });
      navigate('/doctor/home', { replace: true });
    }, 100);
  };

  return (
    <InnerScreenLayout title="Student Profile">
      <div className="flex flex-col h-full bg-slate-50 relative">
        <div className="app-scroll flex-1 px-5 pb-28 pt-5">
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">
            Tell us about yourself so we can personalize your learning experience.
          </p>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Personal Info</h3>
            <div className="flex flex-col gap-3">
              <Input 
                label="Full Name"
                name="name"
                placeholder="e.g. Ahmed Khan"
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

          {/* Academic Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Academic Details</h3>
            <div className="flex flex-col gap-3">
              <Input 
                label="University / College"
                name="university"
                placeholder="e.g. Dow University"
                value={formData.university}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  label="Program"
                  name="program"
                  placeholder="e.g. MBBS"
                  value={formData.program}
                  onChange={handleChange}
                />
                <div className="w-full flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700 leading-none">Current Year</label>
                  <select 
                    name="year" 
                    value={formData.year} 
                    onChange={handleChange} 
                    className="w-full bg-white text-slate-900 text-sm rounded-xl border border-surface-border h-11 px-3.5 focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600"
                  >
                    <option value="">Select</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="Final">Final Year</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>
              <Input 
                label="Student ID"
                name="studentId"
                placeholder="e.g. STU-2024-XXXX"
                value={formData.studentId}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Clinical Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-3">Clinical</h3>
            <div className="flex flex-col gap-3">
              <Input 
                label="Teaching Hospital"
                name="hospital"
                placeholder="e.g. Civil Hospital"
                value={formData.hospital}
                onChange={handleChange}
              />
              <Input 
                label="Interests"
                name="interests"
                placeholder="e.g. Surgery, Pediatrics"
                value={formData.interests}
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
            Complete Setup
          </Button>
        </div>
      </div>
    </InnerScreenLayout>
  );
};
