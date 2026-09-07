export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  gender?: string;
  dob?: string;
  contactPreference?: string;
  emergencyContact?: string;
}

export interface ContactPreference {
  id: string;
  number: string;
  label: string;
  allowSim: boolean;
  allowWhatsApp: boolean;
}

export interface UserPreferences {
  appointmentReminders: boolean;
  medicineReminders: boolean;
  communityOpportunities: boolean;
  largeText: boolean;
  language?: 'EN' | 'UR';
  currency?: 'PKR' | 'USD';
  contacts?: ContactPreference[];
}

export interface CareProfile {
  id: string;
  name: string;
  relation: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string;
  conditions?: string;
  isPrimary?: boolean;
  sosEnabled?: boolean;
  sosPrimaryContactName?: string;
  sosPrimaryContactPhone?: string;
  sosPrimaryContactRelation?: string;
  sosSecondaryContactName?: string;
  sosSecondaryContactPhone?: string;
  sosPreferredHospital?: string;
  sosShareLocation?: boolean;
  sosShareMedical?: boolean;
}

export interface AppState {
  version: number;
  language: string;
  role: string;
  activeAccountId: string | null;
  activeRole: string | null;
  providerGroup: string;
  providerJourney: string;
  verificationStatus?: string;
  verificationOutcome?: string;
  introCompleted: boolean;
  authMode: string;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  lastStep: string;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  careScope: string;
  careProfiles: CareProfile[];
  activeProfileId: string | null;
}

const CURRENT_VERSION = 1;
const STORAGE_KEY = 'sehat_sahara_prototype_state';

export const FALLBACK_PROFILE: UserProfile = {
  name: 'Ali Raza',
  phone: '0300 0000000',
  email: 'ali.demo@sehatsahara.local',
  city: 'Karachi',
  area: 'Gulshan-e-Iqbal',
};

const DEFAULT_STATE: AppState = {
  version: CURRENT_VERSION,
  language: '',
  role: '',
  activeAccountId: null,
  activeRole: null,
  providerGroup: '',
  providerJourney: '',
  verificationStatus: '',
  verificationOutcome: '',
  introCompleted: false,
  authMode: '',
  isAuthenticated: false,
  onboardingComplete: false,
  lastStep: '/welcome',
  profile: null,
  preferences: {
    appointmentReminders: true,
    medicineReminders: true,
    communityOpportunities: true,
    largeText: false,
    language: 'EN',
    currency: 'PKR',
  },
  careScope: '',
  careProfiles: [],
  activeProfileId: null,
};

class OnboardingStoreClass {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const loadedState: AppState = { 
            ...DEFAULT_STATE, 
            ...parsed, 
            version: CURRENT_VERSION,
            preferences: { ...DEFAULT_STATE.preferences, ...(parsed.preferences || {}) }
          };

          // Safe state migration and normalization:
          const role = (loadedState.role || '').toLowerCase();
          const activeRole = (loadedState.activeRole || '').toLowerCase();
          const journey = (loadedState.providerJourney || '').toLowerCase();

          const providerKeywords = ['doctor', 'provider', 'student', 'medical_student', 'fresh_doctor', 'practicing_doctor', 'consultant_specialist'];
          const isProvider = providerKeywords.includes(role) || providerKeywords.includes(activeRole) || providerKeywords.includes(journey);
          const isPatient = ['patient', 'careseeker', 'care_seeker'].includes(role) || ['patient', 'careseeker', 'care_seeker'].includes(activeRole);

          if (isProvider) {
            loadedState.role = 'Doctor';
            loadedState.activeRole = 'doctor';
            if (!loadedState.providerJourney) {
              if (role === 'student' || activeRole === 'student') loadedState.providerJourney = 'medical_student';
              else loadedState.providerJourney = 'practicing_doctor';
            }
            if (!loadedState.activeAccountId) {
              loadedState.activeAccountId = 'USR-DOCTOR-DEMO';
            }
          } else if (isPatient) {
            loadedState.role = 'Patient';
            loadedState.activeRole = 'patient';
            if (!loadedState.activeAccountId) {
              loadedState.activeAccountId = 'USR-PATIENT-DEMO';
            }
          } else if (loadedState.isAuthenticated && !role && !activeRole) {
            loadedState.isAuthenticated = false;
            loadedState.onboardingComplete = false;
            loadedState.role = '';
            loadedState.activeRole = null;
            loadedState.activeAccountId = null;
          }

          if (!Array.isArray(loadedState.careProfiles)) {
            loadedState.careProfiles = [];
          }
          return loadedState;
        }
      }
    } catch {
      console.warn('Failed to parse local prototype state, resetting to default.');
    }
    return { ...DEFAULT_STATE };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch {
      console.error('Failed to save prototype state.');
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    return this.state;
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  updateState(updates: Partial<AppState>) {
    const updated = { ...this.state, ...updates };
    if (updates.role && !updates.activeRole) {
      updated.activeRole = updates.role.toLowerCase();
    }
    this.state = updated;
    this.saveState();
  }

  reset() {
    this.state = { ...DEFAULT_STATE };
    this.saveState();
  }

  signOut() {
    this.updateState({
      isAuthenticated: false,
      onboardingComplete: false,
      role: '',
      activeRole: null,
      activeAccountId: null,
      providerJourney: '',
      providerGroup: '',
      verificationStatus: '',
      verificationOutcome: '',
      lastStep: '/onboarding/role',
      profile: null,
      careProfiles: []
    });
  }

  // --- Household Management ---

  addCareProfile(profile: Omit<CareProfile, 'id'>) {
    const id = `care-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.updateState({
      careProfiles: [...this.state.careProfiles, { ...profile, id }]
    });
    return id;
  }

  updateCareProfile(id: string, updates: Partial<CareProfile>) {
    this.updateState({
      careProfiles: this.state.careProfiles.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  }

  removeCareProfile(id: string) {
    this.updateState({
      careProfiles: this.state.careProfiles.filter(p => p.id !== id)
    });
  }

  // --- Completion Meter ---
  
  getCompletionPercentage(): { total: number, nextSteps: { route: string, label: string }[] } {
    let total = 0;
    const nextSteps: { route: string, label: string }[] = [];
    
    // 1. Core Profile (Name, Phone, City, Area) = 40%
    if (this.state.profile?.name && this.state.profile?.phone && this.state.profile?.city && this.state.profile?.area) {
      total += 40;
    } else {
      nextSteps.push({ route: '/patient/profile', label: 'Complete Core Profile' });
    }
    
    // 2. Adding a Dependent = 20%
    const hasDependent = this.state.careProfiles.some(p => !p.isPrimary);
    if (hasDependent) {
      total += 20;
    } else {
      nextSteps.push({ route: '/patient/profile/household/add', label: 'Add a Dependent' });
    }
    
    // 3. Adding an Emergency Contact = 20%
    const hasSos = this.state.careProfiles.some(p => p.sosEnabled);
    if (hasSos) {
      total += 20;
    } else {
      nextSteps.push({ route: '/patient/profile/sos-setup', label: 'Set up Emergency SOS' });
    }
    
    // 4. Choosing a Preference = 20%
    if (this.state.preferences) {
      total += 20;
    } else {
      nextSteps.push({ route: '/onboarding/preferences', label: 'Review Preferences' });
    }
    
    return { total, nextSteps };
  }
}

export const OnboardingStore = new OnboardingStoreClass();
