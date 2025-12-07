'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAartiLoader } from '@/hooks/useContentLoader';
import AartiDisplay from '@/components/AartiDisplay';
import ContentLoadingState from '@/components/ContentLoadingState';
import ErrorDisplay from '@/components/ErrorDisplay';

export default function IndividualAartiPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();

  const deityId = params.deityId as string;
  const aartiId = params.aartiId as string;

  const { data: aartiData, loading, error, retry, retrying } = useAartiLoader(aartiId, true);

  // Verify the aarti belongs to the correct deity and redirect if necessary
  React.useEffect(() => {
    if (aartiData && aartiData.deity_id !== deityId) {
      router.push(`/aartis/${aartiData.deity_id}/${aartiId}`);
    }
  }, [aartiData, deityId, aartiId, router]);

  if (loading) {
    return <ContentLoadingState type="aarti" />;
  }

  if (error || !aartiData) {
    const errorType = error?.includes('not found') ? 'aarti' : 'network';
    return (
      <ErrorDisplay
        error={error || 'Aarti not found'}
        type={errorType}
        onRetry={retry}
        retrying={retrying}
        fallbackUrl={`/aartis/${deityId}`}
        fallbackText={language === 'hindi' ? 'वापस जाएं' : 'Go Back'}
      />
    );
  }

  const { deity, ...aarti } = aartiData;

  if (!deity) {
    return (
      <ErrorDisplay
        error="Deity information not found"
        type="deity"
        fallbackUrl="/aartis"
        fallbackText={language === 'hindi' ? 'आरती संग्रह' : 'Aarti Collection'}
      />
    );
  }

  const deityName = language === 'hindi' ? deity.name_hindi : deity.name_english;

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="bg-white shadow-sm border-b" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/aartis"
                className="text-spiritual-primary hover:text-spiritual-primary-light spiritual-transition"
              >
                {language === 'hindi' ? 'आरती संग्रह' : 'Aarti Collection'}
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link
                href={`/aartis/${deityId}`}
                className={`text-spiritual-primary hover:text-spiritual-primary-light spiritual-transition ${language === 'hindi' ? 'devanagari' : ''
                  }`}
              >
                {deityName}
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className={`text-gray-600 ${language === 'hindi' ? 'devanagari' : ''}`} aria-current="page">
                {language === 'hindi' ? aarti.title_hindi : aarti.title_english}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Aarti Display Component */}
      <AartiDisplay aarti={aarti} deity={deity} />
    </>
  );
}