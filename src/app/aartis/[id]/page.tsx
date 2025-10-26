'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { Deity, Aarti } from '@/types';

export default function DeityAartisPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [deity, setDeity] = useState<Deity | null>(null);
  const [aartis, setAartis] = useState<Aarti[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deityId = params.id as string;

  useEffect(() => {
    const fetchDeityAndAartis = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch deity details
        const deityResponse = await fetch(`/api/deities/${deityId}`);
        if (!deityResponse.ok) {
          if (deityResponse.status === 404) {
            router.push('/aartis');
            return;
          }
          throw new Error('Failed to fetch deity');
        }

        const deityData = await deityResponse.json();
        if (deityData.success) {
          setDeity(deityData.data);
        }

        // Fetch aartis for this deity
        const aartisResponse = await fetch(`/api/aartis?deity_id=${deityId}`);
        if (!aartisResponse.ok) {
          throw new Error('Failed to fetch aartis');
        }

        const aartisData = await aartisResponse.json();
        if (aartisData.success) {
          setAartis(aartisData.data || []);
        }
      } catch (err) {
        console.error('Error fetching deity and aartis:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (deityId) {
      fetchDeityAndAartis();
    }
  }, [deityId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="w-full md:w-1/3">
                <div className="aspect-square bg-gray-200 rounded-xl"></div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !deity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {language === 'hindi' ? 'देवता नहीं मिला' : 'Deity not found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'hindi' 
                ? 'यह देवता उपलब्ध नहीं है या हटा दिया गया है।'
                : 'This deity is not available or has been removed.'
              }
            </p>
            <Link 
              href="/aartis"
              className="inline-flex items-center px-6 py-3 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light spiritual-transition"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {language === 'hindi' ? 'वापस जाएं' : 'Go Back'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deityName = language === 'hindi' ? deity.name_hindi : deity.name_english;
  const deityDescription = language === 'hindi' ? deity.description_hindi : deity.description_english;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/aartis"
            className="inline-flex items-center text-spiritual-primary hover:text-spiritual-primary-light spiritual-transition"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'hindi' ? 'आरती संग्रह' : 'Aarti Collection'}
          </Link>
        </nav>

        {/* Deity Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-full md:w-1/3 max-w-sm">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                <Image
                  src={deity.image_url}
                  alt={deityName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className={`text-4xl md:text-5xl font-bold text-spiritual-primary mb-4 ${
                language === 'hindi' ? 'devanagari' : ''
              }`}>
                {deityName}
              </h1>
              
              {/* Show both names */}
              {language === 'hindi' && deity.name_english && (
                <h2 className="text-xl text-gray-600 mb-4">{deity.name_english}</h2>
              )}
              
              {language === 'english' && deity.name_hindi && (
                <h2 className="text-xl text-gray-600 mb-4 devanagari">{deity.name_hindi}</h2>
              )}
              
              {deityDescription && (
                <p className={`text-gray-700 leading-relaxed ${
                  language === 'hindi' ? 'devanagari' : ''
                }`}>
                  {deityDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Aartis Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className={`text-2xl font-bold text-spiritual-primary mb-6 ${
            language === 'hindi' ? 'devanagari' : ''
          }`}>
            {language === 'hindi' ? 'आरतियाँ' : 'Aartis'}
          </h2>

          {aartis.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🙏</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {language === 'hindi' ? 'कोई आरती उपलब्ध नहीं' : 'No aartis available'}
              </h3>
              <p className="text-gray-500">
                {language === 'hindi' 
                  ? 'इस देवता के लिए आरतियाँ जल्द ही जोड़ी जाएंगी।'
                  : 'Aartis for this deity will be added soon.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {aartis.map((aarti) => {
                const aartiTitle = language === 'hindi' ? aarti.title_hindi : aarti.title_english;
                return (
                  <div 
                    key={aarti.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md spiritual-transition cursor-pointer"
                  >
                    <h3 className={`text-xl font-semibold text-spiritual-primary mb-2 ${
                      language === 'hindi' ? 'devanagari' : ''
                    }`}>
                      {aartiTitle}
                    </h3>
                    
                    {/* Show both titles */}
                    {language === 'hindi' && aarti.title_english && (
                      <p className="text-gray-600 mb-3">{aarti.title_english}</p>
                    )}
                    
                    {language === 'english' && aarti.title_hindi && (
                      <p className="text-gray-600 mb-3 devanagari">{aarti.title_hindi}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-spiritual-secondary font-medium">
                        {language === 'hindi' ? 'पूरी आरती पढ़ें' : 'Read Full Aarti'}
                      </span>
                      <svg className="w-5 h-5 text-spiritual-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}