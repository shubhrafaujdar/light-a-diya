"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { VerseDisplay } from './VerseDisplay';
import { ChapterNavigation } from './ChapterNavigation';
import { DailyGoalTracker } from './DailyGoalTracker';
import { getVerseContent, saveScriptureProgress, getScriptureProgress } from '@/app/actions/scripture';
import { VerseData } from './VerseDisplay';
import { analytics } from '@/lib/analytics';
import { GitaSetup } from './GitaSetup';

const STORAGE_KEY = 'gita_progress';
const SETUP_COMPLETED_KEY = 'gita_setup_completed';
const PENDING_GOAL_KEY = 'pending_gita_setup_goal';

interface LocalProgress {
    currentChapter: number;
    currentVerse: number;
    dailyGoal: number;
    versesReadToday: number;
    lastReadDate: string; // YYYY-MM-DD
    readVersesToday: string[]; // "1-1", "1-2"
}

export default function ScriptureReader() {
    const { user, loading: authLoading } = useAuth();

    const [chapter, setChapter] = useState(1);
    const [verse, setVerse] = useState(1);
    const [verseData, setVerseData] = useState<VerseData | null>(null);
    const [loadingVerse, setLoadingVerse] = useState(true);

    // Progress State
    const [dailyGoal, setDailyGoal] = useState(2);
    const [versesReadToday, setVersesReadToday] = useState(0);
    const [readVerses, setReadVerses] = useState<Set<string>>(new Set());

    // Setup State
    const [setupCompleted, setSetupCompleted] = useState(false);
    const [initializing, setInitializing] = useState(true);

    // Helper to save state (DB or Local)
    const saveProgress = useCallback(async (
        c: number,
        v: number,
        goal: number,
        count: number,
        date: string,
        readSet: string[]
    ) => {
        if (user) {
            await saveScriptureProgress('gita', {
                currentChapter: c,
                currentVerse: v,
                dailyGoal: goal,
                versesReadToday: count,
                lastReadDate: date
            });
        } else {
            const payload: LocalProgress = {
                currentChapter: c,
                currentVerse: v,
                dailyGoal: goal,
                versesReadToday: count,
                lastReadDate: date,
                readVersesToday: readSet
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        }
    }, [user]);

    // Initialization & Hydration
    useEffect(() => {
        async function init() {
            setInitializing(true);
            const today = new Date().toISOString().split('T')[0];

            if (user) {
                // Check if we have a pending goal from pre-signin setup
                const pendingGoal = localStorage.getItem(PENDING_GOAL_KEY);

                // Fetch from DB
                const result = await getScriptureProgress('gita');
                if (result.success && result.data) {
                    // User exists in DB
                    setChapter(result.data.current_chapter);
                    setVerse(result.data.current_verse);

                    // If pending goal exists, update it, otherwise use stored
                    const finalGoal = pendingGoal ? parseInt(pendingGoal) : result.data.daily_goal;
                    setDailyGoal(finalGoal);

                    if (result.data.last_read_date === today) {
                        setVersesReadToday(result.data.verses_read_today);
                    } else {
                        setVersesReadToday(0);
                        setReadVerses(new Set());
                    }

                    // Since they have a record (or we just updated it), setup is done
                    setSetupCompleted(true);

                    // If we had a pending goal, we should force a save to sync it to DB immediately
                    if (pendingGoal) {
                        await saveScriptureProgress('gita', {
                            currentChapter: result.data.current_chapter,
                            currentVerse: result.data.current_verse,
                            dailyGoal: finalGoal,
                            versesReadToday: result.data.verses_read_today,
                            lastReadDate: result.data.last_read_date
                        });
                        localStorage.removeItem(PENDING_GOAL_KEY);
                    }
                } else {
                    // New user in DB context (first time gita or syncing from local)
                    
                    // Priority 1: Pending Goal (from setup flow just now)
                    if (pendingGoal) {
                        const goal = parseInt(pendingGoal);
                        setDailyGoal(goal);
                        setSetupCompleted(true);

                        await saveScriptureProgress('gita', {
                            currentChapter: 1,
                            currentVerse: 1,
                            dailyGoal: goal,
                            versesReadToday: 0,
                            lastReadDate: today
                        });
                        localStorage.removeItem(PENDING_GOAL_KEY);
                    } 
                    // Priority 2: Existing anonymous progress in LocalStorage
                    else {
                        const localSaved = localStorage.getItem(STORAGE_KEY);
                        if (localSaved) {
                            try {
                                const parsed: LocalProgress = JSON.parse(localSaved);
                                
                                // Apply local state
                                setChapter(parsed.currentChapter);
                                setVerse(parsed.currentVerse);
                                setDailyGoal(parsed.dailyGoal);
                                
                                if (parsed.lastReadDate === today) {
                                    setVersesReadToday(parsed.versesReadToday);
                                    setReadVerses(new Set(parsed.readVersesToday || []));
                                } else {
                                    setVersesReadToday(0);
                                    setReadVerses(new Set());
                                }
                                
                                setSetupCompleted(true);

                                // SYNC TO DB IMMEDIATELY
                                await saveScriptureProgress('gita', {
                                    currentChapter: parsed.currentChapter,
                                    currentVerse: parsed.currentVerse,
                                    dailyGoal: parsed.dailyGoal,
                                    versesReadToday: parsed.lastReadDate === today ? parsed.versesReadToday : 0,
                                    lastReadDate: today // Update date to today effectively
                                });
                                
                            } catch (e) {
                                console.error("Error parsing local progress for sync", e);
                                setSetupCompleted(false);
                            }
                        } else {
                            // Truly new user with no local history
                            setSetupCompleted(false);
                        }
                    }
                }
            } else {
                // Loaded from LocalStorage
                // Check setup flag first
                const isSetupDone = localStorage.getItem(SETUP_COMPLETED_KEY) === 'true';

                if (isSetupDone) {
                    setSetupCompleted(true);
                    const saved = localStorage.getItem(STORAGE_KEY);
                    if (saved) {
                        const parsed: LocalProgress = JSON.parse(saved);
                        setChapter(parsed.currentChapter);
                        setVerse(parsed.currentVerse);
                        setDailyGoal(parsed.dailyGoal);

                        if (parsed.lastReadDate === today) {
                            setVersesReadToday(parsed.versesReadToday);
                            setReadVerses(new Set(parsed.readVersesToday || []));
                        } else {
                            // Reset daily progress if new day
                            setVersesReadToday(0);
                            setReadVerses(new Set());
                        }
                    }
                } else {
                    setSetupCompleted(false);
                }
            }
            setInitializing(false);
        }

        if (!authLoading) {
            init();
        }
    }, [user, authLoading]);

    // Fetch Verse Content
    useEffect(() => {
        if (!setupCompleted) return;

        async function fetchVerse() {
            setLoadingVerse(true);
            const result = await getVerseContent(chapter, verse);
            if (result.success) {
                setVerseData(result.data);
            }
            setLoadingVerse(false);
        }
        fetchVerse();
        // Track view
        analytics.viewScripture('gita', chapter, verse);
    }, [chapter, verse, setupCompleted]);

    // Mark verse as read logic
    useEffect(() => {
        if (!setupCompleted || !verseData || loadingVerse) return;

        const verseId = `${chapter}-${verse}`;
        const today = new Date().toISOString().split('T')[0];

        if (!readVerses.has(verseId)) {
            // New verse read today
            const newCount = versesReadToday + 1;
            setVersesReadToday(newCount);

            const newReadSet = new Set(readVerses);
            newReadSet.add(verseId);
            setReadVerses(newReadSet);

            // Save Progress
            saveProgress(chapter, verse, dailyGoal, newCount, today, Array.from(newReadSet));
        } else {
            // Just save position if moved, but don't increment count
            saveProgress(chapter, verse, dailyGoal, versesReadToday, today, Array.from(readVerses));
        }
    }, [chapter, verse, verseData, loadingVerse, readVerses, versesReadToday, dailyGoal, saveProgress, setupCompleted]);

    const CHAPTER_VERSE_COUNTS: Record<number, number> = {
        1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47,
        7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20,
        13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
    };

    const handleNext = () => {
        const maxVerses = CHAPTER_VERSE_COUNTS[chapter] || 0;
        analytics.scriptureNavigation('gita', 'next_verse');

        if (verse < maxVerses) {
            setVerse(v => v + 1);
        } else if (chapter < 18) {
            setChapter(c => c + 1);
            setVerse(1);
            analytics.scriptureNavigation('gita', 'next_chapter');
        }
    };

    const handlePrev = () => {
        analytics.scriptureNavigation('gita', 'prev_verse');
        if (verse > 1) {
            setVerse(v => v - 1);
        } else if (chapter > 1) {
            const prevChapter = chapter - 1;
            const prevMax = CHAPTER_VERSE_COUNTS[prevChapter];
            setChapter(prevChapter);
            setVerse(prevMax);
            analytics.scriptureNavigation('gita', 'prev_chapter');
        }
    };

    const handleGoalChange = (newGoal: number) => {
        setDailyGoal(newGoal);
        analytics.updateScriptureGoal('gita', newGoal);
        const today = new Date().toISOString().split('T')[0];
        saveProgress(chapter, verse, newGoal, versesReadToday, today, Array.from(readVerses));
    };

    const handleSignIn = async () => {
        analytics.promptSignIn('scripture_goal', 'gita');
        const { authService } = await import('@/lib/auth');
        await authService.signInWithGoogle(window.location.pathname);
    };

    const handleSetupComplete = (goal: number) => {
        setDailyGoal(goal);
        setSetupCompleted(true);
        localStorage.setItem(SETUP_COMPLETED_KEY, 'true');

        // Save initial state to local storage
        const today = new Date().toISOString().split('T')[0];
        const payload: LocalProgress = {
            currentChapter: 1,
            currentVerse: 1,
            dailyGoal: goal,
            versesReadToday: 0,
            lastReadDate: today,
            readVersesToday: []
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

        analytics.track('gita_setup_complete', { category: 'scripture', label: 'skip', value: goal });
    };

    const handleSetupSignIn = async (goal: number) => {
        localStorage.setItem(PENDING_GOAL_KEY, goal.toString());
        analytics.track('gita_setup_signin', { category: 'scripture', value: goal });
        const { authService } = await import('@/lib/auth');
        await authService.signInWithGoogle(window.location.pathname);
    };

    if (authLoading || initializing) {
        return <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>;
    }

    if (!setupCompleted) {
        return (
            <div className="max-w-4xl mx-auto py-10">
                <GitaSetup
                    onComplete={handleSetupComplete}
                    onSignIn={handleSetupSignIn}
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">

            <DailyGoalTracker
                goal={dailyGoal}
                completed={versesReadToday}
                isAuthenticated={!!user}
                onGoalChange={handleGoalChange}
                onSignInClick={handleSignIn}
            />

            <VerseDisplay
                verseData={verseData}
                isLoading={loadingVerse}
            />

            <ChapterNavigation
                currentChapter={chapter}
                currentVerse={verse}
                onChapterChange={(c) => {
                    setChapter(c);
                    setVerse(1);
                    analytics.scriptureNavigation('gita', 'chapter_select');
                }}
                onNext={handleNext}
                onPrev={handlePrev}
            />

        </div>
    );
}
