import { todayBookings, initialQueueTokens, patients as initialPatients, initialJobs, initialApplicants, scheduleData, providers as initialProviders } from '../data/demo-data';
import type { Booking, QueueToken, Patient, ConsentStatus, TokenStatus, Job, Applicant, ApplicantStatus, Schedule, BookingStatus, Provider } from '../types';

type Listener = () => void;

interface StoreState {
  session: {
    isAuthenticated: boolean;
    activeFacilityId: string | null;
    facilityType: 'CLINIC' | 'HOSPITAL' | null;
    activeBranchId: string | null;
  };
  activeBranchId: string; // kept for legacy compatibility for now, but will migrate to session
  sidebarCollapsed: boolean;
  notifications: { id: string; message: string; read: boolean; time: string }[];
  bookings: Booking[];
  schedules: Schedule[];
  tokens: QueueToken[];
  patients: Patient[];
  jobs: Job[];
  applicants: Applicant[];
  providers: Provider[];
}

const STORAGE_KEY = 'sehat-sahara-hospital-store';

function loadPersistedState(): Partial<StoreState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {};
}

function persistState(state: StoreState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        session: state.session,
        activeBranchId: state.activeBranchId,
        sidebarCollapsed: state.sidebarCollapsed,
        jobs: state.jobs, // Persisting jobs so created jobs stay
        bookings: state.bookings,
        schedules: state.schedules,
        providers: state.providers,
      })
    );
  } catch {
    // ignore quota errors
  }
}

const defaultState: StoreState = {
  session: {
    isAuthenticated: false,
    activeFacilityId: null,
    facilityType: null,
    activeBranchId: null,
  },
  activeBranchId: 'br-001',
  sidebarCollapsed: false,
  notifications: [
    { id: 'n1', message: 'New booking request from Muhammad Imran', read: false, time: '5 min ago' },
    { id: 'n2', message: 'Dr. Fatima Noor updated her schedule', read: false, time: '15 min ago' },
    { id: 'n3', message: 'Lab results ready for patient Aisha Bibi', read: true, time: '1 hr ago' },
  ],
  bookings: todayBookings,
  schedules: scheduleData,
  tokens: initialQueueTokens,
  patients: initialPatients,
  jobs: initialJobs,
  applicants: initialApplicants,
  providers: initialProviders,
};

// Merge persisted state with defaults
let state: StoreState = { ...defaultState, ...loadPersistedState() };
const listeners = new Set<Listener>();

function emitChange() {
  persistState(state);
  listeners.forEach((listener) => listener());
}

