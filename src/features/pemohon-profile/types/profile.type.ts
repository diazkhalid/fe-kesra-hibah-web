export interface PemohonProfileData {
  user_id: string;
  nik: string;
  full_name: string;
  birth_place: string | null;
  birth_date: string | null;
  gender: string | null;
  address: string | null;
  profile_photo_url: string | null;
  organization: string | null;
  created_at: string;
  updated_at: string;
}

export interface PemohonUpdateProfileDto {
  nik: string;
  full_name: string;
  birth_place: string;
  birth_date: string;
  gender: "L" | "P";
  address: string;
}

export interface PemohonUpdateProfilePhotoDto {
  image: File;
}
