import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardShell } from './components/layout/DashboardShell';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { BookingsPage } from './pages/BookingsPage';
import { QueuePage } from './pages/QueuePage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { HiringPage } from './pages/hiring/HiringPage';
import { CreateJobPage } from './pages/hiring/CreateJobPage';
import { ApplicantsPage } from './pages/hiring/ApplicantsPage';
import { CandidateDetailPage } from './pages/hiring/CandidateDetailPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { ServicesPage } from './pages/ServicesPage';
import { SchedulePage } from './pages/SchedulePage';
import { BillingPage } from './pages/BillingPage';
import { ClinicProfilePage } from './pages/ClinicProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardShell /></ProtectedRoute>}>
          {/* H-01, H-02, H-03: Dashboards */}
          <Route index element={<DashboardPage />} />

          {/* H-04: Doctors */}
          <Route path="/doctors" element={<DoctorsPage />} />

          {/* H-05: Bookings */}
          <Route path="/bookings" element={<BookingsPage />} />

          {/* H-06: Live Token */}
          <Route path="/queue" element={<QueuePage />} />

          {/* H-07: Patients List */}
          <Route path="/patients" element={<PatientsPage />} />
          
          {/* H-08 & H-09: Patient Detail */}
          <Route path="/patients/:id" element={<PatientDetailPage />} />

          {/* H-10, H-11, H-12, H-13: Hiring Flow */}
          <Route path="/hiring" element={<HiringPage />} />
          <Route path="/hiring/new" element={<CreateJobPage />} />
          <Route path="/hiring/:jobId/applicants" element={<ApplicantsPage />} />
          <Route path="/hiring/:jobId/applicants/:applicantId" element={<CandidateDetailPage />} />

          {/* Support Modules */}
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/clinic-profile" element={<ClinicProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
