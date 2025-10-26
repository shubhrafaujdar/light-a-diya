'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { Deity, Aarti } from '@/types';
import AartiDisplay from '@/components/AartiDisplay';

export default function IndividualAartiPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const [aarti, setAarti] = useState<Aarti | null>(null);
  const [deity, setDeity] = useState<Deity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deityId = params.deityId as string;
  const aartiId = params.aartiId as string;

  useEffect(() => {
    const fetchAartiAndDeity = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch aarti with deity information
        const aartiResponse = await fetch(`/api/aartis/${aartiId}?include_deity=true`);
        if (!aartiResponse.ok) {
          if (aartiResponse.status === 404) {
            router.push(`/aartis/${deityId}`);
            return;
          }
          throw new Error('Failed to fetch aarti');
        }

        const aartiData = await aartiResponse.json();
        if (aartiData.data) {
          setAarti(aartiData.data);
          setDeity(aartiData.data.deity);
          
          // Verify the aarti belongs to the correct deity
          if (aartiData.data.deity_id !== deityId) {
            router.push(`/aartis/${aartiData.data.deity_id}/${aartiId}`);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching aarti:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (deityId && aartiId) {
      fetchAartiAndDeity();
    }
  }, [deityId, aartiId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            
            {/* Header skeleton */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
              <div className="h-2 bg-gray-200"></div>
              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="w-full lg:w-1/3 max-w-sm">
                    <div className="aspect-square bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-16 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-2 bg-gray-200"></div>
              <div className="p-8 md:p-12 space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !aarti || !deity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {language === 'hindi' ? 'आरती नहीं मिली' : 'Aarti not found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'hindi' 
                ? 'यह आरती उपलब्ध नहीं है या हटा दी गई है।'
                : 'This aarti is not available or has been removed.'
              }
            </p>
            <Link 
              href={`/aartis/${deityId}`}
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

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href="/aartis"
              className="text-spiritual-primary hover:text-spiritual-primary-light spiritual-transition"
            >
              {language === 'hindi' ? 'आरती संग्रह' : 'Aarti Collection'}
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link 
              href={`/aartis/${deityId}`}
              className={`text-spiritual-primary hover:text-spiritual-primary-light spiritual-transition ${
                language === 'hindi' ? 'devanagari' : ''
              }`}
            >
              {deityName}
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className={`text-gray-600 ${language === 'hindi' ? 'devanagari' : ''}`}>
              {language === 'hindi' ? aarti.title_hindi : aarti.title_english}
            </span>
          </nav>
        </div>
      </div>

      {/* Aarti Display Component */}
      <AartiDisplay aarti={aarti} deity={deity} />
    </div>
  );
}