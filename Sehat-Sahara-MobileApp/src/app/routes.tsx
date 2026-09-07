import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DevMobileShellPreview } from './DevMobileShellPreview';
import {
  Splash,
  LanguageSelection,
  RoleSelection,
  Intro,
  AuthEntry,
  VerifyOTP,
  AuthProfile,
  CareScopeSetup,
  DependentsSetup,
  EmergencySetup,
  PreferencesSetup,
  ReviewSetup,
  ProviderTypeSelection,
  DoctorOnboarding,
  StudentOnboarding,
  FresherOnboarding,
  ConsultantOnboarding
} from '../features/onboarding';
import {
  DoctorSignIn,
  DoctorAppointmentDetail,
  DoctorConsultation,
  DoctorAINote,
  DoctorPrescription,
  DoctorQueue,
  DoctorHomeVisit
} from '../features/doctor';
import {
  ProviderHome,
  ProviderAppointments,
  ProviderOpportunities,
  ProviderCommunity,
  ProviderProfile
} from '../features/provider/roots';
import { ProviderNotifications } from '../features/provider/roots/ProviderNotifications';
import { ProviderNoticeFallback } from '../features/provider/inner/ProviderNoticeFallback';
import { ProviderVerificationStatus } from '../features/provider/ProviderVerificationStatus';
import {
  CareRecipients,
  ProviderAICopilot,
  ProviderPostOpportunity,
  ProviderOpportunityDetail,
  ProviderOpportunityApplicants
} from '../features/provider/inner';
import {
  PatientHome,
  PatientTriage, TriageResult, DoctorSearch, EmergencySOS, SOSResult,
  PatientConsultation,
  DoctorProfile,
  BookingFlow,
  BookingConfirmation,
  AppointmentDetail,
  LiveQueue,
  NotificationsList,
  MedicalRecords,
  PrescriptionDetail,
  RecordDetail,
  FolderDetail,
  UploadRecord,
  ShareRecord,
  ShareCreated,
  ManageShares,
  PublicRecordView,
  CareProfileDetail,
  CareProfileAdd,
  CareProfileEdit,
  ProfileRoot,
  CareProfiles,
  Settings,
  PersonalInfo,
  EmergencySetupList,
  EmergencySetupDetail,
  HelpSupport,
  About,
  PrivacyContact,
  MedicineReminder,
  AddMedicine,
  CommunityHome,
  BloodRequests,
  CreateBloodRequest,
  BloodRequestDetail,
  BloodDonorPledge,
  FindingDonors,
  DonorResponse,
  DonorCoordination,
  DonorChat,
  ThingsSharing,
  SharedItemDetail,
  ShareItem,
  BorrowRequest,
  ContextualChat,


  CareHub,
  InClinicList,
  InClinicBooking,
  OnlineConsultList,
  OnlineConsultBooking,
  HomeVisitList,
  HomeVisitBooking,
  HomeVisitTracker,
  OpenCareRequest,
  FacilityList,
  FacilityDetail,
  TokenFacilityList,
  TokenIssue,
  HomeSupportList,
  HomeSupportBooking,
  MyCare,
  Checkout
} from '../features/patient';
// Imported via main bundle
import { PATIENT_ROUTES } from '../constants/routes';
import { OnboardingStore } from '../services/OnboardingStore';

export { PATIENT_ROUTES };

const InitialRedirect = () => {
  return <Navigate to="/welcome" replace />;
};

const RequirePatient = () => {
  const snap = OnboardingStore.getSnapshot();
  if (!snap.isAuthenticated || !snap.onboardingComplete) {
    return <Navigate to="/welcome" replace />;
  }
  const role = snap.role?.toLowerCase() || '';
  if (role === 'doctor' || role === 'provider' || role === 'student') {
    return <Navigate to="/doctor/home" replace />;
  }
  return <Outlet />;
};

