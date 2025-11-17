'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { getUserCelebrations } from '@/lib/diya-lighting';
import { Celebration } from '@/types/database';

export default function CelebrationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCelebrations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await getUserCelebrations(user.id);
        
        if (fetchError) {
          throw fetchError;
        }

        setCelebrations(data || []);
      } catch (err) {
        console.error('Error loading celebrations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load celebrations');
      } finally {
        setIsLoading(false);
      }
    };

    loadCelebrations();
  }, [user]);

  const handleCreateNew = () => {
    router.push('/diya');
  };

  const handleViewCelebration = (celebrationId: string) => {
    router.push(`/celebrations/${celebrationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spiritual-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-spiritual-primary text-lg">
            {language === 'hindi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <svg 
              className="w-16 h-16 mx-auto text-spiritual-secondary mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <h2 className={`text-xl font-semibold text-gray-800 mb-2 ${
              language === 'hindi' ? 'hindi-text' : ''
            }`}>
              {language === 'hindi' 
                ? 'अपने उत्सव देखने के लिए साइन इन करें'
                : 'Sign in to view your celebrations'
              }
            </h2>
            <p className={`text-gray-600 mb-6 ${
              language === 'hindi' ? 'hindi-text' : ''
            }`}>
              {language === 'hindi'
                ? 'अपने बनाए गए सभी उत्सवों को देखने और प्रबंधित करने के लिए साइन इन करें'
                : 'Sign in to view and manage all your created celebrations'
              }
            </p>
            <button
              onClick={async () => {
                const { authService } = await import('@/lib/auth');
                await authService.signInWithGoogle();
              }}
              className="px-6 py-3 text-white bg-spiritual-primary rounded-lg hover:bg-spiritual-primary-light spiritual-transition shadow-md"
            >
              <span className={language === 'hindi' ? 'hindi-text' : ''}>
                {language === 'hindi' ? 'Google से साइन इन करें' : 'Sign in with Google'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold text-spiritual-primary mb-2 ${
              language === 'hindi' ? 'hindi-text' : ''
            }`}>
              {language === 'hindi' ? 'मेरे उत्सव' : 'My Celebrations'}
            </h1>
            <p className={`text-gray-600 ${
              language === 'hindi' ? 'hindi-text' : ''
            }`}>
              {language === 'hindi'
                ? 'आपके द्वारा बनाए गए सभी दीया उत्सव'
                : 'All diya celebrations you have created'
              }
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 text-white bg-spiritual-primary rounded-lg hover:bg-spiritual-primary-light spiritual-transition shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className={language === 'hindi' ? 'hindi-text' : ''}>
              {language === 'hindi' ? 'नया बनाएं' : 'Create New'}
            </span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-6">
            {error}
          </div>
        )}

        {/* Celebrations Grid */}
        {celebrations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
              />
            </svg>
            <h3 className={`text-xl font-semibold text-gray-700 mb-2 ${
              language === 'hindi' ? 'hindi-text' : ''
            }`}>
              {language === 'hindi' ? 'कोई उत्सव नहीं' : 'No celebrations yet'}
            </h3>
            <p className={`text-gray-600 mb-6 ${
              language === 'hindi' ? 'hindi-text' : ''
            }`}>
              {language === 'hindi'
                ? 'अपना पहला दीया उत्सव बनाएं और अपने प्रियजनों के साथ साझा करें'
                : 'Create your first diya celebration and share it with loved ones'
              }
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 text-white bg-spiritual-primary rounded-lg hover:bg-spiritual-primary-light spiritual-transition shadow-md"
            >
              <span className={language === 'hindi' ? 'hindi-text' : ''}>
                {language === 'hindi' ? 'उत्सव बनाएं' : 'Create Celebration'}
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {celebrations.map((celebration) => (
              <div
                key={celebration.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl spiritual-transition cursor-pointer"
                onClick={() => handleViewCelebration(celebration.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-spiritual-primary flex-1">
                      {celebration.name}
                    </h3>
                    {celebration.is_active ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {language === 'hindi' ? 'सक्रिय' : 'Active'}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {language === 'hindi' ? 'निष्क्रिय' : 'Inactive'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {celebration.diya_count} {language === 'hindi' ? 'दीये' : 'diyas'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(celebration.created_at).toLocaleDateString(
                          language === 'hindi' ? 'hi-IN' : 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCelebration(celebration.id);
                    }}
                    className="mt-4 w-full px-4 py-2 bg-spiritual-secondary/10 text-spiritual-secondary rounded-lg hover:bg-spiritual-secondary/20 spiritual-transition"
                  >
                    <span className={language === 'hindi' ? 'hindi-text' : ''}>
                      {language === 'hindi' ? 'देखें' : 'View'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
