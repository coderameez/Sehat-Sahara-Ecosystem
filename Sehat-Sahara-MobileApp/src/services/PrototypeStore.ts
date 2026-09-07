import { 
  BloodRequest, 
  SharedItem, 
  MedicineCourse, 
  MedicineDose, 
  AppNotification, 
  SOSState,
  Provider,
  Facility,
  Booking,
  CareRequest,
  ProviderQuote,
  QueueToken,
  Review,
  RequestConversation
} from '../models';

export interface ProviderOpportunity {
  id: string;
  title: string;
  facility: string;
  location: string;
  compensation?: string;
  schedule: string;
  requirements: string;
  deadline: string;
  status: 'Open' | 'Applied' | 'Saved' | 'Interviewing';
  applicantsCount?: number;
}

export interface ProviderOpportunityApplication {
  id: string;
  opportunityId: string;
  providerId: string;
  status: 'Submitted' | 'Interviewing' | 'Accepted' | 'Declined';
  appliedAt: string;
}

export interface PrototypeAppState {
  version: number;
  bloodRequests: BloodRequest[];
  sharedItems: SharedItem[];
  medicineCourses: MedicineCourse[];
  medicineDoses: MedicineDose[];
  notifications: AppNotification[];
  sosState: SOSState;
  providers: Provider[];
  facilities: Facility[];
  bookings: Booking[];
  careRequests: CareRequest[];
  providerQuotes: ProviderQuote[];
  queueTokens: QueueToken[];
  opportunities: ProviderOpportunity[];
  applications: ProviderOpportunityApplication[];
  conversations: RequestConversation[];
  reviews: Review[];
}

export const CURRENT_VERSION = 2;
const STORAGE_KEY = 'sehat_sahara_prototype_data';

/**
 * Deterministic relative demo date helper
 * Returns date formatted as "Wed, 14 Oct" relative to today
 */
export const getRelativeDemoDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString('en-US', { weekday: 'short' }) + ', ' + d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

// Determine today's date in local time for seeding deterministic dynamic data
const today = new Date();
const todayISO = today.toISOString().split('T')[0];
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const dateToday = getRelativeDemoDate(0);
const dateYesterday = getRelativeDemoDate(-1);
const dateTomorrow = getRelativeDemoDate(1);
const dateIn2Days = getRelativeDemoDate(2);
const dateIn3Days = getRelativeDemoDate(3);
const date2DaysAgo = getRelativeDemoDate(-2);
const date3DaysAgo = getRelativeDemoDate(-3);

// Generate some exact times for medicines
const panadolTime = new Date(today);
panadolTime.setHours(20, 0, 0, 0);

const amoxicillinMorning = new Date(today);
amoxicillinMorning.setHours(9, 0, 0, 0);

const amoxicillinNight = new Date(today);
amoxicillinNight.setHours(21, 0, 0, 0);

const SEEDED_FACILITIES: Facility[] = [
  {
    id: "FAC-1",
    name: "Aga Khan University Hospital",
    type: "HOSPITAL",
    logoUrl: "https://ui-avatars.com/api/?name=AKUH&background=0D8ABC&color=fff",
    branches: [
      {
        id: "BR-1",
        name: "Main Campus",
        address: "Stadium Road, Karachi",
        departments: [
          { id: "DEPT-1", name: "Cardiology" },
          { id: "DEPT-2", name: "General Medicine" },
          { id: "DEPT-3", name: "Physiotherapy" }
        ],
        services: [
          {
            id: "SVC-1",
            departmentId: "DEPT-3",
            name: "Physiotherapy Assessment",
            description: "Initial assessment and therapy plan.",
            durationMinutes: 45,
            price: 2500,
            availability: []
          }
        ],
        doctors: ["PROV-4", "PROV-5"],
        hours: "24/7",
        paymentPolicies: ["pay_at_counter", "online_full"],
        approvalMode: "instant_confirmation",
        tokenSupport: true,
        bookingModes: ["fixed_time", "queue_token"]
      }
    ]
  },
  {
    id: "FAC-2",
    name: "City Care Clinic",
    type: "CLINIC",
    logoUrl: "https://ui-avatars.com/api/?name=CC&background=166B32&color=fff",
    branches: [
      {
        id: "BR-2",
        name: "DHA Branch",
        address: "Phase 6, DHA, Karachi",
        departments: [
          { id: "DEPT-4", name: "General Practice" },
          { id: "DEPT-5", name: "Dental" }
        ],
        services: [
          {
            id: "SVC-2",
            departmentId: "DEPT-5",
            name: "Dental Checkup",
            description: "Routine examination and cleaning.",
            durationMinutes: 30,
            price: 1500,
            availability: []
          }
        ],
        doctors: ["PROV-6"],
        hours: "9:00 AM - 9:00 PM",
        paymentPolicies: ["pay_at_clinic"],
        approvalMode: "facility_approval",
        tokenSupport: true,
        bookingModes: ["queue_token"]
      }
    ]
  }
];

