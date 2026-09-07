import type { Facility, Booking, Provider, DashboardStats, NavGroup, Patient, QueueToken, Schedule } from '../types';

// ───────────── Facility & Branch ─────────────

export const hospitalFacility: Facility = {
  id: 'fac-hospital',
  name: 'Sehat Sahara Hospital',
  type: 'HOSPITAL',
  logoUrl: '/brand/sehat-sahara-logo-transparent.png',
  branches: [
    {
      id: 'br-hospital-01',
      name: 'Main Branch',
      type: 'HOSPITAL',
      address: 'Gulberg III, Lahore, Punjab',
      departments: ['General Medicine', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Gynecology', 'Dermatology'],
      services: ['OPD', 'Lab Tests', 'Pharmacy', 'Emergency', 'Surgery'],
      doctors: ['doc-001', 'doc-002', 'doc-003', 'doc-004', 'doc-005', 'doc-006', 'doc-007', 'doc-008'],
      hours: '24/7',
      tokenSupport: true,
    },
    {
      id: 'br-hospital-02',
      name: 'North Branch',
      type: 'HOSPITAL',
      address: 'DHA Phase 6, Lahore',
      departments: ['General Medicine', 'Pediatrics', 'Cardiology'],
      services: ['OPD', 'Lab Tests', 'Pharmacy'],
      doctors: ['doc-003', 'doc-004', 'doc-005', 'doc-006'],
      hours: '24/7',
      tokenSupport: true,
    },
    {
      id: 'br-hospital-03',
      name: 'City Branch',
      type: 'HOSPITAL',
      address: 'Johar Town, Lahore',
      departments: ['General Medicine', 'Orthopedics', 'Dermatology'],
      services: ['OPD', 'Emergency', 'Surgery'],
      doctors: ['doc-001', 'doc-002', 'doc-007', 'doc-008'],
      hours: 'Mon–Sat 9:00 AM – 10:00 PM',
      tokenSupport: true,
    },
  ],
};

export const clinicFacility: Facility = {
  id: 'fac-clinic',
  name: 'Sehat Sahara Medical Clinic',
  type: 'CLINIC',
  logoUrl: '/brand/sehat-sahara-logo-transparent.png',
  branches: [
    {
      id: 'br-clinic-01',
      name: 'Family Care Clinic',
      type: 'CLINIC',
      address: '45-A, Main Boulevard, Gulberg III, Lahore',
      departments: ['General Medicine', 'Pediatrics'],
      services: ['OPD', 'Vaccination'],
      doctors: ['doc-001', 'doc-002'],
      hours: 'Mon–Sat 9:00 AM – 9:00 PM',
      tokenSupport: true,
    }
  ]
};

export const facilities = [hospitalFacility, clinicFacility];

// ───────────── Patients ─────────────

export const patients: Patient[] = [
  {
    id: 'pt-001',
    cnic: '35202-1234567-1',
    name: 'Muhammad Imran',
    gender: 'Male',
    age: 45,
    dob: '15 Mar 1980',
    phone: '0300-1234567',
    email: 'imran@example.com',
    address: 'Model Town, Lahore',
    bloodGroup: 'B+',
    lastVisit: '10 May 2025, 09:30 AM',
    assignedDoctor: 'Dr. Ahmed Raza',
    assignedDoctorId: 'doc-001',
    consentStatus: 'Active',
  },
  {
    id: 'pt-002',
    cnic: '35202-8899001-7',
    name: 'Aisha Bibi',
    gender: 'Female',
    age: 32,
    dob: '22 Jan 1993',
    phone: '0333-9876543',
    email: 'aisha.b@example.com',
    address: 'DHA Phase 5, Lahore',
    bloodGroup: 'O+',
    lastVisit: '15 Apr 2025, 11:00 AM',
    assignedDoctor: 'Dr. Fatima Noor',
    assignedDoctorId: 'doc-002',
    consentStatus: 'Not Requested',
  },
  {
    id: 'pt-003',
    cnic: '42301-1122334-5',
    name: 'Ali Hassan',
    gender: 'Male',
    age: 28,
    dob: '05 Nov 1997',
    phone: '0321-4567890',
    email: 'ali.hassan@example.com',
    address: 'Gulberg III, Lahore',
    bloodGroup: 'A-',
    lastVisit: '01 May 2025, 02:15 PM',
    assignedDoctor: 'Dr. Hassan Ali',
    assignedDoctorId: 'doc-003',
    consentStatus: 'Expired',
  },
  {
    id: 'pt-004',
    cnic: '35202-5566778-9',
    name: 'Zainab Fatima',
    gender: 'Female',
    age: 21,
    dob: '10 Aug 2004',
    phone: '0345-1234567',
    email: 'zainab.f@example.com',
    address: 'Johar Town, Lahore',
    bloodGroup: 'AB+',
    lastVisit: '20 Mar 2025, 10:45 AM',
    assignedDoctor: 'Dr. Sana Malik',
    assignedDoctorId: 'doc-004',
    consentStatus: 'Active',
  },
  {
    id: 'pt-005',
    cnic: '35202-9988776-3',
    name: 'Kamran Sheikh',
    gender: 'Male',
    age: 55,
    dob: '12 Feb 1970',
    phone: '0301-7654321',
    email: 'kamran.s@example.com',
    address: 'Bahria Town, Lahore',
    bloodGroup: 'B-',
    lastVisit: '25 Apr 2025, 04:30 PM',
    assignedDoctor: 'Dr. Ahmed Raza',
    assignedDoctorId: 'doc-001',
    consentStatus: 'Active',
  }
];

// ───────────── Providers (Doctors) ─────────────

export const providers: Provider[] = [
  {
    id: 'doc-001',
    name: 'Dr. Ahmed Raza',
    specialty: 'General Medicine',
    qualification: 'MBBS, FCPS',
    providerType: 'Doctor',
    verificationStatus: 'VERIFIED',
    pmdcId: '12485-P',
    email: 'ahmed.raza@sehatsahara.com',
    phone: '+92 300 1234567',
    address: 'Gulberg III, Lahore',
    linkedOn: '24 Jan 2024',
    schedule: {
      days: 'Mon - Fri',
      hours: '09:00 AM - 05:00 PM',
      fullSchedule: [
        { day: 'Monday', time: '09:00 AM - 05:00 PM' },
        { day: 'Tuesday', time: '09:00 AM - 05:00 PM' },
        { day: 'Wednesday', time: '09:00 AM - 05:00 PM' },
        { day: 'Thursday', time: '09:00 AM - 05:00 PM' },
        { day: 'Friday', time: '09:00 AM - 05:00 PM' },
        { day: 'Saturday', time: 'Off' },
        { day: 'Sunday', time: 'Off' },
      ],
    },
    todayBookings: 14,
    nextSlot: '11:00 AM',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    id: 'doc-002',
    name: 'Dr. Fatima Noor',
    specialty: 'Gynecology',
    qualification: 'MBBS, MCPS, FCPS',
    providerType: 'Doctor',
    verificationStatus: 'VERIFIED',
    pmdcId: '84920-P',
    email: 'fatima.noor@sehatsahara.com',
    phone: '+92 333 9876543',
    address: 'DHA Phase 5, Lahore',
    linkedOn: '12 Feb 2024',
    schedule: {
      days: 'Mon - Thu',
      hours: '10:00 AM - 02:00 PM',
      fullSchedule: [
        { day: 'Monday', time: '10:00 AM - 02:00 PM' },
        { day: 'Tuesday', time: '10:00 AM - 02:00 PM' },
        { day: 'Wednesday', time: '10:00 AM - 02:00 PM' },
        { day: 'Thursday', time: '10:00 AM - 02:00 PM' },
        { day: 'Friday', time: 'Off' },
        { day: 'Saturday', time: 'Off' },
        { day: 'Sunday', time: 'Off' },
      ],
    },
    todayBookings: 8,
    nextSlot: '12:30 PM',
    status: 'Away',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: 'doc-003',
    name: 'Dr. Hassan Ali',
    specialty: 'Pediatrics',
    qualification: 'MBBS, DCH',
    providerType: 'Doctor',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'doc-004',
    name: 'Dr. Sana Malik',
    specialty: 'Dermatology',
    qualification: 'MBBS, FCPS Dermatology',
    providerType: 'Doctor',
    verificationStatus: 'PENDING',
  },
  {
    id: 'doc-005',
    name: 'Dr. Usman Tariq',
    specialty: 'General Medicine',
    qualification: 'MBBS',
    providerType: 'Doctor',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'doc-006',
    name: 'Dr. Ayesha Khan',
    specialty: 'Orthopedics',
    qualification: 'MBBS, MS Ortho',
    providerType: 'Doctor',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'doc-007',
    name: 'Dr. Bilal Saeed',
    specialty: 'Cardiology',
    qualification: 'MBBS, FCPS Cardiology',
    providerType: 'Doctor',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'doc-008',
    name: 'Dr. Maria Zafar',
    specialty: 'Pediatrics',
    qualification: 'MBBS, FCPS Pediatrics',
    providerType: 'Doctor',
    verificationStatus: 'VERIFIED',
  },
];

// ───────────── Today's Bookings ─────────────

export const todayBookings: Booking[] = [
  {
    id: 'BK-2025-05124',
    patientId: 'pt-001',
    patientName: 'Muhammad Imran',
    patientPhone: '0301-1234567',
    providerId: 'doc-001',
    providerName: 'Dr. Ahmed Raza',
    facilityId: 'fac-001',
    careType: 'IN_PERSON',
    type: 'Consultation',
    date: '24 May 2025',
    time: '09:30 AM',
    scheduledDate: '2025-05-24',
    scheduledTime: '09:30 AM',
    checkInTime: '09:20 AM',
    status: 'Checked In',
    fee: 2000,
    department: 'General Medicine',
    notes: 'Patient advised dietary control and medicines for 7 days.'
  },
  {
    id: 'BK-2025-05123',
    patientId: 'pt-002',
    patientName: 'Ayesha Khan',
    patientPhone: '0312-9876543',
    providerId: 'doc-002',
    providerName: 'Dr. Fatima Noor',
    facilityId: 'fac-001',
    careType: 'IN_PERSON',
    type: 'Consultation',
    date: '24 May 2025',
    time: '10:00 AM',
    scheduledDate: '2025-05-24',
    scheduledTime: '10:00 AM',
    status: 'Scheduled',
    fee: 2500,
    department: 'Gynecology',
  },
  {
    id: 'BK-2025-05122',
    patientId: 'pt-003',
    patientName: 'Raza Mehboob',
    patientPhone: '0321-4567890',
    providerId: 'doc-005',
    providerName: 'Dr. Usman Tariq',
    facilityId: 'fac-001',
    careType: 'IN_PERSON',
    type: 'Follow-up',
    date: '24 May 2025',
    time: '10:30 AM',
    scheduledDate: '2025-05-24',
    scheduledTime: '10:30 AM',
    status: 'Scheduled',
    fee: 1500,
    department: 'General Medicine',
  },
  {
    id: 'BK-2025-05121',
    patientId: 'pt-004',
    patientName: 'Fatima Noor',
    patientPhone: '0333-1112223',
    providerId: 'doc-002',
    providerName: 'Dr. Fatima Noor',
    facilityId: 'fac-001',
    careType: 'IN_PERSON',
    type: 'Consultation',
    date: '24 May 2025',
    time: '11:00 AM',
    scheduledDate: '2025-05-24',
    scheduledTime: '11:00 AM',
    status: 'Scheduled',
    fee: 2500,
    department: 'Gynecology',
  },
  {
    id: 'BK-2025-05120',
    patientId: 'pt-005',
    patientName: 'Bilal Hussain',
    patientPhone: '0300-7654321',
    providerId: 'doc-001',
    providerName: 'Dr. Ahmed Raza',
    facilityId: 'fac-001',
    careType: 'IN_PERSON',
    type: 'Follow-up',
    date: '24 May 2025',
    time: '11:30 AM',
    scheduledDate: '2025-05-24',
    scheduledTime: '11:30 AM',
    checkInTime: '11:25 AM',
    status: 'In Progress',
    fee: 1000,
    department: 'General Medicine',
  },
  {
    id: 'BK-2025-05119',
    patientId: 'pt-006',
    patientName: 'Zainab Abbas',
    patientPhone: '0315-2223334',
    providerId: 'doc-002',
    providerName: 'Dr. Fatima Noor',
    facilityId: 'fac-001',
    careType: 'IN_PERSON',
    type: 'Consultation',
    date: '24 May 2025',
    time: '12:00 PM',
    scheduledDate: '2025-05-24',
    scheduledTime: '12:00 PM',
    status: 'Scheduled',
    fee: 2500,
    department: 'Gynecology',
  },
  {
    id: 'BK-2025-05118',
    patientId: 'pt-007',
    patientName: 'Hassan Raza',
    patientPhone: '0345-5556677',
    providerId: 'doc-005',
    providerName: 'Dr. Usman Tariq',
    facilityId: 'fac-001',
    careType: 'IN_PERSON',
    type: 'Consultation',
    date: '24 May 2025',
    time: '12:30 PM',
    scheduledDate: '2025-05-24',
    scheduledTime: '12:30 PM',
    status: 'Cancelled',
    fee: 2000,
    department: 'General Medicine',
  },
];

// ───────────── Live Tokens ─────────────

export const initialQueueTokens: QueueToken[] = [
  {
    id: 't-01',
    patientId: 'pt-001',
    patientName: 'Muhammad Ali',
    patientCnic: '35202-1234567-1',
    patientAgeGender: '34 Years / Male',
    tokenNumber: '#08',
    departmentId: 'dept-01',
    doctorId: 'doc-001',
    doctorName: 'Dr. M. Hassan',
    status: 'Completed',
    issuedAt: '2025-05-24T09:00:00Z',
    time: '09:15 AM'
  },
  {
    id: 't-02',
    patientId: 'pt-005',
    patientName: 'Usman Tariq',
    patientCnic: '35202-8899001-7',
    patientAgeGender: '34 Years / Male',
    tokenNumber: '#12',
    departmentId: 'dept-01',
    doctorId: 'doc-001',
    doctorName: 'Dr. M. Hassan',
    status: 'Now Serving',
    issuedAt: '2025-05-24T10:00:00Z',
    time: '10:30 AM',
    waitTime: '18 min'
  },
  {
    id: 't-03',
    patientId: 'pt-008',
    patientName: 'Ayesha Noor',
    patientCnic: '38403-3344556-8',
    patientAgeGender: '28 Years / Female',
    tokenNumber: '#13',
    departmentId: 'dept-01',
    doctorId: 'doc-001',
    doctorName: 'Dr. M. Hassan',
    status: 'Waiting',
    issuedAt: '2025-05-24T10:10:00Z',
    time: '10:45 AM'
  },
];

// ───────────── Dashboard Stats ─────────────

export const dashboardStats: DashboardStats = {
  totalBookings: 1284,
  todayBookings: todayBookings.length,
  totalPatients: 3842,
  totalDoctors: providers.length,
  revenue: 485000,
  pendingBookings: todayBookings.filter(b => b.status === 'PENDING').length,
};

// ───────────── Sidebar Navigation ─────────────

export const sidebarNavigation: NavGroup[] = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { id: 'bookings', label: 'Bookings', icon: 'CalendarCheck', path: '/bookings', badge: 3 },
      { id: 'queue', label: 'Queue & Tokens', icon: 'ListOrdered', path: '/queue' },
      { id: 'patients', label: 'Patients', icon: 'Users', path: '/patients' },
      { id: 'doctors', label: 'Doctors', icon: 'Stethoscope', path: '/doctors' },
      { id: 'hiring', label: 'Hiring', icon: 'Briefcase', path: '/hiring' },
      { id: 'departments', label: 'Departments', icon: 'Building2', path: '/departments' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'services', label: 'Services', icon: 'HeartPulse', path: '/services' },
      { id: 'schedule', label: 'Schedule', icon: 'Clock', path: '/schedule' },
      { id: 'billing', label: 'Billing', icon: 'Receipt', path: '/billing' },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { id: 'profile', label: 'Clinic Profile', icon: 'Hospital', path: '/clinic-profile' },
      { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
    ],
  },
];

