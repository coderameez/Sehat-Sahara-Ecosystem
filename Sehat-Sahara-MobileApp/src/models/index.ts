/**
 * Sehat Sahara Core Domain Models
 * Aligned with Locked MVP Boundary and Canonical Data Schemas
 */

export type ProviderRole = "DOCTOR" | "STUDENT"; // Legacy
export type FacilityType = "BASIC_CLINIC" | "POLY_CLINIC" | "HOSPITAL"; // Legacy
export type ServiceMode = "STATIC" | "DEMO" | "API";
export type BloodState = "OPEN" | "RESPONDED" | "FULFILLED" | "CLOSED";
export type ItemState = "AVAILABLE" | "REQUESTED" | "BORROWED" | "RETURNED" | "CLOSED";
export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED" | "CORRECTIONS_REQUIRED";
export type BloodUrgency = "STANDARD" | "URGENT" | "SOS";

// --- New Care Domain Enums ---
export type CareType = 
  | "in_clinic_doctor"
  | "online_consultation"
  | "direct_home_visit"
  | "open_care_request"
  | "facility_named_doctor"
  | "facility_service"
  | "walk_in_token"
  | "home_care_support";

export type ProviderType = 
  | "independent_doctor"
  | "facility_doctor"
  | "dentist"
  | "nurse"
  | "physiotherapist"
  | "caregiver"
  | "supervised_medical_student"
  | "facility_team";

export type FulfilmentType = 
  | "instant_confirmation"
  | "provider_approval"
  | "facility_approval"
  | "quote_acceptance"
  | "queue_token";

export type PaymentPolicy = 
  | "online_full"
  | "online_deposit"
  | "simulated_escrow"
  | "pay_at_clinic"
  | "pay_at_counter"
  | "cash_after_home_visit"
  | "token_fee_online"
  | "no_payment_required";

export type BookingState = 
  | "draft"
  | "published"
  | "quotes_received"
  | "requested"
  | "awaiting_provider"
  | "awaiting_facility"
  | "payment_pending"
  | "payment_held"
  | "confirmed"
  | "checked_in"
  | "in_queue"
  | "consultation_ready"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected"
  | "no_show"
  | "refund_pending"
  | "refunded";

// --- New Core Domain Models ---

export interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Review {
  id: string;
  appointmentId?: string;
  providerId?: string;
  patientName: string;
  rating: number;
  communication?: number;
  punctuality?: number;
  careExperience?: number;
  comment: string;
  isAnonymous?: boolean;
  date: string;
  createdAt?: string;
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  providerType: ProviderType;
  verificationStatus: VerificationStatus;
  specialty: string;
  qualification: string;
  experienceYears: number;
  languages: string[];
  careTypes: CareType[];
  fees: Record<CareType, number>;
  serviceAreas?: string[]; // For home visit
  facilityAffiliations?: string[]; // Facility IDs
  availability: AvailabilitySlot[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  avatarUrl?: string;
  introVideoUrl?: string;
  about: string;
  bookingModes?: ("fixed_time" | "queue_token")[];
}

export interface Department {
  id: string;
  name: string;
}

export interface FacilityService {
  id: string;
  departmentId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  preparationInstructions?: string;
  availability: AvailabilitySlot[];
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  departments: Department[];
  services: FacilityService[];
  doctors: string[]; // Provider IDs
  hours: string; // e.g. "9:00 AM - 10:00 PM"
  paymentPolicies: PaymentPolicy[];
  approvalMode: FulfilmentType;
  tokenSupport: boolean;
  queueConfiguration?: any;
  bookingModes?: ("fixed_time" | "queue_token")[];
}

export interface Facility {
  id: string;
  name: string;
  type: "HOSPITAL" | "CLINIC" | "LABORATORY";
  logoUrl?: string;
  branches: Branch[];
}

export interface Booking {
  id: string;
  patientId: string;
  patientName?: string;
  patientPhone?: string;
  providerId?: string;
  facilityId?: string;
  branchId?: string;
  careType: CareType;
  scheduledDate?: string;
  scheduledTime?: string;
  status: BookingState;
  fee: number;
  paymentPolicy: PaymentPolicy;
  reason?: string;
  meetLink?: string;
  notes?: string;
}

export interface CareRequest {
  id: string;
  patientId: string;
  patientName: string;
  status: BookingState;
  requestedRole: string;
  symptoms: string;
  urgency: string;
  location: string;
  preferredDate: string;
  timeWindow: string;
  budget?: string;
  createdAt: string;
}

export interface ProviderQuote {
  id: string;
  requestId: string;
  providerId: string;
  proposedPrice: number;
  arrivalTime: string;
  travelIncluded: boolean;
  estimatedDuration: string;
  message: string;
  validUntil: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: "PENDING" | "HELD" | "PAID" | "REFUND_PENDING" | "REFUNDED" | "FAILED";
  timestamp: string;
}

export interface CreditTransaction {
  id: string;
  providerId: string;
  amount: number;
  reason: string;
  referenceId?: string;
  timestamp: string;
}

export interface QueueToken {
  id: string;
  patientId: string;
  facilityId?: string;
  branchId?: string;
  departmentId?: string;
  providerId?: string;
  tokenNumber: number;
  estimatedWaitMinutes: number;
  status: "IN_QUEUE" | "CALLED" | "SERVING" | "COMPLETED" | "CANCELLED" | "MISSED";
  issuedAt: string;
}

export interface AppointmentActivity {
  id: string;
  bookingId: string;
  action: string;
  timestamp: string;
}

export interface RequestConversation {
  id: string;
  referenceId: string; // Booking or Request ID
  messages: any[];
}

export interface SelectedRecordAttachment {
  id: string;
  recordId: string;
  bookingId: string;
}

export interface CancellationPolicy {
  id: string;
  careType: CareType;
  rules: string[];
}

// --- Legacy Models (Preserved for B00-B09 transitions) ---
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "PATIENT" | "DOCTOR" | "FACILITY" | "ADMIN";
  avatarUrl?: string;
  createdAt: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  fullName: string;
  cnic?: string;
  gender: "Male" | "Female" | "Other";
  dob?: string;
  bloodGroup?: string;
  location: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  pmdcNumber: string;
  specialty: string;
  providerRole: ProviderRole;
  verificationStatus: VerificationStatus;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  reviewsCount: number;
  avatarUrl?: string;
}

