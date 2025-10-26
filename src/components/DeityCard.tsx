'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Deity, Language } from '@/types';

interface DeityCardProps {
  deity: Deity;
  language: Language;
}

export const DeityCard: React.FC<DeityCardProps> = ({ deity, language }) => {
  const deityName = language === 'hindi' ? deity.name_hindi : deity.name_english;
  const deityDescription = language === 'hindi' ? deity.description_hindi : deity.description_english;

  return (
    <Link 
      href={`/aartis/${deity.id}`}
      className="group block bg-white rounded-xl shadow-lg hover:shadow-xl spiritual-transition overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={deity.image_url}
          alt={deityName}
          fill
          className="object-cover group-hover:scale-105 spiritual-transition"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 spiritual-transition" />
      </div>
      
      <div className="p-6">
        <h3 className={`text-xl font-semibold text-spiritual-primary mb-2 group-hover:text-spiritual-primary-light spiritual-transition ${
          language === 'hindi' ? 'devanagari' : ''
        }`}>
          {deityName}
        </h3>
        
        {/* Show both names for better accessibility */}
        {language === 'hindi' && deity.name_english && (
          <p className="text-sm text-gray-500 mb-2">
            {deity.name_english}
          </p>
        )}
        
        {language === 'english' && deity.name_hindi && (
          <p className="text-sm text-gray-500 mb-2 devanagari">
            {deity.name_hindi}
          </p>
        )}
        
        {deityDescription && (
          <p className={`text-gray-600 text-sm line-clamp-2 ${
            language === 'hindi' ? 'devanagari' : ''
          }`}>
            {deityDescription}
          </p>
        )}
        
        <div className="mt-4 flex items-center text-spiritual-secondary text-sm font-medium">
          <span className="group-hover:text-spiritual-secondary-light spiritual-transition">
            {language === 'hindi' ? 'आरती देखें' : 'View Aartis'}
          </span>
          <svg 
            className="ml-2 w-4 h-4 group-hover:translate-x-1 spiritual-transition" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};