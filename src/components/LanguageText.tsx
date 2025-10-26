'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { LanguageContent } from '@/types';

interface LanguageTextProps {
  content: LanguageContent;
  className?: string;
  as?: React.ElementType;
  showBoth?: boolean;
  bothSeparator?: string;
}

export const LanguageText: React.FC<LanguageTextProps> = ({
  content,
  className = '',
  as: Component = 'span',
  showBoth = false,
  bothSeparator = ' | '
}) => {
  const { language } = useLanguage();

  const getTextClass = (lang: 'hindi' | 'english') => {
    return lang === 'hindi' ? 'hindi-text' : 'english-text';
  };

  if (showBoth) {
    return (
      <Component className={className}>
        <span className={getTextClass(language)}>
          {content[language]}
        </span>
        {bothSeparator}
        <span className={getTextClass(language === 'hindi' ? 'english' : 'hindi')}>
          {content[language === 'hindi' ? 'english' : 'hindi']}
        </span>
      </Component>
    );
  }

  return (
    <Component className={`${getTextClass(language)} ${className}`}>
      {content[language]}
    </Component>
  );
};

interface ConditionalLanguageTextProps {
  hindi?: string;
  english?: string;
  className?: string;
  as?: React.ElementType;
}

export const ConditionalLanguageText: React.FC<ConditionalLanguageTextProps> = ({
  hindi,
  english,
  className = '',
  as: Component = 'span'
}) => {
  const { language } = useLanguage();

  const text = language === 'hindi' ? hindi : english;
  if (!text) return null;

  const textClass = language === 'hindi' ? 'hindi-text' : 'english-text';

  return (
    <Component className={`${textClass} ${className}`}>
      {text}
    </Component>
  );
};