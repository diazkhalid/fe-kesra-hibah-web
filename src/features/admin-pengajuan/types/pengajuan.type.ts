import { GrantApplicationStatus } from "@/features/pemohon-pengajuan/types/pengajuan.type";

export interface AdminGrantVerificationDto {
  decision: "terverifikasi" | "ditolak";
  note: string;
}

export interface AdminGrantApplicationAdminParams {
  submission_number?: string;
  applicant_name?: string;
  organization_name?: string;
  status?: GrantApplicationStatus;
  fiscal_year?: number;
  submitted_from?: string;
  submitted_until?: string;
  page?: number;
  rows_per_page?: number;
}

export interface AdminGrantApplicationData {
  id: string;
  submission_number: string;
  submitted_at: string;
  organization_name: string;
  applicant_name: string;
  activity_name: string;
  requested_amount: number;
  status: GrantApplicationStatus;
  fiscal_year: number;
}

export interface AdminGrantApplicationDetail {
  id: string;
  submission_number: string;
  status: GrantApplicationStatus;
  fiscal_year: number;
  field: string;
  submitted_at: string;
  requested_amount: number;
  applicant: GrantApplicant;
  organization: GrantOrganization;
  activity: GrantActivity;
  documents: GrantApplicationDocument[];
  verification_reviews: GrantVerificationReview[];
  status_history: GrantStatusHistory[];
  can_verify: boolean;
}

export interface GrantApplicant {
  user_id: string;
  full_name: string;
  nik: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface GrantOrganization {
  id: string;
  name: string;
  organization_type: string;
  deed_number: string;
  established_on: string;
  registration_number: string;
  address: string;
  chair_name: string;
  chair_phone: string;
  secretary_name: string;
  treasurer_name: string;
}

export interface GrantActivity {
  activity_name: string;
  background: string;
  objectives: string;
  activity_location: string;
  activity_period: string;
  expected_benefits: string;
  requested_amount: number;
}

export interface GrantApplicationDocument {
  id: string;
  document_type: string;
  display_name: string;
  is_required: boolean;
  original_filename: string;
  mime_type: string;
  file_size_bytes: number;
  download_url: string;
  review_status: GrantDocumentReviewStatus;
  review_note: string | null;
  reviewed_at: string | null;
  uploaded_at: string;
}

export interface GrantVerificationReview {
  // Menunggu struktur response
}

export interface GrantStatusHistory {
  // Menunggu struktur response
}

export type GrantDocumentReviewStatus =
  | "belum_diperiksa"
  | "sesuai"
  | "tidak_sesuai";
