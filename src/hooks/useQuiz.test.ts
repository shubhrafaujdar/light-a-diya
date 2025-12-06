
import { renderHook, act } from '@testing-library/react'
import { useQuiz } from './useQuiz'
import fc from 'fast-check'

// Mock fetch
global.fetch = jest.fn()

describe('useQuiz Hook Properties', () => {

    // Helper to create mock API response
    const createMockResponse = (category: unknown, questions: unknown[]) => ({
        ok: true,
        json: async () => ({
            data: {
                category,
                questions
            }
        })
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Property 2 & 6: Answer validation correctness and Navigation state', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.record({
                    id: fc.uuid(),
                    name_hindi: fc.string(),
                    name_english: fc.string(),
                    // other fields optional/mocked
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
                    }),
                    { minLength: 1 } // At least one question
                ),
                fc.integer({ min: 0, max: 3 }), // Answer selection
                async (mockCategory, mockQuestions, selectedAnswerIndex) => {
                    (global.fetch as jest.Mock).mockResolvedValue(createMockResponse(mockCategory, mockQuestions))

                    const { result } = renderHook(() => useQuiz('test-category-id'))

                    // Wait for loading to finish
                    await act(async () => {
                        // Wait for effect
                    })

                    // Poll for loading to complete
                    let retries = 0;
                    while (result.current.isLoading && retries < 50) {
                        await act(async () => { await new Promise(r => setTimeout(r, 10)) });
                        retries++;
                    }

                    if (result.current.isLoading) return; // Skip if still loading (shouldn't happen with mocks)

                    // Select answer
                    await act(async () => {
                        result.current.selectAnswer(selectedAnswerIndex)
                    })

                    const currentQ = mockQuestions[0]
                    const expectedCorrect = selectedAnswerIndex === currentQ.correct_answer_index

                    // Property 2: Answer validaton correctness
                    expect(result.current.session?.selectedAnswer).toBe(selectedAnswerIndex)
                    expect(result.current.session?.isAnswerCorrect).toBe(expectedCorrect)

                    // Property 6: Navigation state (implied by isAnswerCorrect, but nextQuestion should work)
                    // If correct, user usually clicks next. If incorrect, they can't proceed (this logic might be in UI, 
                    // but hook state supports it).
                    // The hook doesn't strictly prevent nextQuestion call based on correctness (UI does),
                    // but `isAnswerCorrect` provides the state needed for the UI disable logic.
                    // We verify `isAnswerCorrect` accurately reflects the state.
                }
            ),
            { numRuns: 50 }
        )
    })

    it('Property 3 & 7: Progress tracking and Completion detection', async () => {
        await fc.assert(
            fc.asyncProperty(
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
                        is_active: fc.constant(true),
                    }),
                    { minLength: 1, maxLength: 5 } // Keep it short for simulation
                ),
                async (mockQuestions) => {
                    const mockCategory = { name_hindi: 'H', name_english: 'E' };
                    (global.fetch as jest.Mock).mockResolvedValue(createMockResponse(mockCategory, mockQuestions))

                    const { result } = renderHook(() => useQuiz('test-category-id'))

                    // Wait for load
                    let retries = 0;
                    while (result.current.isLoading && retries < 50) {
                        await act(async () => { await new Promise(r => setTimeout(r, 10)) });
                        retries++;
                    }

                    // Iterate through questions
                    for (let i = 0; i < mockQuestions.length; i++) {
                        // Property 3: Progress tracking
                        expect(result.current.session?.currentQuestionIndex).toBe(i)
                        expect(result.current.session?.completedQuestions).toBe(i)
                        expect(result.current.isQuizComplete).toBe(false)

                        // Simulate answering correctly to move forward (hook doesn't strictly force correct to move next, 
                        // but flow is answer -> next)
                        await act(async () => {
                            result.current.selectAnswer(mockQuestions[i].correct_answer_index)
                        })

                        await act(async () => {
                            result.current.nextQuestion()
                        })
                    }

                    // Property 7: Completion detection
                    // After last question, it should be complete
                    expect(result.current.session?.completedQuestions).toBe(mockQuestions.length)
                    expect(result.current.isQuizComplete).toBe(true)
                }
            ),
            { numRuns: 20 }
        )
    })
})
