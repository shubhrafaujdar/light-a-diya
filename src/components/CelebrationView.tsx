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
  isDiyaPositionAvailable,
  updateCelebration,
} from '@/lib/diya-lighting';
import { useAuth } from '@/components/AuthProvider';
import { analytics } from '@/lib/analytics';
import { WhatsAppShare } from './WhatsAppShare';

interface CelebrationViewProps {
  celebrationId: string;
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

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
  const [userMessage, setUserMessage] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [celebrationCreatorId, setCelebrationCreatorId] = useState<string>('');
  const [showManageModal, setShowManageModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [pendingDiyaPosition, setPendingDiyaPosition] = useState<number | null>(null);

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
        setCelebrationCreatorId(celebration.created_by);
        setEditedName(celebration.name);

        // Debug: Log celebration data
        console.log('[CelebrationView] Initial celebration data:', {
          name: celebration.name,
          diya_count: celebration.diya_count,
          id: celebration.id,
          full_celebration: celebration,
        });

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
                message: diya.message,
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

      } catch (err) {
        console.error('Error initializing celebration:', err);
        setError(err instanceof Error ? err.message : 'Failed to load celebration');
      } finally {
        setIsLoading(false);
      }
    };

    initializeCelebration();
  }, [celebrationId]);

  // Track celebration view
  useEffect(() => {
    if (celebrationName) {
      analytics.viewCelebration(celebrationName);
    }
  }, [celebrationName]);

  // Set user name when user changes
  useEffect(() => {
    if (user?.displayName) {
      setUserName(user.displayName);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!celebrationId) return;

    setConnectionStatus('connecting');

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
                message: newDiya.message,
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
      onStatusChange: (status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setConnectionStatus('disconnected');
        }
      },
    });

    return () => {
      if (realtimeChannel) {
        unsubscribeChannel(realtimeChannel);
        setConnectionStatus('disconnected');
      }
    };
  }, [celebrationId]);

  const handleLightDiya = useCallback(async (position: number) => {
    setPendingDiyaPosition(position);
    setShowNameInput(true);
  }, []);

  const processLighting = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || pendingDiyaPosition === null) {
      return;
    }

    // Close modal immediately for better UX
    setShowNameInput(false);

    try {
      const position = pendingDiyaPosition;
      console.log('[CelebrationView] Processing lighting for position:', position, { userName, userMessage });

      // Check if position is still available (handle concurrent lighting)
      const { data: isAvailable, error: checkError } = await isDiyaPositionAvailable(
        celebrationId,
        position
      );

      if (checkError) {
        throw checkError;
      }

      // Check anonymous participation limit
      if (!user) {
        const storageKey = `lad_lit_${celebrationId}`;
        const hasLit = localStorage.getItem(storageKey);

        if (hasLit) {
          setError('You have already lit a diya in this celebration. Sign in to light more! 🕉️');
          setPendingDiyaPosition(null);
          setTimeout(() => setError(null), 4000);
          return;
        }
      }

      if (!isAvailable) {
        setError('This diya was just lit by someone else. Please choose another one.');
        setPendingDiyaPosition(null);
        setTimeout(() => setError(null), 3000);
        return;
      }

      const { error: lightError } = await lightDiya(
        celebrationId,
        position,
        userName,
        user?.id,
        userMessage
      );

      if (lightError) {
        throw lightError;
      }

      console.log('[CelebrationView] Diya lit successfully');

      // Track diya lighting event
      analytics.lightDiya(celebrationName);

      // Show sign-in prompt for anonymous users after successfully lighting a diya
      if (!user) {
        localStorage.setItem(`lad_lit_${celebrationId}`, 'true');
        setShowSignInPrompt(true);
      }

      // Clear pending state
      setPendingDiyaPosition(null);
      // Don't clear userName so it's remembered for next time
      // Clear message for next time? Maybe keep it? Let's clear it.
      setUserMessage('');

      // Re-fetch celebration to check if diya_count changed
      const { data: updatedCelebration } = await getCelebration(celebrationId);
      console.log('[CelebrationView] Celebration after lighting:', {
        name: updatedCelebration?.name,
        diya_count: updatedCelebration?.diya_count,
      });
    } catch (err) {
      console.error('Error lighting diya:', err);
      setError(err instanceof Error ? err.message : 'Failed to light diya');
      setPendingDiyaPosition(null);

      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
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

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName === celebrationName) {
      setIsEditingName(false);
      return;
    }

    try {
      const { error: updateError } = await updateCelebration(celebrationId, {
        name: editedName.trim(),
      });

      if (updateError) {
        throw updateError;
      }

      setCelebrationName(editedName.trim());
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update celebration name:', err);
      setError(err instanceof Error ? err.message : 'Failed to update celebration name');
      setTimeout(() => setError(null), 3000);
    }
  };

  const isCreator = user?.id === celebrationCreatorId;

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 border-4 border-spiritual-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-spiritual-primary text-lg">Loading celebration...</p>
        </div>
      </main>
    );
  }

  if (error && !stats) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md" role="alert">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Connection Status Indicator */}
        <aside className="fixed top-20 right-4 z-40" aria-label="Connection status">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg spiritual-transition ${connectionStatus === 'connected'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : connectionStatus === 'connecting'
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            role="status"
            aria-live="polite"
          >
            <div
              className={`w-2 h-2 rounded-full ${connectionStatus === 'connected'
                ? 'bg-green-500 animate-pulse'
                : connectionStatus === 'connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
                }`}
            />
            <span className="text-xs font-medium">
              {connectionStatus === 'connected'
                ? 'Live'
                : connectionStatus === 'connecting'
                  ? 'Connecting...'
                  : 'Disconnected'}
            </span>
          </div>
        </aside>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-3xl md:text-4xl font-bold text-spiritual-primary border-b-2 border-spiritual-primary focus:outline-none bg-transparent text-center"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdateName();
                    if (e.key === 'Escape') {
                      setEditedName(celebrationName);
                      setIsEditingName(false);
                    }
                  }}
                />
                <button
                  onClick={handleUpdateName}
                  className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 spiritual-transition"
                  aria-label="Save name"
                  title="Save"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setEditedName(celebrationName);
                    setIsEditingName(false);
                  }}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 spiritual-transition"
                  aria-label="Cancel"
                  title="Cancel"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-spiritual-primary">
                  {celebrationName}
                </h1>
                {isCreator && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 rounded-lg bg-spiritual-primary/10 hover:bg-spiritual-primary/20 text-spiritual-primary spiritual-transition"
                    aria-label="Edit celebration name"
                    title="Edit name"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </>
            )}
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
            {isCreator && (
              <button
                onClick={() => setShowManageModal(true)}
                className="p-2 rounded-lg bg-spiritual-accent/10 hover:bg-spiritual-accent/20 text-spiritual-accent spiritual-transition"
                aria-label="Manage celebration"
                title="Manage celebration"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
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
        </header>

        {/* Share modal */}
        {showShareModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowShareModal(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 id="share-modal-title" className="text-xl font-semibold text-spiritual-primary">
                  Share Celebration
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-spiritual-primary rounded"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Share this link with friends and family to light diyas together
              </p>

              <div className="mb-6 flex justify-center">
                <WhatsAppShare
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/celebrations/${celebrationId}`}
                  text="I just lit a diya for our family's prosperity. Come light yours and complete our circle of light:"
                  className="w-full justify-center"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or copy link</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
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
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNameInput(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowNameInput(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="name-modal-title"
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="name-modal-title" className="text-xl font-semibold text-spiritual-primary mb-4">
                Light a Diya
              </h2>
              <form onSubmit={processLighting}>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spiritual-primary mb-4"
                  aria-label="Enter your name"
                  autoFocus
                />
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Your blessing (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-spiritual-primary mb-4 min-h-[80px]"
                  aria-label="Enter your blessing"
                  maxLength={140}
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNameInput(false);
                      setPendingDiyaPosition(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 spiritual-transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!userName.trim()}
                    className="flex-1 px-4 py-2 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light disabled:opacity-50 disabled:cursor-not-allowed spiritual-transition"
                  >
                    Light Diya
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sign-in prompt modal for anonymous users */}
        {showSignInPrompt && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSignInPrompt(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowSignInPrompt(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-modal-title"
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-spiritual-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-spiritual-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 id="signin-modal-title" className="text-xl font-semibold text-spiritual-primary mb-2">
                  Diya Lit Successfully!
                </h2>
                <p className="text-gray-600">
                  Sign in to save your progress and track all the diyas you&apos;ve lit across celebrations.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={async () => {
                    const { authService } = await import('@/lib/auth');
                    await authService.signInWithGoogle();
                  }}
                  className="w-full px-4 py-3 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary-light spiritual-transition font-medium"
                >
                  Sign In to Save Progress
                </button>
                <button
                  onClick={() => setShowSignInPrompt(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 spiritual-transition text-gray-700"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && stats && (
          <div className="max-w-md mx-auto mb-6" role="alert">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
              {error}
            </div>
          </div>
        )}

        {/* Diya Grid */}
        <section aria-label="Diya lighting grid">
          <DiyaGrid
            celebrationId={celebrationId}
            diyas={diyas}
            onLightDiya={handleLightDiya}
            isLoading={isLoading}
            isAuthenticated={!!user}
          />
        </section>

        {/* Management modal */}
        {showManageModal && isCreator && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowManageModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowManageModal(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-modal-title"
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 id="manage-modal-title" className="text-xl font-semibold text-spiritual-primary">
                  Manage Celebration
                </h2>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-spiritual-primary rounded"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Celebration Info */}
                <div className="bg-spiritual-primary/5 rounded-lg p-4 border border-spiritual-primary/20">
                  <h3 className="font-semibold text-spiritual-primary mb-2">Celebration Details</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{celebrationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Diyas:</span>
                      <span>{stats?.total_diyas || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Lit Diyas:</span>
                      <span>{stats?.lit_diyas || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Participants:</span>
                      <span>{stats?.unique_participants || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Progress:</span>
                      <span>{Math.round(stats?.completion_percentage || 0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowManageModal(false);
                      handleShare();
                    }}
                    className="w-full px-4 py-3 bg-spiritual-secondary text-white rounded-lg hover:bg-spiritual-secondary/90 spiritual-transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Celebration
                  </button>

                  <button
                    onClick={() => {
                      setShowManageModal(false);
                      setIsEditingName(true);
                    }}
                    className="w-full px-4 py-3 bg-spiritual-primary text-white rounded-lg hover:bg-spiritual-primary/90 spiritual-transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Name
                  </button>
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 text-center pt-4 border-t">
                  As the creator, you can edit the celebration name and share it with others
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <footer className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Click on an unlit diya to light it and add your blessing to this celebration
          </p>
        </footer>
      </div>
    </main>
  );
};
