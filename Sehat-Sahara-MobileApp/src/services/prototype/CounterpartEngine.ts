import { PrototypeStore } from '../PrototypeStore';
import { AppNotification } from '../../models';

interface ScheduledEvent {
  id: string;
  type: string;
  executeAt: number; // timestamp
  data: any;
}

const STORAGE_KEY = 'sehat_sahara_scheduled_events';

class CounterpartEngineClass {
  private events: ScheduledEvent[] = [];
  private intervalId: number | null = null;

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch {
      this.events = [];
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
    } catch {
      console.error('Failed to save scheduled events');
    }
  }

  public start() {
    if (this.intervalId !== null) return;
    
    // Check every second for events that are due
    this.intervalId = window.setInterval(() => {
      const now = Date.now();
      const dueEvents = this.events.filter(e => e.executeAt <= now);
      
      if (dueEvents.length > 0) {
        this.events = this.events.filter(e => e.executeAt > now);
        this.saveEvents();
        
        for (const event of dueEvents) {
          console.log(`[CounterpartEngine] Executing event: ${event.type}`, event.data);
          this.executeEvent(event);
        }
      }
    }, 1000);
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public reset() {
    this.events = [];
    this.saveEvents();
  }

  private schedule(type: string, delayMs: number, data: any) {
    const event: ScheduledEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      executeAt: Date.now() + delayMs,
      data,
    };
    console.log(`[CounterpartEngine] Scheduled ${type} in ${delayMs}ms`, data);
    this.events.push(event);
    this.saveEvents();
  }

  // --- API for triggering counterpart behaviors ---

  public scheduleBloodDonors(requestId: string) {
    this.schedule('BLOOD_REQUEST_INTEREST', 6000, { requestId });
  }

  public scheduleBloodAcceptance(requestId: string) {
    this.schedule('BLOOD_REQUEST_ACCEPTED', 8000, { requestId });
  }

  public scheduleItemAcceptance(itemId: string) {
    this.schedule('ITEM_REQUEST_ACCEPTED', 6000, { itemId });
  }

  public scheduleProviderOffers(careRequestId: string) {
    this.schedule('CARE_REQUEST_OFFERS', 8000, { careRequestId });
  }

  public scheduleBookingConfirmation(bookingId: string) {
    this.schedule('BOOKING_CONFIRMED', 3000, { bookingId });
  }

  public scheduleQueueAdvance(tokenId: string) {
    this.schedule('QUEUE_ADVANCE', 10000, { tokenId }); // First advance in 10s
  }

  public scheduleConsultationCompletion(bookingId: string) {
    this.schedule('CONSULTATION_COMPLETED', 5000, { bookingId });
  }

  public scheduleRecordShareAccess(recordId: string) {
    this.schedule('RECORD_SHARE_ACCESSED', 20000, { recordId });
  }

  public scheduleEmergencyResponse() {
    this.schedule('SOS_AMBULANCE_DISPATCHED', 5000, {});
  }

  // --- Execution Handlers ---

  private executeEvent(event: ScheduledEvent) {
    switch (event.type) {
      case 'BLOOD_REQUEST_INTEREST':
        this.handleBloodRequestInterest(event.data.requestId);
        break;
      case 'BLOOD_REQUEST_ACCEPTED':
        this.handleBloodRequestAccepted(event.data.requestId);
        break;
      case 'ITEM_REQUEST_ACCEPTED':
        this.handleItemRequestAccepted(event.data.itemId);
        break;
      case 'CARE_REQUEST_OFFERS':
        this.handleCareRequestOffers(event.data.careRequestId);
        break;
      case 'BOOKING_CONFIRMED':
        this.handleBookingConfirmed(event.data.bookingId);
        break;
      case 'QUEUE_ADVANCE':
        this.handleQueueAdvance(event.data.tokenId);
        break;
      case 'CONSULTATION_COMPLETED':
        this.handleConsultationCompleted(event.data.bookingId);
        break;
      case 'RECORD_SHARE_ACCESSED':
        this.handleRecordShareAccessed(event.data.recordId);
        break;
      case 'SOS_AMBULANCE_DISPATCHED':
        this.handleSOSAmbulanceDispatched();
        break;
    }
  }

  private handleBloodRequestInterest(requestId: string) {
    const state = PrototypeStore.getSnapshot();
    const request = state.bloodRequests.find(r => r.id === requestId);
    if (!request) return;

    // We can simulate updating the request by setting state to 'RESPONDED'
    PrototypeStore.updateBloodRequest(requestId, { state: 'RESPONDED' });

    const notif: AppNotification = {
      id: `NOTIF-BLD-${Date.now()}`,
      userId: request.requesterId, // The user
      type: 'BLOOD',
      title: 'Donors Available',
      body: '2 donors have shown interest in your blood request.',
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/community/blood/${requestId}`
    };
    PrototypeStore.addNotification(notif);
  }

  private handleBloodRequestAccepted(requestId: string) {
    const state = PrototypeStore.getSnapshot();
    const request = state.bloodRequests.find(r => r.id === requestId);
    if (!request) return;

    PrototypeStore.updateBloodRequest(requestId, { state: 'FULFILLED' });

    const notif: AppNotification = {
      id: `NOTIF-BLD-ACC-${Date.now()}`,
      userId: 'USR-PATIENT', 
      type: 'BLOOD',
      title: 'Blood Donation Accepted',
      body: `${request.requesterName} accepted your offer to donate blood.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/community/blood/${requestId}`
    };
    PrototypeStore.addNotification(notif);
  }

  private handleItemRequestAccepted(itemId: string) {
    const state = PrototypeStore.getSnapshot();
    const item = state.sharedItems.find(i => i.id === itemId);
    if (!item) return;

    PrototypeStore.updateSharedItem(itemId, { state: 'BORROWED' });

    const notif: AppNotification = {
      id: `NOTIF-ITM-${Date.now()}`,
      userId: 'USR-PATIENT',
      type: 'THINGS',
      title: 'Item Request Accepted',
      body: `${item.ownerName} has accepted your request for ${item.title}.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/community/things/${itemId}`
    };
    PrototypeStore.addNotification(notif);
  }

  private handleCareRequestOffers(careRequestId: string) {
    const state = PrototypeStore.getSnapshot();
    const req = state.careRequests.find(r => r.id === careRequestId);
    if (!req) return;

    const newQuotes = [
      {
        id: `QT-${Date.now()}-1`,
        requestId: careRequestId,
        providerId: 'PROV-1', // Ayesha
        proposedPrice: 2000,
        arrivalTime: '2:00 PM',
        travelIncluded: true,
        estimatedDuration: '30 mins',
        message: 'I can be there soon.',
        validUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'PENDING' as any
      },
      {
        id: `QT-${Date.now()}-2`,
        requestId: careRequestId,
        providerId: 'PROV-8', // Ali
        proposedPrice: 2500,
        arrivalTime: '3:00 PM',
        travelIncluded: true,
        estimatedDuration: '45 mins',
        message: 'Happy to help.',
        validUntil: new Date(Date.now() + 3600000).toISOString(),
        status: 'PENDING' as any
      }
    ];

    PrototypeStore.updateState({ 
      careRequests: state.careRequests.map(r => r.id === careRequestId ? { ...r, status: 'quotes_received' } : r),
      providerQuotes: [...newQuotes, ...state.providerQuotes]
    });

    const notif: AppNotification = {
      id: `NOTIF-CARE-${Date.now()}`,
      userId: req.patientId,
      type: 'GENERAL',
      title: 'Provider Offers Received',
      body: `You received 2 offers for your care request.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/care/my-care`
    };
    PrototypeStore.addNotification(notif);
  }

  private handleBookingConfirmed(bookingId: string) {
    const state = PrototypeStore.getSnapshot();
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    PrototypeStore.updateBooking(bookingId, { status: 'confirmed' });

    const notif: AppNotification = {
      id: `NOTIF-BKG-${Date.now()}`,
      userId: booking.patientId,
      type: 'GENERAL',
      title: 'Appointment Confirmed',
      body: `Your appointment has been confirmed by the provider.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/appointments/${bookingId}`
    };
    PrototypeStore.addNotification(notif);
  }

  private handleQueueAdvance(tokenId: string) {
    const state = PrototypeStore.getSnapshot();
    const token = state.queueTokens.find(t => t.id === tokenId);
    if (!token) return;

    if (token.estimatedWaitMinutes > 5) {
      PrototypeStore.updateState({
        queueTokens: state.queueTokens.map(t => t.id === tokenId ? { ...t, estimatedWaitMinutes: t.estimatedWaitMinutes - 5 } : t)
      });
      this.schedule('QUEUE_ADVANCE', 8000, { tokenId }); 
    } else {
      PrototypeStore.updateState({
        queueTokens: state.queueTokens.map(t => t.id === tokenId ? { ...t, estimatedWaitMinutes: 0, status: 'CALLED' } : t)
      });
      
      const notif: AppNotification = {
        id: `NOTIF-Q-${Date.now()}`,
        userId: token.patientId,
        type: 'GENERAL',
        title: 'It is your turn!',
        body: `Your token number ${token.tokenNumber} has been called.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        deepLink: `/patient/queue/${tokenId}`
      };
      PrototypeStore.addNotification(notif);
    }
  }

  private handleConsultationCompleted(bookingId: string) {
    const state = PrototypeStore.getSnapshot();
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    PrototypeStore.updateBooking(bookingId, { status: 'completed' });

    const notif: AppNotification = {
      id: `NOTIF-CONSULT-${Date.now()}`,
      userId: booking.patientId,
      type: 'GENERAL',
      title: 'Consultation Completed',
      body: `Your consultation is complete. Prescription is available.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/appointments/${bookingId}`
    };
    PrototypeStore.addNotification(notif);
  }

  private handleRecordShareAccessed(recordId: string) {
    const notif: AppNotification = {
      id: `NOTIF-REC-${Date.now()}`,
      userId: 'USR-PATIENT',
      type: 'GENERAL',
      title: 'Record Accessed',
      body: `A provider has accessed your shared medical record.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/records/${recordId}`
    };
    PrototypeStore.addNotification(notif);
  }

  private handleSOSAmbulanceDispatched() {
    PrototypeStore.updateState({ sosState: { status: 'RESPONDED' } });
    const notif: AppNotification = {
      id: `NOTIF-SOS-${Date.now()}`,
      userId: 'USR-PATIENT',
      type: 'GENERAL',
      title: 'Ambulance Dispatched',
      body: 'An emergency response team has been dispatched to your location.',
      isRead: false,
      createdAt: new Date().toISOString(),
      deepLink: `/patient/sos/result`
    };
    PrototypeStore.addNotification(notif);
  }
}

export const CounterpartEngine = new CounterpartEngineClass();
