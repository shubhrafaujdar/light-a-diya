import { db } from '@/lib/database'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  validateLimit, 
  sanitizeSearchQuery 
} from '@/utils/api-helpers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawSearch = searchParams.get('search')
    const category = searchParams.get('category')
    const rawLimit = searchParams.get('limit')

    // Validate and sanitize inputs
    const search = sanitizeSearchQuery(rawSearch)
    const limitValidation = validateLimit(rawLimit)
    
    if (!limitValidation.isValid) {
      return createErrorResponse(limitValidation.error!, 400, 'INVALID_LIMIT')
    }

    let deities
    if (search) {
      deities = await db.searchDeities(search)
    } else {
      deities = await db.getDeities()
    }

    // Filter by category if specified
    if (category) {
      const sanitizedCategory = category.trim().toLowerCase()
      deities = deities.filter(deity => 
        deity.category.toLowerCase() === sanitizedCategory
      )
    }

    // Apply limit if specified
    if (limitValidation.value) {
      deities = deities.slice(0, limitValidation.value)
    }

    return createSuccessResponse(deities, {
      count: deities.length,
      filters: {
        search: search || null,
        category: category || null,
        limit: limitValidation.value || null
      }
    })
  } catch (error: unknown) {
    const errorInfo = db.handleDatabaseError(error)
    
    // If tables don't exist, return empty data with setup instructions
    // Note: setupRequired is only included when database setup is needed
    const errorWithCode = error as { code?: string }
    if (errorInfo.code === 'TABLE_NOT_FOUND' || errorWithCode?.code === 'PGRST205') {
      return createSuccessResponse([], {
        count: 0,
        message: 'Database not set up. Please run the setup script.',
        setupRequired: true
      })
    }
    
    return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
  }
}