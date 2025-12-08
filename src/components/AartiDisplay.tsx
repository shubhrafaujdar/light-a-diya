'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Aarti, Deity } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { analytics } from '@/lib/analytics';
import ContentFallback from './ContentFallback';

interface AartiDisplayProps {
  aarti: Aarti;
  deity: Deity;
}

export default function AartiDisplay({ aarti, deity }: AartiDisplayProps) {
  const { language } = useLanguage();
  const [imageSrc, setImageSrc] = useState(deity.image_url);

  const aartiTitle = language === 'hindi' ? aarti.title_hindi : aarti.title_english;
  const deityName = language === 'hindi' ? deity.name_hindi : deity.name_english;

  // Track aarti view
  useEffect(() => {
    analytics.viewAarti(deityName);
  }, [deityName]);

  const handleImageError = () => {
    setImageSrc('/images/deities/placeholder-deity.png');
  };

  // Get the appropriate content based on language with fallbacks
  const getContent = () => {
    if (language === 'hindi') {
      return aarti.content_hindi || aarti.content_sanskrit || '';
    }
    // For English, show Transliteration as requested
    return aarti.transliteration || '';
  };

  const content = getContent();
  const hasContent = content.trim().length > 0;

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Ornate Header with Deity Image */}
        <header className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Decorative Border */}
          <div className="h-2 bg-gradient-to-r from-spiritual-secondary via-spiritual-accent to-spiritual-secondary"></div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Deity Image with Ornate Frame */}
              <div className="w-full lg:w-1/3 max-w-sm">
                <div className="relative">
                  {/* Ornate frame background */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-spiritual-secondary to-spiritual-accent rounded-2xl opacity-20 blur-sm"></div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-spiritual-primary to-spiritual-accent rounded-xl opacity-30"></div>

                  {/* Main image container */}
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={deityName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        priority
                        onError={handleImageError}
                      />
                    ) : (
                      <ContentFallback
                        type="image"
                        className="h-full bg-gray-100"
                        message={language === 'hindi' ? 'देवता का चित्र उपलब्ध नहीं है' : 'Deity image not available'}
                      />
                    )}
                  </div>

                  {/* Decorative corners */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-spiritual-secondary rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-spiritual-secondary rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-spiritual-secondary rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-spiritual-secondary rounded-br-lg"></div>
                </div>
              </div>

              {/* Aarti Title and Deity Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className={`text-4xl md:text-6xl font-bold text-spiritual-primary mb-4 ${language === 'hindi' ? 'devanagari' : ''
                  }`}>
                  {aartiTitle}
                </h1>

                <div className="flex flex-col gap-2 mb-6">
                  <h2 className={`text-2xl md:text-3xl text-spiritual-accent font-semibold ${language === 'hindi' ? 'devanagari' : ''
                    }`}>
                    {deityName}
                  </h2>

                  {/* Show alternate language name */}
                  {language === 'hindi' && deity.name_english && (
                    <p className="text-lg text-gray-600">{deity.name_english}</p>
                  )}

                  {language === 'english' && deity.name_hindi && (
                    <p className="text-lg text-gray-600 devanagari">{deity.name_hindi}</p>
                  )}
                </div>

                {/* Language Toggle Buttons - Removed Transliteration Toggle for Hindi */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {aarti.audio_url && (
                    <button className="px-4 py-2 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light spiritual-transition">
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play Audio
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Aarti Content */}
        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative Border */}
          <div className="h-2 bg-gradient-to-r from-spiritual-primary via-spiritual-secondary to-spiritual-primary"></div>

          <div className="p-8 md:p-12">
            {/* Content Header */}
            <div className="text-center mb-8">
              <h3 className={`text-2xl md:text-3xl font-bold text-spiritual-primary mb-2 ${language === 'hindi' ? 'devanagari' : ''
                }`}>
                {language === 'hindi' ? 'आरती' : 'Aarti'}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-spiritual-secondary to-spiritual-accent mx-auto rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              {/* Content availability check */}
              {!hasContent ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📜</div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    {language === 'hindi' ? 'सामग्री उपलब्ध नहीं' : 'Content not available'}
                  </h4>
                  <p className="text-gray-500">
                    {language === 'hindi'
                      ? 'इस आरती की सामग्री अभी उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें।'
                      : 'The transliteration for this aarti is not available at the moment.'
                    }
                  </p>
                </div>
              ) : (
                <>
                  {/* Content Display (Hindi or Transliteration) */}
                  <div className="mb-8">
                    <div className={`text-lg md:text-xl leading-relaxed text-center ${language === 'hindi' ? 'devanagari' : 'italic text-gray-700'
                      }`}>
                      {content.split('\n').map((line, index) => (
                        <div key={index} className="mb-3">
                          {line.trim() || <br />}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Removed separate Transliteration block since it is now the main content for English */}

              {/* Missing content warnings */}
              {language === 'english' && !aarti.transliteration && aarti.content_sanskrit && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                  <p className="text-blue-700 text-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Transliteration is not available for this aarti.
                  </p>
                </div>
              )}

              {/* Show both titles in alternate language */}
              {language === 'hindi' && aarti.title_english && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600 italic">
                    English: {aarti.title_english}
                  </p>
                </div>
              )}

              {language === 'english' && aarti.title_hindi && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600 italic devanagari">
                    हिंदी: {aarti.title_hindi}
                  </p>
                </div>
              )}
            </div>

            {/* Decorative Footer */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-spiritual-secondary">
                <div className="w-8 h-px bg-spiritual-secondary"></div>
                <span className="text-2xl">🙏</span>
                <div className="w-8 h-px bg-spiritual-secondary"></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}