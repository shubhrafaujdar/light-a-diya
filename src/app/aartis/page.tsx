'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDeities } from '@/hooks/useDeities';
import { SearchBar } from '@/components/SearchBar';
import { DeityGrid } from '@/components/DeityGrid';

export default function AartisPage() {
  const { language, isLoading: languageLoading } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const { deities, loading: deitiesLoading, error } = useDeities(searchQuery);

  const loading = languageLoading || deitiesLoading;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold text-spiritual-primary mb-4 ${
            language === 'hindi' ? 'devanagari' : ''
          }`}>
            {language === 'hindi' ? 'आरती संग्रह' : 'Aarti Sangrah'}
          </h1>
          
          {/* Show both languages for better accessibility */}
          {language === 'hindi' && (
            <h2 className="text-2xl md:text-3xl text-spiritual-primary-light mb-6">
              Aarti Collection
            </h2>
          )}
          
          {language === 'english' && (
            <h2 className="text-2xl md:text-3xl text-spiritual-primary-light mb-6 devanagari">
              आरती संग्रह
            </h2>
          )}
          
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto mb-8 ${
            language === 'hindi' ? 'devanagari' : ''
          }`}>
            {language === 'hindi' 
              ? 'पवित्र आरतियों और भक्ति गीतों के हमारे संग्रह में आपका स्वागत है। अपनी आध्यात्मिक यात्रा शुरू करने के लिए अपने पसंदीदा देवता को चुनें।'
              : 'Welcome to our collection of sacred aartis and devotional songs. Choose your preferred deity to begin your spiritual journey.'
            }
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            language={language}
            className="mb-6"
          />
          
          {searchQuery && (
            <div className="text-center">
              <p className={`text-gray-600 ${language === 'hindi' ? 'devanagari' : ''}`}>
                {language === 'hindi' 
                  ? `"${searchQuery}" के लिए खोज परिणाम`
                  : `Search results for "${searchQuery}"`
                }
              </p>
            </div>
          )}
        </div>

        {/* Deities Grid */}
        <DeityGrid 
          deities={deities}
          language={language}
          loading={loading}
          error={error}
        />

        {/* Footer Message */}
        {!loading && !error && deities.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className={`text-gray-500 ${language === 'hindi' ? 'devanagari' : ''}`}>
              {language === 'hindi' 
                ? 'अधिक देवताओं और आरतियों को जल्द ही जोड़ा जाएगा'
                : 'More deities and aartis will be added soon'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}