const RequireProvider = () => {
  const snap = OnboardingStore.getSnapshot();
  if (!snap.isAuthenticated || !snap.onboardingComplete) return <Navigate to="/welcome" replace />;
  const role = snap.role?.toLowerCase() || '';
  if (role !== 'doctor' && role !== 'provider' && role !== 'student') {
    return <Navigate to={PATIENT_ROUTES.HOME} replace />;
  }
  return <Outlet />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ── Onboarding & Auth ── */}
      <Route path="/welcome" element={<Splash />} />
      <Route path="/onboarding/language" element={<LanguageSelection />} />
      <Route path="/onboarding/role" element={<RoleSelection />} />
      <Route path="/onboarding/provider-type" element={<ProviderTypeSelection />} />
      <Route path="/onboarding/doctor" element={<DoctorOnboarding />} />
      <Route path="/onboarding/student" element={<StudentOnboarding />} />
      <Route path="/onboarding/fresher" element={<FresherOnboarding />} />
      <Route path="/onboarding/consultant" element={<ConsultantOnboarding />} />
      <Route path="/onboarding/intro" element={<Intro />} />
      <Route path="/auth/entry" element={<AuthEntry />} />
      <Route path="/auth/verify" element={<VerifyOTP />} />
      <Route path="/auth/profile" element={<AuthProfile />} />
      <Route path="/auth/care-scope" element={<CareScopeSetup />} />
      <Route path="/auth/dependents" element={<DependentsSetup />} />
      <Route path="/auth/emergency" element={<EmergencySetup />} />
      <Route path="/auth/preferences" element={<PreferencesSetup />} />
      <Route path="/auth/review" element={<ReviewSetup />} />

      {/* ── Implemented Patient Screens ── */}
      <Route element={<RequirePatient />}>
        <Route path={PATIENT_ROUTES.HOME}        element={<PatientHome />} />
        <Route path="/patient/care"                  element={<CareHub />} />
        <Route path="/patient/care/my-care"          element={<MyCare />} />
        <Route path="/patient/care/in-clinic"        element={<InClinicList />} />
        <Route path="/patient/care/in-clinic/:id" element={<InClinicBooking />} />
        <Route path="/patient/care/online"       element={<OnlineConsultList />} />
        <Route path="/patient/care/online/:id"   element={<OnlineConsultBooking />} />
        <Route path="/patient/care/home-visit"       element={<HomeVisitList />} />
        <Route path="/patient/care/home-visit/:id"   element={<HomeVisitBooking />} />
        <Route path="/patient/care/home-visit/tracker/:id" element={<HomeVisitTracker />} />
        <Route path="/patient/care/open-request" element={<OpenCareRequest />} />
        <Route path="/patient/care/facilities"       element={<FacilityList />} />
        <Route path="/patient/care/facilities/:id"   element={<FacilityDetail />} />
        <Route path="/patient/care/token"            element={<TokenFacilityList />} />
        <Route path="/patient/care/token/:id"        element={<TokenIssue />} />
        <Route path="/patient/care/home-support"       element={<HomeSupportList />} />
        <Route path="/patient/care/home-support/:id"   element={<HomeSupportBooking />} />
        <Route path="/patient/sos"               element={<EmergencySOS />} />
        <Route path="/patient/sos/result"        element={<SOSResult />} />
        <Route path={PATIENT_ROUTES.TRIAGE}      element={<PatientTriage />} />
        <Route path={PATIENT_ROUTES.TRIAGE_RESULT} element={<TriageResult />} />
        <Route path={PATIENT_ROUTES.DOCTORS}     element={<DoctorSearch />} />
        <Route path={PATIENT_ROUTES.DOCTOR_DETAIL} element={<DoctorProfile />} />
        <Route path={PATIENT_ROUTES.BOOKING}     element={<BookingFlow />} />
        <Route path="/patient/care/doctors/:id/book" element={<BookingFlow />} />
        <Route path="/patient/checkout"          element={<Checkout />} />
        <Route path={PATIENT_ROUTES.BOOKING_CONFIRM} element={<BookingConfirmation />} />
        <Route path={PATIENT_ROUTES.APPOINTMENT_DETAIL} element={<AppointmentDetail />} />
        <Route path={PATIENT_ROUTES.QUEUE}       element={<LiveQueue />} />
        <Route path="/patient/consultation/:id"  element={<PatientConsultation />} />
        <Route path={PATIENT_ROUTES.NOTIFICATIONS} element={<NotificationsList />} />
        <Route path={PATIENT_ROUTES.RECORDS}     element={<MedicalRecords />} />
        <Route path="/patient/records/folder/:folderId" element={<FolderDetail />} />
        <Route path="/patient/records/upload" element={<UploadRecord />} />
        <Route path={PATIENT_ROUTES.RECORD_DETAIL} element={<RecordDetail />} />
        <Route path={PATIENT_ROUTES.RECORD_SHARE} element={<ShareRecord />} />
        <Route path="/patient/records/share" element={<ShareRecord />} />
        <Route path="/patient/records/share/:token/created" element={<ShareCreated />} />
        <Route path="/patient/records/shares" element={<ManageShares />} />
        <Route path="/shared/records/:token" element={<PublicRecordView />} />
        <Route path={PATIENT_ROUTES.PRESCRIPTION_DETAIL} element={<PrescriptionDetail />} />
        <Route path={PATIENT_ROUTES.MEDICINES}   element={<MedicineReminder />} />
        <Route path="/patient/medicines/add" element={<AddMedicine />} />

        {/* ── Community Flow ── */}
        <Route path={PATIENT_ROUTES.COMMUNITY} element={<CommunityHome />} />
        <Route path={PATIENT_ROUTES.COMMUNITY_BLOOD} element={<BloodRequests />} />
        <Route path={PATIENT_ROUTES.COMMUNITY_BLOOD_DETAIL} element={<BloodRequestDetail />} />
        <Route path={PATIENT_ROUTES.COMMUNITY_BLOOD_CREATE} element={<CreateBloodRequest />} />
        <Route path="/patient/community/blood/pledge" element={<BloodDonorPledge />} />
        <Route path="/patient/community/blood/finding" element={<FindingDonors />} />
        <Route path="/patient/community/blood/response" element={<DonorResponse />} />
        <Route path="/patient/community/blood/coordination/:donorId" element={<DonorCoordination />} />
        <Route path="/patient/community/blood/chat/:donorId" element={<DonorChat />} />
        <Route path={PATIENT_ROUTES.COMMUNITY_THINGS} element={<ThingsSharing />} />
        <Route path={PATIENT_ROUTES.COMMUNITY_THINGS_DETAIL} element={<SharedItemDetail />} />
        <Route path="/patient/community/things/add" element={<ShareItem />} />
        <Route path="/patient/community/things/borrow" element={<BorrowRequest />} />
        <Route path="/patient/community/chat" element={<ContextualChat />} />

        {/* ── Profile Flow ── */}
        <Route path={PATIENT_ROUTES.PROFILE} element={<ProfileRoot />} />
        <Route path="/patient/profile/personal" element={<PersonalInfo />} />
        <Route path="/patient/profile/household" element={<CareProfiles />} />
        <Route path="/patient/profile/household/add" element={<CareProfileAdd />} />
        <Route path="/patient/profile/household/:id" element={<CareProfileDetail />} />
        <Route path="/patient/profile/household/:id/edit" element={<CareProfileEdit />} />
        <Route path="/patient/profile/sos-setup" element={<EmergencySetupList />} />
        <Route path="/patient/profile/sos-setup/:id" element={<EmergencySetupDetail />} />
        <Route path="/patient/profile/settings" element={<Settings />} />
        <Route path="/patient/profile/help" element={<HelpSupport />} />
        <Route path="/patient/profile/about" element={<About />} />
        <Route path="/patient/profile/privacy" element={<PrivacyContact />} />
      </Route>

      {/* ── Development Shell (preserved, not in patient nav) ── */}
      <Route path={PATIENT_ROUTES.DEV_SHELL}   element={<DevMobileShellPreview />} />

      {/* ── Doctor Flow ── */}
      <Route path="/doctor" element={<Navigate to="/doctor/home" replace />} />
      <Route path="/doctor/signin" element={<DoctorSignIn />} />
      <Route path="/doctor/verification-status" element={<ProviderVerificationStatus />} />
      <Route element={<RequireProvider />}>
        <Route path="/doctor/home" element={<ProviderHome />} />
        <Route path="/doctor/notifications" element={<ProviderNotifications />} />
        <Route path="/doctor/notice" element={<ProviderNoticeFallback />} />
        <Route path="/doctor/queue" element={<DoctorQueue />} />
        <Route path="/doctor/home-visit/:id" element={<DoctorHomeVisit />} />
        <Route path="/doctor/appointments" element={<ProviderAppointments />} />
        <Route path="/doctor/appointments/:id" element={<DoctorAppointmentDetail />} />
        <Route path="/doctor/opportunities" element={<ProviderOpportunities />} />
        <Route path="/doctor/opportunities/post" element={<ProviderPostOpportunity />} />
        <Route path="/doctor/opportunities/:id" element={<ProviderOpportunityDetail />} />
        <Route path="/doctor/opportunities/:id/applicants" element={<ProviderOpportunityApplicants />} />
        <Route path="/doctor/community" element={<ProviderCommunity />} />
        <Route path="/doctor/community/blood" element={<BloodRequests />} />
        <Route path="/doctor/community/blood/create" element={<CreateBloodRequest />} />
        <Route path="/doctor/community/blood/pledge" element={<BloodDonorPledge />} />
        <Route path="/doctor/community/blood/finding" element={<FindingDonors />} />
        <Route path="/doctor/community/blood/response" element={<DonorResponse />} />
        <Route path="/doctor/community/blood/:id" element={<BloodRequestDetail />} />
        <Route path="/doctor/community/blood/coordination/:donorId" element={<DonorCoordination />} />
        <Route path="/doctor/community/blood/chat/:donorId" element={<DonorChat />} />
        <Route path="/doctor/community/things" element={<ThingsSharing />} />
        <Route path="/doctor/community/things/:id" element={<SharedItemDetail />} />
        <Route path="/doctor/community/things/borrow" element={<BorrowRequest />} />
        <Route path="/doctor/community/chat" element={<ContextualChat />} />
        <Route path="/doctor/consultation/:id" element={<DoctorConsultation />} />
        <Route path="/doctor/consultation/:id/ai-note" element={<DoctorAINote />} />
        <Route path="/doctor/consultation/:id/prescription" element={<DoctorPrescription />} />
        <Route path="/doctor/patients" element={<CareRecipients />} />
        <Route path="/doctor/profile" element={<ProviderProfile />} />
        <Route path="/doctor/ai-copilot" element={<ProviderAICopilot />} />
      </Route>

      {/* ── Root & Aliases → Onboarding/Home ── */}
      <Route path="/"  element={<InitialRedirect />} />
      <Route path="/home" element={<Navigate to={PATIENT_ROUTES.HOME} replace />} />

      {/* ── Catch-all → Onboarding ── */}
      <Route path="*"  element={<InitialRedirect />} />
    </Routes>
  );
};
