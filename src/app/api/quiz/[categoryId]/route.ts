
import { db } from '@/lib/database'
import {
    createSuccessResponse,
    createErrorResponse,
    isValidUUID
} from '@/utils/api-helpers'
import { NextRequest } from 'next/server'

// Disable caching since questions are randomized per request
export const revalidate = 0

interface Context {
    params: Promise<{
        categoryId: string
    }>
}

export async function GET(
    request: NextRequest,
    context: Context
) {
    try {
        const { categoryId } = await context.params

        // Validate UUID format
        if (!isValidUUID(categoryId)) {
            return createErrorResponse('Invalid category ID format', 400, 'INVALID_ID')
        }

        // Check if category exists
        const category = await db.getQuizCategoryById(categoryId)
        if (!category) {
            return createErrorResponse('Category not found', 404, 'NOT_FOUND')
        }

        // Fetch questions
        const questions = await db.getQuizQuestionsByCategory(categoryId)

        // Randomize questions using Fisher-Yates shuffle
        const shuffledQuestions = [...questions];
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }

        // Return with no-cache headers since questions are randomized
        return createSuccessResponse({
            category,
            questions: shuffledQuestions
        }, {
            count: shuffledQuestions.length
        })

    } catch (error: unknown) {
        const errorInfo = db.handleDatabaseError(error)
        return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
    }
}
