'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LanguageLoader: React.FC<LanguageLoaderProps> = ({ 
  children, 
  fallback 
}) => {
  const { isLoading } = useLanguage();

  if (isLoading) {
    return (
      <>
        {fallback || (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

interface LanguageAwareProps {
  children: React.ReactNode;
  className?: string;
}

export const LanguageAware: React.FC<LanguageAwareProps> = ({ 
  children, 
  className = '' 
}) => {
  const { language, isLoading } = useLanguage();

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  const languageClass = language === 'hindi' ? 'hindi-text' : 'english-text';

  return (
    <div className={`${languageClass} ${className}`}>
      {children}
    </div>
  );
};