export interface FacilityProfile {
  id: string;
  name: string;
  type: FacilityType;
  city: string;
  address: string;
  primaryContact: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export type AppointmentStatus = "CONFIRMED" | "CHECKED_IN" | "QUEUED" | "IN_CONSULTATION" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  facilityId?: string;
  facilityName?: string;
  visitType: "VIDEO" | "CLINIC" | "HOME";
  scheduledDate: string;
  scheduledTime: string;
  status: AppointmentStatus;
  tokenNumber?: number;
  estimatedWaitMinutes?: number;
  consultationFee: number;
}

export interface BloodDonorResponse {
  id: string;
  requestId: string;
  donorId: string;
  donorName: string;
  donorRole: 'patient' | 'doctor';
  status: 'PENDING' | 'ACCEPTED' | 'WITHDRAWN' | 'COMPLETED';
  respondedAt: string;
  message?: string;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  bloodGroup: string;
  unitsRequired: number;
  urgency: BloodUrgency;
  hospitalName: string;
  location: string;
  contactNumber: string;
  state: BloodState;
  createdAt: string;
  expiresAt: string;
  donorResponses?: BloodDonorResponse[];
}

export interface SharedItem {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  category: "Wheelchair" | "Oxygen" | "Crutches" | "Walking Frame" | "Hospital Bed" | "Other";
  condition: string;
  location: string;
  distanceKm: number;
  availableDays: number;
  state: ItemState;
  imageUrl?: string;
  description?: string;
  borrowerName?: string;
  borrowerId?: string;
}

export type MedicineFrequency = "ONCE" | "DAILY" | "CUSTOM";
export type MealRelation = "BEFORE_MEAL" | "AFTER_MEAL" | "WITH_MEAL" | "ANYTIME";

export interface MedicineCourse {
  id: string;
  patientId: string;
  name: string;
  strength: string;
  form: string;
  frequency: MedicineFrequency;
  startDate: string; // ISO date
  endDate?: string;  // ISO date
  mealRelation: MealRelation;
  notes?: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  exactTimes: string[]; // e.g., ["08:00", "20:00"]
}

export interface MedicineDose {
  id: string;
  courseId: string;
  patientId: string;
  medicineName: string;
  scheduledTime: string; // ISO datetime
  status: "DUE" | "TAKEN" | "SKIPPED" | "SNOOZED";
  takenAt?: string; // ISO datetime
  snoozedUntil?: string; // ISO datetime
  skipReason?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "SOS" | "BLOOD" | "THINGS" | "MEDICINE" | "GENERAL" | string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO datetime
  deepLink?: string;
  entityType?: 'appointment' | 'queue_token' | 'review' | 'blood_request' | 'borrow_item' | 'opportunity' | 'care_marketplace' | string;
  entityId?: string;
  notificationType?: string;
  role?: 'patient' | 'provider' | 'all';
}

export interface SOSState {
  status: "IDLE" | "CONFIRMATION" | "COUNTDOWN" | "ACTIVE" | "RESPONDED" | "CANCELLED" | "ENDED";
  reason?: string;
  startedAt?: string;
}
