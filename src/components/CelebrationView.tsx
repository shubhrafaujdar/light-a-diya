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
import { useAuth } from '@/hooks/useAuth';

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
  const [showNameInput, setShowNameInput] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [celebrationCreatorId, setCelebrationCreatorId] = useState<string>('');
  const [showManageModal, setShowManageModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

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

    // Monitor channel status
    realtimeChannel.on('system', {}, (payload) => {
      if (payload.status === 'SUBSCRIBED') {
        setConnectionStatus('connected');
      } else if (payload.status === 'CHANNEL_ERROR') {
        setConnectionStatus('disconnected');
      } else if (payload.status === 'TIMED_OUT') {
        setConnectionStatus('disconnected');
      }
    });

    return () => {
      if (realtimeChannel) {
        unsubscribeChannel(realtimeChannel);
        setConnectionStatus('disconnected');
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
      // Check if position is still available (handle concurrent lighting)
      const { data: isAvailable, error: checkError } = await isDiyaPositionAvailable(
        celebrationId,
        position
      );

      if (checkError) {
        throw checkError;
      }

      if (!isAvailable) {
        setError('This diya was just lit by someone else. Please choose another one.');
        setTimeout(() => setError(null), 3000);
        return;
      }

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
        {/* Connection Status Indicator */}
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg spiritual-transition ${
              connectionStatus === 'connected'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
            role="status"
            aria-live="polite"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-green-500 animate-pulse'
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-sm font-medium">
              {connectionStatus === 'connected'
                ? 'Live'
                : connectionStatus === 'connecting'
                ? 'Connecting...'
                : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
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

        {/* Management modal */}
        {showManageModal && isCreator && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-spiritual-primary">
                  Manage Celebration
                </h2>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Click on an unlit diya to light it and add your blessing to this celebration
          </p>
        </div>
      </div>
    </div>
  );
};
