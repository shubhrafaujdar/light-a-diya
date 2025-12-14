"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { VerseDisplay } from './VerseDisplay';
import { ChapterNavigation } from './ChapterNavigation';
import { DailyGoalTracker } from './DailyGoalTracker';
import { getVerseContent, saveScriptureProgress, getScriptureProgress } from '@/app/actions/scripture';
import { VerseData } from './VerseDisplay';
import { analytics } from '@/lib/analytics';

const STORAGE_KEY = 'gita_progress';

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
    // const { language } = useLanguage(); // Removed: useLanguage is not used

    const [chapter, setChapter] = useState(1);
    const [verse, setVerse] = useState(1);
    const [verseData, setVerseData] = useState<VerseData | null>(null); // Fixed: Type annotation for verseData
    const [loadingVerse, setLoadingVerse] = useState(true);

    // Progress State
    const [dailyGoal, setDailyGoal] = useState(2);
    const [versesReadToday, setVersesReadToday] = useState(0);
    const [readVerses, setReadVerses] = useState<Set<string>>(new Set());

    // Initialization & Hydration
    useEffect(() => {
        async function init() {
            const today = new Date().toISOString().split('T')[0];

            if (user) {
                // Fetch from DB
                const result = await getScriptureProgress('gita');
                if (result.success && result.data) {
                    setChapter(result.data.current_chapter);
                    setVerse(result.data.current_verse);
                    setDailyGoal(result.data.daily_goal);

                    if (result.data.last_read_date === today) {
                        setVersesReadToday(result.data.verses_read_today);
                        // Note: DB simple schema doesn't track exact set of verses read today, 
                        // so we might just assume the count is correct.
                        // For DB, we don't store individual read verses for the day, only the count.
                        // So, readVerses will remain empty for authenticated users on init.
                    } else {
                        setVersesReadToday(0);
                        setReadVerses(new Set()); // Reset read verses for new day
                    }
                }
            } else {
                // Load from LocalStorage
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
            }
        }

        if (!authLoading) {
            init();
        }
    }, [user, authLoading]);

    // Fetch Verse Content
    useEffect(() => {
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
    }, [chapter, verse]);

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

    // Mark verse as read logic
    useEffect(() => {
        if (!loadingVerse && verseData) {
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
        }
    }, [chapter, verse, verseData, loadingVerse, readVerses, versesReadToday, dailyGoal, saveProgress]);

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
                // onVerseChange={setVerse} // Removed: onVerseChange is not used in ChapterNavigation
                onNext={handleNext}
                onPrev={handlePrev}
            />

        </div>
    );
}
