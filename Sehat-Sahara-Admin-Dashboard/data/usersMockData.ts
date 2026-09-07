// ─── Admin Users Mock Data ──────────────────────────────────────────────────
// Realistic local data matching PDF Page 6 (A-02 Users) exactly.

export interface AdminUser {
  id: string;
  name: string;
  avatarInitials: string;
  cnic: string;
  role: 'Patient' | 'Doctor' | 'Hospital';
  phone: string;
  email: string;
  status: 'Verified' | 'Pending' | 'Suspended';
  joinedDate: string;
  joinedTime: string;
  lastLogin: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  accountType: string;
  specialty?: string;
  facilityType?: string;
  auditTrail: {
    event: string;
    date: string;
    notes?: string;
  }[];
}

export const mockPatients: AdminUser[] = [
  {
    id: 'USS-0001248',
    name: 'Sana Ahmed',
    avatarInitials: 'SA',
    cnic: '35202-1234567-8',
    role: 'Patient',
    phone: '0333 1234567',
    email: 'sana.ahmed92@gmail.com',
    status: 'Verified',
    joinedDate: '12 May 2025',
    joinedTime: '10:24 AM',
    lastLogin: '14 May 2025 09:12 AM',
    dateOfBirth: '14 Feb 1992',
    gender: 'Female',
    location: 'Lahore, Punjab',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Account verified by Sehat Sahara Admin',
        date: '12 May 2025 10:30 AM',
        notes: 'Identity & phone verified via OTP',
      },
      {
        event: 'No recent suspensions',
        date: 'Clean standing',
      },
    ],
  },
  {
    id: 'USS-0001249',
    name: 'Muhammad Rizwan',
    avatarInitials: 'MR',
    cnic: '35201-9876543-1',
    role: 'Patient',
    phone: '0300 9876543',
    email: 'rizwan.khan85@gmail.com',
    status: 'Verified',
    joinedDate: '11 May 2025',
    joinedTime: '02:15 PM',
    lastLogin: '13 May 2025 06:40 PM',
    dateOfBirth: '20 Nov 1985',
    gender: 'Male',
    location: 'Karachi, Sindh',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Account verified automatically',
        date: '11 May 2025 02:15 PM',
        notes: 'Standard patient registration',
      },
    ],
  },
  {
    id: 'USS-0001250',
    name: 'Fatima Saleem',
    avatarInitials: 'FS',
    cnic: '35202-5557788-2',
    role: 'Patient',
    phone: '0312 5557788',
    email: 'fatima.saleem19@gmail.com',
    status: 'Pending',
    joinedDate: '10 May 2025',
    joinedTime: '09:40 AM',
    lastLogin: '10 May 2025 09:40 AM',
    dateOfBirth: '05 Aug 1996',
    gender: 'Female',
    location: 'Islamabad, ICT',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Registration initiated',
        date: '10 May 2025 09:40 AM',
        notes: 'Awaiting phone number OTP confirmation',
      },
    ],
  },
  {
    id: 'USS-0001251',
    name: 'Ali Hassan',
    avatarInitials: 'AH',
    cnic: '33100-2223344-5',
    role: 'Patient',
    phone: '0345 2223344',
    email: 'ali.hassan.786@gmail.com',
    status: 'Verified',
    joinedDate: '09 May 2025',
    joinedTime: '06:30 PM',
    lastLogin: '14 May 2025 11:20 AM',
    dateOfBirth: '18 Jul 1990',
    gender: 'Male',
    location: 'Faisalabad, Punjab',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Account verified',
        date: '09 May 2025 06:35 PM',
      },
    ],
  },
  {
    id: 'USS-0001252',
    name: 'Nida Khalid',
    avatarInitials: 'NK',
    cnic: '37405-1112233-4',
    role: 'Patient',
    phone: '0321 1112233',
    email: 'nida.khalid@gmail.com',
    status: 'Suspended',
    joinedDate: '08 May 2025',
    joinedTime: '11:05 AM',
    lastLogin: '11 May 2025 04:12 PM',
    dateOfBirth: '12 Oct 1994',
    gender: 'Female',
    location: 'Rawalpindi, Punjab',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Suspended by Admin',
        date: '12 May 2025 03:00 PM',
        notes: 'Multiple spam reports on community feed',
      },
    ],
  },
  {
    id: 'USS-0001253',
    name: 'Usman Shahid',
    avatarInitials: 'US',
    cnic: '35202-4445566-7',
    role: 'Patient',
    phone: '0308 4445566',
    email: 'usman.shahid12@gmail.com',
    status: 'Verified',
    joinedDate: '07 May 2025',
    joinedTime: '04:50 PM',
    lastLogin: '12 May 2025 08:30 PM',
    dateOfBirth: '23 Mar 1988',
    gender: 'Male',
    location: 'Multan, Punjab',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Account verified',
        date: '07 May 2025 04:52 PM',
      },
    ],
  },
  {
    id: 'USS-0001254',
    name: 'Ayesha Qureshi',
    avatarInitials: 'AQ',
    cnic: '42201-7778899-6',
    role: 'Patient',
    phone: '0330 7778899',
    email: 'ayesha.qureshi96@gmail.com',
    status: 'Pending',
    joinedDate: '06 May 2025',
    joinedTime: '01:20 PM',
    lastLogin: '06 May 2025 01:20 PM',
    dateOfBirth: '16 Jun 1997',
    gender: 'Female',
    location: 'Karachi, Sindh',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Registration pending verification',
        date: '06 May 2025 01:20 PM',
      },
    ],
  },
  {
    id: 'USS-0001255',
    name: 'Hammad Tariq',
    avatarInitials: 'HT',
    cnic: '36302-6667788-3',
    role: 'Patient',
    phone: '0315 6667788',
    email: 'hammad.tariq@gmail.com',
    status: 'Verified',
    joinedDate: '05 May 2025',
    joinedTime: '03:10 PM',
    lastLogin: '13 May 2025 05:45 PM',
    dateOfBirth: '09 Sep 1991',
    gender: 'Male',
    location: 'Peshawar, KPK',
    accountType: 'Patient',
    auditTrail: [
      {
        event: 'Account verified',
        date: '05 May 2025 03:15 PM',
      },
    ],
  },
];

