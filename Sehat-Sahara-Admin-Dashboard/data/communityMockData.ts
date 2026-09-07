// ─── Community Moderation Mock Data & Store ─────────────────────────────────
// Matches PDF Page 12 (A-08 / A-07 Community Moderation) exactly.
// Only two allowed categories: 'Blood' and 'Things Sharing'.

export type CommunityType = 'Blood' | 'Things Sharing';
export type ModerationStatus = 'Pending' | 'Kept' | 'Hidden' | 'Removed';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface CommunityReportRecord {
  id: string;
  type: CommunityType;
  title: string;
  reporter: {
    name: string;
    userId: string;
    avatar?: string;
  };
  reason: 'Misinformation' | 'Spam' | 'Incomplete Info' | 'Irrelevant' | 'Suspicious Contact' | 'Safety Hazard';
  aiFlag: {
    label: string;
    type: 'warning' | 'neutral' | 'danger';
  };
  risk: RiskLevel;
  reportedTime: string;
  status: ModerationStatus;

  // Detail View (Drawer) information
  originalListing: {
    title: string;
    postedBy: string;
    userId: string;
    postedTime: string;
    description: string;
    location: string;
    contactNumber?: string;
    // Blood specific
    bloodGroup?: string;
    urgency?: 'Standard' | 'Urgent' | 'SOS';
    unitsNeeded?: number;
    hospital?: string;
    // Things sharing specific
    category?: string;
    condition?: string;
    availableDuration?: string;
  };
  evidence: {
    reporterNotes: string;
    attachmentName?: string;
    attachmentType?: 'image' | 'document';
  };
  aiModerationAssist: {
    assessment: string;
    confidenceScore: number;
    signals: string[];
  };
}

