
import { quizCache, _resetCacheManagerInstance } from './quiz-cache';
import { CacheManager } from './cache-manager';
import fc from 'fast-check';

// Mock CacheManager and its dependencies
jest.mock('./cache-manager');
jest.mock('./storage-manager');
jest.mock('./indexeddb', () => ({
    getCacheDB: jest.fn(() => ({
        isOpen: jest.fn(() => true),
        open: jest.fn().mockResolvedValue(undefined)
    }))
}));

describe('QuizCache', () => {
    let mockCacheManager: any;

    beforeEach(() => {
        jest.clearAllMocks();
        _resetCacheManagerInstance();

        // Setup mock CacheManager instance
        mockCacheManager = {
            cacheApiResponse: jest.fn().mockResolvedValue(undefined),
            getApiResponse: jest.fn().mockResolvedValue(null)
        };
        (CacheManager as jest.Mock).mockImplementation(() => mockCacheManager);
    });

    it('Property 10.1: Cache equivalence for Categories', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(
                    fc.record({
                        id: fc.uuid(),
                        name_hindi: fc.string(),
                        name_english: fc.string(),
                        // Use fc.oneof([fc.string(), fc.constant(undefined)]) instead of fc.option for undefined
                        description_hindi: fc.oneof(fc.string(), fc.constant(undefined)),
                        description_english: fc.oneof(fc.string(), fc.constant(undefined)),
                        icon: fc.oneof(fc.string(), fc.constant(undefined)),
                        question_count: fc.integer(),
                        display_order: fc.integer(),
                        is_active: fc.constant(true),
                        created_at: fc.string(),
                        updated_at: fc.string()
                    })
                ),
                async (categories) => {
                    // Cast to unknown first to avoid strict type checks on generated data vs QuizCategory
                    // because fast-check might generate properties we don't strictly control or optional vs null handling is tricky
                    const typedCategories = categories as unknown as import('@/types/database').QuizCategory[];

                    // Test caching
                    await quizCache.cacheCategories(typedCategories);

                    expect(mockCacheManager.cacheApiResponse).toHaveBeenCalledWith(
                        '/api/quiz/categories',
                        typedCategories
                    );

                    // Test retrieval
                    mockCacheManager.getApiResponse.mockResolvedValue(typedCategories);
                    const retrieved = await quizCache.getCachedCategories();

                    expect(mockCacheManager.getApiResponse).toHaveBeenCalledWith('/api/quiz/categories');
                    expect(retrieved).toEqual(typedCategories);
                }
            )
        );
    });

    it('Property 10.1: Cache equivalence for Questions', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.uuid(),
                fc.record({
                    category: fc.record({
                        id: fc.uuid(),
                        name_hindi: fc.string(),
                        name_english: fc.string(),
                        // ... other props simplified for test
                    }),
                    questions: fc.array(fc.record({
                        id: fc.uuid(),
                        category_id: fc.uuid(),
                        question_text_hindi: fc.string(),
                        question_text_english: fc.string(),
                        options: fc.record({
                            hindi: fc.array(fc.string()),
                            english: fc.array(fc.string())
                        }),
                        correct_answer_index: fc.integer()
                        // ...
                    }))
                }),
                async (categoryId, data) => {
                    // Cache
                    await quizCache.cacheQuestions(categoryId, data as any);

                    expect(mockCacheManager.cacheApiResponse).toHaveBeenCalledWith(
                        `/api/quiz/${categoryId}`,
                        data
                    );

                    // Retrieve
                    mockCacheManager.getApiResponse.mockResolvedValue(data);
                    const retrieved = await quizCache.getCachedQuestions(categoryId);

                    expect(mockCacheManager.getApiResponse).toHaveBeenCalledWith(`/api/quiz/${categoryId}`);
                    expect(retrieved).toEqual(data);
                }
            )
        );
    });
});
