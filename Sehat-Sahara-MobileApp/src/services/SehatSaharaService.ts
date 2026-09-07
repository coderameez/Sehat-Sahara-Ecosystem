import { Appointment, BloodRequest, DoctorProfile, SharedItem, User } from '../models';
import { TriageInput, TriageOutput, ConsultNoteInput, ConsultNoteOutput } from '../ai/contracts';

/**
 * Common SehatSaharaService Interface
 * Implemented across STATIC, DEMO, and API modes.
 */
export interface SehatSaharaService {
  readonly mode: 'STATIC' | 'DEMO' | 'API';

  // Identity / Auth
  getCurrentUser(): Promise<User | null>;

  // Doctor & Booking
  searchDoctors(params: { query?: string; specialty?: string; visitType?: string }): Promise<DoctorProfile[]>;
  getDoctorById(id: string): Promise<DoctorProfile | null>;
  createBooking(data: Partial<Appointment>, idempotencyKey: string): Promise<Appointment>;
  getAppointments(userId: string): Promise<Appointment[]>;

  // Community
  getBloodRequests(): Promise<BloodRequest[]>;
  createBloodRequest(data: Partial<BloodRequest>, idempotencyKey: string): Promise<BloodRequest>;
  getSharedItems(): Promise<SharedItem[]>;
  createSharedItem(data: Partial<SharedItem>, idempotencyKey: string): Promise<SharedItem>;

  // AI Operations
  performTriage(input: TriageInput): Promise<TriageOutput>;
  generateConsultNote(input: ConsultNoteInput): Promise<ConsultNoteOutput>;
}
