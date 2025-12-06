'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { clearImageCache, updateServiceWorker, getCacheStats } from '@/lib/cache-utils';

/**
 * Settings Menu Component
 * Dropdown menu with gear icon containing cache management and other settings
 */
export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState('');
  const [cacheStats, setCacheStats] = useState<{ imageCacheSize: number; apiCacheSize: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Load cache stats when menu opens
      loadCacheStats();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadCacheStats = async () => {
    const stats = await getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = async () => {
    setClearing(true);
    setMessage('');

    try {
      const cleared = await clearImageCache();
      
      if (cleared) {
        await updateServiceWorker();
        setMessage(language === 'hindi' ? '✅ कैश साफ़ हो गया!' : '✅ Cache cleared!');
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage(language === 'hindi' ? '⚠️ कैश साफ़ करने में विफल' : '⚠️ Failed to clear cache');
      }
    } catch (error) {
      console.error('Cache clear error:', error);
      setMessage(language === 'hindi' ? '❌ त्रुटि' : '❌ Error');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Gear Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-700 hover:text-spiritual-primary hover:bg-spiritual-primary/5 spiritual-transition"
        aria-label={language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
        title={language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* Menu Header */}
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className={`text-sm font-semibold text-gray-700 ${language === 'hindi' ? 'devanagari' : ''}`}>
              {language === 'hindi' ? 'सेटिंग्स' : 'Settings'}
            </h3>
          </div>

          {/* Cache Stats */}
          {cacheStats && (
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>{language === 'hindi' ? 'चित्र कैश:' : 'Image Cache:'}</span>
                  <span className="font-medium">{cacheStats.imageCacheSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'hindi' ? 'API कैश:' : 'API Cache:'}</span>
                  <span className="font-medium">{cacheStats.apiCacheSize}</span>
                </div>
              </div>
            </div>
          )}

          {/* Clear Cache Button */}
          <div className="px-4 py-2">
            <button
              onClick={handleClearCache}
              disabled={clearing}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md spiritual-transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={`flex items-center gap-2 ${language === 'hindi' ? 'devanagari' : ''}`}>
                {clearing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{language === 'hindi' ? 'साफ़ हो रहा है...' : 'Clearing...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{language === 'hindi' ? 'कैश साफ़ करें' : 'Clear Cache'}</span>
                  </>
                )}
              </span>
            </button>

            {/* Message */}
            {message && (
              <div className="mt-2 text-xs text-center py-1 px-2 bg-gray-50 rounded">
                {message}
              </div>
            )}
          </div>

          {/* Development Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="px-4 py-2 border-t border-gray-200">
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Development Mode</span>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="px-4 py-2 border-t border-gray-200">
            <p className={`text-xs text-gray-500 ${language === 'hindi' ? 'devanagari' : ''}`}>
              {language === 'hindi' 
                ? 'यदि चित्र अपडेट नहीं हो रहे हैं तो कैश साफ़ करें'
                : 'Clear cache if images are not updating'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
