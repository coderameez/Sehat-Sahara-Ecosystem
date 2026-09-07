import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppShell, Button, SehatSaharaLogo } from '../../components';
import { OnboardingStore } from '../../services/OnboardingStore';
import { getProviderDisplayIdentity, VerificationStatus } from '../../services/ProviderCapabilities';
import { ShieldCheck, ShieldAlert, Clock, AlertTriangle, Edit3, ArrowRight } from 'lucide-react';

const JOURNEY_ROUTES: Record<string, string> = {
  medical_student: '/onboarding/student',
  fresh_doctor: '/onboarding/fresher',
  practicing_doctor: '/onboarding/doctor',
  consultant_specialist: '/onboarding/consultant',
};

export const ProviderVerificationStatus: React.FC = () => {
  const navigate = useNavigate();
  const snap = OnboardingStore.getSnapshot();
  const journey = snap.providerJourney || 'consultant_specialist';
  const identity = getProviderDisplayIdentity(journey as any);

  const initialStatus: VerificationStatus = (snap.verificationStatus as VerificationStatus) || 'Verification Pending';
  const [status, setStatus] = useState<VerificationStatus>(initialStatus);
  const [isProcessing, setIsProcessing] = useState<boolean>(initialStatus === 'Verification Pending');

  useEffect(() => {
    if (status === 'Verification Pending') {
      const timer = setTimeout(() => {
        // Determine prototype outcome
        let outcome: VerificationStatus = 'PMDC Verified';
        if (snap.verificationOutcome) {
          outcome = snap.verificationOutcome as VerificationStatus;
        } else if (journey === 'medical_student') {
          outcome = 'Supervised Student';
        }

        setStatus(outcome);
        setIsProcessing(false);

        OnboardingStore.updateState({
          verificationStatus: outcome,
          lastStep: (outcome === 'PMDC Verified' || outcome === 'Supervised Student') ? '/doctor/home' : '/doctor/verification-status'
        });

        // Automatically navigate approved providers to doctor home after 1 second
        if (outcome === 'PMDC Verified' || outcome === 'Supervised Student') {
          navigate('/doctor/home', { replace: true });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status, journey, snap.verificationOutcome, navigate]);

  const handleEditApplication = () => {
    const editRoute = JOURNEY_ROUTES[journey] || '/onboarding/consultant';
    navigate(editRoute, { replace: true });
  };

  const handleProceedHome = () => {
    navigate('/doctor/home', { replace: true });
  };

  return (
    <MobileAppShell>
      <div className="flex flex-col h-full bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="px-5 py-4 shrink-0 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SehatSaharaLogo variant="lightBackground" className="w-8 h-8" />
            <span className="font-bold text-slate-800 text-[15px]">Verification Status</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            Prototype Portal
          </span>
        </header>

        {/* Scrollable Content */}
        <div className="app-scroll flex-1 px-5 py-6">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 font-extrabold text-xl flex items-center justify-center shrink-0">
                {identity.name.replace('Dr.', '').trim().charAt(0) || 'P'}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-slate-900 truncate">{identity.name}</h2>
                <p className="text-xs font-medium text-slate-500">{identity.label || 'Healthcare Provider'}</p>
                <p className="text-xs text-slate-400 mt-0.5">{snap.profile?.phone || '0300 0000000'}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Journey:</span>
                <span className="font-semibold text-slate-700 capitalize">{journey.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">City / Location:</span>
                <span className="font-semibold text-slate-700">{snap.profile?.city || 'Karachi'}</span>
              </div>
            </div>
          </div>

          {/* Status Display Card */}
          {(status === 'Verification Pending' || isProcessing) && (
            <div className="bg-white rounded-2xl border border-amber-200 p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 animate-pulse">
                <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Application Under Review</h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Your application has been submitted and is currently being verified against official registers.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-xs font-medium border border-amber-200">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Processing verification outcome (approx 1s)...
              </div>
            </div>
          )}

          {(status === 'PMDC Verified' || status === 'Supervised Student') && !isProcessing && (
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Verification Approved!</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                {status === 'Supervised Student' 
                  ? 'Your student credentials are benchmarked for supervised clinical learning.' 
                  : 'Your credentials have been verified. You can now access your Provider workspace.'}
              </p>
              <Button onClick={handleProceedHome} variant="primary" fullWidth className="flex items-center justify-center gap-2">
                Open Provider Home <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {status === 'Needs Changes' && !isProcessing && (
            <div className="bg-white rounded-2xl border border-orange-200 p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                <AlertTriangle className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Action Required: Needs Changes</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Some details in your profile or submitted PMDC document require clarification before approval.
              </p>
              <Button onClick={handleEditApplication} variant="primary" fullWidth className="flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit Application
              </Button>
            </div>
          )}

          {(status === 'Restricted' || status === 'Registration Expired') && !isProcessing && (
            <div className="bg-white rounded-2xl border border-red-200 p-6 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <ShieldAlert className="w-9 h-9" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Account Restricted</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Your medical registration is flagged as expired or restricted. Please contact support.
              </p>
              <Button onClick={handleEditApplication} variant="secondary" fullWidth className="!text-slate-700">
                Update Information
              </Button>
            </div>
          )}
        </div>
      </div>
    </MobileAppShell>
  );
};
