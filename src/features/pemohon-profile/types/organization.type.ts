export interface PemohonOrganizationData {
  id: string;
  owner_user_id: string;
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
  created_at: string;
  updated_at: string;
}

export interface PemohonUpsertOrganizationDto {
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
