// ─── Doctor Verification Mock Data & State ─────────────────────────────────
// Matches PDF Page 7 (A-03 Queue) & Page 8 (A-04 Detail) exactly.

export interface DoctorVerificationRecord {
  id: string; // Case ID e.g. DV-2025-05-31-000247
  caseId: string;
  doctorName: string;
  degree: string;
  specialty: string;
  careerStage: string;
  pmdcNumber: string;
  submittedOn: string;
  ocrConfidence: number; // 0-100
  riskFlag: {
    label: string;
    sublabel?: string;
    severity: 'low' | 'medium' | 'high';
  };
  status: 'Pending' | 'Corrections' | 'Rejected' | 'Approved';

  // Detail view information (A-04)
  personalInfo: {
    fullName: string;
    fatherName: string;
    gender: 'Female' | 'Male';
    age: number;
    phone: string;
    email: string;
    city: string;
    country: string;
    address: string;
    cnicNumber: string;
    dob: string;
    issueDate: string;
    expiryDate: string;
    nationality: string;
  };
  pmdcDetails: {
    licenseNumber: string;
    issueDate: string;
    expiryDate: string;
    registrationStatus: 'Active' | 'Expired' | 'Suspended';
  };
  qualifications: {
    degree: string;
    institution: string;
    year: string;
  }[];
  additionalDocuments: {
    name: string;
    uploadedDate: string;
    verified: boolean;
  }[];
  declaration: {
    text: string;
    doctorName: string;
    date: string;
    accepted: boolean;
  };
  mismatches: {
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
  }[];
  aiAssist: {
    confidenceScore: number;
    confidenceLevel: string;
    summary: string;
    documentsAuthentic: boolean;
    faceMatchScore: number;
    fraudPattern: string;
  };
  auditTimeline: {
    event: string;
    date: string;
    completed: boolean;
  }[];
  internalNotes: {
    id: string;
    author: string;
    role: string;
    date: string;
    text: string;
  }[];
}

