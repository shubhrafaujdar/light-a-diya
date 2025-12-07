import { QuizQuestion, QuizSession } from '@/types/database';

/**
 * Fisher-Yates shuffle algorithm for randomizing questions
 */
export function shuffleQuestions<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generate storage key for quiz progress
 */
export function getQuizStorageKey(categoryId: string): string {
    return `quiz_progress_${categoryId}`;
}

/**
 * Save quiz progress to sessionStorage
 */
export function saveQuizProgress(categoryId: string, session: QuizSession): void {
    try {
        const key = getQuizStorageKey(categoryId);
        const data = {
            ...session,
            // Store timestamp for expiration check
            savedAt: Date.now(),
        };
        sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        // Silent fail - sessionStorage might be disabled or full
        console.warn('Failed to save quiz progress:', error);
    }
}

/**
 * Load quiz progress from sessionStorage
 */
export function loadQuizProgress(categoryId: string): QuizSession | null {
    try {
        const key = getQuizStorageKey(categoryId);
        const stored = sessionStorage.getItem(key);

        if (!stored) {
            return null;
        }

        const data = JSON.parse(stored);

        // Check if saved data is less than 24 hours old
        const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
        if (data.savedAt && Date.now() - data.savedAt > MAX_AGE) {
            clearQuizProgress(categoryId);
            return null;
        }

        // Remove savedAt timestamp before returning
        const { savedAt, ...session } = data;
        return session as QuizSession;
    } catch (error) {
        console.warn('Failed to load quiz progress:', error);
        return null;
    }
}

/**
 * Clear quiz progress from sessionStorage
 */
export function clearQuizProgress(categoryId: string): void {
    try {
        const key = getQuizStorageKey(categoryId);
        sessionStorage.removeItem(key);
    } catch (error) {
        console.warn('Failed to clear quiz progress:', error);
    }
}

/**
 * Constants for quiz limits
 */
export const QUIZ_CONSTANTS = {
    ANONYMOUS_QUESTION_LIMIT: 10,
    ANONYMOUS_TIMER_SECONDS: 120, // 2 minutes
} as const;
