import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileAppShell } from '../../../components';
import { ChevronLeft, Droplet, Heart, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { PrototypeStore } from '../../../services/PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from '../../../services/OnboardingStore';

type PledgeStep = 'eligibility' | 'details' | 'review' | 'done';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const AREAS = ['Gulshan-e-Iqbal', 'DHA', 'Clifton', 'Saddar', 'PECHS', 'North Nazimabad', 'Scheme 33'];

const ELIGIBILITY_CHECKS = [
  'I am between 18 and 65 years of age',
  'I weigh at least 50 kg',
  'I have not donated blood in the last 3 months',
  'I do not have any active infections',
  'I am not currently on blood-thinning medication',
];

export const BloodDonorPledge: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDoctor = location.pathname.startsWith('/doctor') || OnboardingStore.getSnapshot().role === 'Doctor';
  const bloodBasePath = isDoctor ? '/doctor/community/blood' : '/patient/community/blood';
  const communityBasePath = isDoctor ? '/doctor/community' : '/patient/community';
  const profile = OnboardingStore.getSnapshot().profile || FALLBACK_PROFILE;

  const [step, setStep] = useState<PledgeStep>('eligibility');
  const [checkedItems, setCheckedItems] = useState<boolean[]>(ELIGIBILITY_CHECKS.map(() => false));
  const [bloodGroup, setBloodGroup] = useState('');
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [availableDate, setAvailableDate] = useState('');
  const [message, setMessage] = useState('');

  const allChecked = checkedItems.every(Boolean);

  const toggleCheck = (i: number) => {
    setCheckedItems(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  const toggleArea = (area: string) => {
    setAvailableAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  });

  const handleSubmitPledge = () => {
    const pledgeId = `PLG-${Date.now()}`;
    PrototypeStore.addNotification({
      id: `NOTIF-PLG-${pledgeId}`,
      userId: isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO',
      type: 'BLOOD',
      title: 'Donor Pledge Registered',
      body: `Your pledge to donate ${bloodGroup} blood has been registered. Matching requests will be shared with you.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: bloodBasePath,
    });

    setStep('done');
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-4 py-4 pt-safe bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 flex items-center">
          <button
            onClick={() => step === 'eligibility' ? navigate(bloodBasePath) : setStep(step === 'details' ? 'eligibility' : step === 'review' ? 'details' : 'eligibility')}
            className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full active:bg-slate-100 text-slate-700 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="ml-2">
            <h1 className="text-lg font-bold text-slate-900">Become a Donor</h1>
            <p className="text-xs text-slate-500">Blood Donation Pledge</p>
          </div>
        </header>

        {/* Step indicator */}
        {step !== 'done' && (
          <div className="flex px-4 py-3 gap-1.5 bg-white border-b border-slate-100 shrink-0">
            {(['eligibility', 'details', 'review'] as PledgeStep[]).map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  ['eligibility', 'details', 'review'].indexOf(step) >= i ? 'bg-red-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}

        <div className="app-scroll flex-1 px-5 py-6 overflow-y-auto pb-28">

          {/* ── STEP 1: Eligibility ── */}
          {step === 'eligibility' && (
            <div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 leading-relaxed">
                  <strong>Important:</strong> This checklist is for your self-assessment only. Final medical eligibility will be confirmed by qualified medical staff at the blood donation site.
                </p>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">Self-Eligibility Check</h2>
              <p className="text-sm text-slate-500 mb-6">Please confirm each of the following to continue:</p>

              <div className="flex flex-col gap-3">
                {ELIGIBILITY_CHECKS.map((check, i) => (
                  <button
                    key={i}
                    onClick={() => toggleCheck(i)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      checkedItems[i] ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      checkedItems[i] ? 'border-red-500 bg-red-500' : 'border-slate-300'
                    }`}>
                      {checkedItems[i] && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700 leading-snug">{check}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Details ── */}
          {step === 'details' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Your Pledge Details</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Your Blood Group</label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button
                      key={bg}
                      onClick={() => setBloodGroup(bg)}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        bloodGroup === bg ? 'border-red-500 bg-red-500 text-white' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  <MapPin className="inline w-4 h-4 mr-1" />Available in Areas
                </label>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map(area => (
                    <button
                      key={area}
                      onClick={() => toggleArea(area)}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                        availableAreas.includes(area) ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  <Calendar className="inline w-4 h-4 mr-1" />Available From
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dates.map(date => (
                    <button
                      key={date}
                      onClick={() => setAvailableDate(date)}
                      className={`py-3 px-3 rounded-xl border-2 text-left transition-all ${
                        availableDate === date ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-medium block">{date.split(',')[0]}</span>
                      <span className="text-sm font-bold">{date.split(',').slice(1).join(',')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Add any notes for the requester, e.g., 'I am available on short notice in DHA'..."
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-red-400 outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Review ── */}
          {step === 'review' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Review Your Pledge</h2>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl border-2 border-red-100 flex flex-col items-center justify-center">
                      <Droplet className="w-5 h-5 text-red-600 fill-current mb-0.5" />
                      <span className="text-sm font-black text-red-700">{bloodGroup}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{profile.name || 'You'}</p>
                      <p className="text-sm text-slate-500">Blood Group: <strong className="text-slate-700">{bloodGroup}</strong></p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Available Areas</p>
                  <p className="text-sm font-semibold text-slate-700">{availableAreas.join(', ') || 'Not specified'}</p>
                </div>
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Available From</p>
                  <p className="text-sm font-semibold text-slate-700">{availableDate || 'Immediately'}</p>
                </div>
                {message && (
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Your Message</p>
                    <p className="text-sm text-slate-700 italic">"{message}"</p>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>General Information Only:</strong> Medical eligibility will be determined by healthcare staff at the blood donation center.
                </p>
              </div>
            </div>
          )}

          {/* ── DONE ── */}
          {step === 'done' && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-24 h-24 bg-red-50 border-4 border-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-100">
                <Heart className="w-12 h-12 text-red-600 fill-current" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Pledge Registered!</h2>
              <p className="text-[15px] text-slate-500 mb-8 leading-relaxed max-w-xs">
                Thank you for pledging to donate <strong className="text-slate-700">{bloodGroup}</strong> blood.
                Requesters in your area will be able to reach you.
              </p>
              <div className="bg-white rounded-2xl border border-slate-200 w-full text-left overflow-hidden mb-8">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between">
                  <span className="text-sm text-slate-500">Blood Group</span>
                  <span className="text-sm font-bold text-red-600">{bloodGroup}</span>
                </div>
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between">
                  <span className="text-sm text-slate-500">Areas</span>
                  <span className="text-sm font-bold text-slate-700">{availableAreas.slice(0, 2).join(', ')}{availableAreas.length > 2 ? '…' : ''}</span>
                </div>
                <div className="px-5 py-4 flex justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active ✓</span>
                </div>
              </div>
              <button
                onClick={() => navigate(bloodBasePath)}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl text-base active:bg-red-700 transition-colors"
              >
                View Blood Requests
              </button>
              <button
                onClick={() => navigate(communityBasePath)}
                className="w-full py-4 text-slate-600 font-semibold text-base mt-3"
              >
                Back to Community
              </button>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {step !== 'done' && (
          <div className="px-5 py-4 bg-white border-t border-slate-200 shrink-0 pb-safe">
            <button
              onClick={() => {
                if (step === 'eligibility') setStep('details');
                else if (step === 'details') setStep('review');
                else if (step === 'review') handleSubmitPledge();
              }}
              disabled={
                (step === 'eligibility' && !allChecked) ||
                (step === 'details' && (!bloodGroup || availableAreas.length === 0))
              }
              className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-700 transition-colors"
            >
              {step === 'eligibility' ? 'Continue to Pledge Details' :
               step === 'details' ? 'Review Pledge' :
               'Publish My Pledge'}
            </button>
          </div>
        )}
      </div>
    </MobileAppShell>
  );
};