export const initialCommunityReports: CommunityReportRecord[] = [
  // ─── Blood Moderation Reports ─────────────────────────────────────────────
  {
    id: 'RPT-B-001',
    type: 'Blood',
    title: 'O+ Blood Required in Lahore',
    reporter: {
      name: 'Ayesha Khan',
      userId: 'U-78291',
    },
    reason: 'Misinformation',
    aiFlag: {
      label: 'Likely Misleading',
      type: 'warning',
    },
    risk: 'Medium',
    reportedTime: '19 May 2025 10:24 AM',
    status: 'Pending',
    originalListing: {
      title: 'O+ Blood Required in Lahore',
      postedBy: 'Ayesha Khan',
      userId: 'U-78291',
      postedTime: '19 May 2025, 08:47 AM',
      description:
        'My father is admitted in Services Hospital Lahore. Need O+ blood urgently. Contact: 0300-1234567. Please reach out immediately if available.',
      location: 'Services Hospital, Lahore, Punjab',
      contactNumber: '0300-1234567',
      bloodGroup: 'O+',
      urgency: 'SOS',
      unitsNeeded: 2,
      hospital: 'Services Hospital, Lahore',
    },
    evidence: {
      reporterNotes:
        'The mobile number provided matches a commercial blood agent previously flagged. Hospital desk confirmed no patient by this name in ward 4.',
      attachmentName: 'hospital_inquiry_receipt.jpg',
      attachmentType: 'image',
    },
    aiModerationAssist: {
      assessment: 'Likely Misleading',
      confidenceScore: 78,
      signals: [
        'Contact number appears in multiple previously reported listings across different cities.',
        'Similar text phrasing detected from known fake urgent blood campaign templates.',
        'No verified blood requisition slip or hospital case sheet attached.',
      ],
    },
  },
  {
    id: 'RPT-B-002',
    type: 'Blood',
    title: 'B- Blood Needed Urgently',
    reporter: {
      name: 'Bilal Ahmed',
      userId: 'U-62134',
    },
    reason: 'Spam',
    aiFlag: {
      label: 'Unlikely',
      type: 'neutral',
    },
    risk: 'Low',
    reportedTime: '19 May 2025 09:58 AM',
    status: 'Pending',
    originalListing: {
      title: 'B- Blood Needed Urgently',
      postedBy: 'Tariq Mehmood',
      userId: 'U-45219',
      postedTime: '19 May 2025, 09:15 AM',
      description:
        'Urgently require 1 unit B-negative blood for emergency coronary bypass at Jinnah Hospital, Karachi.',
      location: 'Jinnah Postgraduate Medical Centre, Karachi, Sindh',
      contactNumber: '0321-9876543',
      bloodGroup: 'B-',
      urgency: 'Urgent',
      unitsNeeded: 1,
      hospital: 'Jinnah Hospital, Karachi',
    },
    evidence: {
      reporterNotes:
        'User reposted this 3 times within 10 minutes in the general feed.',
      attachmentName: 'repeated_posts_feed.png',
      attachmentType: 'image',
    },
    aiModerationAssist: {
      assessment: 'Low Risk — Likely High Urgency Duplication',
      confidenceScore: 89,
      signals: [
        'Valid hospital requisition ID verified in text.',
        'Rapid reposting likely motivated by critical emergency rather than malicious intent.',
        'Recommending consolidation rather than punitive removal.',
      ],
    },
  },
  {
    id: 'RPT-B-003',
    type: 'Blood',
    title: 'AB+ Blood Required for Surgery',
    reporter: {
      name: 'Hassan Raza',
      userId: 'U-55821',
    },
    reason: 'Incomplete Info',
    aiFlag: {
      label: 'Possible Issue',
      type: 'warning',
    },
    risk: 'Medium',
    reportedTime: '19 May 2025 09:41 AM',
    status: 'Pending',
    originalListing: {
      title: 'AB+ Blood Required for Surgery',
      postedBy: 'Farhan Zaidi',
      userId: 'U-88123',
      postedTime: '19 May 2025, 07:30 AM',
      description:
        'Need AB+ blood tomorrow morning. No phone number provided, only Instagram handle @bloodneed_pk.',
      location: 'Civil Hospital, Karachi, Sindh',
      bloodGroup: 'AB+',
      urgency: 'Standard',
      unitsNeeded: 3,
      hospital: 'Civil Hospital, Karachi',
    },
    evidence: {
      reporterNotes:
        'Poster redirected users to external unverified Instagram page charging fee.',
      attachmentName: 'chat_screenshot_external.png',
      attachmentType: 'image',
    },
    aiModerationAssist: {
      assessment: 'Possible Commercial Solicitation',
      confidenceScore: 74,
      signals: [
        'Out-of-app redirection detected (social handle).',
        'Lacks primary direct emergency contact number.',
      ],
    },
  },
  {
    id: 'RPT-B-004',
    type: 'Blood',
    title: 'A- Blood Needed Today',
    reporter: {
      name: 'Sana Tariq',
      userId: 'U-44771',
    },
    reason: 'Misinformation',
    aiFlag: {
      label: 'Possible Issue',
      type: 'warning',
    },
    risk: 'Medium',
    reportedTime: '19 May 2025 08:21 AM',
    status: 'Pending',
    originalListing: {
      title: 'A- Blood Needed Today',
      postedBy: 'Kamran Shah',
      userId: 'U-31902',
      postedTime: '19 May 2025, 06:10 AM',
      description:
        'Severe thalassemia patient requires 1 unit A negative at Holy Family Hospital Rawalpindi.',
      location: 'Holy Family Hospital, Rawalpindi, Punjab',
      contactNumber: '0333-5551234',
      bloodGroup: 'A-',
      urgency: 'Urgent',
      unitsNeeded: 1,
      hospital: 'Holy Family Hospital, Rawalpindi',
    },
    evidence: {
      reporterNotes: 'Thalassemia center stated patient was already discharged yesterday.',
    },
    aiModerationAssist: {
      assessment: 'Outdated Request',
      confidenceScore: 68,
      signals: [
        'Request timestamp older than initial broadcast origin.',
        'Recommend closing or marking fulfilled.',
      ],
    },
  },
  {
    id: 'RPT-B-005',
    type: 'Blood',
    title: 'O- Blood Donors Needed',
    reporter: {
      name: 'Zainab Malik',
      userId: 'U-66218',
    },
    reason: 'Spam',
    aiFlag: {
      label: 'Likely Spam',
      type: 'warning',
    },
    risk: 'Medium',
    reportedTime: '19 May 2025 07:05 AM',
    status: 'Pending',
    originalListing: {
      title: 'O- Blood Donors Needed',
      postedBy: 'Quick Blood Group',
      userId: 'U-11209',
      postedTime: '19 May 2025, 05:40 AM',
      description:
        'Universal donor paid compensation available. Contact fast delivery.',
      location: 'Faisalabad, Punjab',
      contactNumber: '0345-0001122',
      bloodGroup: 'O-',
      urgency: 'SOS',
      unitsNeeded: 4,
    },
    evidence: {
      reporterNotes: 'Explicitly offering money for blood donations which violates policy.',
    },
    aiModerationAssist: {
      assessment: 'Policy Violation — Paid Blood Trade',
      confidenceScore: 94,
      signals: [
        'Keyword detection: "paid compensation", "fast delivery".',
        'Direct violation of non-commercial community charter.',
      ],
    },
  },

  // ─── Things Sharing Moderation Reports ────────────────────────────────────
  {
    id: 'RPT-T-001',
    type: 'Things Sharing',
    title: 'Hospital Bed with Mattress',
    reporter: {
      name: 'Fatima Noor',
      userId: 'U-99321',
    },
    reason: 'Irrelevant',
    aiFlag: {
      label: 'Unlikely',
      type: 'neutral',
    },
    risk: 'Low',
    reportedTime: '19 May 2025 09:15 AM',
    status: 'Pending',
    originalListing: {
      title: 'Hospital Bed with Mattress',
      postedBy: 'Rashid Minhas',
      userId: 'U-22810',
      postedTime: '18 May 2025, 11:20 PM',
      description:
        'Adjustable semi-fowler hospital bed with waterproof medical mattress. Free to borrow for up to 30 days for post-surgery home recovery.',
      location: 'Model Town, Lahore, Punjab',
      contactNumber: '0302-8877665',
      category: 'Hospital Bed / Furniture',
      condition: 'Gently Used (Sanitized)',
      availableDuration: '30 Days',
    },
    evidence: {
      reporterNotes:
        'Listing photos show mild wear on the side-rails; reporter thought it was completely brand new.',
      attachmentName: 'bed_condition_photo.jpg',
      attachmentType: 'image',
    },
    aiModerationAssist: {
      assessment: 'Legitimate Medical Equipment Sharing',
      confidenceScore: 88,
      signals: [
        'Item is verified medical support apparatus.',
        'Lender account is a verified community contributor with 3 prior successful returns.',
        'Report appears to be subjective expectation mismatch.',
      ],
    },
  },
  {
    id: 'RPT-T-002',
    type: 'Things Sharing',
    title: 'Wheelchair for Elderly',
    reporter: {
      name: 'Usman Ali',
      userId: 'U-77123',
    },
    reason: 'Spam',
    aiFlag: {
      label: 'Likely Spam',
      type: 'warning',
    },
    risk: 'Medium',
    reportedTime: '19 May 2025 08:52 AM',
    status: 'Pending',
    originalListing: {
      title: 'Wheelchair for Elderly',
      postedBy: 'Commercial Med Supplies',
      userId: 'U-90412',
      postedTime: '18 May 2025, 08:30 PM',
      description:
        'Wheelchairs available for rent PKR 2500 per week. Call our showroom in Saddar.',
      location: 'Saddar, Karachi, Sindh',
      contactNumber: '0331-4455667',
      category: 'Mobility Equipment',
      condition: 'New',
      availableDuration: 'Commercial Rental',
    },
    evidence: {
      reporterNotes: 'This is a commercial business using the free Things Sharing community as free advertising.',
      attachmentName: 'rental_rates_card.png',
      attachmentType: 'image',
    },
    aiModerationAssist: {
      assessment: 'Commercial Rental Activity',
      confidenceScore: 91,
      signals: [
        'Detects commercial rate quotation "PKR 2500 per week".',
        'Things Sharing is reserved strictly for mutual free sharing and solidarity loans.',
      ],
    },
  },
  {
    id: 'RPT-T-003',
    type: 'Things Sharing',
    title: 'Walking Stick Available',
    reporter: {
      name: 'Imran Sheikh',
      userId: 'U-33211',
    },
    reason: 'Irrelevant',
    aiFlag: {
      label: 'Unlikely',
      type: 'neutral',
    },
    risk: 'Low',
    reportedTime: '19 May 2025 07:46 AM',
    status: 'Pending',
    originalListing: {
      title: 'Walking Stick Available',
      postedBy: 'Dawood Javed',
      userId: 'U-51204',
      postedTime: '17 May 2025, 04:15 PM',
      description:
        'Quad-cane walking stick in excellent condition. Free for any senior or patient in need in Sector F-7 Islamabad.',
      location: 'Sector F-7, Islamabad, ICT',
      contactNumber: '0315-9988771',
      category: 'Mobility Aid',
      condition: 'Good',
      availableDuration: '60 Days',
    },
    evidence: {
      reporterNotes: 'User wanted crutches instead of a walking stick and flagged the post by mistake.',
    },
    aiModerationAssist: {
      assessment: 'No Policy Violation',
      confidenceScore: 96,
      signals: [
        'Content complies 100% with Things Sharing terms.',
        'Misunderstanding by reporter.',
      ],
    },
  },
  {
    id: 'RPT-T-004',
    type: 'Things Sharing',
    title: 'Portable Oxygen Concentrator 5L',
    reporter: {
      name: 'Dr. Bilal Qureshi',
      userId: 'U-14890',
    },
    reason: 'Safety Hazard',
    aiFlag: {
      label: 'Possible Issue',
      type: 'warning',
    },
    risk: 'High',
    reportedTime: '18 May 2025 06:10 PM',
    status: 'Pending',
    originalListing: {
      title: 'Portable Oxygen Concentrator 5L',
      postedBy: 'Noman Riaz',
      userId: 'U-60211',
      postedTime: '18 May 2025, 02:00 PM',
      description:
        'Old concentrator machine. Filter is clogged and beeps error 4, but works if restarted every 15 minutes. Free borrow.',
      location: 'Peshawar, KPK',
      contactNumber: '0301-2233445',
      category: 'Respiratory Device',
      condition: 'Faulty / Needs Service',
      availableDuration: '14 Days',
    },
    evidence: {
      reporterNotes:
        'Clogged oxygen concentrators can deliver hypoxic gas mixtures to acute respiratory patients. Extremely dangerous.',
    },
    aiModerationAssist: {
      assessment: 'Clinical Equipment Safety Risk',
      confidenceScore: 89,
      signals: [
        'Faulty life-support equipment listed.',
        'High probability of patient harm if used in medical emergency.',
      ],
    },
  },
];

// ─── Pub-Sub In-Memory Store for Moderation State ───────────────────────────
class CommunityModerationStore {
  private reports: CommunityReportRecord[] = [...initialCommunityReports];
  private listeners: (() => void)[] = [];
  private reviewedTodayCount: number = 26; // seed starting value matching PDF (26 Reviewed Today)

  getReports(): CommunityReportRecord[] {
    return this.reports;
  }

  getReviewedTodayCount(): number {
    return this.reviewedTodayCount;
  }

  updateReportStatus(id: string, newStatus: ModerationStatus, _adminNote?: string): void {
    const prev = this.reports.find((r) => r.id === id);
    if (!prev) return;

    // Increment reviewed count if going from Pending to a decided state
    if (prev.status === 'Pending' && newStatus !== 'Pending') {
      this.reviewedTodayCount += 1;
    }

    this.reports = this.reports.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: newStatus,
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

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const communityModerationStore = new CommunityModerationStore();
