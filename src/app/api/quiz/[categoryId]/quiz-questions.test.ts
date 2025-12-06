
import { GET } from './route'
import { NextRequest } from 'next/server'
import fc from 'fast-check'
import { db } from '@/lib/database'

// Mock next/server
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, options) => ({
            json: async () => data,
            status: options?.status || 200,
        }))
    },
    NextRequest: jest.fn()
}))

// Mock the database
jest.mock('@/lib/database', () => ({
    db: {
        getQuizCategoryById: jest.fn(),
        getQuizQuestionsByCategory: jest.fn(),
        handleDatabaseError: jest.fn()
    }
}))

describe('Spiritial Quiz Feature Properties', () => {
    const validIsoDate = new Date().toISOString();

    describe('Property 4: Question retrieval completeness', () => {
        it('should return all active questions for a valid category', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.uuid(),
                    fc.record({
                        id: fc.uuid(),
                        name_hindi: fc.string(),
                        name_english: fc.string(),
                        question_count: fc.integer(),
                        display_order: fc.integer(),
                        is_active: fc.constant(true),
                        created_at: fc.constant(validIsoDate),
                        updated_at: fc.constant(validIsoDate)
                    }),
                    fc.array(
                        fc.record({
                            id: fc.uuid(),
                            category_id: fc.uuid(),
                            question_text_hindi: fc.string(),
                            question_text_english: fc.string(),
                            options: fc.record({
                                hindi: fc.array(fc.string(), { minLength: 4, maxLength: 4 }),
                                english: fc.array(fc.string(), { minLength: 4, maxLength: 4 })
                            }),
                            correct_answer_index: fc.integer({ min: 0, max: 3 }),
                            display_order: fc.integer(),
                            is_active: fc.constant(true),
                            difficulty_level: fc.constantFrom('easy', 'medium', 'hard'),
                            created_at: fc.constant(validIsoDate),
                            updated_at: fc.constant(validIsoDate)
                        })
                    ),
                    async (categoryId, mockCategory, mockQuestions) => {
                        // Setup mocks
                        (db.getQuizCategoryById as jest.Mock).mockResolvedValue(mockCategory);
                        (db.getQuizQuestionsByCategory as jest.Mock).mockResolvedValue(mockQuestions);

                        // Mock request/context
                        const request = new NextRequest(`http://localhost/api/quiz/${categoryId}`);
                        const context = { params: Promise.resolve({ categoryId }) };

                        // Call API
                        const response = await GET(request, context);
                        const data = await response.json();

                        if (!data?.data?.questions) {
                            console.error('Debug Data Prop 4:', JSON.stringify(data, null, 2));
                        }

                        // Verification
                        expect(response.status).toBe(200);
                        expect(data).toHaveProperty('data');
                        expect(data.data).toHaveProperty('category');
                        expect(data.data).toHaveProperty('questions');
                        expect(data.data.category).toEqual(mockCategory);
                        expect(data.data.questions).toEqual(mockQuestions); // Deep equality check
                        expect(data.count).toBe(mockQuestions.length);
                    }
                ),
                { numRuns: 50 }
            )
        })

        it('should return 404 for non-existent category', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.uuid(),
                    async (categoryId) => {
                        (db.getQuizCategoryById as jest.Mock).mockResolvedValue(null);

                        const request = new NextRequest(`http://localhost/api/quiz/${categoryId}`);
                        const context = { params: Promise.resolve({ categoryId }) };

                        const response = await GET(request, context);
                        const data = await response.json();

                        expect(response.status).toBe(404);
                        expect(data.error).toContain('not found');
                    }
                )
            )
        })

        it('should return 400 for invalid UUID format', async () => {
            const invalidId = 'not-a-uuid';
            const request = new NextRequest(`http://localhost/api/quiz/${invalidId}`);
            const context = { params: Promise.resolve({ categoryId: invalidId }) };

            const response = await GET(request, context);
            expect(response.status).toBe(400);
        })
    })

    describe('Property 5: Multilingual content consistency', () => {
        it('should validate structure of returned questions', async () => {
            await fc.assert(
                fc.asyncProperty(
                    fc.uuid(),
                    fc.record({
                        id: fc.uuid(),
                        name_hindi: fc.string(),
                        name_english: fc.string(),
                        question_count: fc.integer(),
                        display_order: fc.integer(),
                        is_active: fc.constant(true),
                        created_at: fc.constant(validIsoDate),
                        updated_at: fc.constant(validIsoDate)
                    }),
                    fc.array(
                        fc.record({
                            id: fc.uuid(),
                            category_id: fc.uuid(),
                            question_text_hindi: fc.string(),
                            question_text_english: fc.string(),
                            options: fc.record({
                                hindi: fc.array(fc.string(), { minLength: 4, maxLength: 4 }),
                                english: fc.array(fc.string(), { minLength: 4, maxLength: 4 })
                            }),
                            correct_answer_index: fc.integer({ min: 0, max: 3 }),
                            display_order: fc.integer(),
                            is_active: fc.constant(true),
                            difficulty_level: fc.constantFrom('easy', 'medium', 'hard'),
                            created_at: fc.constant(validIsoDate),
                            updated_at: fc.constant(validIsoDate)
                        })
                    ),
                    async (categoryId, mockCategory, mockQuestions) => {
                        (db.getQuizCategoryById as jest.Mock).mockResolvedValue(mockCategory);
                        (db.getQuizQuestionsByCategory as jest.Mock).mockResolvedValue(mockQuestions);

                        const request = new NextRequest(`http://localhost/api/quiz/${categoryId}`);
                        const context = { params: Promise.resolve({ categoryId }) };

                        const response = await GET(request, context);
                        const data = await response.json();

                        // Property 5 validation
                        expect(response.status).toBe(200);

                        expect(data).toHaveProperty('data');

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data.data.questions.forEach((q: any) => {
                            expect(q.options).toHaveProperty('hindi');
                            expect(q.options).toHaveProperty('english');
                            expect(q.options.hindi).toHaveLength(4);
                            expect(q.options.english).toHaveLength(4);
                            expect(q.correct_answer_index).toBeGreaterThanOrEqual(0);
                            expect(q.correct_answer_index).toBeLessThan(4);
                        });
                    }
                )
            )
        })
    })
})
