'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface ContentFallbackProps {
  type: 'image' | 'text' | 'audio' | 'translation';
  message?: string;
  className?: string;
  showIcon?: boolean;
}

export default function ContentFallback({ 
  type, 
  message, 
  className = '', 
  showIcon = true 
}: ContentFallbackProps) {
  const { language } = useLanguage();

  const getFallbackContent = () => {
    switch (type) {
      case 'image':
        return {
          icon: '🖼️',
          defaultMessage: language === 'hindi' 
            ? 'चित्र उपलब्ध नहीं है' 
            : 'Image not available'
        };
      
      case 'text':
        return {
          icon: '📜',
          defaultMessage: language === 'hindi' 
            ? 'पाठ उपलब्ध नहीं है' 
            : 'Text not available'
        };
      
      case 'audio':
        return {
          icon: '🔊',
          defaultMessage: language === 'hindi' 
            ? 'ऑडियो उपलब्ध नहीं है' 
            : 'Audio not available'
        };
      
      case 'translation':
        return {
          icon: '🌐',
          defaultMessage: language === 'hindi' 
            ? 'अनुवाद उपलब्ध नहीं है' 
            : 'Translation not available'
        };
      
      default:
        return {
          icon: '❓',
          defaultMessage: language === 'hindi' 
            ? 'सामग्री उपलब्ध नहीं है' 
            : 'Content not available'
        };
    }
  };

  const content = getFallbackContent();
  const displayMessage = message || content.defaultMessage;

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center text-gray-500 ${className}`}>
      {showIcon && (
        <div className="text-4xl mb-3 opacity-50" role="img" aria-label="Content unavailable">
          {content.icon}
        </div>
      )}
      <p className="text-sm leading-relaxed max-w-xs">
        {displayMessage}
      </p>
    </div>
  );
}