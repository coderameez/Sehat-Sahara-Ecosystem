export type BloodRequest = {
  id: string;
  patientName: string;
  bloodGroup: string | 'Any';
  units: number;
  urgency: 'Urgent' | 'Routine';
  location: string;
  facility: string; // Primary hospital
  additionalLocations?: { name: string; address: string; mapLink?: string }[];
  description?: string;
  timePosted: string;
  status: 'active' | 'fulfilled';
};

export type SharedItem = {
  id: string;
  title: string;
  category: string;
  condition: string;
  ownerName: string;
  location: string;
  description?: string;
  images?: string[];
  available: boolean;
  timePosted: string;
};

export const MOCK_BLOOD_REQUESTS: BloodRequest[] = [
  {
    id: 'req-1',
    patientName: 'Ahmad Khan',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'Urgent',
    location: 'Gulshan-e-Iqbal',
    facility: 'Aga Khan University Hospital',
    timePosted: '2 hours ago',
    status: 'active'
  },
  {
    id: 'req-2',
    patientName: 'Fatima Ali',
    bloodGroup: 'A-',
    units: 1,
    urgency: 'Routine',
    location: 'DHA Phase 6',
    facility: 'South City Hospital',
    timePosted: '5 hours ago',
    status: 'active'
  },
  {
    id: 'req-3',
    patientName: 'Usman Tariq',
    bloodGroup: 'B+',
    units: 3,
    urgency: 'Urgent',
    location: 'Clifton',
    facility: 'Ziauddin Hospital',
    timePosted: '1 day ago',
    status: 'active'
  }
];

// @TODO (PrototypeService): Direct mutation of this array in the static frontend 
// (e.g. via unshift) is temporary StaticService behavior to mock session state.
// It must be replaced by real PrototypeService state/context in the next prototype phase.
export const MOCK_SHARED_ITEMS: SharedItem[] = [
  {
    id: 'item-1',
    title: 'Standard Wheelchair',
    category: 'Wheelchair',
    condition: 'Good',
    ownerName: 'Ali Raza',
    location: 'North Nazimabad',
    images: ['https://placehold.co/400x300?text=Wheelchair'],
    available: true,
    timePosted: '1 day ago'
  },
  {
    id: 'item-2',
    title: 'Adjustable Crutches',
    category: 'Crutches',
    condition: 'Like New',
    ownerName: 'Sara Ahmed',
    location: 'Tariq Road',
    available: true,
    timePosted: '3 days ago'
  },
  {
    id: 'item-3',
    title: 'Oxygen Cylinder (5L)',
    category: 'Oxygen Cylinder',
    condition: 'Fair',
    ownerName: 'Hassan',
    location: 'Gulistan-e-Jauhar',
    available: true,
    timePosted: '1 week ago'
  }
];

// Session state management for the static prototype
type Listener = () => void;
class SessionStore<T> {
  data: T[];
  listeners: Set<Listener> = new Set();
  constructor(initialData: T[]) { this.data = [...initialData]; }
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  getSnapshot = () => this.data;
  add = (item: T) => {
    this.data = [item, ...this.data];
    this.listeners.forEach(l => l());
  };
}

export const bloodRequestsStore = new SessionStore<BloodRequest>(MOCK_BLOOD_REQUESTS);
export const sharedItemsStore = new SessionStore<SharedItem>(MOCK_SHARED_ITEMS);