const SEEDED_PROVIDERS: Provider[] = [
  {
    id: "d1",
    userId: "USR-DOC-1",
    name: "Dr. Ayesha Khan",
    gender: "Female",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "General Physician",
    qualification: "MBBS, FCPS",
    experienceYears: 12,
    languages: ["English", "Urdu"],
    careTypes: ["in_clinic_doctor", "online_consultation", "direct_home_visit", "open_care_request"],
    fees: {
      in_clinic_doctor: 1500,
      online_consultation: 1200,
      direct_home_visit: 2500,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 1000,
      home_care_support: 0
    },
    serviceAreas: ["Clifton", "DHA", "PECHS"],
    availability: [],
    rating: 4.8,
    reviewsCount: 124,
    reviews: [],
    avatarUrl: "https://i.pravatar.cc/150?u=d1",
    about: "Dr. Ayesha Khan is a highly experienced General Physician specializing in accurate diagnosis and compassionate care for a wide range of common illnesses.",
    bookingModes: ["fixed_time", "queue_token"]
  },
  {
    id: "d2",
    userId: "USR-DOC-2",
    name: "Dr. Salman Ahmed",
    gender: "Male",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    experienceYears: 15,
    languages: ["English", "Urdu", "Sindhi"],
    careTypes: ["in_clinic_doctor", "online_consultation", "open_care_request"],
    fees: {
      in_clinic_doctor: 3000,
      online_consultation: 2500,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 0
    },
    serviceAreas: ["Clifton", "DHA"],
    availability: [],
    rating: 4.9,
    reviewsCount: 89,
    reviews: [],
    avatarUrl: "https://i.pravatar.cc/150?u=d2",
    about: "Dr. Salman Ahmed is a leading Cardiologist with a focus on preventative heart care and advanced cardiovascular treatments.",
    bookingModes: ["fixed_time"]
  },
  {
    id: "d3",
    userId: "USR-DOC-3",
    name: "Dr. Fatima Ali",
    gender: "Female",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "Dermatologist",
    qualification: "MBBS, MCPS",
    experienceYears: 8,
    languages: ["English", "Urdu"],
    careTypes: ["in_clinic_doctor", "online_consultation"],
    fees: {
      in_clinic_doctor: 2000,
      online_consultation: 1800,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 1500,
      home_care_support: 0
    },
    serviceAreas: ["Gulshan", "Johar"],
    availability: [],
    rating: 4.7,
    reviewsCount: 210,
    reviews: [],
    avatarUrl: "https://i.pravatar.cc/150?u=d3",
    about: "Dr. Fatima Ali treats all types of skin conditions, providing personalized skincare regimens and medical treatments for her patients.",
    bookingModes: ["queue_token"]
  },
  {
    id: "d4",
    userId: "USR-DOC-4",
    name: "Dr. Bilal Qureshi",
    gender: "Male",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "Pediatrician",
    qualification: "MBBS, FCPS (Pediatrics)",
    experienceYears: 10,
    languages: ["English", "Urdu"],
    careTypes: ["in_clinic_doctor", "online_consultation", "direct_home_visit"],
    fees: {
      in_clinic_doctor: 1800,
      online_consultation: 1500,
      direct_home_visit: 3500,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 1200,
      home_care_support: 0
    },
    serviceAreas: ["North Nazimabad", "Gulberg"],
    availability: [],
    rating: 4.9,
    reviewsCount: 156,
    reviews: [],
    avatarUrl: "https://i.pravatar.cc/150?u=d4",
    about: "Dr. Bilal Qureshi is a dedicated Pediatrician who provides expert, gentle care for infants, children, and adolescents.",
    bookingModes: ["fixed_time", "queue_token"]
  },
  {
    id: "PROV-1",
    userId: "USR-DOC-1",
    name: "Dr. Ayesha Khan",
    gender: "Female",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "General Physician",
    qualification: "MBBS, FCPS",
    experienceYears: 12,
    languages: ["English", "Urdu"],
    careTypes: ["in_clinic_doctor", "online_consultation", "direct_home_visit", "open_care_request"],
    fees: {
      in_clinic_doctor: 1500,
      online_consultation: 1200,
      direct_home_visit: 2500,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 1000,
      home_care_support: 0
    },
    serviceAreas: ["Clifton", "DHA"],
    availability: [],
    rating: 4.8,
    reviewsCount: 124,
    reviews: [],
    avatarUrl: "https://i.pravatar.cc/150?u=d1",
    about: "Experienced general physician focused on preventive care.",
    bookingModes: ["fixed_time", "queue_token"]
  },
  {
    id: "PROV-2",
    userId: "USR-DOC-2",
    name: "Dr. Imran Siddiqui",
    gender: "Male",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    experienceYears: 15,
    languages: ["English", "Urdu", "Sindhi"],
    careTypes: ["in_clinic_doctor", "online_consultation", "open_care_request"],
    fees: {
      in_clinic_doctor: 3000,
      online_consultation: 2500,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 0
    },
    availability: [],
    rating: 4.9,
    reviewsCount: 89,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Imran+Siddiqui&background=166B32&color=fff",
    about: "Specialist in cardiovascular diseases and hypertension.",
    bookingModes: ["fixed_time"]
  },
  {
    id: "PROV-3",
    userId: "USR-DOC-3",
    name: "Dr. Sana Ali",
    gender: "Female",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "Dermatologist",
    qualification: "MBBS, MCPS",
    experienceYears: 8,
    languages: ["English", "Urdu"],
    careTypes: ["in_clinic_doctor", "online_consultation"],
    fees: {
      in_clinic_doctor: 2500,
      online_consultation: 2000,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 0
    },
    availability: [],
    rating: 4.7,
    reviewsCount: 56,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Sana+Ali&background=166B32&color=fff",
    about: "Expert in skin, hair and nail disorders.",
    bookingModes: ["queue_token"]
  },
  {
    id: "PROV-4",
    userId: "USR-DOC-4",
    name: "Dr. Kamran Ahmed",
    gender: "Male",
    providerType: "facility_doctor",
    verificationStatus: "VERIFIED",
    specialty: "General Medicine",
    qualification: "MBBS",
    experienceYears: 10,
    languages: ["English", "Urdu"],
    careTypes: ["facility_named_doctor", "walk_in_token"],
    fees: {
      in_clinic_doctor: 0,
      online_consultation: 0,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 2200,
      facility_service: 0,
      walk_in_token: 1000,
      home_care_support: 0
    },
    facilityAffiliations: ["FAC-1"],
    availability: [],
    rating: 4.6,
    reviewsCount: 210,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Kamran+Ahmed&background=166B32&color=fff",
    about: "Senior physician at AKUH."
  },
  {
    id: "PROV-5",
    userId: "USR-DOC-5",
    name: "Dr. Huma Riaz",
    gender: "Female",
    providerType: "facility_doctor",
    verificationStatus: "VERIFIED",
    specialty: "Pediatrician",
    qualification: "MBBS, FCPS (Pediatrics)",
    experienceYears: 14,
    languages: ["English", "Urdu"],
    careTypes: ["facility_named_doctor", "walk_in_token"],
    fees: {
      in_clinic_doctor: 0,
      online_consultation: 0,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 2500,
      facility_service: 0,
      walk_in_token: 1200,
      home_care_support: 0
    },
    facilityAffiliations: ["FAC-1"],
    availability: [],
    rating: 4.9,
    reviewsCount: 340,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Huma+Riaz&background=166B32&color=fff",
    about: "Dedicated pediatrician with a focus on child development."
  },
  {
    id: "PROV-6",
    userId: "USR-DOC-6",
    name: "Dr. Bilal Tariq",
    gender: "Male",
    providerType: "dentist",
    verificationStatus: "VERIFIED",
    specialty: "Dentist",
    qualification: "BDS",
    experienceYears: 6,
    languages: ["English", "Urdu"],
    careTypes: ["facility_named_doctor", "in_clinic_doctor"],
    fees: {
      in_clinic_doctor: 1500,
      online_consultation: 0,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 1500,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 0
    },
    facilityAffiliations: ["FAC-2"],
    availability: [],
    rating: 4.5,
    reviewsCount: 45,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Bilal+Tariq&background=166B32&color=fff",
    about: "Gentle and experienced dental surgeon."
  },
  {
    id: "PROV-7",
    userId: "USR-NUR-1",
    name: "Sara Qureshi",
    gender: "Female",
    providerType: "nurse",
    verificationStatus: "VERIFIED",
    specialty: "Registered Nurse",
    qualification: "BScN",
    experienceYears: 5,
    languages: ["English", "Urdu"],
    careTypes: ["home_care_support", "open_care_request"],
    fees: {
      in_clinic_doctor: 0,
      online_consultation: 0,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 2000
    },
    serviceAreas: ["Gulshan", "Johar"],
    availability: [],
    rating: 4.8,
    reviewsCount: 32,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Sara+Qureshi&background=166B32&color=fff",
    about: "Compassionate nursing care at home."
  },
  {
    id: "PROV-8",
    userId: "USR-PHY-1",
    name: "Ali Hassan",
    gender: "Male",
    providerType: "physiotherapist",
    verificationStatus: "VERIFIED",
    specialty: "Physiotherapist",
    qualification: "DPT",
    experienceYears: 4,
    languages: ["English", "Urdu"],
    careTypes: ["home_care_support", "open_care_request"],
    fees: {
      in_clinic_doctor: 0,
      online_consultation: 0,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 2500
    },
    serviceAreas: ["Clifton", "DHA", "Saddar"],
    availability: [],
    rating: 4.7,
    reviewsCount: 28,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Ali+Hassan&background=166B32&color=fff",
    about: "Expert in post-op rehab and sports injuries."
  },
  {
    id: "PROV-9",
    userId: "USR-CAR-1",
    name: "Zainab Bibi",
    gender: "Female",
    providerType: "caregiver",
    verificationStatus: "VERIFIED",
    specialty: "Elder Care",
    qualification: "Certified Caregiver",
    experienceYears: 8,
    languages: ["Urdu", "Punjabi"],
    careTypes: ["home_care_support", "open_care_request"],
    fees: {
      in_clinic_doctor: 0,
      online_consultation: 0,
      direct_home_visit: 0,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 1200
    },
    serviceAreas: ["All Karachi"],
    availability: [],
    rating: 4.9,
    reviewsCount: 50,
    reviews: [],
    about: "Loving support for daily activities and mobility."
  },
  {
    id: "PROV-10",
    userId: "USR-DOC-10",
    name: "Dr. Hamza Ahmed",
    gender: "Male",
    providerType: "independent_doctor",
    verificationStatus: "VERIFIED",
    specialty: "Neurologist",
    qualification: "MBBS, FCPS",
    experienceYears: 10,
    languages: ["English", "Urdu"],
    careTypes: ["in_clinic_doctor", "online_consultation", "direct_home_visit", "open_care_request"],
    fees: {
      in_clinic_doctor: 3500,
      online_consultation: 3000,
      direct_home_visit: 8000,
      open_care_request: 0,
      facility_named_doctor: 0,
      facility_service: 0,
      walk_in_token: 0,
      home_care_support: 0
    },
    serviceAreas: ["Clifton", "DHA", "Gulshan"],
    availability: [],
    rating: 4.9,
    reviewsCount: 156,
    reviews: [],
    avatarUrl: "https://ui-avatars.com/api/?name=Hamza+Ahmed&background=166B32&color=fff",
    about: "Senior Neurologist with expertise in headaches and nerve disorders.",
    bookingModes: ["fixed_time", "queue_token"]
  }
];

