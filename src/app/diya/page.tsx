'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/hooks/useLanguage';
import { createCelebration } from '@/lib/diya-lighting';
import { logger } from '@/lib/logger';

export default function DiyaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [celebrationName, setCelebrationName] = useState('');
  const [diyaCount, setDiyaCount] = useState(108);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCelebration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError(language === 'hindi' ? 'कृपया पहले साइन इन करें' : 'Please sign in first');
      return;
    }

    if (!celebrationName.trim()) {
      setError(language === 'hindi' ? 'कृपया उत्सव का नाम दर्ज करें' : 'Please enter a celebration name');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      logger.debug({
        name: celebrationName.trim(),
        userId: user.id,
        diyaCount: diyaCount,
        diyaCountType: typeof diyaCount,
      }, 'Creating celebration');

      const { data, error: createError } = await createCelebration(
        celebrationName.trim(),
        user.id,
        diyaCount
      );

      if (createError || !data) {
        throw new Error(createError?.message || 'Failed to create celebration');
      }

      // Navigate to the celebration page
      router.push(`/celebrations/${data.id}`);
    } catch (err) {
      logger.error({ error: err }, 'Error creating celebration');
      setError(err instanceof Error ? err.message : 'Failed to create celebration');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSignIn = async () => {
    const { authService } = await import('@/lib/auth');
    await authService.signInWithGoogle();
  };

  return (
    <main id="main-content" className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold text-spiritual-primary mb-4 ${language === 'hindi' ? 'hindi-text' : ''
            }`}>
            {language === 'hindi' ? 'दीया जलाएं' : 'Light a Diya'}
          </h1>
          <p className={`text-lg text-gray-600 ${language === 'hindi' ? 'hindi-text' : ''
            }`}>
            {language === 'hindi'
              ? 'एक आभासी दीया उत्सव बनाएं और अपने प्रियजनों के साथ साझा करें'
              : 'Create a virtual diya celebration and share with your loved ones'
            }
          </p>
        </header>

        {/* Main Content */}
        <section className="bg-white rounded-xl shadow-lg p-8">
          {!user ? (
            <div className="text-center py-8">
              <div className="mb-6">
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
                <h2 className={`text-xl font-semibold text-gray-800 mb-2 ${language === 'hindi' ? 'hindi-text' : ''
                  }`}>
                  {language === 'hindi'
                    ? 'उत्सव बनाने के लिए साइन इन करें'
                    : 'Sign in to create a celebration'
                  }
                </h2>
                <p className={`text-gray-600 ${language === 'hindi' ? 'hindi-text' : ''
                  }`}>
                  {language === 'hindi'
                    ? 'आप अभी भी साझा किए गए उत्सवों में भाग ले सकते हैं'
                    : 'You can still participate in shared celebrations'
                  }
                </p>
              </div>
              <button
                onClick={handleSignIn}
                className="px-6 py-3 text-white bg-spiritual-primary rounded-lg hover:bg-spiritual-primary-light spiritual-transition shadow-md"
              >
                <span className={language === 'hindi' ? 'hindi-text' : ''}>
                  {language === 'hindi' ? 'Google से साइन इन करें' : 'Sign in with Google'}
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateCelebration} className="space-y-6">
              {/* Celebration Name */}
              <div>
                <label
                  htmlFor="celebrationName"
                  className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'hindi' ? 'hindi-text' : ''
                    }`}
                >
                  {language === 'hindi' ? 'उत्सव का नाम' : 'Celebration Name'}
                </label>
                <input
                  type="text"
                  id="celebrationName"
                  value={celebrationName}
                  onChange={(e) => setCelebrationName(e.target.value)}
                  placeholder={language === 'hindi' ? 'जैसे: दिवाली 2024' : 'e.g., Diwali 2024'}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spiritual-primary focus:border-transparent ${language === 'hindi' ? 'hindi-text' : ''
                    }`}
                  required
                />
              </div>

              {/* Diya Count */}
              <div>
                <label
                  htmlFor="diyaCount"
                  className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'hindi' ? 'hindi-text' : ''
                    }`}
                >
                  {language === 'hindi' ? 'दीयों की संख्या' : 'Number of Diyas'}
                </label>
                <select
                  id="diyaCount"
                  value={diyaCount}
                  onChange={(e) => setDiyaCount(Number(e.target.value))}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spiritual-primary focus:border-transparent ${language === 'hindi' ? 'hindi-text' : ''
                    }`}
                >
                  <option value={9}>9 {language === 'hindi' ? 'दीये' : 'diyas'}</option>
                  <option value={21}>21 {language === 'hindi' ? 'दीये' : 'diyas'}</option>
                  <option value={51}>51 {language === 'hindi' ? 'दीये' : 'diyas'}</option>
                  <option value={108}>108 {language === 'hindi' ? 'दीये' : 'diyas'}</option>
                </select>
                <p className={`mt-2 text-sm text-gray-500 ${language === 'hindi' ? 'hindi-text' : ''
                  }`}>
                  {language === 'hindi'
                    ? '108 हिंदू धर्म में एक पवित्र संख्या है'
                    : '108 is a sacred number in Hinduism'
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCreating || !celebrationName.trim()}
                className="w-full px-6 py-3 text-white bg-spiritual-primary rounded-lg hover:bg-spiritual-primary-light disabled:opacity-50 disabled:cursor-not-allowed spiritual-transition shadow-md"
              >
                <span className={language === 'hindi' ? 'hindi-text' : ''}>
                  {isCreating
                    ? (language === 'hindi' ? 'बना रहे हैं...' : 'Creating...')
                    : (language === 'hindi' ? 'उत्सव बनाएं' : 'Create Celebration')
                  }
                </span>
              </button>
            </form>
          )}
        </section>

        {/* Info Section */}
        <section className="mt-8 bg-spiritual-primary/5 rounded-lg p-6 border border-spiritual-primary/20" aria-label="How it works">
          <h3 className={`text-lg font-semibold text-spiritual-primary mb-3 ${language === 'hindi' ? 'hindi-text' : ''
            }`}>
            {language === 'hindi' ? 'यह कैसे काम करता है' : 'How it works'}
          </h3>
          <ol className={`space-y-2 text-gray-700 ${language === 'hindi' ? 'hindi-text' : ''
            }`}>
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>
                {language === 'hindi'
                  ? 'एक उत्सव बनाएं और एक साझा करने योग्य लिंक प्राप्त करें'
                  : 'Create a celebration and get a shareable link'
                }
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>
                {language === 'hindi'
                  ? 'अपने परिवार और दोस्तों के साथ लिंक साझा करें'
                  : 'Share the link with family and friends'
                }
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>
                {language === 'hindi'
                  ? 'हर कोई वास्तविक समय में दीये जला सकता है'
                  : 'Everyone can light diyas in real-time'
                }
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>
                {language === 'hindi'
                  ? 'एक साथ आशीर्वाद और खुशी साझा करें'
                  : 'Share blessings and joy together'
                }
              </span>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
