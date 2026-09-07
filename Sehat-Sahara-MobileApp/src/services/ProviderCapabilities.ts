import { OnboardingStore } from './OnboardingStore';

export type ProviderJourney = 'medical_student' | 'fresh_doctor' | 'practicing_doctor' | 'consultant_specialist' | '';
export type ProviderGroup = 'student_fresher' | 'professional' | '';
export type VerificationStatus = 'Supervised Student' | 'Verification Pending' | 'PMDC Verified' | 'Needs Changes' | 'Restricted' | 'Registration Expired';

export interface ProviderCapabilities {
  canViewStudentOpportunities: boolean;
  canUseLogbook: boolean;
  canUseOSCE: boolean;
  canApplySupervisedPlacements: boolean;
  canConsultIndependently: boolean;
  canAcceptHomeVisit: boolean;
  canPrescribe: boolean;
  canApplyUnsupervisedLocum: boolean;

  canViewEarlyCareerJobs: boolean;
  canAcceptBasicConsultation: boolean;
  canPitchCareRequests: boolean;
  canAcceptEligibleHomeVisit: boolean;
  canApplyMOShift: boolean;
  canAcceptSpecialistWork: boolean;

  canManageAppointments: boolean;
  canConfigureClinicVideoHomeModes: boolean;
  canUseBasicCopilot: boolean;
  canViewAuthorizedRecords: boolean;
  canApplyProfessionalOpportunities: boolean;

  canManageSpecialistAppointments: boolean;
  canUseAdvancedCopilot: boolean;
  canSignPrototypePrescription: boolean;
  canApplySpecialistOpportunities: boolean;
  canMentor: boolean;
}

export const getProviderJourney = (): ProviderJourney => {
  const snap = OnboardingStore.getSnapshot();
  return (snap.providerJourney as ProviderJourney) || '';
};

export const getProviderGroup = (journey: ProviderJourney = getProviderJourney()): ProviderGroup => {
  if (journey === 'medical_student' || journey === 'fresh_doctor') return 'student_fresher';
  if (journey === 'practicing_doctor' || journey === 'consultant_specialist') return 'professional';
  return '';
};

export const getProviderCapabilities = (journey: ProviderJourney = getProviderJourney(), verification: VerificationStatus = 'PMDC Verified'): ProviderCapabilities => {
  const isVerified = verification === 'PMDC Verified';
  const isStudent = journey === 'medical_student';
  const isFresh = journey === 'fresh_doctor';
  const isPracticing = journey === 'practicing_doctor';
  const isConsultant = journey === 'consultant_specialist';

  return {
    canViewStudentOpportunities: isStudent,
    canUseLogbook: isStudent,
    canUseOSCE: isStudent,
    canApplySupervisedPlacements: isStudent,
    canConsultIndependently: false, // Students can't consult independently
    canAcceptHomeVisit: false,
    canPrescribe: (isFresh || isPracticing || isConsultant) && isVerified,
    canApplyUnsupervisedLocum: false,

    canViewEarlyCareerJobs: isFresh || isStudent,
    canAcceptBasicConsultation: isFresh && isVerified,
    canPitchCareRequests: isFresh && isVerified,
    canAcceptEligibleHomeVisit: isFresh && isVerified,
    canApplyMOShift: isFresh && isVerified,
    canAcceptSpecialistWork: isConsultant,

    canManageAppointments: (isPracticing || isConsultant) && isVerified,
    canConfigureClinicVideoHomeModes: isPracticing || isConsultant,
    canUseBasicCopilot: isPracticing || isFresh, // Or consultant too, but they use advanced
    canViewAuthorizedRecords: isPracticing || isConsultant || isFresh,
    canApplyProfessionalOpportunities: isPracticing || isConsultant,

    canManageSpecialistAppointments: isConsultant && isVerified,
    canUseAdvancedCopilot: isConsultant,
    canSignPrototypePrescription: isConsultant,
    canApplySpecialistOpportunities: isConsultant,
    canMentor: isConsultant,
  };
};

export const getProviderDisplayIdentity = (journey: ProviderJourney = getProviderJourney()) => {
  const isStudent = journey === 'medical_student';
  const snap = OnboardingStore.getSnapshot();
  const rawName = snap.profile?.name || (isStudent ? 'Sara Ahmed' : 'Dr. Hamza Ahmed');
  
  let finalName = rawName;
  if (!isStudent && !finalName.toLowerCase().startsWith('dr.')) {
    finalName = `Dr. ${finalName}`;
  }

  let label = '';
  let badge: VerificationStatus = 'PMDC Verified';

  switch (journey) {
    case 'medical_student':
      label = 'Medical Student';
      badge = 'Supervised Student';
      break;
    case 'fresh_doctor':
      label = 'Fresh Doctor / GP / MO';
      badge = 'PMDC Verified';
      break;
    case 'practicing_doctor':
      label = 'Practicing Doctor / General Physician';
      badge = 'PMDC Verified';
      break;
    case 'consultant_specialist':
      label = 'Consultant / Specialist';
      badge = 'PMDC Verified';
      break;
  }

  return { name: finalName, label, badge, avatarUrl: (snap.profile as any)?.avatarUrl };
};
