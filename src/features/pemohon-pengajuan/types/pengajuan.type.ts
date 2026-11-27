export interface GrantDocument {
  document_type: string;
  file: File | null;
}

export interface PemohonUpsertGrantApplicationDto {
  fiscal_year: number;
  field: string;
  activity_name: string;
  background: string;
  objectives: string;
  requested_amount: number;
  activity_location: string;
  activity_period: string;
  expected_benefits: string;
  declaration_accepted: boolean;
  documents: GrantDocument[];
}

export type GrantApplicationStatus =
  | "menunggu_verifikasi"
  | "terverifikasi"
  | "ditolak";

export interface GrantApplicationParams {
  search?: string;
  status?: GrantApplicationStatus;
  fiscal_year?: number;
  submitted_from?: string;
  submitted_until?: string;
  page?: number;
  rows_per_page?: number;
}

export interface PemohonGrantApplicationData {
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
