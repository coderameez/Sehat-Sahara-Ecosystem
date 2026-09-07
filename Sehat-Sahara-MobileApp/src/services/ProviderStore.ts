import { OnboardingStore } from './OnboardingStore';
import { PrototypeStore } from './PrototypeStore';
import { getProviderJourney, getProviderDisplayIdentity, ProviderJourney, VerificationStatus } from './ProviderCapabilities';

export type { ProviderJourney, VerificationStatus };

export interface ProviderIdentity {
  name: string;
  label: string;
  avatarUrl?: string;
}

export interface ProviderAppointment {
  id: string;
  patientName: string;
  patientInitials: string;
  mode: string;
  date: string;
  time: string;
  facility: string;
  reason: string;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled' | 'Waiting' | 'Requested';
  paymentStatus?: 'Paid' | 'Pending' | 'N/A';
  unreadMessage: boolean;
  rawStatus?: string;
}

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
}

export interface ProviderState {
  version: number;
  identity: ProviderIdentity;
  journey: ProviderJourney;
  verificationStatus: VerificationStatus;
  appointments: ProviderAppointment[];
  opportunities: ProviderOpportunity[];
  unreadMessagesCount: number;
  creditBalance: number;
  reviewsCount: number;
  rating: number;
}

const CURRENT_VERSION = 1;

class ProviderStoreClass {
  private listeners: Set<() => void> = new Set();
  private cachedSnapshot: ProviderState | null = null;

  constructor() {
    // Listen to PrototypeStore and OnboardingStore, then invalidate cache and notify ProviderStore listeners
    PrototypeStore.subscribe(() => {
      this.cachedSnapshot = null;
      this.notifyListeners();
    });
    OnboardingStore.subscribe(() => {
      this.cachedSnapshot = null;
      this.notifyListeners();
    });
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  getSnapshot = (): ProviderState => {
    if (!this.cachedSnapshot) {
      this.cachedSnapshot = this.computeSnapshot();
    }
    return this.cachedSnapshot;
  };

  private computeSnapshot(): ProviderState {
    const journey = getProviderJourney();
    const identityDisplay = getProviderDisplayIdentity();
    const prototypeState = PrototypeStore.getSnapshot();

    // Map bookings to ProviderAppointments
    const appointments: ProviderAppointment[] = prototypeState.bookings.map(b => {
      // Map mode from careType
      let mode = 'Clinic';
      if (b.careType === 'online_consultation') mode = 'Video';
      if (b.careType === 'walk_in_token') mode = 'Walk-in/Token';
      if (b.careType === 'direct_home_visit') mode = 'Home Visit';

      // Map status
      let status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled' | 'Waiting' | 'Requested' = 'Upcoming';
      if (b.status === 'requested') status = 'Requested';
      else if (b.status === 'confirmed') status = 'Upcoming';
      else if (b.status === 'checked_in' || b.status === 'in_queue') status = 'Waiting';
      else if (b.status === 'in_progress' || b.status === 'consultation_ready') status = 'Active';
      else if (b.status === 'completed') status = 'Completed';
      else if (b.status === 'cancelled' || b.status === 'no_show') status = 'Cancelled';

      const paymentStatus = (b.paymentPolicy === 'no_payment_required' || b.paymentPolicy === 'pay_at_clinic' || b.paymentPolicy === 'pay_at_counter') ? 'Pending' : 'Paid';

      const patientName = b.patientName || (b.patientId === 'USR-PATIENT-DEMO' ? 'Ayesha Siddiqui' : 'Patient');
      const patientInitials = patientName
        .split(' ')
        .map(n => n[0])
        .filter(Boolean)
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'PT';

      const facilityName = 
        b.facilityId === 'FAC-1' ? 'Aga Khan University Hospital' : 
        b.facilityId === 'FAC-2' ? 'City Care Clinic' : 
        (b.facilityId || 'Sehat Clinic');

      return {
        id: b.id,
        patientName, 
        patientInitials,
        mode,
        date: b.scheduledDate || '',
        time: b.scheduledTime || '',
        facility: facilityName,
        reason: b.reason || 'Consultation',
        status,
        paymentStatus,
        unreadMessage: false,
        rawStatus: b.status
      };
    });

    const opportunities = prototypeState.opportunities || [];

    // Filter appointments for student vs others
    const filteredAppointments = appointments;

    const reviews = prototypeState.reviews || [];
    const providerReviews = reviews;
    const reviewsCount = providerReviews.length + 15; // 15 base reviews
    const avgRating = providerReviews.length > 0 
      ? (providerReviews.reduce((acc, r) => acc + r.rating, 0) + (15 * 4.8)) / reviewsCount 
      : 4.8;

    const unreadNotifsCount = (prototypeState.notifications || []).filter(
      n => (n.role === 'provider' || n.role === 'all' || !n.role) && !n.isRead
    ).length;

    return {
      version: CURRENT_VERSION,
      identity: { 
        name: identityDisplay.name, 
        label: identityDisplay.label, 
        avatarUrl: identityDisplay.avatarUrl 
      },
      journey,
      verificationStatus: identityDisplay.badge,
      appointments: filteredAppointments,
      opportunities: opportunities as any,
      unreadMessagesCount: unreadNotifsCount,
      creditBalance: 12500,
      reviewsCount,
      rating: parseFloat(avgRating.toFixed(1))
    };
  }

  updateState(_updates: Partial<ProviderState>) {
    // Cannot update directly anymore, state is derived
    console.warn("ProviderStore.updateState called but state is now derived from PrototypeStore.");
  }

  reset() {
    // Handled by PrototypeStore/OnboardingStore reset
  }
}

export const ProviderStore = new ProviderStoreClass();