export const mockDoctors: AdminUser[] = [
  {
    id: 'DOC-000412',
    name: 'Dr. Muhammad Hamza',
    avatarInitials: 'MH',
    cnic: '35201-7845124-9',
    role: 'Doctor',
    phone: '0321 8844112',
    email: 'dr.hamza.mbbs@gmail.com',
    status: 'Verified',
    joinedDate: '02 May 2025',
    joinedTime: '08:45 AM',
    lastLogin: '14 May 2025 10:00 AM',
    dateOfBirth: '14 Jan 1986',
    gender: 'Male',
    location: 'Lahore, Punjab',
    accountType: 'Doctor (GP)',
    specialty: 'Family Medicine',
    auditTrail: [
      {
        event: 'PMDC License 784512-P verified by Admin',
        date: '02 May 2025 11:30 AM',
      },
    ],
  },
  {
    id: 'DOC-000413',
    name: 'Dr. Ayesha Khalid',
    avatarInitials: 'AK',
    cnic: '42101-6123985-2',
    role: 'Doctor',
    phone: '0300 5511223',
    email: 'ayesha.khalid.fcps@gmail.com',
    status: 'Pending',
    joinedDate: '04 May 2025',
    joinedTime: '11:15 AM',
    lastLogin: '04 May 2025 11:15 AM',
    dateOfBirth: '28 Sep 1984',
    gender: 'Female',
    location: 'Karachi, Sindh',
    accountType: 'Doctor (Specialist)',
    specialty: 'Gynecology',
    auditTrail: [
      {
        event: 'Credentials in verification queue',
        date: '04 May 2025 11:15 AM',
      },
    ],
  },
  {
    id: 'DOC-000414',
    name: 'Dr. Bilal Ahmed',
    avatarInitials: 'BA',
    cnic: '37405-7956321-1',
    role: 'Doctor',
    phone: '0345 7788990',
    email: 'bilal.ahmed.doc@gmail.com',
    status: 'Verified',
    joinedDate: '28 Apr 2025',
    joinedTime: '03:30 PM',
    lastLogin: '14 May 2025 08:15 AM',
    dateOfBirth: '03 May 1989',
    gender: 'Male',
    location: 'Rawalpindi, Punjab',
    accountType: 'Doctor (Specialist)',
    specialty: 'Internal Medicine',
    auditTrail: [
      {
        event: 'PMDC License verified',
        date: '28 Apr 2025 04:00 PM',
      },
    ],
  },
];

export const mockHospitals: AdminUser[] = [
  {
    id: 'HOS-000089',
    name: 'Karachi Health Center',
    avatarInitials: 'KH',
    cnic: '42101-0001234-0',
    role: 'Hospital',
    phone: '021-34567890',
    email: 'info@karachihealth.pk',
    status: 'Verified',
    joinedDate: '20 May 2025',
    joinedTime: '10:00 AM',
    lastLogin: '14 May 2025 11:00 AM',
    dateOfBirth: 'N/A',
    gender: 'N/A',
    location: 'Karachi, Sindh',
    accountType: 'Hospital',
    facilityType: 'Hospital (General)',
    auditTrail: [
      {
        event: 'Facility account approved by Admin',
        date: '20 May 2025 10:30 AM',
      },
    ],
  },
  {
    id: 'HOS-000090',
    name: 'Life Care Clinic',
    avatarInitials: 'LC',
    cnic: '35202-0005678-0',
    role: 'Hospital',
    phone: '0321-7654321',
    email: 'contact@lifecareclinic.pk',
    status: 'Verified',
    joinedDate: '18 May 2025',
    joinedTime: '09:15 AM',
    lastLogin: '13 May 2025 04:30 PM',
    dateOfBirth: 'N/A',
    gender: 'N/A',
    location: 'Lahore, Punjab',
    accountType: 'Poly-Clinic',
    facilityType: 'Poly-Clinic',
    auditTrail: [
      {
        event: 'Clinic verified and active',
        date: '18 May 2025 09:30 AM',
      },
    ],
  },
  {
    id: 'HOS-000091',
    name: 'City General Hospital',
    avatarInitials: 'CG',
    cnic: '33100-0009876-0',
    role: 'Hospital',
    phone: '0305-1122334',
    email: 'info@citygeneral.com.pk',
    status: 'Suspended',
    joinedDate: '10 May 2025',
    joinedTime: '02:00 PM',
    lastLogin: '11 May 2025 01:00 PM',
    dateOfBirth: 'N/A',
    gender: 'N/A',
    location: 'Faisalabad, Punjab',
    accountType: 'Hospital',
    facilityType: 'Hospital',
    auditTrail: [
      {
        event: 'Account suspended by Admin',
        date: '12 May 2025 11:00 AM',
        notes: 'Compliance documentation missing',
      },
    ],
  },
];
