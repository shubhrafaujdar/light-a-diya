import { GET } from './route'
import fc from 'fast-check'
import { db } from '@/lib/database'

// Mock next/server
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, options) => ({
            json: async () => data,
            status: options?.status || 200,
        }))
    }
}))

// Mock the database
jest.mock('@/lib/database', () => ({
    db: {
        getQuizCategories: jest.fn(),
        handleDatabaseError: jest.fn()
    }
}))

describe('Property 1: Category display completeness', () => {
    it('should return all active categories with required fields', async () => {
        // Generate valid quiz categories using fast-check
        await fc.assert(
            fc.asyncProperty(
                fc.array(
                    fc.record({
                        id: fc.uuid(),
                        name_hindi: fc.string({ minLength: 1 }),
                        name_english: fc.string({ minLength: 1 }),
                        description_hindi: fc.option(fc.string(), { nil: undefined }),
                        description_english: fc.option(fc.string(), { nil: undefined }),
                        icon: fc.option(fc.string(), { nil: undefined }),
                        question_count: fc.integer({ min: 0 }),
                        display_order: fc.integer({ min: 0 }),
                        is_active: fc.constant(true),
                        created_at: fc.date().map(d => d.toISOString()),
                        updated_at: fc.date().map(d => d.toISOString())
                    })
                ),
                async (mockCategories) => {
                    // Setup mock return
                    (db.getQuizCategories as jest.Mock).mockResolvedValue(mockCategories)

                    // Call the API
                    const response = await GET()
                    const data = await response.json()

                    // Validation
                    expect(response.status).toBe(200)
                    expect(data).toHaveProperty('data')
                    expect(data.data).toHaveLength(mockCategories.length)

                    expect(data.count).toBe(mockCategories.length)

                    // Verify each category
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.data.forEach((cat: any, index: number) => {
                        const originalProxy = mockCategories[index]
                        expect(cat.id).toBe(originalProxy.id)
                        expect(cat.name_hindi).toBe(originalProxy.name_hindi)
                        expect(cat.name_english).toBe(originalProxy.name_english)
                        expect(cat.question_count).toBe(originalProxy.question_count)
                        expect(cat.display_order).toBe(originalProxy.display_order)
                    })
                }
            ),
            { numRuns: 100 }
        )
    })

    it('should handle database errors gracefully', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string({ minLength: 1 }),
                fc.integer({ min: 400, max: 599 }),
                async (errorMessage, statusCode) => {
                    // Setup mock error
                    (db.getQuizCategories as jest.Mock).mockRejectedValue(new Error(errorMessage));
                    (db.handleDatabaseError as jest.Mock).mockReturnValue({
                        message: errorMessage,
                        status: statusCode,
                        code: 'DB_ERROR'
                    })

                    const response = await GET()
                    const data = await response.json()

                    expect(response.status).toBe(statusCode)
                    expect(data).toHaveProperty('error')
                    expect(data.error).toBe(errorMessage)
                }
            )
        )
    })
})
