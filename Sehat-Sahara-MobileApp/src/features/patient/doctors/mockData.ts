export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  fee: number;
  rating: number;
  reviews: number;
  avatarUrl: string;
  availableToday: boolean;
  nextAvailable: string;
  about: string;
  gender: 'Female' | 'Male';
  bookingModes: ('fixed_time' | 'queue_token')[];
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Ayesha Khan',
    specialty: 'General Physician',
    experience: '12 Years',
    fee: 1500,
    rating: 4.8,
    reviews: 124,
    avatarUrl: 'https://i.pravatar.cc/150?u=d1',
    availableToday: true,
    nextAvailable: 'Today, 02:00 PM',
    about: 'Dr. Ayesha Khan is a highly experienced General Physician specializing in accurate diagnosis and compassionate care for a wide range of common illnesses.',
    gender: 'Female',
    bookingModes: ['fixed_time', 'queue_token'] // Dual mode
  },
  {
    id: 'd2',
    name: 'Dr. Salman Ahmed',
    specialty: 'Cardiologist',
    experience: '15 Years',
    fee: 3000,
    rating: 4.9,
    reviews: 89,
    avatarUrl: 'https://i.pravatar.cc/150?u=d2',
    availableToday: false,
    nextAvailable: 'Tomorrow, 10:00 AM',
    about: 'Dr. Salman Ahmed is a leading Cardiologist with a focus on preventative heart care and advanced cardiovascular treatments.',
    gender: 'Male',
    bookingModes: ['fixed_time'] // Fixed-time only
  },
  {
    id: 'd3',
    name: 'Dr. Fatima Ali',
    specialty: 'Dermatologist',
    experience: '8 Years',
    fee: 2000,
    rating: 4.7,
    reviews: 210,
    avatarUrl: 'https://i.pravatar.cc/150?u=d3',
    availableToday: true,
    nextAvailable: 'Today, 05:30 PM',
    about: 'Dr. Fatima Ali treats all types of skin conditions, providing personalized skincare regimens and medical treatments for her patients.',
    gender: 'Female',
    bookingModes: ['queue_token'] // Queue token only
  },
  {
    id: 'd4',
    name: 'Dr. Bilal Qureshi',
    specialty: 'Pediatrician',
    experience: '10 Years',
    fee: 1800,
    rating: 4.9,
    reviews: 156,
    avatarUrl: 'https://i.pravatar.cc/150?u=d4',
    availableToday: true,
    nextAvailable: 'Today, 04:00 PM',
    about: 'Dr. Bilal Qureshi is a dedicated Pediatrician who provides expert, gentle care for infants, children, and adolescents.',
    gender: 'Male',
    bookingModes: ['fixed_time', 'queue_token'] // Dual mode
  }
];