export const initialDoctorVerifications: DoctorVerificationRecord[] = [
  {
    id: 'DV-2025-05-31-000247',
    caseId: 'DV-2025-05-31-000247',
    doctorName: 'Dr. Sana Khan',
    degree: 'MBBS, MCPS',
    specialty: 'General Physician',
    careerStage: 'Mid Career (5-15 years)',
    pmdcNumber: '45567-P',
    submittedOn: 'May 31, 2025, 10:42 AM',
    ocrConfidence: 94,
    riskFlag: {
      label: 'License Expiring Soon',
      sublabel: 'Expiring in 225 days',
      severity: 'medium',
    },
    status: 'Pending',
    personalInfo: {
      fullName: 'Sana Khan',
      fatherName: 'Khalid Khan',
      gender: 'Female',
      age: 32,
      phone: '0333 7891234',
      email: 'sana.khan@example.com',
      city: 'Karachi, Sindh',
      country: 'Pakistan',
      address: 'House 15-A, Block 7, Gulshan-e-Iqbal, Karachi, Sindh',
      cnicNumber: '42201-1234567-8',
      dob: '14 Mar 1993',
      issueDate: '20 Aug 2018',
      expiryDate: '20 Aug 2028',
      nationality: 'Pakistani',
    },
    pmdcDetails: {
      licenseNumber: '45567-P',
      issueDate: '12 Jan 2021',
      expiryDate: '11 Jan 2026',
      registrationStatus: 'Active',
    },
    qualifications: [
      { degree: 'MBBS', institution: 'Dow Medical College, Karachi', year: '2015' },
      { degree: 'FCPS (Medicine)', institution: 'College of Physicians & Surgeons Pakistan', year: '2020' },
      { degree: 'MCPS (Medicine)', institution: 'College of Physicians & Surgeons Pakistan', year: '2017' },
    ],
    additionalDocuments: [
      { name: 'MBBS Degree.pdf', uploadedDate: '31 May 2025, 10:20 AM', verified: true },
      { name: 'FCPS Certificate.pdf', uploadedDate: '31 May 2025, 10:21 AM', verified: true },
    ],
    declaration: {
      text: 'I confirm that all provided information and documents are true and correct.',
      doctorName: 'Dr. Sana Khan',
      date: '31 May 2025, 10:20 AM',
      accepted: true,
    },
    mismatches: [
      {
        title: 'Name Variation',
        description: 'CNIC: Sana Khan | PMDC: Sana K.',
        severity: 'Medium',
      },
      {
        title: 'License Expiry',
        description: 'License expiring in 225 days (11 Jan 2026)',
        severity: 'High',
      },
      {
        title: 'Address Variation',
        description: 'CNIC: Gulshan-e-Iqbal, Karachi | Profile: Clifton, Karachi',
        severity: 'Medium',
      },
    ],
    aiAssist: {
      confidenceScore: 78,
      confidenceLevel: 'High confidence',
      summary: 'Minor discrepancies detected in name abbreviation.',
      documentsAuthentic: true,
      faceMatchScore: 92,
      fraudPattern: 'No fraud pattern detected',
    },
    auditTimeline: [
      { event: 'Application Submitted', date: '31 May 2025, 10:42 AM', completed: true },
      { event: 'Documents Uploaded', date: '31 May 2025, 10:42 AM', completed: true },
      { event: 'AI Pre-Check Completed', date: '31 May 2025, 10:43 AM', completed: true },
      { event: 'Under Admin Review', date: '31 May 2025, 10:44 AM', completed: true },
    ],
    internalNotes: [
      {
        id: 'NOTE-1',
        author: 'Admin',
        role: 'Super Administrator',
        date: '31 May 2025, 10:46 AM',
        text: 'Name initial mismatch (K) - likely short form. Please verify from original degree.',
      },
      {
        id: 'NOTE-2',
        author: 'Rida Zaidi',
        role: 'Verification Officer',
        date: '31 May 2025, 10:50 AM',
        text: 'Checked PMDC portal - license is valid. Proceed with approval if all good.',
      },
    ],
  },
  {
    id: 'DV-2025-05-26-000189',
    caseId: 'DV-2025-05-26-000189',
    doctorName: 'Dr. Muhammad Hamza',
    degree: 'MBBS',
    specialty: 'Family Medicine',
    careerStage: 'Early Career (0-5 years)',
    pmdcNumber: '784512-P',
    submittedOn: 'May 26, 2025, 09:48 AM',
    ocrConfidence: 92,
    riskFlag: {
      label: 'Document Expiry',
      sublabel: 'Reg. expired',
      severity: 'high',
    },
    status: 'Pending',
    personalInfo: {
      fullName: 'Muhammad Hamza',
      fatherName: 'Hamid Raza',
      gender: 'Male',
      age: 29,
      phone: '0321 8844112',
      email: 'dr.hamza.mbbs@gmail.com',
      city: 'Lahore, Punjab',
      country: 'Pakistan',
      address: 'House 42, Street 3, Johar Town, Lahore, Punjab',
      cnicNumber: '35201-7845124-9',
      dob: '14 Jan 1996',
      issueDate: '15 Feb 2018',
      expiryDate: '15 Feb 2028',
      nationality: 'Pakistani',
    },
    pmdcDetails: {
      licenseNumber: '784512-P',
      issueDate: '01 Mar 2021',
      expiryDate: '28 Feb 2025',
      registrationStatus: 'Expired',
    },
    qualifications: [
      { degree: 'MBBS', institution: 'King Edward Medical University, Lahore', year: '2020' },
    ],
    additionalDocuments: [
      { name: 'MBBS Degree.pdf', uploadedDate: '26 May 2025, 09:40 AM', verified: true },
      { name: 'House Job Certificate.pdf', uploadedDate: '26 May 2025, 09:42 AM', verified: true },
    ],
    declaration: {
      text: 'I confirm that all provided information and documents are true and correct.',
      doctorName: 'Dr. Muhammad Hamza',
      date: '26 May 2025, 09:45 AM',
      accepted: true,
    },
    mismatches: [
      {
        title: 'PMDC Registration Expired',
        description: 'License expired on 28 Feb 2025. Renewal receipt needed.',
        severity: 'High',
      },
    ],
    aiAssist: {
      confidenceScore: 84,
      confidenceLevel: 'High confidence',
      summary: 'License expiry detected. Needs proof of renewal.',
      documentsAuthentic: true,
      faceMatchScore: 94,
      fraudPattern: 'No fraud pattern detected',
    },
    auditTimeline: [
      { event: 'Application Submitted', date: '26 May 2025, 09:48 AM', completed: true },
      { event: 'AI Pre-Check Completed', date: '26 May 2025, 09:49 AM', completed: true },
    ],
    internalNotes: [
      {
        id: 'NOTE-1',
        author: 'Admin',
        role: 'Super Administrator',
        date: '26 May 2025, 10:00 AM',
        text: 'License has expired 3 months ago. Request correction for updated registration certificate.',
      },
    ],
  },
  {
    id: 'DV-2025-05-26-000192',
    caseId: 'DV-2025-05-26-000192',
    doctorName: 'Dr. Ayesha Khalid',
    degree: 'MBBS, FCPS',
    specialty: 'Gynecology',
    careerStage: 'Mid Career (5-15 years)',
    pmdcNumber: '612398-P',
    submittedOn: 'May 26, 2025, 09:15 AM',
    ocrConfidence: 89,
    riskFlag: {
      label: 'Name Mismatch',
      sublabel: 'Against PMDC database',
      severity: 'medium',
    },
    status: 'Corrections',
    personalInfo: {
      fullName: 'Ayesha Khalid',
      fatherName: 'Khalid Mahmood',
      gender: 'Female',
      age: 38,
      phone: '0300 5511223',
      email: 'ayesha.khalid.fcps@gmail.com',
      city: 'Karachi, Sindh',
      country: 'Pakistan',
      address: 'Apartment 4B, Defence Phase 5, Karachi',
      cnicNumber: '42101-6123985-2',
      dob: '28 Sep 1986',
      issueDate: '10 Oct 2017',
      expiryDate: '10 Oct 2027',
      nationality: 'Pakistani',
    },
    pmdcDetails: {
      licenseNumber: '612398-P',
      issueDate: '15 Jul 2016',
      expiryDate: '14 Jul 2026',
      registrationStatus: 'Active',
    },
    qualifications: [
      { degree: 'MBBS', institution: 'Sindh Medical College, Karachi', year: '2010' },
      { degree: 'FCPS (Gynecology)', institution: 'College of Physicians & Surgeons Pakistan', year: '2016' },
    ],
    additionalDocuments: [
      { name: 'MBBS Degree.pdf', uploadedDate: '26 May 2025, 09:10 AM', verified: true },
      { name: 'FCPS Specialist Certificate.pdf', uploadedDate: '26 May 2025, 09:12 AM', verified: true },
    ],
    declaration: {
      text: 'I confirm that all provided information and documents are true and correct.',
      doctorName: 'Dr. Ayesha Khalid',
      date: '26 May 2025, 09:15 AM',
      accepted: true,
    },
    mismatches: [
      {
        title: 'Middle Name Variation',
        description: 'CNIC has maiden name, PMDC has married name.',
        severity: 'Medium',
      },
    ],
    aiAssist: {
      confidenceScore: 89,
      confidenceLevel: 'High confidence',
      summary: 'Requires marriage certificate or updated CNIC for name reconciliation.',
      documentsAuthentic: true,
      faceMatchScore: 91,
      fraudPattern: 'No fraud pattern detected',
    },
    auditTimeline: [
      { event: 'Application Submitted', date: '26 May 2025, 09:15 AM', completed: true },
      { event: 'Correction Requested by Admin', date: '26 May 2025, 10:30 AM', completed: true },
    ],
    internalNotes: [
      {
        id: 'NOTE-1',
        author: 'Admin',
        role: 'Super Administrator',
        date: '26 May 2025, 10:30 AM',
        text: 'Correction request sent: please upload marriage certificate or CNIC showing husband name.',
      },
    ],
  },
  {
    id: 'DV-2025-05-26-000195',
    caseId: 'DV-2025-05-26-000195',
    doctorName: 'Dr. Bilal Ahmed',
    degree: 'MBBS, MS (Surgery)',
    specialty: 'General Surgery',
    careerStage: 'Early Career (0-5 years)',
    pmdcNumber: '795632-P',
    submittedOn: 'May 26, 2025, 08:37 AM',
    ocrConfidence: 76,
    riskFlag: {
      label: 'Document Blurry',
      sublabel: 'Low scan clarity',
      severity: 'high',
    },
    status: 'Rejected',
    personalInfo: {
      fullName: 'Bilal Ahmed',
      fatherName: 'Ahmed Din',
      gender: 'Male',
      age: 33,
      phone: '0345 7788990',
      email: 'bilal.ahmed.doc@gmail.com',
      city: 'Rawalpindi, Punjab',
      country: 'Pakistan',
      address: 'Satellite Town, Rawalpindi',
      cnicNumber: '37405-7956321-1',
      dob: '03 May 1991',
      issueDate: '12 Jan 2019',
      expiryDate: '12 Jan 2029',
      nationality: 'Pakistani',
    },
    pmdcDetails: {
      licenseNumber: '795632-P',
      issueDate: '10 Nov 2019',
      expiryDate: '09 Nov 2024',
      registrationStatus: 'Expired',
    },
    qualifications: [
      { degree: 'MBBS', institution: 'Rawalpindi Medical University', year: '2016' },
      { degree: 'MS (General Surgery)', institution: 'Shaheed Zulfiqar Ali Bhutto Medical University', year: '2022' },
    ],
    additionalDocuments: [
      { name: 'Scanned PMDC License.jpg', uploadedDate: '26 May 2025, 08:30 AM', verified: false },
    ],
    declaration: {
      text: 'I confirm that all provided information and documents are true and correct.',
      doctorName: 'Dr. Bilal Ahmed',
      date: '26 May 2025, 08:35 AM',
      accepted: true,
    },
    mismatches: [
      {
        title: 'Illegible PMDC Scan',
        description: 'Text on license scan is distorted and OCR cannot confirm authenticity.',
        severity: 'High',
      },
    ],
    aiAssist: {
      confidenceScore: 76,
      confidenceLevel: 'Low confidence',
      summary: 'Image resolution below minimum 300 DPI threshold.',
      documentsAuthentic: false,
      faceMatchScore: 82,
      fraudPattern: 'Inconclusive document structure',
    },
    auditTimeline: [
      { event: 'Application Submitted', date: '26 May 2025, 08:37 AM', completed: true },
      { event: 'Rejected by Admin', date: '26 May 2025, 09:00 AM', completed: true },
    ],
    internalNotes: [
      {
        id: 'NOTE-1',
        author: 'Admin',
        role: 'Super Administrator',
        date: '26 May 2025, 09:00 AM',
        text: 'Rejected due to illegible scan and expired license number.',
      },
    ],
  },
  {
    id: 'DV-2025-05-26-000198',
    caseId: 'DV-2025-05-26-000198',
    doctorName: 'Dr. Sana Fatima',
    degree: 'MBBS, MCPS',
    specialty: 'Pediatrics',
    careerStage: 'Mid Career (5-15 years)',
    pmdcNumber: '673214-P',
    submittedOn: 'May 26, 2025, 07:58 AM',
    ocrConfidence: 96,
    riskFlag: {
      label: 'No Issues',
      sublabel: 'Full match verified',
      severity: 'low',
    },
    status: 'Approved',
    personalInfo: {
      fullName: 'Sana Fatima',
      fatherName: 'Fatima Ali',
      gender: 'Female',
      age: 35,
      phone: '0312 9988776',
      email: 'sana.fatima.ped@gmail.com',
      city: 'Islamabad, ICT',
      country: 'Pakistan',
      address: 'Sector F-8/2, Islamabad',
      cnicNumber: '35202-6732145-4',
      dob: '18 Dec 1989',
      issueDate: '05 Mar 2016',
      expiryDate: '05 Mar 2026',
      nationality: 'Pakistani',
    },
    pmdcDetails: {
      licenseNumber: '673214-P',
      issueDate: '20 Aug 2017',
      expiryDate: '19 Aug 2027',
      registrationStatus: 'Active',
    },
    qualifications: [
      { degree: 'MBBS', institution: 'Army Medical College, Rawalpindi', year: '2014' },
      { degree: 'MCPS (Pediatrics)', institution: 'College of Physicians & Surgeons Pakistan', year: '2019' },
    ],
    additionalDocuments: [
      { name: 'MBBS Degree.pdf', uploadedDate: '26 May 2025, 07:50 AM', verified: true },
      { name: 'PMDC Card Copy.pdf', uploadedDate: '26 May 2025, 07:52 AM', verified: true },
    ],
    declaration: {
      text: 'I confirm that all provided information and documents are true and correct.',
      doctorName: 'Dr. Sana Fatima',
      date: '26 May 2025, 07:55 AM',
      accepted: true,
    },
    mismatches: [],
    aiAssist: {
      confidenceScore: 96,
      confidenceLevel: 'Very High confidence',
      summary: 'All credentials verified against national database without discrepancies.',
      documentsAuthentic: true,
      faceMatchScore: 98,
      fraudPattern: 'No fraud pattern detected',
    },
    auditTimeline: [
      { event: 'Application Submitted', date: '26 May 2025, 07:58 AM', completed: true },
      { event: 'Approved by Super Admin', date: '26 May 2025, 08:15 AM', completed: true },
    ],
    internalNotes: [
      {
        id: 'NOTE-1',
        author: 'Admin',
        role: 'Super Administrator',
        date: '26 May 2025, 08:15 AM',
        text: 'Clean record. PMDC portal cross-check matched 100%. Approved.',
      },
    ],
  },
  {
    id: 'DV-2025-05-26-000201',
    caseId: 'DV-2025-05-26-000201',
    doctorName: 'Dr. Usman Tariq',
    degree: 'MBBS',
    specialty: 'Internal Medicine',
    careerStage: 'Early Career (0-5 years)',
    pmdcNumber: '812467-P',
    submittedOn: 'May 26, 2025, 07:41 AM',
    ocrConfidence: 91,
    riskFlag: {
      label: 'Document Expiry',
      sublabel: 'Reg. expiring soon',
      severity: 'medium',
    },
    status: 'Pending',
    personalInfo: {
      fullName: 'Usman Tariq',
      fatherName: 'Tariq Mahmood',
      gender: 'Male',
      age: 28,
      phone: '0308 1122334',
      email: 'usman.tariq.doc@gmail.com',
      city: 'Multan, Punjab',
      country: 'Pakistan',
      address: 'Gulgasht Colony, Multan',
      cnicNumber: '36302-8124671-3',
      dob: '22 Jul 1996',
      issueDate: '10 Nov 2018',
      expiryDate: '10 Nov 2028',
      nationality: 'Pakistani',
    },
    pmdcDetails: {
      licenseNumber: '812467-P',
      issueDate: '01 Jan 2022',
      expiryDate: '31 Dec 2025',
      registrationStatus: 'Active',
    },
    qualifications: [
      { degree: 'MBBS', institution: 'Nishtar Medical University, Multan', year: '2021' },
    ],
    additionalDocuments: [
      { name: 'MBBS Degree.pdf', uploadedDate: '26 May 2025, 07:35 AM', verified: true },
      { name: 'PMDC Certificate.pdf', uploadedDate: '26 May 2025, 07:36 AM', verified: true },
    ],
    declaration: {
      text: 'I confirm that all provided information and documents are true and correct.',
      doctorName: 'Dr. Usman Tariq',
      date: '26 May 2025, 07:40 AM',
      accepted: true,
    },
    mismatches: [
      {
        title: 'Registration Expiring Soon',
        description: 'PMDC license valid until Dec 2025.',
        severity: 'Medium',
      },
    ],
    aiAssist: {
      confidenceScore: 91,
      confidenceLevel: 'High confidence',
      summary: 'Clean credentials, standard early-career doctor application.',
      documentsAuthentic: true,
      faceMatchScore: 95,
      fraudPattern: 'No fraud pattern detected',
    },
    auditTimeline: [
      { event: 'Application Submitted', date: '26 May 2025, 07:41 AM', completed: true },
      { event: 'Under Admin Review', date: '26 May 2025, 08:00 AM', completed: true },
    ],
    internalNotes: [],
  },
];