// ───────────── Poly Clinic Data (H-02) ─────────────

export const polyClinicStats = {
  todayAppointments: 86,
  doctorsOnDuty: 9,
  checkedIn: 22,
  waiting: 11,
};

export const polyClinicAppointments = [
  { id: 'pc-1', time: '09:00 AM', patient: 'Muhammad Arslan', ageGender: '28 / Male', doctor: 'Dr. Saima Khan', specialty: 'General Physician', status: 'Checked In' },
  { id: 'pc-2', time: '09:20 AM', patient: 'Ayesha Bibi', ageGender: '34 / Female', doctor: 'Dr. Saima Khan', specialty: 'General Physician', status: 'Waiting' },
  { id: 'pc-3', time: '09:40 AM', patient: 'Imran Shah', ageGender: '45 / Male', doctor: 'Dr. Bilal Ahmad', specialty: 'Cardiologist', status: 'Checked In' },
  { id: 'pc-4', time: '10:00 AM', patient: 'Nadia Sultana', ageGender: '29 / Female', doctor: 'Dr. Bilal Ahmad', specialty: 'Cardiologist', status: 'Waiting' },
  { id: 'pc-5', time: '10:20 AM', patient: 'Zain Ul Abideen', ageGender: '12 / Male', doctor: 'Dr. Maria Farooq', specialty: 'Pediatrician', status: 'Checked In' },
  { id: 'pc-6', time: '10:40 AM', patient: 'Hafsah Noor', ageGender: '6 / Female', doctor: 'Dr. Maria Farooq', specialty: 'Pediatrician', status: 'Waiting' },
  { id: 'pc-7', time: '11:00 AM', patient: 'Ghulam Mustafa', ageGender: '52 / Male', doctor: 'Dr. Usman Ali', specialty: 'Orthopedic', status: 'Checked In' },
  { id: 'pc-8', time: '11:20 AM', patient: 'Shagufta Kousar', ageGender: '41 / Female', doctor: 'Dr. Usman Ali', specialty: 'Orthopedic', status: 'Waiting' },
];

