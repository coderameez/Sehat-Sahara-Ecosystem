// ─── Admin Mock Data ─────────────────────────────────────────────────────────
// Realistic local mock data for Admin-01 Dashboard.
// All data stays inside src/admin/. No external dependencies.

export interface PlatformStats {
  totalUsers: number;
  totalDoctors: number;
  totalHospitals: number;
  totalPatients: number;
  pendingVerifications: number;
  activeConsultations: number;
  communityPosts: number;
  flaggedContent: number;
}

export interface DoctorVerificationItem {
  id: string;
  name: string;
  specialty: string;
  submittedDate: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
  documentsCount: number;
  city: string;
  aiScore: number; // 0-100
}

export interface RecentActivityItem {
  id: string;
  type: 'user_registered' | 'doctor_verified' | 'hospital_onboarded' | 'content_flagged' | 'report_submitted' | 'doctor_rejected';
  description: string;
  timestamp: string;
  actor: string;
}

export interface PendingActionItem {
  id: string;
  category: 'verification' | 'moderation' | 'hospital' | 'report';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface CommunityReportItem {
  id: string;
  reportedBy: string;
  reportedContent: string;
  reason: string;
  status: 'open' | 'under-review' | 'resolved' | 'dismissed';
  createdAt: string;
  contentType: 'post' | 'comment' | 'blood_request' | 'item_listing';
}

export interface AIVerificationSummary {
  totalProcessed: number;
  autoApproved: number;
  flaggedForReview: number;
  autoRejected: number;
  avgProcessingTime: string;
  accuracyRate: number;
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export const platformStats: PlatformStats = {
  totalUsers: 14_832,
  totalDoctors: 1_247,
  totalHospitals: 186,
  totalPatients: 13_399,
  pendingVerifications: 23,
  activeConsultations: 89,
  communityPosts: 4_621,
  flaggedContent: 12,
};

// ─── Doctor Verification Queue ───────────────────────────────────────────────
export const doctorVerifications: DoctorVerificationItem[] = [
  {
    id: 'VER-001',
    name: 'Dr. Fatima Noor',
    specialty: 'Dermatology',
    submittedDate: '2026-09-01',
    status: 'pending',
    documentsCount: 4,
    city: 'Lahore',
    aiScore: 92,
  },
  {
    id: 'VER-002',
    name: 'Dr. Ahmed Raza',
    specialty: 'Cardiology',
    submittedDate: '2026-08-30',
    status: 'in-review',
    documentsCount: 5,
    city: 'Karachi',
    aiScore: 87,
  },
  {
    id: 'VER-003',
    name: 'Dr. Sana Malik',
    specialty: 'General Practice',
    submittedDate: '2026-08-29',
    status: 'pending',
    documentsCount: 3,
    city: 'Islamabad',
    aiScore: 78,
  },
  {
    id: 'VER-004',
    name: 'Dr. Hassan Ali',
    specialty: 'Orthopedics',
    submittedDate: '2026-08-28',
    status: 'pending',
    documentsCount: 6,
    city: 'Faisalabad',
    aiScore: 95,
  },
  {
    id: 'VER-005',
    name: 'Dr. Maryam Sheikh',
    specialty: 'Pediatrics',
    submittedDate: '2026-08-27',
    status: 'in-review',
    documentsCount: 4,
    city: 'Multan',
    aiScore: 64,
  },
];

// ─── Recent Activity ─────────────────────────────────────────────────────────
export const recentActivity: RecentActivityItem[] = [
  {
    id: 'ACT-001',
    type: 'doctor_verified',
    description: 'Dr. Zainab Hussain verified and approved',
    timestamp: '2 minutes ago',
    actor: 'AI Verification',
  },
  {
    id: 'ACT-002',
    type: 'user_registered',
    description: '15 new patients registered today',
    timestamp: '18 minutes ago',
    actor: 'System',
  },
  {
    id: 'ACT-003',
    type: 'content_flagged',
    description: 'Community post flagged for misinformation',
    timestamp: '45 minutes ago',
    actor: 'AI Moderation',
  },
  {
    id: 'ACT-004',
    type: 'hospital_onboarded',
    description: 'City Care Hospital completed onboarding',
    timestamp: '1 hour ago',
    actor: 'System',
  },
  {
    id: 'ACT-005',
    type: 'doctor_rejected',
    description: 'Dr. Imran Qureshi — invalid PMDC number',
    timestamp: '2 hours ago',
    actor: 'Admin Review',
  },
  {
    id: 'ACT-006',
    type: 'report_submitted',
    description: 'Patient reported inappropriate blood request',
    timestamp: '3 hours ago',
    actor: 'User Report',
  },
];

// ─── Pending Admin Actions ───────────────────────────────────────────────────
export const pendingActions: PendingActionItem[] = [
  {
    id: 'PA-001',
    category: 'verification',
    title: 'Doctor documents require manual review',
    description: '5 doctor verification requests need manual credential check',
    priority: 'high',
    createdAt: '2026-09-02',
  },
  {
    id: 'PA-002',
    category: 'moderation',
    title: 'Flagged community posts',
    description: '3 posts flagged by AI moderation need human review',
    priority: 'high',
    createdAt: '2026-09-02',
  },
  {
    id: 'PA-003',
    category: 'hospital',
    title: 'Hospital account approval pending',
    description: 'Al-Shifa Medical Center awaiting account verification',
    priority: 'medium',
    createdAt: '2026-09-01',
  },
  {
    id: 'PA-004',
    category: 'report',
    title: 'User complaint unresolved',
    description: 'Patient complaint about incorrect doctor rating',
    priority: 'low',
    createdAt: '2026-08-31',
  },
];

// ─── Community Reports ───────────────────────────────────────────────────────
export const communityReports: CommunityReportItem[] = [
  {
    id: 'RPT-001',
    reportedBy: 'Ayesha Bibi',
    reportedContent: 'Unverified medical advice in health tips post',
    reason: 'Misinformation',
    status: 'open',
    createdAt: '2026-09-02',
    contentType: 'post',
  },
  {
    id: 'RPT-002',
    reportedBy: 'Usman Tariq',
    reportedContent: 'Suspicious blood request with incorrect details',
    reason: 'Suspicious Activity',
    status: 'under-review',
    createdAt: '2026-09-01',
    contentType: 'blood_request',
  },
  {
    id: 'RPT-003',
    reportedBy: 'Nadia Perveen',
    reportedContent: 'Offensive comment on community discussion',
    reason: 'Harassment',
    status: 'open',
    createdAt: '2026-09-01',
    contentType: 'comment',
  },
];

// ─── AI Verification / Moderation Summary ────────────────────────────────────
export const aiVerificationSummary: AIVerificationSummary = {
  totalProcessed: 342,
  autoApproved: 285,
  flaggedForReview: 41,
  autoRejected: 16,
  avgProcessingTime: '< 2 min',
  accuracyRate: 96.4,
};

// ─── Dashboard KPI trend helpers ─────────────────────────────────────────────
export interface KPICard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string; // lucide icon name key
}

export const kpiCards: KPICard[] = [
  {
    label: 'Total Users',
    value: '14,832',
    change: '+12.3%',
    changeType: 'up',
    icon: 'Users',
  },
  {
    label: 'Active Doctors',
    value: '1,247',
    change: '+8.1%',
    changeType: 'up',
    icon: 'Stethoscope',
  },
  {
    label: 'Hospitals / Clinics',
    value: '186',
    change: '+3 this week',
    changeType: 'up',
    icon: 'Building2',
  },
  {
    label: 'Pending Verifications',
    value: '23',
    change: '5 urgent',
    changeType: 'neutral',
    icon: 'ShieldCheck',
  },
];
