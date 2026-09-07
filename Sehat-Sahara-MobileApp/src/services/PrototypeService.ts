import { SehatSaharaService } from './SehatSaharaService';
import { Appointment, BloodRequest, DoctorProfile, SharedItem, User } from '../models';
import { TriageInput, TriageOutput, ConsultNoteInput, ConsultNoteOutput } from '../ai/contracts';
import { PrototypeStore } from './PrototypeStore';
import { OnboardingStore, FALLBACK_PROFILE } from './OnboardingStore';
import { CounterpartEngine } from './prototype/CounterpartEngine';

/**
 * PrototypeService (DEMO mode)
 * Handles controlled scenarios, seeded responses, and simulated transitions.
 */
export class PrototypeService implements SehatSaharaService {
  readonly mode = 'DEMO' as const;

  async getCurrentUser(): Promise<User | null> {
    const obState = OnboardingStore.getSnapshot();
    const profile = obState.profile || FALLBACK_PROFILE;
    return {
      id: 'USR-PATIENT-DEMO',
      name: profile.name,
      phone: profile.phone,
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

  async createBooking(data: Partial<Appointment>, _idempotencyKey?: string): Promise<Appointment> {
    const obState = OnboardingStore.getSnapshot();
    const profile = obState.profile || FALLBACK_PROFILE;
    
    const booking: Appointment = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      patientId: 'USR-PATIENT',
      patientName: profile.name.split(' ')[0],
      doctorId: data.doctorId || 'DOC-01',
      doctorName: data.doctorName || 'Dr. Sana Khan',
      visitType: data.visitType || 'VIDEO',
      scheduledDate: data.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: data.scheduledTime || '10:00 AM',
      status: 'CONFIRMED',
      tokenNumber: 15,
      estimatedWaitMinutes: 25,
      consultationFee: data.consultationFee || 1200,
    };

    CounterpartEngine.scheduleBookingConfirmation(booking.id);
    return booking;
  }

  async getAppointments(_userId?: string): Promise<Appointment[]> {
    return [];
  }

  async getBloodRequests(): Promise<BloodRequest[]> {
    return PrototypeStore.getSnapshot().bloodRequests;
  }

  async createBloodRequest(data: Partial<BloodRequest>, _idempotencyKey?: string): Promise<BloodRequest> {
    const obState = OnboardingStore.getSnapshot();
    const profile = obState.profile || FALLBACK_PROFILE;
    const isDoctor = obState.role?.toLowerCase() === 'doctor';
    
    const newRequest: BloodRequest = {
      id: data.id || `BLD-${Date.now().toString().slice(-6)}`,
      requesterId: data.requesterId || (isDoctor ? 'USR-DOCTOR-DEMO' : 'USR-PATIENT-DEMO'),
      requesterName: data.requesterName || (isDoctor ? 'Dr. Ayesha Khan' : profile.name),
      bloodGroup: data.bloodGroup || 'B+',
      unitsRequired: data.unitsRequired || 1,
      urgency: data.urgency || 'STANDARD',
      hospitalName: data.hospitalName || 'Jinnah Hospital, Karachi',
      location: data.location || profile.area || 'Karachi',
      contactNumber: data.contactNumber || profile.phone || '0300-0000000',
      state: 'OPEN',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hrs
    };

    PrototypeStore.addBloodRequest(newRequest);
    CounterpartEngine.scheduleBloodDonors(newRequest.id);
    return newRequest;
  }

  async getSharedItems(): Promise<SharedItem[]> {
    return PrototypeStore.getSnapshot().sharedItems;
  }

  async createSharedItem(data: Partial<SharedItem>, _idempotencyKey?: string): Promise<SharedItem> {
    const obState = OnboardingStore.getSnapshot();
    const profile = obState.profile || FALLBACK_PROFILE;
    
    const newItem: SharedItem = {
      id: `ITM-${Date.now().toString().slice(-6)}`,
      ownerId: 'USR-PATIENT-DEMO',
      ownerName: profile.name,
      title: data.title || 'Item',
      category: data.category || 'Other',
      condition: data.condition || 'Good',
      location: data.location || profile.area,
      distanceKm: 0,
      availableDays: data.availableDays || 7,
      state: 'AVAILABLE',
      imageUrl: data.imageUrl,
      description: data.description,
    };

    PrototypeStore.addSharedItem(newItem);
    return newItem;
  }

  async performTriage(input: TriageInput): Promise<TriageOutput> {
    const isCritical = input.symptoms.some(s => s.toLowerCase().includes('chest') || s.toLowerCase().includes('heart') || s.toLowerCase().includes('bleed'));
    return {
      severity: isCritical ? 'CRITICAL' : 'ROUTINE',
      summary: isCritical ? 'Critical symptoms detected' : 'Routine symptoms detected',
      recommendedNextSteps: isCritical
        ? ['Activate Emergency SOS immediately', 'Get to the nearest hospital']
        : ['Book a consultation with a General Physician for further evaluation'],
      disclaimer: 'AI guidance is not a diagnosis. Always consult a qualified healthcare professional.',
    };
  }

  async generateConsultNote(_input?: ConsultNoteInput): Promise<ConsultNoteOutput> {
    return {
      subjective: 'Patient presented with headache and fever for 2 days.',
      objective: 'Temp 99.4F, BP 120/80.',
      assessment: ['Viral Upper Respiratory Infection'],
      plan: ['Paracetamol 500mg TDS', 'Hydration', 'Rest'],
      requiresDoctorApproval: true,
    };
  }
}
