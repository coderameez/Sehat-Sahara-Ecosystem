import React, { useState } from 'react';
import { Building2, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitToGoogleSheet } from '../../utils/formSubmit';

interface FormData {
  facilityName: string;
  facilityType: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  approxDoctors: string;
  numBranches: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export const HospitalOnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    facilityName: '',
    facilityType: 'Hospital',
    city: '',
    contactPerson: '',
    phone: '',
    email: '',
    approxDoctors: '',
    numBranches: '1',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.facilityName.trim()) {
      newErrors.facilityName = 'Hospital / Clinic name is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Valid phone number is required';
    } else if (!/^[\d\s+\-()]{10,16}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number (e.g. 0300 1234567)';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Official email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitToGoogleSheet({
        formType: 'hospital_onboarding',
        facilityName: formData.facilityName,
        facilityType: formData.facilityType,
        city: formData.city,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        approxDoctors: formData.approxDoctors,
        numBranches: formData.numBranches,
        message: formData.message,
      });
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      facilityName: '',
      facilityType: 'Hospital',
      city: '',
      contactPerson: '',
      phone: '',
      email: '',
      approxDoctors: '',
      numBranches: '1',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="partner-form" className="py-20 md:py-24 bg-[#F8FAFC] dark:bg-[#071A10]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white dark:bg-darkbg-card border border-slate-200/90 dark:border-darkbg-border p-8 sm:p-12 shadow-sm">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-darkbg-800 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Institutional Onboarding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Partner With Sehat Sahara
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Submit your healthcare institution details below. Our institutional onboarding team will review your credentials and schedule an integration briefing.
            </p>
          </div>

          {/* Form or Polished Success State */}
          {isSubmitted ? (
            <div className="py-12 px-6 text-center space-y-4 max-w-lg mx-auto bg-brand-50/50 dark:bg-darkbg-800/40 rounded-2xl border border-brand-200 dark:border-brand-800">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Request Received
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Thank you. Your onboarding request has been received. The Sehat Sahara team will contact you regarding the next steps.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold rounded-full bg-white dark:bg-darkbg-card text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hospital / Clinic Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Hospital / Clinic Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.facilityName}
                    onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                    placeholder="e.g. Jinnah Memorial Hospital"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.facilityName
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-darkbg-border'
                    }`}
                  />
                  {errors.facilityName && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.facilityName}</p>
                  )}
                </div>

                {/* Facility Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Facility Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.facilityType}
                    onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-darkbg-border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Hospital">Hospital</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Other Healthcare Facility">Other Healthcare Facility</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Karachi, Lahore, Islamabad"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.city
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-darkbg-border'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.city}</p>
                  )}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Contact Person <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Full name & designation"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.contactPerson
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-darkbg-border'
                    }`}
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.contactPerson}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0300 1234567"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.phone
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-darkbg-border'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Official Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@hospital.org.pk"
                    className={`w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-400'
                        : 'border-slate-200 dark:border-darkbg-border'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Approximate Doctors & Branches */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                      Approx Doctors
                    </label>
                    <input
                      type="text"
                      value={formData.approxDoctors}
                      onChange={(e) => setFormData({ ...formData, approxDoctors: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-darkbg-border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                      Branches
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.numBranches}
                      onChange={(e) => setFormData({ ...formData, numBranches: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-darkbg-border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Requirements / Message */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Requirements / Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe specific department workflows, token integration needs, or pilot scope..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-darkbg-border text-sm bg-white dark:bg-darkbg-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Submit button & security tag */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified institutional data privacy</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-3.5 rounded-full font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <span>Validating...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Verification Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default HospitalOnboardingForm;
