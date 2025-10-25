// Configuration settings for the Dharma Platform

export const config = {
  app: {
    name: 'Dharma.com',
    description: 'Hindu Spiritual Platform for Prayers, Aartis, and Collaborative Celebrations',
    version: '1.0.0',
  },
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  
  auth: {
    providers: ['google'],
    redirectUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  
  features: {
    enableDiyaLighting: true,
    enableAartiCollection: true,
    enableAnonymousParticipation: true,
    maxCelebrationParticipants: 1000,
    defaultDiyaCount: 108,
  },
  
  ui: {
    defaultLanguage: 'english' as const,
    supportedLanguages: ['hindi', 'english'] as const,
    theme: {
      primary: '#3b82f6',
      secondary: '#f59e0b',
      accent: '#f97316',
    },
  },
} as const;

// Environment validation
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};