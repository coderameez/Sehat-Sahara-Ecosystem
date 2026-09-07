import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Check,
  X,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  Code,
  Send,
  UserCheck,
  RotateCcw,
  Ban,
  GraduationCap,
} from 'lucide-react';
import {
  doctorVerificationStore,
  DoctorVerificationRecord,
} from '../data/verificationMockData';

export const DoctorVerificationDetail: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  // Record from store
  const [record, setRecord] = useState<DoctorVerificationRecord | undefined>(() =>
    doctorVerificationStore.getRecordById(doctorId || 'DV-2025-05-31-000247')
  );

  useEffect(() => {
    const unsub = doctorVerificationStore.subscribe(() => {
      setRecord(doctorVerificationStore.getRecordById(doctorId || 'DV-2025-05-31-000247'));
    });
    return unsub;
  }, [doctorId]);

  // Tab inside OCR Extracted info
  const [ocrTab, setOcrTab] = useState<'cnic' | 'pmdc' | 'other'>('cnic');

  // JSON modal state
  const [showJsonModal, setShowJsonModal] = useState(false);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('PMDC license registration expired or invalid');
  const [rejectCustomReason, setRejectCustomReason] = useState('');

  // Correction modal state
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionInstruction, setCorrectionInstruction] = useState('');

  // Note input state
  const [newNoteText, setNewNoteText] = useState('');

  // If no record found, fallback to first record
  const currentRecord =
    record || doctorVerificationStore.getRecords()[0];

  const handleApprove = () => {
    if (!currentRecord) return;
    doctorVerificationStore.approveRecord(currentRecord.id);
  };

  const handleConfirmReject = () => {
    if (!currentRecord) return;
    const finalReason = rejectReason === 'Other' ? rejectCustomReason : rejectReason;
    doctorVerificationStore.rejectRecord(currentRecord.id, finalReason || 'Application rejected');
    setShowRejectModal(false);
  };

  const handleConfirmCorrection = () => {
    if (!currentRecord || !correctionInstruction.trim()) return;
    doctorVerificationStore.requestCorrection(currentRecord.id, correctionInstruction.trim());
    setShowCorrectionModal(false);
    setCorrectionInstruction('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRecord || !newNoteText.trim()) return;
    doctorVerificationStore.addNote(currentRecord.id, newNoteText.trim());
    setNewNoteText('');
  };

  if (!currentRecord) {
    return (
      <div className="max-w-[1440px] mx-auto p-8 text-center">
        <p className="text-slate-500 mb-4">Doctor record not found.</p>
        <button
          onClick={() => navigate('/admin/verification')}
          className="px-4 py-2 bg-brand-700 text-white rounded-lg text-sm font-semibold"
        >
          Back to Queue
        </button>
      </div>
    );
  }

  const isApproved = currentRecord.status === 'Approved';
  const isRejected = currentRecord.status === 'Rejected';

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12">

      {/* ─── Top Bar: Back & Case Metadata ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-surface-border rounded-xl px-5 py-3.5 shadow-card">
        <button
          onClick={() => navigate('/admin/verification')}
          className="flex items-center gap-2 text-[13.5px] font-bold text-slate-800 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Doctor Verification Detail</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap text-[12px]">
          <span className="text-slate-500 font-mono">Case ID: {currentRecord.caseId}</span>
          <span className="text-slate-300">•</span>
          {currentRecord.status === 'Pending' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-amber-600" />
              Pending Review
            </span>
          )}
          {currentRecord.status === 'Approved' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <Check className="w-3 h-3 text-emerald-600" />
              Approved
            </span>
          )}
          {currentRecord.status === 'Rejected' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
              <XCircle className="w-3 h-3 text-rose-600" />
              Rejected
            </span>
          )}
          {currentRecord.status === 'Corrections' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3 text-orange-600" />
              Corrections Needed
            </span>
          )}
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">Submitted: {currentRecord.submittedOn}</span>
        </div>
      </div>

      {/* ─── Doctor Profile Header Card ─────────────────────────────── */}
      <div className="bg-white border border-surface-border rounded-xl p-6 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Doctor Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-xl font-bold flex items-center justify-center border-2 border-white shadow-sm shrink-0">
              {currentRecord.doctorName
                .replace('Dr. ', '')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[19px] font-bold text-slate-900 leading-tight">
                  {currentRecord.doctorName}
                </h2>
                {isApproved && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[13px] font-semibold text-brand-700 mt-0.5">
                {currentRecord.specialty} • {currentRecord.degree}
              </p>

              {/* Meta pills matching PDF Page 8 */}
              <div className="flex items-center gap-3 flex-wrap mt-2.5 text-[12px] text-slate-600 font-medium">
                <span className="inline-flex items-center gap-1">
                  🇵🇰 {currentRecord.personalInfo.country}
                </span>
                <span className="text-slate-300">•</span>
                <span>📍 {currentRecord.personalInfo.city}</span>
                <span className="text-slate-300">•</span>
                <span>👤 {currentRecord.personalInfo.gender}</span>
                <span className="text-slate-300">•</span>
                <span>🎂 {currentRecord.personalInfo.age} Years</span>
                <span className="text-slate-300">•</span>
                <span className="font-mono">📞 {currentRecord.personalInfo.phone}</span>
                <span className="text-slate-300">•</span>
                <span>✉️ {currentRecord.personalInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Right: Verification Document Badges / Previews */}
          <div className="flex items-center gap-3 self-start lg:self-auto overflow-x-auto pb-1 lg:pb-0">
            {/* Selfie / Liveness */}
            <div className="bg-surface-page border border-surface-border rounded-xl p-3 flex items-center gap-3 w-48 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-slate-600 overflow-hidden shrink-0">
                <UserCheck className="w-6 h-6 text-brand-700" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-slate-900">Selfie</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded">Live</span>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-0.5">Liveness Verified</p>
              </div>
            </div>

            {/* CNIC (Front) */}
            <div className="bg-surface-page border border-surface-border rounded-xl p-3 flex items-center gap-3 w-48 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 font-mono text-[10px] font-bold">
                CNIC
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-slate-900">CNIC (Front)</p>
                <p className="text-[10.5px] text-emerald-700 font-semibold mt-0.5">Extracted: Via OCR</p>
              </div>
            </div>

            {/* PMDC License */}
            <div className="bg-surface-page border border-surface-border rounded-xl p-3 flex items-center gap-3 w-48 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 font-mono text-[10px] font-bold">
                PMDC
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-slate-900">PMDC License</p>
                <p className="text-[10.5px] text-emerald-700 font-semibold mt-0.5">Extracted: Via OCR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Two-Column Main Content ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ════════════ LEFT COLUMN: Extracted Info & Docs (7 cols) ════════════ */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── Extracted Information (OCR) ── */}
          <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-page/40">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-700" />
                <h3 className="text-[14px] font-bold text-slate-900">Extracted Information (OCR)</h3>
              </div>
              <button
                onClick={() => setShowJsonModal(true)}
                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                <span>View Full OCR JSON</span>
              </button>
            </div>

            {/* Segmented Sub-Tabs */}
            <div className="flex border-b border-surface-border px-4 bg-slate-50/50">
              <button
                onClick={() => setOcrTab('cnic')}
                className={`py-2.5 px-4 text-[12.5px] font-semibold border-b-2 transition-colors ${ocrTab === 'cnic'
                    ? 'border-brand-700 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                CNIC Details
              </button>
              <button
                onClick={() => setOcrTab('pmdc')}
                className={`py-2.5 px-4 text-[12.5px] font-semibold border-b-2 transition-colors ${ocrTab === 'pmdc'
                    ? 'border-brand-700 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                PMDC License
              </button>
              <button
                onClick={() => setOcrTab('other')}
                className={`py-2.5 px-4 text-[12.5px] font-semibold border-b-2 transition-colors ${ocrTab === 'other'
                    ? 'border-brand-700 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                Other Documents
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 text-[12.5px]">
              {ocrTab === 'cnic' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Full Name</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Father Name</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">CNIC Number</span>
                    <span className="text-slate-900 font-semibold font-mono">{currentRecord.personalInfo.cnicNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Date of Birth</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Gender</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Nationality</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.nationality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Issue Date</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Expiry Date</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.expiryDate}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 font-medium text-[11px] block">Permanent Address</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.personalInfo.address}</span>
                  </div>
                </div>
              )}

              {ocrTab === 'pmdc' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">License Number</span>
                    <span className="text-slate-900 font-semibold font-mono">{currentRecord.pmdcDetails.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Registration Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {currentRecord.pmdcDetails.registrationStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Issue Date</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.pmdcDetails.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px] block">Expiry Date</span>
                    <span className="text-slate-900 font-semibold">{currentRecord.pmdcDetails.expiryDate}</span>
                  </div>
                </div>
              )}

              {ocrTab === 'other' && (
                <div className="space-y-2.5">
                  {currentRecord.additionalDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-page border border-surface-border">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-brand-700" />
                        <div>
                          <p className="text-[12.5px] font-semibold text-slate-900">{doc.name}</p>
                          <p className="text-[10.5px] text-slate-400">Uploaded {doc.uploadedDate}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Qualifications & Medical Education ── */}
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-700" />
              <h3 className="text-[14px] font-bold text-slate-900">Medical Qualifications</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="bg-surface-page border-b border-surface-border text-slate-500 font-semibold text-[11px] uppercase">
                    <th className="py-2.5 px-3">Degree</th>
                    <th className="py-2.5 px-3">Institution</th>
                    <th className="py-2.5 px-3 text-right">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {currentRecord.qualifications.map((q, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{q.degree}</td>
                      <td className="py-2.5 px-3 text-slate-700">{q.institution}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-right">{q.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Applicant Declaration ── */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-[13px] font-bold text-slate-900">Applicant Declaration</h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Declaration Accepted
                </span>
              </div>
              <p className="text-[12px] text-slate-700 italic mt-1 leading-relaxed">
                "{currentRecord.declaration.text}"
              </p>
              <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                Signed by <span className="font-semibold text-slate-700">{currentRecord.declaration.doctorName}</span> on {currentRecord.declaration.date}
              </p>
            </div>
          </div>

        </div>

        {/* ════════════ RIGHT COLUMN: AI Assist, Decisions & Notes (5 cols) ════════════ */}
        <div className="lg:col-span-5 space-y-6">

          {/* ── Mismatch / Risk Analysis ── */}
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-[14px] font-bold text-slate-900">Mismatch / Risk Analysis</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {currentRecord.mismatches.length} items flagged
              </span>
            </div>

            {currentRecord.mismatches.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>No mismatches or risk factors detected.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentRecord.mismatches.map((m, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-[12px] flex items-start justify-between gap-3 ${m.severity === 'High'
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-amber-50/70 border-amber-200'
                      }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">{m.title}</p>
                      <p className="text-slate-600 text-[11.5px] mt-0.5">{m.description}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${m.severity === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                      {m.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── AI Assist Summary (Assistive only) ── */}
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900">AI Assist Summary</h3>
                  <span className="text-[10.5px] text-slate-400 font-medium">Assist only • Human decision required</span>
                </div>
              </div>
              {/* Score Badge */}
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-700 font-black text-[14px] flex flex-col items-center justify-center leading-none shrink-0">
                <span>{currentRecord.aiAssist.confidenceScore}</span>
                <span className="text-[8px] font-normal text-slate-400">/100</span>
              </div>
            </div>

            <div className="bg-surface-page rounded-lg p-3 space-y-2 text-[12px]">
              <p className="text-slate-800 font-medium">
                <span className="font-bold text-brand-700">{currentRecord.aiAssist.confidenceLevel}:</span>{' '}
                {currentRecord.aiAssist.summary}
              </p>
              <div className="border-t border-surface-border pt-2 space-y-1 text-slate-600 text-[11.5px]">
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Documents appear authentic</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Face match score: {currentRecord.aiAssist.faceMatchScore}%</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentRecord.aiAssist.fraudPattern}</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Admin Decision Actions (Approve / Correction / Reject) ── */}
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card space-y-3">
            <h3 className="text-[14px] font-bold text-slate-900">Admin Decision Actions</h3>

            <div className="space-y-2.5">
              {/* Approve */}
              <button
                onClick={handleApprove}
                disabled={isApproved}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors ${isApproved
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-brand-700 hover:bg-brand-800 text-white shadow-xs'
                  }`}
              >
                <Check className="w-4 h-4" />
                <span>{isApproved ? 'Application Approved (Verified)' : 'Approve - Mark as Verified'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Request Correction */}
                <button
                  onClick={() => setShowCorrectionModal(true)}
                  disabled={isApproved}
                  className={`py-2 px-3 rounded-lg font-bold text-[12px] flex items-center justify-center gap-1.5 border transition-colors ${isApproved
                      ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                    }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Request Correction</span>
                </button>

                {/* Reject */}
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isApproved || isRejected}
                  className={`py-2 px-3 rounded-lg font-bold text-[12px] flex items-center justify-center gap-1.5 border transition-colors ${isApproved || isRejected
                      ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                    }`}
                >
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isRejected ? 'Rejected' : 'Reject Application'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Audit Timeline ── */}
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card space-y-3">
            <h3 className="text-[14px] font-bold text-slate-900">Audit Timeline</h3>
            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-6">
              {currentRecord.auditTimeline.map((item, index) => (
                <div key={index} className="relative text-[12px]">
                  <div className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  <p className="font-semibold text-slate-800 leading-snug">{item.event}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Notes (Internal) ── */}
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-slate-900">Internal Notes</h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {currentRecord.internalNotes.length} notes
              </span>
            </div>

            {/* Note List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {currentRecord.internalNotes.length === 0 ? (
                <p className="text-slate-400 text-[12px] italic">No internal notes added yet.</p>
              ) : (
                currentRecord.internalNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-surface-page rounded-lg border border-surface-border text-[12px]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900">{note.author}</span>
                      <span className="text-[10.5px] text-slate-400">{note.date}</span>
                    </div>
                    <p className="text-slate-700 leading-snug">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-surface-border">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add internal note..."
                className="flex-1 h-9 px-3 text-[12.5px] rounded-lg border border-surface-border bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 transition-colors"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="h-9 px-3 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded-lg text-[12px] font-bold flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ─── OCR JSON Modal ─────────────────────────────────────────── */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-surface-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-page">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-brand-700" />
                <h3 className="text-[14px] font-bold text-slate-900">Extracted OCR Payload</h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="w-7 h-7 rounded-md border border-surface-border bg-white flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-[480px] overflow-auto">
              <pre className="text-[11.5px] font-mono bg-slate-900 text-emerald-300 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(
                  {
                    caseId: currentRecord.caseId,
                    doctor: currentRecord.doctorName,
                    ocrConfidence: `${currentRecord.ocrConfidence}%`,
                    personalInfo: currentRecord.personalInfo,
                    pmdcDetails: currentRecord.pmdcDetails,
                    qualifications: currentRecord.qualifications,
                    mismatches: currentRecord.mismatches,
                    aiAssist: currentRecord.aiAssist,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div className="p-3 border-t border-surface-border bg-surface-page flex justify-end">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-1.5 bg-slate-700 text-white rounded-lg text-[12.5px] font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Rejection Reason Modal ─────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-surface-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-surface-border flex items-center justify-between bg-rose-50/50">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-[14px]">
                <Ban className="w-4 h-4" />
                <span>Reject Doctor Application</span>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="w-7 h-7 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-[12.5px]">
              <p className="text-slate-600 font-medium">
                Please select the primary reason for rejecting{' '}
                <span className="font-bold text-slate-900">{currentRecord.doctorName}</span>'s application:
              </p>

              <div className="space-y-2 pt-1">
                {[
                  'PMDC license registration expired or invalid',
                  'Document name does not match PMDC database',
                  'Low image scan quality / unreadable credentials',
                  'Suspected forged/tampered documentation',
                  'Other',
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${rejectReason === reason
                        ? 'border-rose-300 bg-rose-50 text-rose-900 font-semibold'
                        : 'border-surface-border bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      value={reason}
                      checked={rejectReason === reason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="accent-rose-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {rejectReason === 'Other' && (
                <textarea
                  value={rejectCustomReason}
                  onChange={(e) => setRejectCustomReason(e.target.value)}
                  placeholder="Specify custom rejection reason..."
                  rows={3}
                  className="w-full p-2.5 text-[12.5px] rounded-lg border border-surface-border focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              )}
            </div>
            <div className="p-3.5 border-t border-surface-border bg-surface-page flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-[12.5px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[12.5px] shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Correction Request Modal ───────────────────────────────── */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-surface-border overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-surface-border flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-[14px]">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Request Document Correction</span>
              </div>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="w-7 h-7 rounded-md border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-[12.5px]">
              <p className="text-slate-600 font-medium">
                Enter the instructions to send to{' '}
                <span className="font-bold text-slate-900">{currentRecord.doctorName}</span> for resubmission:
              </p>
              <textarea
                value={correctionInstruction}
                onChange={(e) => setCorrectionInstruction(e.target.value)}
                placeholder="e.g. Please upload a clear color scan of PMDC License renewal receipt..."
                rows={4}
                className="w-full p-2.5 text-[12.5px] rounded-lg border border-surface-border focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div className="p-3.5 border-t border-surface-border bg-surface-page flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="px-3.5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-[12.5px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCorrection}
                disabled={!correctionInstruction.trim()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-bold text-[12.5px] shadow-xs"
              >
                Send Correction Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
