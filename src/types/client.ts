
export interface Client {
  id: string;
  email: string;
  full_name: string;
  logo_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  is_deleted?: boolean;
}

export interface EditClientForm {
  full_name: string;
  email: string;
  logo_url: string;
}
