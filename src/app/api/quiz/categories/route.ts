import { db } from '@/lib/database'
import { 
  createSuccessResponse, 
  createErrorResponse 
} from '@/utils/api-helpers'

// Configure route segment caching
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const categories = await db.getQuizCategories()

    // Cache headers are configured in next.config.ts
    // 1 hour max-age, stale-while-revalidate 24 hours
    return createSuccessResponse(categories, {
      count: categories.length
    })
  } catch (error: unknown) {
    const errorInfo = db.handleDatabaseError(error)
    
    // If tables don't exist, return empty data with setup instructions
    const errorWithCode = error as { code?: string }
    if (errorInfo.code === 'TABLE_NOT_FOUND' || errorWithCode?.code === 'PGRST205') {
      return createSuccessResponse([], {
        count: 0,
        message: 'Quiz tables not set up. Please run the database migration.',
        setupRequired: true
      })
    }
    
    return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
  }
}