export const SEEDED_STATE: PrototypeAppState = {
  version: CURRENT_VERSION,
  bloodRequests: [
    {
      id: 'BLD-MOCK-1',
      requesterId: 'USR-OTHER',
      requesterName: 'Ahmad Khan',
      bloodGroup: 'B+',
      unitsRequired: 2,
      urgency: 'URGENT',
      hospitalName: 'Jinnah Hospital, Karachi',
      location: 'Cantt, Karachi',
      contactNumber: '0300-1111111',
      state: 'OPEN',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: 'BLD-MOCK-2',
      requesterId: 'USR-OTHER-2',
      requesterName: 'Zainab Bibi',
      bloodGroup: 'O-',
      unitsRequired: 1,
      urgency: 'STANDARD',
      hospitalName: 'Aga Khan University Hospital',
      location: 'Stadium Road, Karachi',
      contactNumber: '0300-2222222',
      state: 'OPEN',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hrs ago
      expiresAt: new Date(Date.now() + 172800000).toISOString(),
    }
  ],
  sharedItems: [
    {
      id: 'ITM-MOCK-1',
      ownerId: 'USR-OTHER',
      ownerName: 'Kamran Ali',
      title: 'Manual Wheelchair',
      category: 'Wheelchair',
      condition: 'Excellent',
      location: 'Gulshan-e-Iqbal, Karachi',
      distanceKm: 3.2,
      availableDays: 14,
      state: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=500&q=80',
    },
    {
      id: 'ITM-MOCK-2',
      ownerId: 'USR-OTHER-2',
      ownerName: 'Fatima',
      title: 'Oxygen Cylinder (5L)',
      category: 'Oxygen',
      condition: 'Good',
      location: 'DHA Phase 5, Karachi',
      distanceKm: 8.5,
      availableDays: 7,
      state: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    }
  ],
  medicineCourses: [
    {
      id: 'MED-CRS-1',
      patientId: 'USR-PATIENT-DEMO',
      name: 'Panadol',
      strength: '500mg',
      form: 'Tablet',
      frequency: 'ONCE',
      startDate: todayISO,
      mealRelation: 'AFTER_MEAL',
      status: 'ACTIVE',
      exactTimes: ['20:00']
    },
    {
      id: 'MED-CRS-2',
      patientId: 'USR-PATIENT-DEMO',
      name: 'Amoxicillin',
      strength: '250mg',
      form: 'Capsule',
      frequency: 'DAILY',
      startDate: yesterday.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0],
      mealRelation: 'AFTER_MEAL',
      status: 'ACTIVE',
      exactTimes: ['09:00', '21:00']
    }
  ],
  medicineDoses: [
    {
      id: 'DOSE-1',
      courseId: 'MED-CRS-1',
      patientId: 'USR-PATIENT-DEMO',
      medicineName: 'Panadol',
      scheduledTime: panadolTime.toISOString(),
      status: 'DUE'
    },
    {
      id: 'DOSE-2',
      courseId: 'MED-CRS-2',
      patientId: 'USR-PATIENT-DEMO',
      medicineName: 'Amoxicillin',
      scheduledTime: amoxicillinMorning.toISOString(),
      status: 'DUE'
    }
  ],
  notifications: [
    {
      id: "NOTIF-PROV-REQ-1",
      userId: "d1",
      role: "provider",
      type: "appointment_requested",
      notificationType: "appointment_requested",
      entityType: "appointment",
      entityId: "BKG-REQ-1",
      title: "New Appointment Request",
      body: "Ayesha Siddiqui requested an In-Clinic consultation for joint pain and swelling.",
      deepLink: "/doctor/appointments/BKG-REQ-1",
      isRead: false,
      createdAt: new Date(Date.now() - 12 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-CONF-1",
      userId: "d1",
      role: "provider",
      type: "appointment_confirmed",
      notificationType: "appointment_confirmed",
      entityType: "appointment",
      entityId: "BKG-CONF-1",
      title: "Appointment Confirmed",
      body: "Bilal Tariq confirmed the Cardiology follow-up for tomorrow at 10:00 AM.",
      deepLink: "/doctor/appointments/BKG-CONF-1",
      isRead: false,
      createdAt: new Date(Date.now() - 40 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-TOK-1",
      userId: "d1",
      role: "provider",
      type: "token_your_turn",
      notificationType: "token_your_turn",
      entityType: "queue_token",
      entityId: "TOK-DEMO-1",
      title: "Live Queue — Next Patient Waiting",
      body: "Token #12 (Rashid Ali) is called and waiting in Consultation Room 3.",
      deepLink: "/doctor/queue",
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-FOL-1",
      userId: "d1",
      role: "provider",
      type: "consultation_follow_up",
      notificationType: "consultation_follow_up",
      entityType: "appointment",
      entityId: "BKG-COMP-SUMMARY",
      title: "Consultation Follow-Up Available",
      body: "Zahid Iqbal reviewed your consultation summary & dietary notes.",
      deepLink: "/doctor/appointments/BKG-COMP-SUMMARY",
      isRead: true,
      createdAt: new Date(Date.now() - 150 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-REV-1",
      userId: "d1",
      role: "provider",
      type: "review_received",
      notificationType: "review_received",
      entityType: "review",
      entityId: "BKG-COMP-WITH-REV",
      title: "New 5★ Patient Review",
      body: "Nadia Pervez left a 5-star review: \"Dr. Sarah explained the thyroid treatment with immense care...\"",
      deepLink: "/doctor/appointments/BKG-COMP-WITH-REV",
      isRead: false,
      createdAt: new Date(Date.now() - 320 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-BLD-1",
      userId: "d1",
      role: "provider",
      type: "blood_response",
      notificationType: "blood_response",
      entityType: "blood_request",
      entityId: "REQ-1",
      title: "Blood Donors Responded",
      body: "2 verified community donors responded for B+ blood request at Civil Hospital Karachi.",
      deepLink: "/doctor/community/blood/REQ-1",
      isRead: false,
      createdAt: new Date(Date.now() - 540 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-BOR-1",
      userId: "d1",
      role: "provider",
      type: "borrow_request",
      notificationType: "borrow_request",
      entityType: "borrow_item",
      entityId: "itm-1",
      title: "Medical Equipment Borrow Request",
      body: "A community member requested to borrow Portable Wheelchair.",
      deepLink: "/doctor/community/things/itm-1",
      isRead: true,
      createdAt: new Date(Date.now() - 720 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-OPP-1",
      userId: "d1",
      role: "provider",
      type: "opportunity_update",
      notificationType: "opportunity_update",
      entityType: "opportunity",
      entityId: "o1",
      title: "Clinical Opportunity Status Update",
      body: "Liaquat National Hospital moved your application for Night Shift MO to Interview stage.",
      deepLink: "/doctor/opportunities/o1",
      isRead: false,
      createdAt: new Date(Date.now() - 890 * 60000).toISOString()
    },
    {
      id: "NOTIF-PROV-UNF-1",
      userId: "d1",
      role: "provider",
      type: "opportunity_update",
      notificationType: "opportunity_update",
      entityType: "care_marketplace",
      entityId: "UNFINISHED-TENDER",
      title: "Care Marketplace Opportunity (Preview)",
      body: "A home healthcare tender has been submitted nearby in Clifton Block 4.",
      deepLink: "/doctor/notice?type=unfinished&title=Coming%20Soon",
      isRead: false,
      createdAt: new Date(Date.now() - 1020 * 60000).toISOString()
    },
    {
      id: "NOTIF-PAT-1",
      userId: "USR-PATIENT-DEMO",
      role: "patient",
      type: "GENERAL",
      notificationType: "appointment_reminder",
      entityType: "appointment",
      entityId: "BKG-VIDEO-READY",
      title: "Appointment Reminder",
      body: "Upcoming consultation with Dr. Sarah Ahmed in 30 minutes.",
      deepLink: "/patient/appointments/BKG-VIDEO-READY",
      isRead: false,
      createdAt: new Date(Date.now() - 25 * 60000).toISOString()
    },
    {
      id: "NOTIF-PAT-2",
      userId: "USR-PATIENT-DEMO",
      role: "patient",
      type: "MEDICINE",
      notificationType: "medicine_due",
      title: "Medicine Reminder",
      body: "Time to take Amoxicillin 500mg (with water).",
      deepLink: "/patient/medicines",
      isRead: false,
      createdAt: new Date(Date.now() - 60 * 60000).toISOString()
    },
    {
      id: "NOTIF-PAT-3",
      userId: "USR-PATIENT-DEMO",
      role: "patient",
      type: "GENERAL",
      notificationType: "lab_report",
      entityType: "record",
      title: "Lab Report Available",
      body: "Your Complete Blood Count (CBC) report is ready to review.",
      deepLink: "/patient/records",
      isRead: true,
      createdAt: new Date(Date.now() - 240 * 60000).toISOString()
    }
  ],
  sosState: {
    status: 'IDLE'
  },
  providers: SEEDED_PROVIDERS,
  facilities: SEEDED_FACILITIES,
  bookings: [
    // ── UPCOMING ──
    {
      id: "BKG-REQ-1",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Ayesha Siddiqui",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateTomorrow,
      scheduledTime: "11:30 AM",
      status: "requested",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Joint pain and swelling evaluation"
    },
    {
      id: "BKG-CONF-1",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Bilal Tariq",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateIn2Days,
      scheduledTime: "10:00 AM",
      status: "confirmed",
      fee: 2500,
      paymentPolicy: "pay_at_clinic",
      reason: "Cardiology follow-up & ECG review"
    },
    {
      id: "BKG-VIDEO-UPCOMING",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Fatima Noor",
      providerId: "d1",
      facilityId: "FAC-2",
      careType: "online_consultation",
      scheduledDate: dateTomorrow,
      scheduledTime: "04:00 PM",
      status: "confirmed",
      fee: 1800,
      paymentPolicy: "online_full",
      reason: "Skin rash and medication review",
      meetLink: "https://meet.google.com/amh-eidp-oei"
    },
    {
      id: "BKG-HOME-UPCOMING",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Zainab Bibi (Elderly Care)",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "direct_home_visit",
      scheduledDate: dateTomorrow,
      scheduledTime: "02:30 PM",
      status: "confirmed",
      fee: 3500,
      paymentPolicy: "cash_after_home_visit",
      reason: "Post-stroke mobility check & BP monitoring"
    },
    {
      id: "BKG-TOKEN-UPCOMING",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Hamza Ahmed",
      providerId: "d1",
      facilityId: "FAC-2",
      careType: "walk_in_token",
      scheduledDate: dateIn2Days,
      scheduledTime: "09:30 AM",
      status: "confirmed",
      fee: 1200,
      paymentPolicy: "pay_at_clinic",
      reason: "Walk-in seasonal flu & throat checkup"
    },
    {
      id: "BKG-RESCHED-1",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Tariq Mehmood",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateIn3Days,
      scheduledTime: "11:00 AM",
      status: "confirmed",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Rescheduled: Diabetic glycemic control follow-up"
    },

    // ── CURRENT / TODAY ──
    {
      id: "BKG-CHECKIN-TODAY",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Sara Salman",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateToday,
      scheduledTime: "10:00 AM",
      status: "checked_in",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "High fever and body ache (Patient Checked In)"
    },
    {
      id: "BKG-WAITING-TODAY",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Mohammad Usman",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateToday,
      scheduledTime: "10:30 AM",
      status: "in_queue",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Persistent cough and chest congestion"
    },
    {
      id: "BKG-APPROACH-TOKEN",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Khadija Begum",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "walk_in_token",
      scheduledDate: dateToday,
      scheduledTime: "11:00 AM",
      status: "in_queue",
      fee: 1000,
      paymentPolicy: "pay_at_clinic",
      reason: "Token #14 (Token #13 in room — 1 ahead)"
    },
    {
      id: "BKG-YOURTURN-TOKEN",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Rashid Ali",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "walk_in_token",
      scheduledDate: dateToday,
      scheduledTime: "11:15 AM",
      status: "consultation_ready",
      fee: 1000,
      paymentPolicy: "pay_at_clinic",
      reason: "Token #12 — Called into Room 3"
    },
    {
      id: "BKG-PROG-TODAY",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Ali Raza",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateToday,
      scheduledTime: "09:45 AM",
      status: "in_progress",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Post-operative wound inspection & dressing"
    },
    {
      id: "BKG-VIDEO-READY",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Maryam Jahangir",
      providerId: "d1",
      facilityId: "FAC-2",
      careType: "online_consultation",
      scheduledDate: dateToday,
      scheduledTime: "11:30 AM",
      status: "consultation_ready",
      fee: 1500,
      paymentPolicy: "online_full",
      reason: "Pediatric nutrition & allergy consultation",
      meetLink: "https://meet.google.com/amh-eidp-oei"
    },

    // ── PAST ──
    {
      id: "BKG-COMP-SUMMARY",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Zahid Iqbal",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateYesterday,
      scheduledTime: "03:00 PM",
      status: "completed",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Routine annual executive checkup",
      notes: "Physical exam unremarkable. Advised low sodium diet and repeat lipid profile in 3 months."
    },
    {
      id: "BKG-COMP-RX",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Hina Farooq",
      providerId: "d1",
      facilityId: "FAC-2",
      careType: "online_consultation",
      scheduledDate: dateYesterday,
      scheduledTime: "04:30 PM",
      status: "completed",
      fee: 1500,
      paymentPolicy: "online_full",
      reason: "Acute migraine episodes",
      notes: "Prescribed Sumatriptan 50mg PRN and Naproxen 500mg. Advised dark room rest and headache log."
    },
    {
      id: "BKG-COMP-NO-REV",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Farhan Aslam",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: date2DaysAgo,
      scheduledTime: "02:00 PM",
      status: "completed",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Lumbar muscle strain physiotherapy follow-up"
    },
    {
      id: "BKG-COMP-WITH-REV",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Nadia Pervez",
      providerId: "d1",
      facilityId: "FAC-2",
      careType: "online_consultation",
      scheduledDate: date3DaysAgo,
      scheduledTime: "11:00 AM",
      status: "completed",
      fee: 1500,
      paymentPolicy: "online_full",
      reason: "Thyroid medication dosage adjustment"
    },
    {
      id: "BKG-CANCELLED-1",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Kamran Khan",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateYesterday,
      scheduledTime: "01:30 PM",
      status: "cancelled",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Patient cancelled due to unexpected family travel"
    },
    {
      id: "BKG-NOSHOW-1",
      patientId: "USR-PATIENT-DEMO",
      patientName: "Imran Sheikh",
      providerId: "d1",
      facilityId: "FAC-1",
      careType: "in_clinic_doctor",
      scheduledDate: dateYesterday,
      scheduledTime: "12:00 PM",
      status: "no_show",
      fee: 2000,
      paymentPolicy: "pay_at_clinic",
      reason: "Patient did not arrive for scheduled slot"
    }
  ],
  careRequests: [],
  providerQuotes: [],
  queueTokens: [
    {
      id: "TOK-DEMO-1",
      patientId: "USR-PATIENT-DEMO",
      providerId: "d1",
      facilityId: "FAC-1",
      tokenNumber: 12,
      estimatedWaitMinutes: 0,
      status: "CALLED",
      issuedAt: new Date().toISOString()
    }
  ],
  opportunities: [
    { id: 'o1', title: 'Night Shift Medical Officer', facility: 'Liaquat National Hospital', location: 'Karachi', compensation: 'Rs. 4000 / shift', schedule: '8 PM - 8 AM (Weekends)', requirements: 'Valid PMDC, 1 yr experience', deadline: '2026-09-30', status: 'Applied' },
    { id: 'o2', title: 'Locum GP', facility: 'Sehat Sahara Clinic', location: 'Gulshan-e-Iqbal', compensation: 'Rs. 2500 / hr', schedule: 'Flexible', requirements: 'PMDC valid', deadline: '2026-09-10', status: 'Open', applicantsCount: 2 },
  ],
  applications: [],
  conversations: [
    {
      id: "CONV-1",
      referenceId: "REQ-1",
      messages: [
        { id: "MSG-1", senderId: "USR-PATIENT-DEMO", text: "Hello Doctor, I wanted to ask if I should continue taking Panadol if my fever drops?", timestamp: yesterday.toISOString(), isRead: true },
        { id: "MSG-2", senderId: "PROV-1", text: "Hi Ayesha. If your fever drops below 99, you can stop taking Panadol. Just make sure to stay hydrated.", timestamp: new Date(yesterday.getTime() + 3600000).toISOString(), isRead: true },
        { id: "MSG-3", senderId: "USR-PATIENT-DEMO", text: "Thank you doctor!", timestamp: new Date(yesterday.getTime() + 3700000).toISOString(), isRead: false }
      ]
    }
  ],
  reviews: [
    {
      id: "REV-DEMO-1",
      appointmentId: "BKG-COMP-WITH-REV",
      providerId: "d1",
      patientName: "Nadia Pervez",
      rating: 5,
      communication: 5,
      punctuality: 5,
      comment: "Dr. Sarah explained the thyroid treatment with immense care and patience. Truly exceptional experience.",
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ]
};

class PrototypeStoreClass {
  private state: PrototypeAppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): PrototypeAppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Merge to ensure missing arrays are present
          const merged: PrototypeAppState = { 
            ...SEEDED_STATE, 
            ...parsed, 
            version: CURRENT_VERSION 
          };

          // Ensure all SEEDED_PROVIDERS exist in merged.providers
          const providerMap = new Map<string, Provider>();
          SEEDED_PROVIDERS.forEach(p => providerMap.set(p.id, p));
          if (Array.isArray(parsed.providers)) {
            parsed.providers.forEach((p: Provider) => {
              if (p && p.id) {
                const existing = providerMap.get(p.id);
                providerMap.set(p.id, { ...(existing || {}), ...p });
              }
            });
          }

          // Normalize bookingModes on every provider
          merged.providers = Array.from(providerMap.values()).map(p => {
            if (!p.bookingModes || !Array.isArray(p.bookingModes) || p.bookingModes.length === 0) {
              const defaultModes: ('fixed_time' | 'queue_token')[] = 
                (p.id === 'd3' || p.id === 'PROV-3') ? ['queue_token'] :
                (p.id === 'd2' || p.id === 'PROV-2') ? ['fixed_time'] :
                ['fixed_time', 'queue_token'];
              return { ...p, bookingModes: defaultModes };
            }
            return p;
          });

          // Purge junk data
          const isValidText = (text?: string) => {
            if (!text || typeof text !== 'string') return false;
            const trimmed = text.trim();
            if (trimmed.length < 3) return false;
            const letters = trimmed.match(/[a-zA-Z]/g);
            if (!letters || letters.length < 2) return false;
            if (/^\d+$/.test(trimmed)) return false;
            if (/^(.)\1+$/.test(trimmed)) return false;
            return true;
          };

          merged.bloodRequests = (merged.bloodRequests || []).filter((r: any) => 
            isValidText(r?.hospitalName) && isValidText(r?.location) && isValidText(r?.requesterName)
          );
          merged.sharedItems = (merged.sharedItems || []).filter((i: any) => 
            isValidText(i?.title) && isValidText(i?.location)
          );

          // Purge duplicate bookings (same provider + date + time slot)
          const seenBookings = new Set<string>();
          merged.bookings = (merged.bookings || []).filter((b: any) => {
            if (!b || !b.id) return false;
            const key = `${b.providerId}-${b.scheduledDate}-${b.scheduledTime}`;
            if (seenBookings.has(key)) return false;
            seenBookings.add(key);
            return true;
          });
          
          if (Array.isArray(merged.bookings)) {
            merged.bookings = merged.bookings.map((b: any) => {
              if (b.providerId === 'PROV-1') {
                return { ...b, providerId: 'd1' };
              }
              return b;
            });
            
            // If version upgraded or seeded bookings are missing/stale, update them
            const seededBookingMap = new Map<string, any>();
            SEEDED_STATE.bookings.forEach((sb: any) => seededBookingMap.set(sb.id, sb));
            
            if (!parsed.version || parsed.version < CURRENT_VERSION) {
              // Update existing seeded bookings with new rich properties
              merged.bookings = merged.bookings.map((b: any) => {
                if (seededBookingMap.has(b.id)) {
                  const seed = seededBookingMap.get(b.id);
                  return { ...seed, ...b, patientName: seed.patientName || b.patientName };
                }
                return b;
              });
            }

            // Ensure all seeded demo bookings exist
            SEEDED_STATE.bookings.forEach((sb: any) => {
              if (!merged.bookings.some((b: any) => b.id === sb.id)) {
                merged.bookings.push(sb);
              }
            });
          }

          // Ensure all seeded notifications exist and have updated fields
          if (!Array.isArray(merged.notifications) || merged.notifications.length === 0) {
            merged.notifications = [...SEEDED_STATE.notifications];
          } else {
            const notifMap = new Map<string, any>();
            merged.notifications.forEach((n: any) => notifMap.set(n.id, n));
            SEEDED_STATE.notifications.forEach((sn: any) => {
              if (notifMap.has(sn.id)) {
                const existing = notifMap.get(sn.id);
                // Preserve user's isRead state if already read
                notifMap.set(sn.id, { ...sn, ...existing, deepLink: sn.deepLink, entityType: sn.entityType, entityId: sn.entityId });
              } else {
                notifMap.set(sn.id, sn);
              }
            });
            merged.notifications = Array.from(notifMap.values());
          }

          // Ensure seeded reviews exist
          if (!Array.isArray(merged.reviews)) {
            merged.reviews = [...SEEDED_STATE.reviews];
          } else {
            SEEDED_STATE.reviews.forEach((sr: any) => {
              if (!merged.reviews.some((r: any) => r.id === sr.id)) {
                merged.reviews.push(sr);
              }
            });
          }

          if (!Array.isArray(merged.queueTokens) || merged.queueTokens.length === 0) {
            merged.queueTokens = SEEDED_STATE.queueTokens;
          }

          return merged;
        }
      }
    } catch {
      console.warn('Failed to parse prototype data state, resetting to seeded.');
    }
    return { ...SEEDED_STATE };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch {
      console.error('Failed to save prototype data state.');
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  getSnapshot = () => {
    return this.state;
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  updateState(updates: Partial<PrototypeAppState>) {
    this.state = { ...this.state, ...updates };
    this.saveState();
  }

  reset() {
    this.state = { ...SEEDED_STATE };
    this.saveState();
  }

  // Helper Methods for specific mutations
  addBloodRequest(request: BloodRequest) {
    const exists = this.state.bloodRequests.some(r => r.id === request.id);
    if (exists) {
      this.updateState({
        bloodRequests: this.state.bloodRequests.map(r => r.id === request.id ? { ...r, ...request } : r)
      });
    } else {
      this.updateState({ bloodRequests: [request, ...this.state.bloodRequests] });
    }
  }

  updateBloodRequest(id: string, updates: Partial<BloodRequest>) {
    this.updateState({
      bloodRequests: this.state.bloodRequests.map(r => r.id === id ? { ...r, ...updates } : r)
    });
  }

  addSharedItem(item: SharedItem) {
    this.updateState({ sharedItems: [item, ...this.state.sharedItems] });
  }

  updateSharedItem(id: string, updates: Partial<SharedItem>) {
    this.updateState({
      sharedItems: this.state.sharedItems.map(i => i.id === id ? { ...i, ...updates } : i)
    });
  }

  addMedicineCourse(course: MedicineCourse, doses: MedicineDose[]) {
    this.updateState({
      medicineCourses: [course, ...this.state.medicineCourses],
      medicineDoses: [...doses, ...this.state.medicineDoses]
    });
  }

  updateMedicineDose(id: string, updates: Partial<MedicineDose>) {
    this.updateState({
      medicineDoses: this.state.medicineDoses.map(d => d.id === id ? { ...d, ...updates } : d)
    });
  }

  updateMedicineCourse(id: string, updates: Partial<MedicineCourse>) {
    this.updateState({
      medicineCourses: this.state.medicineCourses.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  }

  deleteMedicineCourse(id: string) {
    this.updateState({
      medicineCourses: this.state.medicineCourses.filter(c => c.id !== id),
      medicineDoses: this.state.medicineDoses.filter(d => d.courseId !== id)
    });
  }

  addBooking(booking: Booking) {
    this.updateState({ bookings: [booking, ...this.state.bookings] });
  }

  updateBooking(id: string, updates: Partial<Booking>) {
    this.updateState({
      bookings: this.state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
    });
  }

  addNotification(notif: AppNotification) {
    this.updateState({ notifications: [notif, ...this.state.notifications] });
  }

  addConversation(conv: RequestConversation) {
    this.updateState({ conversations: [conv, ...this.state.conversations] });
  }

  addMessageToConversation(conversationId: string, message: any) {
    this.updateState({
      conversations: this.state.conversations.map(c => 
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
      )
    });
  }

  addReview(review: Review) {
    const updatedReviews = [review, ...this.state.reviews];
    let updatedProviders = this.state.providers;
    if (review.providerId) {
      updatedProviders = this.state.providers.map(p => {
        if (p.id === review.providerId) {
          const pReviews = [review, ...(p.reviews || [])];
          const totalRating = pReviews.reduce((sum, r) => sum + (r.rating || 5), 0);
          const newAvg = Number((totalRating / pReviews.length).toFixed(1));
          return {
            ...p,
            reviewsCount: (p.reviewsCount || 0) + 1,
            rating: newAvg,
            reviews: pReviews
          };
        }
        return p;
      });
    }

    const notif: AppNotification = {
      id: `NOTIF-REV-${Date.now()}`,
      userId: review.providerId || 'd1',
      type: 'GENERAL',
      title: 'New Review Received',
      body: `${review.isAnonymous ? 'A patient' : (review.patientName || 'A patient')} left a ${review.rating}★ review: "${review.comment?.slice(0, 45) || 'Great experience'}"`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: '/doctor/profile'
    };

    this.updateState({ 
      reviews: updatedReviews,
      providers: updatedProviders,
      notifications: [notif, ...this.state.notifications]
    });
  }

  updateQueueToken(id: string, updates: Partial<QueueToken>) {
    this.updateState({
      queueTokens: this.state.queueTokens.map(t => t.id === id ? { ...t, ...updates } : t)
    });
  }

  addBloodDonorResponse(requestId: string, response: any) {
    const updated = this.state.bloodRequests.map(r => {
      if (r.id === requestId) {
        const existing = r.donorResponses || [];
        const filtered = existing.filter((res: any) => res.donorId !== response.donorId && res.donorName !== response.donorName);
        return {
          ...r,
          state: 'RESPONDED' as any,
          donorResponses: [response, ...filtered]
        };
      }
      return r;
    });
    this.updateState({ bloodRequests: updated });
  }

  withdrawBloodDonorResponse(requestId: string, donorId: string) {
    const updated = this.state.bloodRequests.map(r => {
      if (r.id === requestId) {
        const existing = r.donorResponses || [];
        const remaining = existing.filter((res: any) => res.donorId !== donorId);
        return {
          ...r,
          state: remaining.length > 0 ? ('RESPONDED' as any) : ('OPEN' as any),
          donorResponses: remaining
        };
      }
      return r;
    });
    this.updateState({ bloodRequests: updated });
  }

  addOpportunity(opp: ProviderOpportunity) {
    this.updateState({ opportunities: [opp, ...this.state.opportunities] });
  }

  updateOpportunity(id: string, updates: Partial<ProviderOpportunity>) {
    this.updateState({
      opportunities: this.state.opportunities.map(o => o.id === id ? { ...o, ...updates } : o)
    });
  }

  addApplication(app: ProviderOpportunityApplication) {
    this.updateState({ applications: [app, ...this.state.applications] });
  }

  updateApplication(id: string, updates: Partial<ProviderOpportunityApplication>) {
    this.updateState({
      applications: this.state.applications.map(a => a.id === id ? { ...a, ...updates } : a)
    });
  }

  markNotificationAsRead(id: string) {
    this.updateState({
      notifications: this.state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    });
  }

  markAllNotificationsAsRead(role?: string) {
    this.updateState({
      notifications: this.state.notifications.map(n => {
        if (!role || n.role === role || n.role === 'all' || !n.role) {
          return { ...n, isRead: true };
        }
        return n;
      })
    });
  }
}

export const PrototypeStore = new PrototypeStoreClass();
