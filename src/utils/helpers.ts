// Helper utility functions for the Dharma Platform

import { Language } from '@/types';

/**
 * Generate a unique shareable link for celebrations
 */
export const generateShareLink = (celebrationId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/celebration/${celebrationId}`;
};

/**
 * Format date for display in spiritual context
 */
export const formatSpiritualDate = (date: string | Date, language: Language = 'english'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (language === 'hindi') {
    return dateObj.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Validate Sanskrit/Devanagari text
 */
export const isValidDevanagari = (text: string): boolean => {
  const devanagariRegex = /^[\u0900-\u097F\s\u0964\u0965]+$/;
  return devanagariRegex.test(text);
};

/**
 * Generate diya positions for grid layout
 */
export const generateDiyaPositions = (count: number = 108) => {
  const positions = [];
  const cols = 12;
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    positions.push({
      id: i,
      x: col,
      y: row,
    });
  }
  
  return positions;
};

/**
 * Sanitize user display names
 */
export const sanitizeDisplayName = (name: string): string => {
  return name
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially harmful characters
    .substring(0, 50); // Limit length
};

/**
 * Check if user is anonymous
 */
export const isAnonymousUser = (userId: string): boolean => {
  return userId.startsWith('anon_');
};

/**
 * Generate anonymous user ID
 */
export const generateAnonymousId = (): string => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get localized content based on language preference
 */
export const getLocalizedContent = (
  content: { hindi: string; english: string },
  language: Language
): string => {
  return content[language] || content.english;
};