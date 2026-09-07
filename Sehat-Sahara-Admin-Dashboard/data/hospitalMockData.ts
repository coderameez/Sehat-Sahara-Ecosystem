// ─── Hospital / Clinic Mock Data & Store ─────────────────────────────────────
// Matches PDF Page 9 (A-05) and Page 10 (A-06) exactly.

export type FacilityType = 'Basic Clinic' | 'Poly-Clinic' | 'Hospital';
export type AccountStatus = 'Active' | 'Suspended' | 'Inactive';

export interface HospitalFacility {
  id: string;
  name: string;
  type: FacilityType;
  city: string;
  province: string;
  address: string;
  primaryContact: {
    name: string;
    phone: string;
    email: string;
  };
  doctorsCount: number;
  status: AccountStatus;
  createdAt: string;
  timings: string;
  services: string[];
  verifiedBy?: string;
  avatarInitials: string;
}

export const initialFacilities: HospitalFacility[] = [
  {
    id: 'FAC-001',
    name: 'Karachi Health Center',
    type: 'Hospital',
    city: 'Karachi',
    province: 'Sindh',
    address: 'Plot 12, Main Shahrah-e-Faisal, Karachi, Sindh',
    primaryContact: {
      name: 'Dr. Imran Ali',
      phone: '0300-1234567',
      email: 'info@karachihealth.pk',
    },
    doctorsCount: 24,
    status: 'Active',
    createdAt: 'May 20, 2025',
    timings: 'Mon - Sat: 9:00 AM - 9:00 PM | Sun: 10:00 AM - 6:00 PM',
    services: ['OPD', 'Surgery', 'Diagnostics', 'Emergency', 'Pharmacy'],
    verifiedBy: 'Dr. Sanaullah Khan',
    avatarInitials: 'KH',
  },
  {
    id: 'FAC-002',
    name: 'Life Care Clinic',
    type: 'Poly-Clinic',
    city: 'Lahore',
    province: 'Punjab',
    address: '24-B, Commercial Area, Gulberg III, Lahore, Punjab',
    primaryContact: {
      name: 'Dr. Ayesha Malik',
      phone: '0321-7654321',
      email: 'contact@lifecareclinic.pk',
    },
    doctorsCount: 8,
    status: 'Active',
    createdAt: 'May 18, 2025',
    timings: 'Mon - Sat: 10:00 AM - 8:00 PM',
    services: ['OPD', 'Dental', 'Pediatrics', 'Laboratory'],
    verifiedBy: 'Dr. Sanaullah Khan',
    avatarInitials: 'LC',
  },
  {
    id: 'FAC-003',
    name: 'Family Care Clinic',
    type: 'Basic Clinic',
    city: 'Rawalpindi',
    province: 'Punjab',
    address: 'House #45, Street 12, Satellite Town, Rawalpindi, Punjab',
    primaryContact: {
      name: 'Dr. Bilal Ahmed',
      phone: '0310-9876543',
      email: 'familycare.rwp@gmail.com',
    },
    doctorsCount: 3,
    status: 'Active',
    createdAt: 'May 15, 2025',
    timings: 'Mon - Sat: 9:00 AM - 5:00 PM',
    services: ['General OPD', 'Vaccination', 'Basic Diagnostics'],
    verifiedBy: 'Dr. Sanaullah Khan',
    avatarInitials: 'FC',
  },
  {
    id: 'FAC-004',
    name: 'City General Hospital',
    type: 'Hospital',
    city: 'Faisalabad',
    province: 'Punjab',
    address: 'Civil Lines, Near Clock Tower, Faisalabad, Punjab',
    primaryContact: {
      name: 'Dr. Usman Javed',
      phone: '0305-1122334',
      email: 'info@citygeneral.com.pk',
    },
    doctorsCount: 35,
    status: 'Suspended',
    createdAt: 'May 10, 2025',
    timings: '24/7 Emergency & OPD Services',
    services: ['Emergency', 'ICU', 'General Surgery', 'Cardiology', 'Radiology'],
    verifiedBy: 'Dr. Tariq Butt',
    avatarInitials: 'CG',
  },
  {
    id: 'FAC-005',
    name: 'Al-Noor Clinic',
    type: 'Basic Clinic',
    city: 'Peshawar',
    province: 'KPK',
    address: 'University Road, Opposite Board Bazaar, Peshawar, KPK',
    primaryContact: {
      name: 'Dr. Noor Ul Haq',
      phone: '0333-5566778',
      email: 'alnoor.clinic@outlook.com',
    },
    doctorsCount: 2,
    status: 'Active',
    createdAt: 'May 8, 2025',
    timings: 'Mon - Fri: 9:00 AM - 2:00 PM & 5:00 PM - 9:00 PM',
    services: ['General Physician', 'Child Health'],
    verifiedBy: 'Dr. Sanaullah Khan',
    avatarInitials: 'AN',
  },
  {
    id: 'FAC-006',
    name: 'Islamabad Diagnostic & Poly-Clinic',
    type: 'Poly-Clinic',
    city: 'Islamabad',
    province: 'ICT',
    address: 'Blue Area, Block H, Islamabad',
    primaryContact: {
      name: 'Dr. Farhan Qureshi',
      phone: '0345-4433221',
      email: 'info@isbclinic.com',
    },
    doctorsCount: 12,
    status: 'Active',
    createdAt: 'May 4, 2025',
    timings: 'Mon - Sat: 8:00 AM - 10:00 PM',
    services: ['Diagnostic Imaging', 'Pathology Lab', 'Specialist Clinics'],
    verifiedBy: 'Dr. Sanaullah Khan',
    avatarInitials: 'ID',
  },
];

// ─── Simple In-Memory Session Store ─────────────────────────────────────────
class HospitalFacilityStore {
  private facilities: HospitalFacility[] = [...initialFacilities];
  private listeners: (() => void)[] = [];

  getFacilities(): HospitalFacility[] {
    return this.facilities;
  }

  getFacilityById(id: string): HospitalFacility | undefined {
    return this.facilities.find((f) => f.id === id);
  }

  createFacility(data: {
    name: string;
    type: FacilityType;
    city: string;
    province?: string;
    address?: string;
    contactName: string;
    phone: string;
    email: string;
    status: AccountStatus;
  }): HospitalFacility {
    const initials = data.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newFacility: HospitalFacility = {
      id: `FAC-${String(this.facilities.length + 1).padStart(3, '0')}`,
      name: data.name,
      type: data.type,
      city: data.city,
      province: data.province || 'Punjab',
      address: data.address || `${data.city}, Pakistan`,
      primaryContact: {
        name: data.contactName,
        phone: data.phone,
        email: data.email,
      },
      doctorsCount: 0,
      status: data.status,
      createdAt: 'Just now',
      timings: 'Mon - Sat: 9:00 AM - 6:00 PM',
      services: ['OPD', 'General Consultation'],
      avatarInitials: initials || 'HC',
    };

    this.facilities = [newFacility, ...this.facilities];
    this.notify();
    return newFacility;
  }

  toggleStatus(id: string): void {
    this.facilities = this.facilities.map((f) => {
      if (f.id === id) {
        const newStatus: AccountStatus = f.status === 'Active' ? 'Suspended' : 'Active';
        return { ...f, status: newStatus };
      }
      return f;
    });
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const hospitalFacilityStore = new HospitalFacilityStore();
