'use client';

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface ContentLoadingStateProps {
  type?: 'aarti' | 'deity' | 'list' | 'page';
  className?: string;
}

export default function ContentLoadingState({ type = 'page', className = '' }: ContentLoadingStateProps) {
  const { language } = useLanguage();

  const renderAartiSkeleton = () => (
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

  const renderDeitySkeleton = () => (
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

  const renderListSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );

  const renderPageSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const skeletonComponents = {
    aarti: renderAartiSkeleton,
    deity: renderDeitySkeleton,
    list: renderListSkeleton,
    page: renderPageSkeleton
  };

  return (
    <div className={className} role="status" aria-label={language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...'}>
      {skeletonComponents[type]()}
    </div>
  );
}