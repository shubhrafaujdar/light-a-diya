'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useDeityLoader, useAartisLoader } from '@/hooks/useContentLoader';
import { Aarti } from '@/types';
import ContentLoadingState from '@/components/ContentLoadingState';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function DeityAartisPage() {
  const params = useParams();
  const { language } = useLanguage();
  const router = useRouter();

  console.log('[Page] Params:', params);
  const deitySlug = params.deitySlug as string;
  console.log('[Page] deitySlug:', deitySlug);

  const {
    data: deity,
    loading: deityLoading,
    error: deityError,
    retry: retryDeity,
    retrying: retryingDeity
  } = useDeityLoader(deitySlug);

  const {
    data: aartis,
    loading: aartisLoading,
    error: aartisError,
    retry: retryAartis,
    retrying: retryingAartis
  } = useAartisLoader(deitySlug);

  const loading = deityLoading || aartisLoading;
  const error = deityError || aartisError;
  const retrying = retryingDeity || retryingAartis;

  const handleRetry = () => {
    if (deityError) retryDeity();
    if (aartisError) retryAartis();
  };

  // Canonical redirect: If the current URL param doesn't match the deity's slug (e.g. it's a UUID), redirect.
  // We use a simple check to avoid infinite loops: if deitySlug is NOT the slug, and the slug exists.
  useEffect(() => {
    if (deity && deity.slug && deitySlug !== deity.slug) {
      router.replace(`/aartis/${deity.slug}`);
    }
  }, [deity, deitySlug, router]);

  if (loading) {
    return <ContentLoadingState type="deity" />;
  }

  // If redirecting, we can verify this by checking the condition again to show loading state
  if (deity && deity.slug && deitySlug !== deity.slug) {
    return <ContentLoadingState type="deity" />;
  }

  if (error || !deity) {
    const errorType = error?.includes('not found') ? 'deity' : 'network';
    return (
      <ErrorDisplay
        error={error || 'Deity not found'}
        type={errorType}
        onRetry={handleRetry}
        retrying={retrying}
        fallbackUrl="/aartis"
        fallbackText={language === 'hindi' ? 'आरती संग्रह' : 'Aarti Collection'}
      />
    );
  }

  const deityName = language === 'hindi' ? deity.name_hindi : deity.name_english;
  const deityDescription = language === 'hindi' ? deity.description_hindi : deity.description_english;

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
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
        <header className="bg-white rounded-xl shadow-lg p-8 mb-8">
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
              <h1 className={`text-4xl md:text-5xl font-bold text-spiritual-primary mb-4 ${language === 'hindi' ? 'devanagari' : ''
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
                <p className={`text-gray-700 leading-relaxed ${language === 'hindi' ? 'devanagari' : ''
                  }`}>
                  {deityDescription}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Aartis Section */}
        <section className="bg-white rounded-xl shadow-lg p-8" aria-label="Available aartis">
          <h2 className={`text-2xl font-bold text-spiritual-primary mb-6 ${language === 'hindi' ? 'devanagari' : ''
            }`}>
            {language === 'hindi' ? 'आरतियाँ' : 'Aartis'}
          </h2>

          {!aartis || aartis.length === 0 ? (
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
              {aartis.map((aarti: Aarti) => {
                const aartiTitle = language === 'hindi' ? aarti.title_hindi : aarti.title_english;
                return (
                  <Link
                    key={aarti.id}
                    href={`/aartis/${deitySlug}/${aarti.slug}`}
                    className="block border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-spiritual-primary spiritual-transition cursor-pointer group"
                  >
                    <h3 className={`text-xl font-semibold text-spiritual-primary mb-2 group-hover:text-spiritual-primary-light spiritual-transition ${language === 'hindi' ? 'devanagari' : ''
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

                    {/* Preview of content */}
                    {aarti.content_hindi && (
                      <p className={`text-gray-500 text-sm mb-3 line-clamp-2 ${language === 'hindi' ? 'devanagari' : ''
                        }`}>
                        {language === 'hindi'
                          ? aarti.content_hindi.split('\n')[0]?.substring(0, 100) + '...'
                          : aarti.content_english?.split('\n')[0]?.substring(0, 100) + '...' || ''
                        }
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-spiritual-secondary font-medium group-hover:text-spiritual-accent spiritual-transition">
                        {language === 'hindi' ? 'पूरी आरती पढ़ें' : 'Read Full Aarti'}
                      </span>
                      <svg className="w-5 h-5 text-spiritual-secondary group-hover:text-spiritual-accent group-hover:translate-x-1 spiritual-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}