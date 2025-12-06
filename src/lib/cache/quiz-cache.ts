
import { CacheManager } from './cache-manager';
import { StorageManager } from './storage-manager';
import { getCacheDB } from './indexeddb';
import { QuizCategory, QuizQuestion } from '@/types/database';
import { logger } from '../logger';

let cacheManagerInstance: CacheManager | null = null;

/**
 * Get singleton instance of CacheManager
 */
async function getCacheManager(): Promise<CacheManager> {
    if (cacheManagerInstance) {
        return cacheManagerInstance;
    }

    // Ensure DB is initialized
    const db = getCacheDB();
    if (!db.isOpen()) {
        await db.open();
    }

    const storageManager = new StorageManager();
    cacheManagerInstance = new CacheManager(storageManager);
    return cacheManagerInstance;
}

/**
 * Reset cache manager instance (for testing)
 */
export function _resetCacheManagerInstance(): void {
    cacheManagerInstance = null;
}

export const quizCache = {
    /**
     * Cache quiz categories
     */
    async cacheCategories(categories: QuizCategory[]): Promise<void> {
        try {
            const manager = await getCacheManager();
            // Cache as API response to match the source
            await manager.cacheApiResponse('/api/quiz/categories', categories);
        } catch (error) {
            logger.warn({ error }, 'Failed to cache quiz categories');
        }
    },

    /**
     * Get cached quiz categories
     */
    async getCachedCategories(): Promise<QuizCategory[] | null> {
        try {
            const manager = await getCacheManager();
            const cached = await manager.getApiResponse('/api/quiz/categories');
            return cached as QuizCategory[] | null;
        } catch (error) {
            logger.warn({ error }, 'Failed to get cached quiz categories');
            return null;
        }
    },

    /**
     * Cache quiz questions for a category
     */
    async cacheQuestions(categoryId: string, data: { category: QuizCategory, questions: QuizQuestion[] }): Promise<void> {
        try {
            const manager = await getCacheManager();
            await manager.cacheApiResponse(`/api/quiz/${categoryId}`, data);
        } catch (error) {
            logger.warn({ error, categoryId }, 'Failed to cache questions for category');
        }
    },

    /**
     * Get cached quiz questions for a category
     */
    async getCachedQuestions(categoryId: string): Promise<{ category: QuizCategory, questions: QuizQuestion[] } | null> {
        try {
            const manager = await getCacheManager();
            const cached = await manager.getApiResponse(`/api/quiz/${categoryId}`);
            return cached as { category: QuizCategory, questions: QuizQuestion[] } | null;
        } catch (error) {
            logger.warn({ error, categoryId }, 'Failed to get cached questions for category');
            return null;
        }
    }
};
