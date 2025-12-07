// Main type exports for the Dharma Platform

export * from './database';

// UI and component types
export type Language = 'hindi' | 'english';

export interface LanguageContent {
  hindi: string;
  english: string;
}

export interface NavigationItem {
  label: LanguageContent;
  href: string;
  icon?: string;
}

export interface SpiritualTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

// Authentication types
export interface AuthUser {
  id: string;
  email?: string;
  displayName: string;
  preferredLanguage: Language;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// Diya lighting types
export interface DiyaPosition {
  x: number;
  y: number;
  id: number;
}

export interface DiyaState {
  position: number;
  isLit: boolean;
  litBy?: string;
  userName?: string;
  message?: string;
  litAt?: string;
}

export interface CelebrationState {
  id: string;
  name: string;
  diyas: DiyaState[];
  totalLit: number;
  participants: string[];
  isActive: boolean;
}
