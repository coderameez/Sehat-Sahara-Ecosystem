// ───────────── Data Models ─────────────

export type FacilityType = 'HOSPITAL' | 'CLINIC' | 'POLY_CLINIC';
export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';

export type ConsentStatus = 'Active' | 'Not Requested' | 'Expired';

export type JobStatus = 'Active' | 'Closed' | 'Draft';
export type ApplicantStatus = 'Eligible' | 'Review' | 'Rejected' | 'Under Review' | 'Accepted';

export interface Job {
  id: string; // e.g. J-2025-041
  title: string;
  providerRole: string; // e.g. Provider, Visiting Consultant
  specialty: string;
  shiftDate: string; // e.g. 20 May 2025 (Evening)
  time: string; // e.g. 2:00 PM - 10:00 PM
  pay: string; // e.g. PKR 120,000 /month
  applicationsCount: number;
  newApplicationsCount: number;
  status: JobStatus;
  closesOn: string; // e.g. 30 May 2025
}

export interface Applicant {
  id: string; // e.g. APP-HR-2025-00472
  jobId: string;
  name: string;
  qualifications: string; // e.g. MBBS, FCPS (Medicine)
  pmdcNumber: string;
  role: string;
  shift: string;
  verification: 'Verified' | 'PMDC Verified' | 'Pending';
  specialtyMatch: 'Good Match' | 'Excellent Match' | 'Partial Match' | 'Mismatch';
  experienceYears: string; // e.g. 2.8 years
  experienceDetails: string; // e.g. (House Job + 1.8)
  appliedDate: string; // e.g. 12 May 2025
  appliedTime: string; // e.g. 10:24 AM
  status: ApplicantStatus;
  email?: string;
  phone?: string;
  address?: string;
}
export type BookingStatus = 'Scheduled' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED' | 'IN_PROGRESS';
export type TokenStatus = 'Waiting' | 'Now Serving' | 'Completed' | 'No-show' | 'Upcoming';
export type QueueTokenStatus = 'WAITING' | 'CALLED' | 'COMPLETED';

export interface Patient {
  id: string;
  cnic: string;
  name: string;
  gender: string;
  age: number;
  dob: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  lastVisit: string;
  assignedDoctor: string;
  assignedDoctorId: string;
  consentStatus: ConsentStatus;
}



export type CareType = 'IN_PERSON' | 'VIDEO' | 'HOME_VISIT';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  logoUrl: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  departments: string[];
  services: string[];
  doctors: string[];
  hours: string;
  tokenSupport: boolean;
}

export interface QueueToken {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientCnic?: string;
  patientAgeGender?: string;
  tokenNumber: string;
  departmentId: string;
  doctorId?: string;
  doctorName?: string;
  status: QueueTokenStatus | TokenStatus;
  issuedAt: string;
  time?: string;
  waitTime?: string;
}

export interface Booking {
  id: string; // e.g. BK-2025-05124
  patientId: string;
  patientName: string;
  patientPhone?: string; // added for H-05
  providerId: string;
  providerName: string;
  facilityId: string;
  careType: CareType;
  type?: string; // added for H-05 (e.g. Consultation)
  date?: string; // added for H-05
  time?: string; // added for H-05
  scheduledDate: string;
  scheduledTime: string;
  checkInTime?: string; // added for H-05
  status: BookingStatus;
  fee: number;
  department: string;
  notes?: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  providerType: string;
  verificationStatus: VerificationStatus;
  avatar?: string;
  pmdcId?: string;
  email?: string;
  phone?: string;
  address?: string;
  linkedOn?: string;
  schedule?: {
    days: string;
    hours: string;
    fullSchedule?: { day: string; time: string }[];
  };
  todayBookings?: number;
  nextSlot?: string;
  status?: 'Active' | 'Away' | 'Inactive';
}

export interface Schedule {
  id: string;
  providerId: string;
  providerName: string;
  specialty: string;
  facilityId: string;
  branchId?: string; // Optional for clinic, required for hospital
  dayOfWeek?: string; // 'Monday', 'Tuesday', etc. for recurring
  specificDate?: string; // 'YYYY-MM-DD' for one-off
  startTime: string; // '09:00 AM'
  endTime: string; // '05:00 PM'
  slotDurationMinutes: number; // e.g., 15, 20, 30
  status: 'Confirmed' | 'On Leave' | 'Cancelled';
}

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  totalPatients: number;
  totalDoctors: number;
  revenue: number;
  pendingBookings: number;
}

// ───────────── Navigation ─────────────

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}
