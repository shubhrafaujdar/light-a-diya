'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/types';

const LANGUAGE_STORAGE_KEY = 'dharma_preferred_language';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('english');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (savedLanguage && (savedLanguage === 'hindi' || savedLanguage === 'english')) {
      setLanguage(savedLanguage);
    }
    setIsLoading(false);
  }, []);

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'hindi' ? 'english' : 'hindi';
    setLanguage(newLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
  };

  const setLanguagePreference = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
  };

  return {
    language,
    isLoading,
    toggleLanguage,
    setLanguagePreference,
    isHindi: language === 'hindi',
    isEnglish: language === 'english',
  };
};