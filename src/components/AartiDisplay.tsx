'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Aarti, Deity } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';

interface AartiDisplayProps {
  aarti: Aarti;
  deity: Deity;
}

export default function AartiDisplay({ aarti, deity }: AartiDisplayProps) {
  const { language } = useLanguage();
  const [showTransliteration, setShowTransliteration] = useState(false);

  const aartiTitle = language === 'hindi' ? aarti.title_hindi : aarti.title_english;
  const deityName = language === 'hindi' ? deity.name_hindi : deity.name_english;
  
  // Get the appropriate content based on language
  const getContent = () => {
    if (language === 'hindi') {
      return aarti.content_hindi || aarti.content_sanskrit;
    }
    return aarti.content_english;
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Ornate Header with Deity Image */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
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
                    <Image
                      src={deity.image_url}
                      alt={deityName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority
                    />
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
                <h1 className={`text-4xl md:text-6xl font-bold text-spiritual-primary mb-4 ${
                  language === 'hindi' ? 'devanagari' : ''
                }`}>
                  {aartiTitle}
                </h1>
                
                <div className="flex flex-col gap-2 mb-6">
                  <h2 className={`text-2xl md:text-3xl text-spiritual-accent font-semibold ${
                    language === 'hindi' ? 'devanagari' : ''
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

                {/* Language Toggle Buttons */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {language === 'english' && aarti.transliteration && (
                    <button
                      onClick={() => setShowTransliteration(!showTransliteration)}
                      className={`px-4 py-2 rounded-lg font-medium spiritual-transition ${
                        showTransliteration
                          ? 'bg-spiritual-secondary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showTransliteration ? 'Hide Transliteration' : 'Show Transliteration'}
                    </button>
                  )}
                  
                  {aarti.audio_url && (
                    <button className="px-4 py-2 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light spiritual-transition">
                      <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Play Audio
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aarti Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative Border */}
          <div className="h-2 bg-gradient-to-r from-spiritual-primary via-spiritual-secondary to-spiritual-primary"></div>
          
          <div className="p-8 md:p-12">
            {/* Content Header */}
            <div className="text-center mb-8">
              <h3 className={`text-2xl md:text-3xl font-bold text-spiritual-primary mb-2 ${
                language === 'hindi' ? 'devanagari' : ''
              }`}>
                {language === 'hindi' ? 'आरती' : 'Aarti'}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-spiritual-secondary to-spiritual-accent mx-auto rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              {/* Sanskrit/Hindi Content */}
              {(language === 'hindi' || aarti.content_sanskrit) && (
                <div className="mb-8">
                  <div className={`text-lg md:text-xl leading-relaxed text-center ${
                    language === 'hindi' ? 'devanagari' : 'devanagari'
                  }`}>
                    {content.split('\n').map((line, index) => (
                      <div key={index} className="mb-3">
                        {line.trim() || <br />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transliteration (for English users) */}
              {language === 'english' && showTransliteration && aarti.transliteration && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-spiritual-secondary">
                  <h4 className="text-lg font-semibold text-spiritual-primary mb-4">
                    Transliteration
                  </h4>
                  <div className="text-base leading-relaxed italic text-gray-700">
                    {aarti.transliteration.split('\n').map((line, index) => (
                      <div key={index} className="mb-2">
                        {line.trim() || <br />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* English Translation */}
              {language === 'english' && aarti.content_english && (
                <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-spiritual-primary">
                  <h4 className="text-lg font-semibold text-spiritual-primary mb-4">
                    Translation
                  </h4>
                  <div className="text-base leading-relaxed text-gray-800">
                    {aarti.content_english.split('\n').map((line, index) => (
                      <div key={index} className="mb-2">
                        {line.trim() || <br />}
                      </div>
                    ))}
                  </div>
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
        </div>
      </div>
    </div>
  );
}