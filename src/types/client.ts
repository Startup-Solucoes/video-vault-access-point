
export interface Client {
  id: string;
  email: string;
  full_name: string;
  logo_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
}

export interface EditClientForm {
  full_name: string;
  email: string;
  logo_url: string;
}