// ─── Simple In-Memory Session Store ─────────────────────────────────────────
// Allows mutations (approve, reject, correction, notes) to persist during session
class DoctorVerificationStore {
  private records: DoctorVerificationRecord[] = [...initialDoctorVerifications];
  private listeners: (() => void)[] = [];

  getRecords(): DoctorVerificationRecord[] {
    return this.records;
  }

  getRecordById(id: string): DoctorVerificationRecord | undefined {
    return this.records.find((r) => r.id === id || r.caseId === id);
  }

  approveRecord(id: string): void {
    this.records = this.records.map((r) => {
      if (r.id === id || r.caseId === id) {
        return {
          ...r,
          status: 'Approved',
          auditTimeline: [
            ...r.auditTimeline,
            { event: 'Approved by Super Admin', date: 'Just now', completed: true },
          ],
          internalNotes: [
            ...r.internalNotes,
            {
              id: `NOTE-${Date.now()}`,
              author: 'Super Admin',
              role: 'Admin',
              date: 'Just now',
              text: 'Credentials verified and approved.',
            },
          ],
        };
      }
      return r;
    });
    this.notify();
  }

  rejectRecord(id: string, reason: string): void {
    this.records = this.records.map((r) => {
      if (r.id === id || r.caseId === id) {
        return {
          ...r,
          status: 'Rejected',
          auditTimeline: [
            ...r.auditTimeline,
            { event: `Rejected by Admin: ${reason}`, date: 'Just now', completed: true },
          ],
          internalNotes: [
            ...r.internalNotes,
            {
              id: `NOTE-${Date.now()}`,
              author: 'Super Admin',
              role: 'Admin',
              date: 'Just now',
              text: `Application rejected. Reason: ${reason}`,
            },
          ],
        };
      }
      return r;
    });
    this.notify();
  }

  requestCorrection(id: string, instruction: string): void {
    this.records = this.records.map((r) => {
      if (r.id === id || r.caseId === id) {
        return {
          ...r,
          status: 'Corrections',
          auditTimeline: [
            ...r.auditTimeline,
            { event: `Correction Requested: ${instruction}`, date: 'Just now', completed: true },
          ],
          internalNotes: [
            ...r.internalNotes,
            {
              id: `NOTE-${Date.now()}`,
              author: 'Super Admin',
              role: 'Admin',
              date: 'Just now',
              text: `Correction requested from applicant: ${instruction}`,
            },
          ],
        };
      }
      return r;
    });
    this.notify();
  }

  addNote(id: string, text: string): void {
    this.records = this.records.map((r) => {
      if (r.id === id || r.caseId === id) {
        return {
          ...r,
          internalNotes: [
            ...r.internalNotes,
            {
              id: `NOTE-${Date.now()}`,
              author: 'Super Admin',
              role: 'Admin',
              date: 'Just now',
              text,
            },
          ],
        };
      }
      return r;
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

export const doctorVerificationStore = new DoctorVerificationStore();
