// Constants for the Dharma Platform

export const LANGUAGES = {
  HINDI: 'hindi' as const,
  ENGLISH: 'english' as const,
} as const;

export const ROUTES = {
  HOME: '/',
  AARTI_SANGRAH: '/aarti-sangrah',
  LIGHT_DIYA: '/light-diya',
  DEITY: '/deity',
  CELEBRATION: '/celebration',
} as const;

export const SPIRITUAL_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  SECONDARY: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    900: '#78350f',
  },
  ACCENT: {
    50: '#fff7ed',
    100: '#ffedd5',
    500: '#f97316',
    600: '#ea580c',
    900: '#9a3412',
  },
} as const;

export const DEITY_CATEGORIES = {
  MAJOR: 'major',
  MINOR: 'minor',
  REGIONAL: 'regional',
} as const;

export const DEFAULT_DIYA_COUNT = 108; // Auspicious number in Hinduism

export const CELEBRATION_SETTINGS = {
  MAX_PARTICIPANTS: 1000,
  DIYA_GRID_SIZE: 12, // 12x9 = 108 diyas
  AUTO_CLEANUP_HOURS: 24,
} as const;