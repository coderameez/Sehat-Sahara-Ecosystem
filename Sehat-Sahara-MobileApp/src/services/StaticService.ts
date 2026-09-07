import { SehatSaharaService } from './SehatSaharaService';
import { Appointment, BloodRequest, DoctorProfile, SharedItem, User } from '../models';
import { TriageInput, TriageOutput, ConsultNoteInput, ConsultNoteOutput } from '../ai/contracts';

/**
 * StaticService
 * Provides deterministic static seed data for offline preview and static testing.
 */
export class StaticService implements SehatSaharaService {
  readonly mode = 'STATIC' as const;

  async getCurrentUser(): Promise<User | null> {
    return {
      id: 'USR-PATIENT-01',
      name: 'Ali Ahmed',
      phone: '0333 1234567',
      role: 'PATIENT',
      createdAt: '2026-05-01T10:00:00Z',
    };
  }

  async searchDoctors(_params?: { query?: string; specialty?: string; visitType?: string }): Promise<DoctorProfile[]> {
    return [];
  }

  async getDoctorById(_id?: string): Promise<DoctorProfile | null> {
    return null;
  }

  async createBooking(): Promise<Appointment> {
    throw new Error('StaticService does not mutate data. Switch to DEMO or API mode.');
  }

  async getAppointments(): Promise<Appointment[]> {
    return [];
  }

  async getBloodRequests(): Promise<BloodRequest[]> {
    return [];
  }

  async createBloodRequest(): Promise<BloodRequest> {
    throw new Error('StaticService does not mutate data.');
  }

  async getSharedItems(): Promise<SharedItem[]> {
    return [];
  }

  async createSharedItem(): Promise<SharedItem> {
    throw new Error('StaticService does not mutate data.');
  }

  async performTriage(input: TriageInput): Promise<TriageOutput> {
    return {
      severity: input.redFlags?.length ? 'CRITICAL' : 'ROUTINE',
      summary: 'Deterministic static assessment placeholder',
      recommendedNextSteps: ['Consult a medical professional'],
      disclaimer: 'AI guidance is not a diagnosis. Always consult a qualified healthcare professional.',
    };
  }

  async generateConsultNote(_input?: ConsultNoteInput): Promise<ConsultNoteOutput> {
    return {
      subjective: 'Patient reports mild symptoms.',
      objective: 'Vitals stable.',
      assessment: ['General checkup'],
      plan: ['Follow-up in 2 weeks'],
      requiresDoctorApproval: true,
    };
  }
}
