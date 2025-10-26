'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import LoadingSpinner from './LoadingSpinner';

interface ErrorDisplayProps {
  error: string | Error;
  type?: 'aarti' | 'deity' | 'content' | 'network' | 'not-found';
  onRetry?: () => void;
  retrying?: boolean;
  fallbackUrl?: string;
  fallbackText?: string;
  className?: string;
}

export default function ErrorDisplay({ 
  error, 
  type = 'content', 
  onRetry, 
  retrying = false,
  fallbackUrl,
  fallbackText,
  className = '' 
}: ErrorDisplayProps) {
  const { language } = useLanguage();

  const errorMessage = error instanceof Error ? error.message : error;

  const getErrorContent = () => {
    switch (type) {
      case 'aarti':
        return {
          icon: '🙏',
          title: language === 'hindi' ? 'आरती नहीं मिली' : 'Aarti not found',
          message: language === 'hindi' 
            ? 'यह आरती उपलब्ध नहीं है या हटा दी गई है।'
            : 'This aarti is not available or has been removed.',
          defaultFallback: '/aartis'
        };
      
      case 'deity':
        return {
          icon: '🕉️',
          title: language === 'hindi' ? 'देवता नहीं मिला' : 'Deity not found',
          message: language === 'hindi' 
            ? 'यह देवता उपलब्ध नहीं है या हटा दिया गया है।'
            : 'This deity is not available or has been removed.',
          defaultFallback: '/aartis'
        };
      
      case 'network':
        return {
          icon: '📡',
          title: language === 'hindi' ? 'कनेक्शन की समस्या' : 'Connection Problem',
          message: language === 'hindi' 
            ? 'कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।'
            : 'Please check your internet connection and try again.',
          defaultFallback: '/'
        };
      
      case 'not-found':
        return {
          icon: '😔',
          title: language === 'hindi' ? 'पृष्ठ नहीं मिला' : 'Page not found',
          message: language === 'hindi' 
            ? 'आपके द्वारा खोजा गया पृष्ठ उपलब्ध नहीं है।'
            : 'The page you are looking for is not available.',
          defaultFallback: '/'
        };
      
      default:
        return {
          icon: '⚠️',
          title: language === 'hindi' ? 'कुछ गलत हुआ' : 'Something went wrong',
          message: language === 'hindi' 
            ? 'कृपया बाद में पुनः प्रयास करें।'
            : 'Please try again later.',
          defaultFallback: '/'
        };
    }
  };

  const content = getErrorContent();
  const showRetry = onRetry && (type === 'network' || type === 'content');
  const finalFallbackUrl = fallbackUrl || content.defaultFallback;
  const finalFallbackText = fallbackText || (language === 'hindi' ? 'वापस जाएं' : 'Go Back');

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8 ${className}`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center py-16">
          <div className="text-6xl mb-6" role="img" aria-label="Error icon">
            {content.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {content.title}
          </h2>
          
          <p className="text-gray-600 mb-2 max-w-md mx-auto">
            {content.message}
          </p>
          
          {/* Technical error details for debugging */}
          {process.env.NODE_ENV === 'development' && errorMessage && (
            <details className="mt-4 text-left max-w-lg mx-auto">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Technical Details
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">
                {errorMessage}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {/* Retry button */}
            {showRetry && (
              <button
                onClick={onRetry}
                disabled={retrying}
                className="inline-flex items-center px-6 py-3 bg-spiritual-secondary text-white rounded-lg hover:bg-spiritual-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed spiritual-transition"
                aria-label={language === 'hindi' ? 'पुनः प्रयास करें' : 'Retry loading content'}
              >
                {retrying ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {language === 'hindi' ? 'पुनः प्रयास...' : 'Retrying...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {language === 'hindi' ? 'पुनः प्रयास करें' : 'Try Again'}
                  </>
                )}
              </button>
            )}
            
            {/* Fallback navigation */}
            <Link 
              href={finalFallbackUrl}
              className="inline-flex items-center px-6 py-3 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary/90 spiritual-transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {finalFallbackText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}