export const polyClinicDoctors = [
  { id: 'pcd-1', name: 'Dr. Saima Khan', specialty: 'General Physician', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', availability: 'Until 02:00 PM' },
  { id: 'pcd-2', name: 'Dr. Bilal Ahmad', specialty: 'Cardiologist', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', availability: 'Until 03:00 PM' },
  { id: 'pcd-3', name: 'Dr. Maria Farooq', specialty: 'Pediatrician', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', availability: 'Until 02:30 PM' },
  { id: 'pcd-4', name: 'Dr. Usman Ali', specialty: 'Orthopedic', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', availability: 'Until 04:00 PM' },
  { id: 'pcd-5', name: 'Dr. Humaira Noreen', specialty: 'Dermatologist', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024e', availability: 'Until 01:30 PM' },
];

// ───────────── Hiring & Jobs Data (H-10 to H-13) ─────────────

import type { Job, Applicant } from '../types';

export const initialJobs: Job[] = [
  {
    id: 'J-2025-041',
    title: 'Medical Officer',
    providerRole: 'Provider',
    specialty: 'General Medicine',
    shiftDate: '20 May 2025 (Evening)',
    time: '2:00 PM - 10:00 PM',
    pay: 'PKR 120,000 /month',
    applicationsCount: 18,
    newApplicationsCount: 5,
    status: 'Active',
    closesOn: '30 May 2025',
  },
  {
    id: 'J-2025-040',
    title: 'Visiting Cardiologist',
    providerRole: 'Visiting Consultant',
    specialty: 'Cardiology',
    shiftDate: '25 May 2025 (Sunday)',
    time: '10:00 AM - 2:00 PM',
    pay: 'PKR 15,000 /per visit',
    applicationsCount: 22,
    newApplicationsCount: 7,
    status: 'Active',
    closesOn: '20 May 2025',
  },
  {
    id: 'J-2025-039',
    title: 'Staff Nurse (Female)',
    providerRole: 'Provider',
    specialty: 'Nursing',
    shiftDate: '18 May 2025 (Morning)',
    time: '7:00 AM - 3:00 PM',
    pay: 'PKR 60,000 /month',
    applicationsCount: 31,
    newApplicationsCount: 6,
    status: 'Active',
    closesOn: '25 May 2025',
  },
  {
    id: 'J-2025-038',
    title: 'Dental Surgeon',
    providerRole: 'Provider',
    specialty: 'Dentistry',
    shiftDate: '22 May 2025 (Full Day)',
    time: '9:00 AM - 5:00 PM',
    pay: 'PKR 100,000 /month',
    applicationsCount: 16,
    newApplicationsCount: 3,
    status: 'Active',
    closesOn: '28 May 2025',
  },
  {
    id: 'J-2025-037',
    title: 'Physiotherapist',
    providerRole: 'Provider',
    specialty: 'Physiotherapy',
    shiftDate: '19 May 2025 (Morning)',
    time: '8:00 AM - 2:00 PM',
    pay: 'PKR 70,000 /month',
    applicationsCount: 9,
    newApplicationsCount: 2,
    status: 'Active',
    closesOn: '27 May 2025',
  }
];

export const initialApplicants: Applicant[] = [
  {
    id: 'APP-HR-2025-00472',
    jobId: 'J-2025-041',
    name: 'Dr. Ahsan Raza',
    qualifications: 'MBBS, FCPS (Medicine)',
    pmdcNumber: '748123-P',
    role: 'Medical Officer',
    shift: 'Evening Shift',
    verification: 'Verified',
    specialtyMatch: 'Good Match',
    experienceYears: '2.8 years',
    experienceDetails: '(House Job + 1.8)',
    appliedDate: '12 May 2025',
    appliedTime: '10:24 AM',
    status: 'Eligible',
    email: 'ahsan.raza@gmail.com',
    phone: '0333-1234567',
    address: 'Lahore, Punjab'
  },
  {
    id: 'APP-HR-2025-00473',
    jobId: 'J-2025-041',
    name: 'Dr. Maria Fatima',
    qualifications: 'MBBS, FCPS (Medicine)',
    pmdcNumber: '71234-P',
    role: 'Medical Officer',
    shift: 'Evening Shift',
    verification: 'Verified',
    specialtyMatch: 'Excellent Match',
    experienceYears: '4.6 years',
    experienceDetails: '(House Job + 3.6)',
    appliedDate: '11 May 2025',
    appliedTime: '04:15 PM',
    status: 'Eligible',
    email: 'maria.fatima@gmail.com',
    phone: '0300-9876543',
    address: 'Lahore, Punjab'
  },
  {
    id: 'APP-HR-2025-00474',
    jobId: 'J-2025-041',
    name: 'Dr. Usman Khalid',
    qualifications: 'MBBS, MCPS',
    pmdcNumber: '64523-P',
    role: 'Medical Officer',
    shift: 'Evening Shift',
    verification: 'Verified',
    specialtyMatch: 'Good Match',
    experienceYears: '1.9 years',
    experienceDetails: '(House Job + 0.9)',
    appliedDate: '11 May 2025',
    appliedTime: '11:08 AM',
    status: 'Eligible'
  },
  {
    id: 'APP-HR-2025-00475',
    jobId: 'J-2025-041',
    name: 'Dr. Ayesha Noor',
    qualifications: 'MBBS, FCPS (Family Medicine)',
    pmdcNumber: '69871-P',
    role: 'Medical Officer',
    shift: 'Evening Shift',
    verification: 'Verified',
    specialtyMatch: 'Partial Match',
    experienceYears: '3.2 years',
    experienceDetails: '(House Job + 2.2)',
    appliedDate: '10 May 2025',
    appliedTime: '09:30 PM',
    status: 'Review'
  },
  {
    id: 'APP-HR-2025-00476',
    jobId: 'J-2025-041',
    name: 'Dr. Bilal Hussain',
    qualifications: 'MBBS',
    pmdcNumber: '81239-P',
    role: 'Medical Officer',
    shift: 'Evening Shift',
    verification: 'Verified',
    specialtyMatch: 'Good Match',
    experienceYears: '1.2 years',
    experienceDetails: '(House Job + 0.2)',
    appliedDate: '10 May 2025',
    appliedTime: '02:47 PM',
    status: 'Eligible'
  },
  {
    id: 'APP-HR-2025-00477',
    jobId: 'J-2025-041',
    name: 'Dr. Hina Saleem',
    qualifications: 'MBBS',
    pmdcNumber: '90321-P',
    role: 'Medical Officer',
    shift: 'Evening Shift',
    verification: 'Verified',
    specialtyMatch: 'Mismatch',
    experienceYears: '2.1 years',
    experienceDetails: '(House Job + 1.1)',
    appliedDate: '09 May 2025',
    appliedTime: '06:12 PM',
    status: 'Rejected'
  }
];

export const polyClinicJobs = {
  openPositions: 3,
  list: ['Front Desk Officer', 'Receptionist (Female)', 'Security Guard'],
};

// ───────────── Hospital Data (H-03) ─────────────

export const hospitalStats = {
  bookings: 142,
  doctors: 31,
  patients: 118,
  sharedFiles: 24,
  openJobs: 4,
};

export const hospitalBookings = [
  { id: 'h-bk-01', time: '09:00 AM', bookingId: '#B-10492', patient: 'Muhammad Imran', doctor: 'Dr. Tariq Jamil', department: 'Cardiology', status: 'Waiting' },
  { id: 'h-bk-02', time: '09:15 AM', bookingId: '#B-10493', patient: 'Sadia Malik', doctor: 'Dr. Aisha Khan', department: 'Gynecology', status: 'Completed' },
  { id: 'h-bk-03', time: '09:30 AM', bookingId: '#B-10494', patient: 'Hassan Ali', doctor: 'Dr. Zafar Iqbal', department: 'Orthopedics', status: 'Confirmed' },
  { id: 'h-bk-04', time: '09:45 AM', bookingId: '#B-10495', patient: 'Rabia Noor', doctor: 'Dr. Fatima Syed', department: 'Pediatrics', status: 'Waiting' },
  { id: 'h-bk-05', time: '10:00 AM', bookingId: '#B-10496', patient: 'Usman Tariq', doctor: 'Dr. Bilal Ahmed', department: 'Neurology', status: 'Confirmed' },
];

export const hospitalFileShares = [
  { id: 'REQ-9214', requestedBy: 'Dr. M. Qasim (Agha Khan Hosp)', purpose: 'Second Opinion', fileType: 'MRI Scan', status: 'Active', date: '21 May, 2025' },
  { id: 'REQ-9213', requestedBy: 'Dr. S. Raza (Shaukat Khanum)', purpose: 'Oncology Consult', fileType: 'Biopsy Report', status: 'Expired', date: '19 May, 2025' },
  { id: 'REQ-9212', requestedBy: 'Dr. N. Ali (CMH Lahore)', purpose: 'Surgical Referral', fileType: 'Complete Record', status: 'Active', date: '18 May, 2025' },
];

export const hospitalDoctors = [
  { id: 'hd-1', name: 'Dr. Tariq Jamil', specialty: 'Cardiology', avatar: 'https://i.pravatar.cc/150?u=h042581f4e29026024d', availability: 'Available', status: 'available' },
  { id: 'hd-2', name: 'Dr. Aisha Khan', specialty: 'Gynecology', avatar: 'https://i.pravatar.cc/150?u=h042581f4e29026704d', availability: 'In Consultation', status: 'busy' },
  { id: 'hd-3', name: 'Dr. Zafar Iqbal', specialty: 'Orthopedics', avatar: 'https://i.pravatar.cc/150?u=h04258114e29026702d', availability: 'Available', status: 'available' },
  { id: 'hd-4', name: 'Dr. Fatima Syed', specialty: 'Pediatrics', avatar: 'https://i.pravatar.cc/150?u=h048581f4e29026701d', availability: 'Available', status: 'available' },
];

export const hospitalHiring = {
  openJobs: 4,
  applications: 42,
  shortlisted: 12,
  interviews: 8,
  topPositions: [
    { title: 'Staff Nurse', department: 'ICU', applicants: 18 },
    { title: 'Medical Officer', department: 'Emergency', applicants: 14 },
    { title: 'Receptionist', department: 'Front Desk', applicants: 10 },
  ],
};

// ───────────── Departments Data ─────────────
export const departmentsData = [
  { id: 'dept-01', name: 'General Medicine', head: 'Dr. M. Hassan', doctorsCount: 12, todayLoad: 145, status: 'Active', timing: '24/7' },
  { id: 'dept-02', name: 'Cardiology', head: 'Dr. Tariq Jamil', doctorsCount: 5, todayLoad: 42, status: 'Active', timing: '08:00 AM - 08:00 PM' },
  { id: 'dept-03', name: 'Pediatrics', head: 'Dr. Fatima Syed', doctorsCount: 8, todayLoad: 89, status: 'Active', timing: '24/7' },
  { id: 'dept-04', name: 'Gynecology', head: 'Dr. Aisha Khan', doctorsCount: 6, todayLoad: 65, status: 'Active', timing: '08:00 AM - 08:00 PM' },
  { id: 'dept-05', name: 'Dermatology', head: 'Dr. Humaira Noreen', doctorsCount: 3, todayLoad: 28, status: 'Maintenance', timing: '09:00 AM - 05:00 PM' },
];

// ───────────── Services Data ─────────────
export const servicesData = [
  { id: 'srv-01', name: 'General Consultation', department: 'General Medicine', availability: 'Walk-in & Appointment', fee: 'PKR 1,500', status: 'Available' },
  { id: 'srv-02', name: 'Specialist Consultation', department: 'Multiple', availability: 'Appointment Only', fee: 'PKR 2,500 - 3,500', status: 'Available' },
  { id: 'srv-03', name: 'Follow-up Visit', department: 'Multiple', availability: 'Walk-in & Appointment', fee: 'PKR 1,000', status: 'Available' },
  { id: 'srv-04', name: 'Video Consultation', department: 'Telemedicine', availability: 'Online Only', fee: 'PKR 1,200', status: 'Available' },
  { id: 'srv-05', name: 'ECG Test', department: 'Cardiology', availability: 'Walk-in', fee: 'PKR 800', status: 'Available' },
  { id: 'srv-06', name: 'Dermatology Laser Treatment', department: 'Dermatology', availability: 'Appointment Only', fee: 'PKR 5,000+', status: 'Unavailable' },
];

// ───────────── Schedule Data ─────────────
export const scheduleData: Schedule[] = [
  { id: 'sch-01', providerId: 'doc-001', providerName: 'Dr. M. Hassan', specialty: 'General Medicine', facilityId: 'fac-hospital', branchId: 'br-hospital-01', dayOfWeek: 'Monday', startTime: '08:00 AM', endTime: '02:00 PM', slotDurationMinutes: 15, status: 'Confirmed' },
  { id: 'sch-02', providerId: 'doc-001', providerName: 'Dr. M. Hassan', specialty: 'General Medicine', facilityId: 'fac-hospital', branchId: 'br-hospital-01', dayOfWeek: 'Tuesday', startTime: '08:00 AM', endTime: '02:00 PM', slotDurationMinutes: 15, status: 'Confirmed' },
  { id: 'sch-03', providerId: 'doc-002', providerName: 'Dr. Tariq Jamil', specialty: 'Cardiology', facilityId: 'fac-hospital', branchId: 'br-hospital-01', dayOfWeek: 'Monday', startTime: '02:00 PM', endTime: '08:00 PM', slotDurationMinutes: 20, status: 'Confirmed' },
  { id: 'sch-04', providerId: 'doc-003', providerName: 'Dr. Aisha Khan', specialty: 'Gynecology', facilityId: 'fac-hospital', branchId: 'br-hospital-01', dayOfWeek: 'Wednesday', startTime: '09:00 AM', endTime: '01:00 PM', slotDurationMinutes: 30, status: 'Confirmed' },
  { id: 'sch-05', providerId: 'doc-004', providerName: 'Dr. Fatima Syed', specialty: 'Pediatrics', facilityId: 'fac-hospital', branchId: 'br-hospital-01', dayOfWeek: 'Friday', startTime: '08:00 PM', endTime: '08:00 AM', slotDurationMinutes: 20, status: 'On Leave' },
];

// ───────────── Billing Data ─────────────
export const billingStats = {
  todayRevenue: 485000,
  totalPaid: 450000,
  pendingAmount: 35000,
};

export const billingInvoices = [
  { id: 'INV-2025-001', patient: 'Ali Raza', reference: 'BKG-1020', amount: 'PKR 2,500', status: 'Paid', date: '2025-05-24 10:15 AM', method: 'Credit Card' },
  { id: 'INV-2025-002', patient: 'Sana Fatima', reference: 'BKG-1021', amount: 'PKR 1,500', status: 'Paid', date: '2025-05-24 10:30 AM', method: 'Cash' },
  { id: 'INV-2025-003', patient: 'Imran Khan', reference: 'BKG-1022', amount: 'PKR 5,000', status: 'Pending', date: '2025-05-24 11:00 AM', method: 'Insurance' },
  { id: 'INV-2025-004', patient: 'Ayesha Noor', reference: 'BKG-1023', amount: 'PKR 3,000', status: 'Refunded', date: '2025-05-24 11:15 AM', method: 'EasyPaisa' },
  { id: 'INV-2025-005', patient: 'Usman Ali', reference: 'BKG-1024', amount: 'PKR 1,200', status: 'Paid', date: '2025-05-24 11:45 AM', method: 'Cash' },
];

// ───────────── Clinic Profile Data ─────────────
export const clinicProfileData = {
  name: 'Sehat Sahara Hospital',
  type: 'Multispecialty Healthcare Facility',
  branch: 'Main Campus (Lahore)',
  address: '123 Health Avenue, Johar Town, Lahore, Pakistan',
  phone: '+92 42 111 222 333',
  email: 'contact@sehatsahara.pk',
  operatingHours: '24/7 Emergency, OPD: 08:00 AM - 10:00 PM',
  departmentsCount: 15,
  servicesCount: 45,
  doctorsCount: 120,
  verificationStatus: 'Verified by PMDC',
};
