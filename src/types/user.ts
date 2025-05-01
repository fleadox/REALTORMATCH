export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface ConnectedAccount {
  id: string;
  provider: string;
  provider_id: string;
  created_at: string;
  last_sign_in?: string;
}

export interface Session {
  id: string;
  user_agent: string;
  ip_address: string;
  created_at: string;
  last_active_at: string;
  is_current: boolean;
} 