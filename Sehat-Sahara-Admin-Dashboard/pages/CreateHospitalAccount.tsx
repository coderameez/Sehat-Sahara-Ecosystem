import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Building2,
  Activity,
  CheckCircle2,
  Info,
  Users,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
} from 'lucide-react';
import {
  hospitalFacilityStore,
  FacilityType,
  AccountStatus,
} from '../data/hospitalMockData';

export const CreateHospitalAccount: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [facilityName, setFacilityName] = useState('');
  const [facilityType, setFacilityType] = useState<FacilityType>('Hospital');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<AccountStatus>('Active');

  // Validation / Feedback State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!facilityName.trim()) {
      setErrorMsg('Facility Name is required.');
      return;
    }
    if (!contactName.trim()) {
      setErrorMsg('Primary Contact Person Name is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Phone Number is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid Email Address is required.');
      return;
    }

    // Create facility in store
    hospitalFacilityStore.createFacility({
      name: facilityName.trim(),
      type: facilityType,
      city,
      address: address.trim() || `${city}, Pakistan`,
      contactName: contactName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status,
    });

    setSuccessMsg('Facility account created successfully! Redirecting...');
    setTimeout(() => {
      navigate('/admin/hospitals');
    }, 900);
  };

  const handleSaveDraft = () => {
    setSuccessMsg('Draft saved locally.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12">

      {/* ─── Top Bar: Breadcrumb & Title ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/hospitals')}
            className="w-9 h-9 rounded-lg border border-surface-border bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mb-0.5">
              <span>Hospitals / Clinics</span>
              <span className="text-slate-300">&gt;</span>
              <span className="text-slate-800 font-semibold">Create Account</span>
            </div>
            <h1 className="text-[20px] font-bold text-slate-900 leading-tight">
              A-06 Create Hospital / Clinic Account
            </h1>
          </div>
        </div>
      </div>

      {/* Error & Success Alerts */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-[13px] font-semibold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[13px] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ─── Two-Column Layout ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ════════════ LEFT COLUMN: Form (7 cols) ════════════ */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCreate} className="bg-white border border-surface-border rounded-xl p-6 shadow-card space-y-6">

            {/* 1. Facility Information */}
            <div className="space-y-4">
              <h2 className="text-[15px] font-bold text-slate-900 border-b border-surface-border pb-2">
                Facility Information
              </h2>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                  Facility Name *
                </label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  placeholder="e.g. Green Valley Hospital"
                  className="w-full h-10 px-3 text-[13px] rounded-lg border border-surface-border bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
                />
              </div>

              {/* Facility Type Selector Cards (Matching PDF Page 10) */}
              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-2">
                  Facility Type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Basic Clinic */}
                  <div
                    onClick={() => setFacilityType('Basic Clinic')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center relative ${
                      facilityType === 'Basic Clinic'
                        ? 'border-brand-700 bg-emerald-50/50 shadow-xs'
                        : 'border-surface-border hover:bg-slate-50'
                    }`}
                  >
                    <Activity className={`w-5 h-5 mb-1.5 ${facilityType === 'Basic Clinic' ? 'text-brand-700' : 'text-slate-500'}`} />
                    <span className="text-[12px] font-bold text-slate-900">Basic Clinic</span>
                    {facilityType === 'Basic Clinic' && (
                      <CheckCircle2 className="w-4 h-4 text-brand-700 absolute top-2 right-2" />
                    )}
                  </div>

                  {/* Poly-Clinic */}
                  <div
                    onClick={() => setFacilityType('Poly-Clinic')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center relative ${
                      facilityType === 'Poly-Clinic'
                        ? 'border-brand-700 bg-emerald-50/50 shadow-xs'
                        : 'border-surface-border hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mb-1.5 ${facilityType === 'Poly-Clinic' ? 'text-brand-700' : 'text-slate-500'}`} />
                    <span className="text-[12px] font-bold text-slate-900">Poly-Clinic</span>
                    {facilityType === 'Poly-Clinic' && (
                      <CheckCircle2 className="w-4 h-4 text-brand-700 absolute top-2 right-2" />
                    )}
                  </div>

                  {/* Hospital */}
                  <div
                    onClick={() => setFacilityType('Hospital')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center relative ${
                      facilityType === 'Hospital'
                        ? 'border-brand-700 bg-emerald-50/50 shadow-xs'
                        : 'border-surface-border hover:bg-slate-50'
                    }`}
                  >
                    <Building className={`w-5 h-5 mb-1.5 ${facilityType === 'Hospital' ? 'text-brand-700' : 'text-slate-500'}`} />
                    <span className="text-[12px] font-bold text-slate-900">Hospital</span>
                    {facilityType === 'Hospital' && (
                      <CheckCircle2 className="w-4 h-4 text-brand-700 absolute top-2 right-2" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Primary Contact */}
            <div className="space-y-4">
              <h2 className="text-[15px] font-bold text-slate-900 border-b border-surface-border pb-2">
                Primary Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Dr. Ali Raza"
                    className="w-full h-10 px-3 text-[13px] rounded-lg border border-surface-border bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0321 1234567"
                    className="w-full h-10 px-3 text-[13px] rounded-lg border border-surface-border bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@greenvalleyhospital.pk"
                    className="w-full h-10 px-3 text-[13px] rounded-lg border border-surface-border bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 px-3 text-[13px] rounded-lg border border-surface-border bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors cursor-pointer"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                  Physical Address (Optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street / Commercial Area / Sector"
                  className="w-full h-10 px-3 text-[13px] rounded-lg border border-surface-border bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
                />
              </div>

              {/* Informational banner (Matching PDF Page 10) */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                <div className="text-[12px]">
                  <p className="font-bold text-slate-900">Temporary Password Delivery</p>
                  <p className="text-slate-600 mt-0.5">
                    A temporary password will be sent to the provided email address for first-time facility login.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Account Status */}
            <div className="space-y-3">
              <h2 className="text-[15px] font-bold text-slate-900 border-b border-surface-border pb-2">
                Status
              </h2>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-[13px]">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Active'}
                    onChange={() => setStatus('Active')}
                    className="accent-brand-700 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800">Active</span>
                  <span className="text-slate-400 text-[11px]">(Account active immediately)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[13px]">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Inactive'}
                    onChange={() => setStatus('Inactive')}
                    className="accent-brand-700 w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800">Inactive</span>
                  <span className="text-slate-400 text-[11px]">(Remains inactive)</span>
                </label>
              </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/hospitals')}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-[13px] transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 rounded-lg border border-surface-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[13px] transition-colors shadow-xs"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold text-[13px] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* ════════════ RIGHT COLUMN: Capabilities & Preview (5 cols) ════════════ */}
        <div className="lg:col-span-5 space-y-6">

          {/* Access & Capabilities Card (Matching PDF Page 10) */}
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card space-y-4">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900">Access & Capabilities</h3>
              <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">
                Based on selected facility type: <span className="font-bold text-brand-700">{facilityType}</span>
              </p>
            </div>

            <div className="space-y-3 text-[12.5px]">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-page border border-surface-border">
                <Users className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">User Management</p>
                  <p className="text-slate-500 text-[11.5px] mt-0.5">
                    Add and manage doctors, staff and reception users.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-page border border-surface-border">
                <Calendar className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Appointment Management</p>
                  <p className="text-slate-500 text-[11.5px] mt-0.5">
                    Manage patient appointments, doctor availability, and tokens.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-page border border-surface-border">
                <FileText className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Patient Records</p>
                  <p className="text-slate-500 text-[11.5px] mt-0.5">
                    Access and manage consent-gated patient medical records.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-page border border-surface-border">
                <BarChart3 className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Reports & Analytics</p>
                  <p className="text-slate-500 text-[11.5px] mt-0.5">
                    View operational metrics, footfall, and doctor performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-page border border-surface-border">
                <MessageSquare className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Community Access</p>
                  <p className="text-slate-500 text-[11.5px] mt-0.5">
                    Participate in community emergency blood requests and medical drives.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-page border border-surface-border">
                <Settings className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">Facility Settings</p>
                  <p className="text-slate-500 text-[11.5px] mt-0.5">
                    Manage facility profile, branches, and clinic timings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Creation Confirmation Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
            <div className="text-[12px]">
              <p className="font-bold text-slate-900">Account Creation Summary</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Upon successful creation, credentials will be dispatched and the facility account will appear in the Hospitals / Clinics directory.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
