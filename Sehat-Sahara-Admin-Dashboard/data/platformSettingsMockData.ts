// ─── Platform Settings Mock Data & Store ──────────────────────────────────
// Matches PDF Page 13 (A-09 / A-08 Platform Settings) exactly.

export type ServiceMode = 'STATIC' | 'DEMO' | 'API';

export interface PlatformSettingsState {
  // General
  platformTimezone: string;
  dateFormat: string;
  defaultLanguage: string;
  itemsPerPageAdmin: number;

  // Verification Rules
  doctorVerificationSlaHours: number;
  ocrAiAssistEnabled: boolean;
  humanDecisionMandatory: boolean;

  // Community Safety
  bloodRequestsExpiryDays: number;
  thingsRequestsExpiryDays: number;
  autoCloseInactiveDays: number;
  reportReviewThreshold: 'Low' | 'Medium' | 'High';

  // Allowed Hospital Facility Types
  allowedFacilityTypes: {
    hospital: boolean;
    clinic: boolean;
    diagnosticCenter: boolean;
    laboratory: boolean;
    bloodBank: boolean;
    rehabilitationCenter: boolean;
  };

  // Notifications
  notifications: {
    newDoctorRegistration: boolean;
    doctorVerificationUpdates: boolean;
    bloodThingsRequests: boolean;
    communityReports: boolean;
    systemAnnouncements: boolean;
  };

  // Demo Mode
  serviceMode: ServiceMode;
  seededDelaySeconds: number;

  // Audit Info
  lastUpdated: string;
  lastSavedBy: string;
}

export const initialPlatformSettings: PlatformSettingsState = {
  // General
  platformTimezone: '(GMT+05:00) Asia/Karachi',
  dateFormat: 'May 20, 2025 (MMM DD, YYYY)',
  defaultLanguage: 'English',
  itemsPerPageAdmin: 25,

  // Verification Rules
  doctorVerificationSlaHours: 72,
  ocrAiAssistEnabled: true,
  humanDecisionMandatory: true,

  // Community Safety
  bloodRequestsExpiryDays: 30,
  thingsRequestsExpiryDays: 60,
  autoCloseInactiveDays: 90,
  reportReviewThreshold: 'Medium',

  // Allowed Hospital Facility Types
  allowedFacilityTypes: {
    hospital: true,
    clinic: true,
    diagnosticCenter: true,
    laboratory: true,
    bloodBank: true,
    rehabilitationCenter: false,
  },

  // Notifications
  notifications: {
    newDoctorRegistration: true,
    doctorVerificationUpdates: true,
    bloodThingsRequests: true,
    communityReports: true,
    systemAnnouncements: true,
  },

  // Demo Mode
  serviceMode: 'DEMO',
  seededDelaySeconds: 3,

  // Audit Info
  lastUpdated: 'May 20, 2025 10:24 AM',
  lastSavedBy: 'superadmin@sehatsahara.pk',
};

class PlatformSettingsStore {
  private settings: PlatformSettingsState = { ...initialPlatformSettings };
  private listeners: (() => void)[] = [];

  getSettings(): PlatformSettingsState {
    return { ...this.settings };
  }

  saveSettings(newSettings: Partial<PlatformSettingsState>): void {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    this.settings = {
      ...this.settings,
      ...newSettings,
      lastUpdated: formattedDate,
    };
    this.notify();
  }

  resetToDefaults(): void {
    this.settings = { ...initialPlatformSettings };
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const platformSettingsStore = new PlatformSettingsStore();
