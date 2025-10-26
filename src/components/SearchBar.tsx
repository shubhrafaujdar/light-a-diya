'use client';

import React, { useState, useEffect } from 'react';
import { Language } from '@/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  language: Language;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  language, 
  placeholder,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const defaultPlaceholder = language === 'hindi' 
    ? 'देवता का नाम खोजें...' 
    : 'Search for deities...';

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className={`relative max-w-md mx-auto ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-spiritual-primary focus:border-spiritual-primary 
            bg-white shadow-sm spiritual-transition placeholder-gray-500
            ${language === 'hindi' ? 'devanagari' : ''}
          `}
          placeholder={placeholder || defaultPlaceholder}
        />
        
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 spiritual-transition"
            aria-label={language === 'hindi' ? 'खोज साफ़ करें' : 'Clear search'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};