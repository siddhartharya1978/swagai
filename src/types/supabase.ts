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
      lookbook_items: {
        Row: {
          id: string
          user_id: string
          outfit_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          outfit_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          outfit_data?: Json
          created_at?: string
        }
      }
      outfit_feedback: {
        Row: {
          id: string
          user_id: string
          outfit_id: string
          is_positive: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          outfit_id: string
          is_positive: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          outfit_id?: string
          is_positive?: boolean
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      wardrobe_items: {
        Row: {
          id: string
          user_id: string
          image_url: string
          cleaned_image_url: string | null
          main_type: string
          sub_type: string
          color: string
          pattern: string
          occasion: string
          auto_tags: string[]
          image_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_url: string
          cleaned_image_url?: string | null
          main_type: string
          sub_type: string
          color: string
          pattern: string
          occasion: string
          auto_tags: string[]
          image_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_url?: string
          cleaned_image_url?: string | null
          main_type?: string
          sub_type?: string
          color?: string
          pattern?: string
          occasion?: string
          auto_tags?: string[]
          image_hash?: string
          created_at?: string
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