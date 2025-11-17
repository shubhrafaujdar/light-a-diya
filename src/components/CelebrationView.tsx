'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DiyaGrid } from './DiyaGrid';
import { DiyaState, CelebrationStats } from '@/types';
import {
  getCelebration,
  getLitDiyas,
  lightDiya,
  getCelebrationStats,
  subscribeToFullCelebration,
  unsubscribeChannel,
} from '@/lib/diya-lighting';
import { useAuth } from '@/hooks/useAuth';

interface CelebrationViewProps {
  celebrationId: string;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  celebrationId,
}) => {
  const { user } = useAuth();
  const [celebrationName, setCelebrationName] = useState<string>('');
  const [diyas, setDiyas] = useState<DiyaState[]>([]);
  const [stats, setStats] = useState<CelebrationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Initialize celebration data
  useEffect(() => {
    const initializeCelebration = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch celebration details
        const { data: celebration, error: celebrationError } = await getCelebration(celebrationId);
        
        if (celebrationError || !celebration) {
          throw new Error('Failed to load celebration');
        }

        setCelebrationName(celebration.name);

        // Initialize diyas array
        const initialDiyas: DiyaState[] = Array.from(
          { length: celebration.diya_count },
          (_, i) => ({
            position: i,
            isLit: false,
          })
        );

        // Fetch lit diyas
        const { data: litDiyas, error: diyasError } = await getLitDiyas(celebrationId);
        
        if (diyasError) {
          console.error('Error fetching lit diyas:', diyasError);
        } else if (litDiyas) {
          litDiyas.forEach((diya) => {
            if (diya.position < initialDiyas.length) {
              initialDiyas[diya.position] = {
                position: diya.position,
                isLit: true,
                userName: diya.user_name,
                litBy: diya.lit_by,
                litAt: diya.lit_at,
              };
            }
          });
        }

        setDiyas(initialDiyas);

        // Fetch stats
        const { data: statsData } = await getCelebrationStats(celebrationId);
        if (statsData) {
          setStats(statsData);
        }

        // Set user name if authenticated
        if (user?.displayName) {
          setUserName(user.displayName);
        }
      } catch (err) {
        console.error('Error initializing celebration:', err);
        setError(err instanceof Error ? err.message : 'Failed to load celebration');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCelebration();
  }, [celebrationId, user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!celebrationId) return;

    const realtimeChannel = subscribeToFullCelebration(celebrationId, {
      onDiyaLit: (payload) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newDiya = payload.new as any;
        if (newDiya && typeof newDiya.position === 'number') {
          setDiyas((prev) => {
            const updated = [...prev];
            if (newDiya.position < updated.length) {
              updated[newDiya.position] = {
                position: newDiya.position,
                isLit: true,
                userName: newDiya.user_name,
                litBy: newDiya.lit_by,
                litAt: newDiya.lit_at,
              };
            }
            return updated;
          });

          // Update stats
          setStats((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              lit_diyas: prev.lit_diyas + 1,
              completion_percentage: ((prev.lit_diyas + 1) / prev.total_diyas) * 100,
            };
          });
        }
      },
    });

    return () => {
      if (realtimeChannel) {
        unsubscribeChannel(realtimeChannel);
      }
    };
  }, [celebrationId]);

  const handleLightDiya = useCallback(async (position: number) => {
    // Check if user has provided a name
    if (!userName.trim()) {
      setShowNameInput(true);
      return;
    }

    try {
      const { error: lightError } = await lightDiya(
        celebrationId,
        position,
        userName,
        user?.id
      );

      if (lightError) {
        throw lightError;
      }
    } catch (err) {
      console.error('Error lighting diya:', err);
      setError(err instanceof Error ? err.message : 'Failed to light diya');
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  }, [celebrationId, userName, user]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setShowNameInput(false);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/celebrations/${celebrationId}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spiritual-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-spiritual-primary text-lg">Loading celebration...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-spiritual-primary">
              {celebrationName}
            </h1>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-spiritual-secondary/10 hover:bg-spiritual-secondary/20 text-spiritual-secondary spiritual-transition"
              aria-label="Share celebration"
              title="Share celebration"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          
          {/* Stats */}
          {stats && (
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md px-6 py-3">
                <div className="text-2xl font-bold text-spiritual-secondary">
                  {stats.lit_diyas}
                </div>
                <div className="text-sm text-gray-600">Diyas Lit</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md px-6 py-3">
                <div className="text-2xl font-bold text-spiritual-accent">
                  {stats.unique_participants}
                </div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md px-6 py-3">
                <div className="text-2xl font-bold text-spiritual-primary">
                  {Math.round(stats.completion_percentage)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {stats && (
            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-spiritual-secondary to-spiritual-accent h-full spiritual-transition rounded-full"
                  style={{ width: `${stats.completion_percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Share modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-spiritual-primary">
                  Share Celebration
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Share this link with friends and family to light diyas together
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/celebrations/${celebrationId}`}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light spiritual-transition"
                >
                  {copySuccess ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copySuccess && (
                <p className="text-green-600 text-sm mt-2">Link copied to clipboard!</p>
              )}
            </div>
          </div>
        )}

        {/* Name input modal */}
        {showNameInput && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold text-spiritual-primary mb-4">
                Enter Your Name
              </h2>
              <form onSubmit={handleNameSubmit}>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spiritual-primary mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNameInput(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 spiritual-transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!userName.trim()}
                    className="flex-1 px-4 py-2 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light disabled:opacity-50 disabled:cursor-not-allowed spiritual-transition"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && stats && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
              {error}
            </div>
          </div>
        )}

        {/* Diya Grid */}
        <DiyaGrid
          celebrationId={celebrationId}
          diyas={diyas}
          onLightDiya={handleLightDiya}
          isLoading={isLoading}
        />

        {/* Instructions */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Click on an unlit diya to light it and add your blessing to this celebration
          </p>
        </div>
      </div>
    </div>
  );
};
