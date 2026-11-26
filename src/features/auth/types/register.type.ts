export interface UserRegisterDto {
  nik: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  agree_to_terms: boolean;
}
