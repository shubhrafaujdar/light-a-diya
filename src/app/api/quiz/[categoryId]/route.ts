import { db } from '@/lib/database'
import { quizService } from '@/lib/quiz-service'
import { createServerSupabaseClient } from '@/lib/supabase-server'
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

        const category = await db.getQuizCategoryById(categoryId)
        if (!category) {
            return createErrorResponse('Category not found', 404, 'NOT_FOUND')
        }

        // Derive slug from name_english (e.g. "Ramayana" -> "ramayana")
        const slug = category.name_english.toLowerCase().trim();
        const allQuestions = await quizService.getQuestions(slug);

        // Check for user session to determine question count
        const supabase = await createServerSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        // 20 questions for signed-in users, 10 for anonymous
        const count = user ? 20 : 10;

        const questions = quizService.getRandomQuestions(allQuestions, count);

        // Return with no-cache headers since questions are randomized
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

