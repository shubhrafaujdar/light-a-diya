"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language } from '@/types';
import { 
  getSavedLanguage, 
  saveLanguage, 
  updateDocumentLanguage, 
  getOppositeLanguage,
  getBrowserPreferredLanguage 
} from '@/utils/language-persistence';

interface LanguageContextType {
  language: Language;
  isLoading: boolean;
  toggleLanguage: () => void;
  setLanguagePreference: (language: Language) => void;
  isHindi: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('english');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved language preference or detect browser preference
    const savedLanguage = getSavedLanguage();
    
    if (savedLanguage !== 'english') {
      // User has a saved preference
      setLanguage(savedLanguage);
    } else {
      // Check if this is the first visit and try to detect browser language
      const browserPreferred = getBrowserPreferredLanguage();
      if (browserPreferred && browserPreferred === 'hindi') {
        setLanguage('hindi');
        saveLanguage('hindi');
      } else {
        setLanguage('english');
        saveLanguage('english');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Update document attributes when language changes
  useEffect(() => {
    if (!isLoading) {
      updateDocumentLanguage(language);
    }
  }, [language, isLoading]);

  const toggleLanguage = () => {
    const newLanguage = getOppositeLanguage(language);
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  const setLanguagePreference = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  const value: LanguageContextType = {
    language,
    isLoading,
    toggleLanguage,
    setLanguagePreference,
    isHindi: language === 'hindi',
    isEnglish: language === 'english',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};