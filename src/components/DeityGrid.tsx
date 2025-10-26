'use client';

import React from 'react';
import { Deity, Language } from '@/types';
import { DeityCard } from './DeityCard';
import { DatabaseSetupInstructions } from './DatabaseSetupInstructions';

interface DeityGridProps {
  deities: Deity[];
  language: Language;
  loading?: boolean;
  error?: string | null;
  setupRequired?: boolean;
}

export const DeityGrid: React.FC<DeityGridProps> = ({ 
  deities, 
  language, 
  loading = false, 
  error = null,
  setupRequired = false
}) => {
  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse w-full max-w-sm md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]">
            <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (setupRequired) {
    return <DatabaseSetupInstructions language={language} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {language === 'hindi' ? 'कुछ गलत हुआ' : 'Something went wrong'}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {language === 'hindi' 
            ? 'देवताओं की जानकारी लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।'
            : 'There was a problem loading the deities. Please try again.'
          }
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light spiritual-transition"
        >
          {language === 'hindi' ? 'पुनः प्रयास करें' : 'Try Again'}
        </button>
      </div>
    );
  }

  if (deities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {language === 'hindi' ? 'कोई देवता नहीं मिला' : 'No deities found'}
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {language === 'hindi' 
            ? 'आपकी खोज के लिए कोई देवता नहीं मिला। कृपया अन्य शब्दों से खोजें।'
            : 'No deities match your search. Try searching with different terms.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {deities.map((deity) => (
        <div key={deity.id} className="w-full max-w-sm md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]">
          <DeityCard 
            deity={deity} 
            language={language} 
          />
        </div>
      ))}
    </div>
  );
};