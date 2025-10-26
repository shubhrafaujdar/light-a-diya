import { Language } from '@/types';

export const LANGUAGE_STORAGE_KEY = 'dharma_preferred_language';

/**
 * Get the saved language preference from localStorage
 * Returns 'english' as default if no preference is saved or if localStorage is not available
 */
export const getSavedLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'english'; // Default for SSR
  }

  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    return (saved === 'hindi' || saved === 'english') ? saved : 'english';
  } catch (error) {
    console.warn('Failed to read language preference from localStorage:', error);
    return 'english';
  }
};

/**
 * Save language preference to localStorage
 */
export const saveLanguage = (language: Language): void => {
  if (typeof window === 'undefined') {
    return; // Skip for SSR
  }

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to save language preference to localStorage:', error);
  }
};

/**
 * Update document attributes for better accessibility and SEO
 */
export const updateDocumentLanguage = (language: Language): void => {
  if (typeof document === 'undefined') {
    return; // Skip for SSR
  }

  // Update HTML lang attribute
  document.documentElement.lang = language === 'hindi' ? 'hi' : 'en';
  
  // Update dir attribute for RTL support (though Hindi is LTR, this is for future extensibility)
  document.documentElement.dir = 'ltr';
  
  // Add/remove body class for CSS targeting
  const body = document.body;
  if (language === 'hindi') {
    body.classList.add('hindi-active');
    body.classList.remove('english-active');
  } else {
    body.classList.add('english-active');
    body.classList.remove('hindi-active');
  }
};

/**
 * Get the opposite language for toggle functionality
 */
export const getOppositeLanguage = (currentLanguage: Language): Language => {
  return currentLanguage === 'hindi' ? 'english' : 'hindi';
};

/**
 * Check if the browser supports the language
 */
export const isBrowserLanguageSupported = (): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('hi') || browserLang.startsWith('en');
};

/**
 * Get browser's preferred language if supported
 */
export const getBrowserPreferredLanguage = (): Language | null => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('hi')) {
    return 'hindi';
  } else if (browserLang.startsWith('en')) {
    return 'english';
  }
  
  return null;
};