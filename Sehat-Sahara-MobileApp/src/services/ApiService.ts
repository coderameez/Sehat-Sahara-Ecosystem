import { SehatSaharaService } from './SehatSaharaService';
import { Appointment, BloodRequest, DoctorProfile, SharedItem, User } from '../models';
import { TriageInput, TriageOutput, ConsultNoteInput, ConsultNoteOutput } from '../ai/contracts';

/**
 * ApiService
 * Communicates with the live backend REST/WebSocket endpoints.
 */
export class ApiService implements SehatSaharaService {
  readonly mode = 'API' as const;
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getCurrentUser(): Promise<User | null> {
    const res = await fetch(`${this.baseUrl}/auth/me`);
    if (!res.ok) return null;
    return res.json();
  }

  async searchDoctors(params: { query?: string; specialty?: string; visitType?: string }): Promise<DoctorProfile[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${this.baseUrl}/doctors?${query}`);
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  }

  async getDoctorById(id: string): Promise<DoctorProfile | null> {
    const res = await fetch(`${this.baseUrl}/doctors/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async createBooking(data: Partial<Appointment>, idempotencyKey: string): Promise<Appointment> {
    const res = await fetch(`${this.baseUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    const res = await fetch(`${this.baseUrl}/appointments?userId=${userId}`);
    if (!res.ok) return [];
    return res.json();
  }

  async getBloodRequests(): Promise<BloodRequest[]> {
    const res = await fetch(`${this.baseUrl}/community/blood`);
    if (!res.ok) return [];
    return res.json();
  }

  async createBloodRequest(data: Partial<BloodRequest>, idempotencyKey: string): Promise<BloodRequest> {
    const res = await fetch(`${this.baseUrl}/community/blood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create blood request');
    return res.json();
  }

  async getSharedItems(): Promise<SharedItem[]> {
    const res = await fetch(`${this.baseUrl}/community/things`);
    if (!res.ok) return [];
    return res.json();
  }

  async createSharedItem(data: Partial<SharedItem>, idempotencyKey: string): Promise<SharedItem> {
    const res = await fetch(`${this.baseUrl}/community/things`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create shared item');
    return res.json();
  }

  async performTriage(input: TriageInput): Promise<TriageOutput> {
    const res = await fetch(`${this.baseUrl}/ai/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('Failed to execute AI triage');
    return res.json();
  }

  async generateConsultNote(input: ConsultNoteInput): Promise<ConsultNoteOutput> {
    const res = await fetch(`${this.baseUrl}/ai/consult-note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error('Failed to generate consult note');
    return res.json();
  }
}
