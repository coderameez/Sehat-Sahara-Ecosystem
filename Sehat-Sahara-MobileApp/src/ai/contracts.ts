/**
 * Sehat Sahara AI Contracts and Safety Guardrails
 */

export interface TriageInput {
  symptoms: string[];
  description: string;
  ageRange?: string;
  redFlags?: string[];
}

export interface TriageOutput {
  severity: "CRITICAL" | "ROUTINE" | "SELF_CARE";
  summary: string;
  recommendedNextSteps: string[];
  clarifyingQuestions?: string[];
  disclaimer: string;
}

export interface ConsultNoteInput {
  patientId: string;
  doctorId: string;
  transcript: string;
  notes?: string;
}

export interface ConsultNoteOutput {
  subjective: string;
  objective: string;
  assessment: string[];
  plan: string[];
  requiresDoctorApproval: true;
}

export interface RecordSummaryInput {
  authorizedFileIds: string[];
  recordTexts: string[];
  consentToken: string;
}

export interface RecordSummaryOutput {
  summary: string;
  citations: Array<{ fileId: string; excerpt: string }>;
  isScopeValid: boolean;
}

export interface AdminAssistInput {
  documentId: string;
  extractedOcrText: string;
  pmdcNumber?: string;
}

export interface AdminAssistOutput {
  confidenceScore: number;
  extractedFields: Record<string, string>;
  discrepancies: string[];
  riskFlag: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  humanDecisionRequired: true;
}
