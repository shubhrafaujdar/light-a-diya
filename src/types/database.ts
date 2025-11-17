// Database type definitions for Dharma Platform

export interface Deity {
  id: string;
  name_hindi: string;
  name_english: string;
  image_url: string;
  description_hindi?: string;
  description_english?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Aarti {
  id: string;
  deity_id: string;
  title_hindi: string;
  title_english: string;
  content_sanskrit: string;
  content_hindi: string;
  content_english: string;
  transliteration: string;
  audio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Celebration {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  share_link: string;
  diya_count: number;
  is_active: boolean;
}

export interface DiyaLight {
  id: string;
  celebration_id: string;
  position: number;
  lit_by: string;
  lit_at: string;
  user_name: string;
}

export interface User {
  id: string;
  email?: string;
  google_id?: string;
  display_name: string;
  preferred_language: 'hindi' | 'english';
  created_at: string;
  updated_at: string;
}

export interface AnonymousParticipant {
  session_id: string;
  display_name: string;
  celebration_id: string;
}

// Helper function return types
export interface CelebrationStats {
  total_diyas: number;
  lit_diyas: number;
  unique_participants: number;
  completion_percentage: number;
}

export interface UserParticipation {
  diya_position: number;
  lit_at: string;
}

// Real-time subscription payload types
export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Partial<T>;
  old: Partial<T>;
  errors: string[] | null;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      deities: {
        Row: Deity;
        Insert: Omit<Deity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Deity, 'id' | 'created_at' | 'updated_at'>>;
      };
      aartis: {
        Row: Aarti;
        Insert: Omit<Aarti, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Aarti, 'id' | 'created_at' | 'updated_at'>>;
      };
      celebrations: {
        Row: Celebration;
        Insert: Omit<Celebration, 'id' | 'created_at'>;
        Update: Partial<Omit<Celebration, 'id' | 'created_at'>>;
      };
      diya_lights: {
        Row: DiyaLight;
        Insert: Omit<DiyaLight, 'id'>;
        Update: Partial<Omit<DiyaLight, 'id'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}