export const store = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): StoreState {
    return state;
  },

  setActiveBranch(branchId: string) {
    state = { ...state, activeBranchId: branchId };
    emitChange();
  },

  toggleSidebar() {
    state = { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    emitChange();
  },

  markNotificationRead(id: string) {
    state = {
      ...state,
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    };
    emitChange();
  },

  markAllNotificationsRead() {
    state = {
      ...state,
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    };
    emitChange();
  },

  getUnreadCount(): number {
    return state.notifications.filter((n) => !n.read).length;
  },

  // ───────────── Booking & Schedule Actions ─────────────

  addSchedule(schedule: Omit<Schedule, 'id'>) {
    const newSchedule: Schedule = {
      ...schedule,
      id: `sch-${Date.now()}`
    };
    state = { ...state, schedules: [...state.schedules, newSchedule] };
    emitChange();
    return newSchedule.id;
  },

  addBooking(booking: Omit<Booking, 'id'>) {
    const newBooking: Booking = {
      ...booking,
      id: `BK-2025-${Math.floor(10000 + Math.random() * 90000)}`
    };
    state = { ...state, bookings: [newBooking, ...state.bookings] };
    emitChange();
    return newBooking.id;
  },

  addProvider(provider: Omit<Provider, 'id'>) {
    const newProvider: Provider = {
      ...provider,
      id: `doc-${Date.now()}`
    };
    state = { ...state, providers: [newProvider, ...state.providers] };
    emitChange();
    return newProvider.id;
  },

  updateProviderStatus(providerId: string, status: Provider['status']) {
    state = {
      ...state,
      providers: state.providers.map(p => 
        p.id === providerId ? { ...p, status } : p
      )
    };
    emitChange();
  },

  addPatient(patient: Omit<Patient, 'id'>) {
    const newPatient: Patient = {
      ...patient,
      id: `PT-${Date.now()}`
    };
    state = { ...state, patients: [newPatient, ...state.patients] };
    emitChange();
    return newPatient.id;
  },

  updateBooking(bookingId: string, updates: Partial<Booking>) {
    state = {
      ...state,
      bookings: state.bookings.map(b => 
        b.id === bookingId ? { ...b, ...updates } : b
      )
    };
    emitChange();
  },

  updateBookingStatus(bookingId: string, status: BookingStatus) {
    state = {
      ...state,
      bookings: state.bookings.map(b => 
        b.id === bookingId ? { ...b, status } : b
      )
    };
    emitChange();
  },

  // ───────────── Chunk 2 Actions ─────────────

  checkInBooking(bookingId: string) {
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Update booking status
    const updatedBookings = state.bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'Checked In' as const, checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : b
    );

    // Create a new token
    const newTokenNumber = `#${state.tokens.length + 14}`; // mock sequence
    const newToken: QueueToken = {
      id: `t-new-${Date.now()}`,
      patientId: booking.patientId,
      patientName: booking.patientName,
      patientCnic: '35202-0000000-0', // mock
      patientAgeGender: 'Adult',
      tokenNumber: newTokenNumber,
      departmentId: booking.department,
      doctorId: booking.providerId,
      doctorName: booking.providerName,
      status: 'Waiting',
      issuedAt: new Date().toISOString(),
      time: booking.time,
    };

    state = { ...state, bookings: updatedBookings, tokens: [...state.tokens, newToken] };
    emitChange();
  },

  updateTokenStatus(tokenId: string, newStatus: TokenStatus) {
    state = {
      ...state,
      tokens: state.tokens.map(t => 
        t.id === tokenId ? { ...t, status: newStatus } : t
      )
    };
    emitChange();
  },

  updatePatientConsent(patientId: string, consentStatus: ConsentStatus) {
    state = {
      ...state,
      patients: state.patients.map(p => 
        p.id === patientId ? { ...p, consentStatus } : p
      )
    };
    emitChange();
  },

  // ───────────── Chunk 3 Actions (Hiring) ─────────────

  addJob(jobData: Omit<Job, 'id' | 'applicationsCount' | 'newApplicationsCount' | 'status'>) {
    const newJob: Job = {
      ...jobData,
      id: `J-2025-0${state.jobs.length + 42}`,
      applicationsCount: 2, // Start with deterministic applicants for demo
      newApplicationsCount: 2,
      status: 'Active',
    };

    // Auto-seed two applicants for the new job to fulfill demo requirements
    const seededApplicants: Applicant[] = [
      {
        id: `APP-HR-${Date.now()}-1`,
        jobId: newJob.id,
        name: 'Dr. Zoya Khan',
        qualifications: 'MBBS',
        pmdcNumber: '99881-P',
        role: newJob.title,
        shift: newJob.shiftDate,
        verification: 'Verified',
        specialtyMatch: 'Good Match',
        experienceYears: '3.5 years',
        experienceDetails: '(House Job + 2.5)',
        appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        appliedTime: '10:00 AM',
        status: 'Eligible',
        email: 'zoya.k@example.com',
        phone: '0300-1112223'
      },
      {
        id: `APP-HR-${Date.now()}-2`,
        jobId: newJob.id,
        name: 'Dr. Faisal Hayat',
        qualifications: 'MBBS, MCPS',
        pmdcNumber: '77665-P',
        role: newJob.title,
        shift: newJob.shiftDate,
        verification: 'Pending',
        specialtyMatch: 'Partial Match',
        experienceYears: '1.5 years',
        experienceDetails: '(House Job + 0.5)',
        appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        appliedTime: '11:30 AM',
        status: 'Review',
        email: 'faisal.h@example.com',
        phone: '0333-4445556'
      }
    ];

    state = {
      ...state,
      jobs: [newJob, ...state.jobs],
      applicants: [...seededApplicants, ...state.applicants],
    };
    emitChange();
    return newJob.id;
  },

  updateApplicantStatus(applicantId: string, newStatus: ApplicantStatus) {
    state = {
      ...state,
      applicants: state.applicants.map(a =>
        a.id === applicantId ? { ...a, status: newStatus } : a
      )
    };
    emitChange();
  },

  login(facilityType: 'CLINIC' | 'HOSPITAL') {
    const activeFacilityId = facilityType === 'CLINIC' ? 'fac-clinic' : 'fac-hospital';
    const activeBranchId = facilityType === 'CLINIC' ? 'br-clinic-01' : 'br-hospital-01'; // Default branch for hospital

    state = {
      ...state,
      session: {
        isAuthenticated: true,
        facilityType,
        activeFacilityId,
        activeBranchId
      },
      activeBranchId // legacy sync
    };
    persistState(state);
    emitChange();
  },

  logout() {
    state = {
      ...state,
      session: {
        isAuthenticated: false,
        facilityType: null,
        activeFacilityId: null,
        activeBranchId: null
      }
    };
    persistState(state);
    emitChange();
  },

  setSessionBranch(branchId: string) {
    state = {
      ...state,
      session: {
        ...state.session,
        activeBranchId: branchId
      },
      activeBranchId: branchId // legacy sync
    };
    persistState(state);
    emitChange();
  },

  addToken(token: Partial<QueueToken>) {
    const newToken: QueueToken = {
      ...token,
      id: `T-${Math.floor(100 + Math.random() * 900)}`,
      patientId: token.patientId || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: token.patientName || 'Walk-in',
      tokenNumber: token.tokenNumber || 'W-001',
      departmentId: token.departmentId || 'OPD',
      status: 'WAITING',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      issuedAt: new Date().toISOString()
    };
    state = {
      ...state,
      tokens: [newToken, ...state.tokens]
    };
    emitChange();
  }
};
