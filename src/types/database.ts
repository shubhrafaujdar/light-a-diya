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
  message?: string;
}

export interface DiyaLight {
  id: string;
  celebration_id: string;
  position: number;
  lit_by: string;
  lit_at: string;
  user_name: string;
  message?: string;
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

// Quiz types
export interface QuizOptions {
  hindi: string[];
  english: string[];
}

export interface QuizCategory {
  id: string;
  name_hindi: string;
  name_english: string;
  description_hindi?: string;
  description_english?: string;
  icon?: string;
  question_count: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  category_id: string;
  question_text_hindi: string;
  question_text_english: string;
  options: QuizOptions;
  correct_answer_index: number;
  explanation_hindi?: string;
  explanation_english?: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Client-side quiz session state
export interface QuizSession {
  categoryId: string;
  categoryName: { hindi: string; english: string };
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  completedQuestions: number;
  // Progress tracking
  answeredQuestionIds: string[];
  // Authentication and limits
  isAuthenticated: boolean;
  // Timer for anonymous users (null for authenticated users)
  timerStartTime: number | null;
  timerRemainingSeconds: number;
  // Limit tracking
  hasReachedLimit: boolean;
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
      quiz_categories: {
        Row: QuizCategory;
        Insert: Omit<QuizCategory, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<QuizCategory, 'id' | 'created_at' | 'updated_at'>>;
      };
      quiz_questions: {
        Row: QuizQuestion;
        Insert: Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}