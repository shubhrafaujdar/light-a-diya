
import { db } from '@/lib/database'
import {
    createSuccessResponse,
    createErrorResponse,
    isValidUUID
} from '@/utils/api-helpers'
import { NextRequest } from 'next/server'

// Configure route segment caching
export const revalidate = 3600 // Revalidate every hour

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

        // Cache headers are configured in next.config.ts or via revalidate above
        return createSuccessResponse({
            category,
            questions
        }, {
            count: questions.length
        })

    } catch (error: unknown) {
        const errorInfo = db.handleDatabaseError(error)
        return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
    }
}
