export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          email_verified: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          email_verified?: string | null
          image?: string | null
        }
        Update: {
          name?: string | null
          email?: string | null
          email_verified?: string | null
          image?: string | null
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          type: string
          provider: string
          provider_account_id: string
          refresh_token: string | null
          access_token: string | null
          expires_at: number | null
          token_type: string | null
          scope: string | null
          id_token: string | null
          session_state: string | null
          oauth_token_secret: string | null
          oauth_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
        }
        Update: {
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          expires: string
          session_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expires: string
          session_token: string
        }
        Update: {
          expires?: string
          session_token?: string
        }
      }
      verification_tokens: {
        Row: {
          identifier: string
          token: string
          expires: string
          created_at: string
        }
        Insert: {
          identifier: string
          token: string
          expires: string
        }
        Update: {
          expires?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          birth_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          birth_date?: string | null
        }
        Update: {
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          birth_date?: string | null
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme: string
          notifications_enabled: boolean
          email_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
        }
        Update: {
          theme?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 