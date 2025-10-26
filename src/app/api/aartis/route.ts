import { db } from '@/lib/database'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  validateLimit, 
  sanitizeSearchQuery,
  isValidUUID 
} from '@/utils/api-helpers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const deityId = searchParams.get('deity_id')
    const withDeities = searchParams.get('with_deities') === 'true'
    const rawSearch = searchParams.get('search')
    const rawLimit = searchParams.get('limit')

    // Validate deity_id if provided
    if (deityId && !isValidUUID(deityId)) {
      return createErrorResponse('Invalid deity ID format', 400, 'INVALID_UUID')
    }

    // Validate and sanitize inputs
    const search = sanitizeSearchQuery(rawSearch)
    const limitValidation = validateLimit(rawLimit)
    
    if (!limitValidation.isValid) {
      return createErrorResponse(limitValidation.error!, 400, 'INVALID_LIMIT')
    }

    let aartis
    
    // Handle search functionality
    if (search) {
      if (withDeities) {
        aartis = await db.searchAartisWithDeities(search)
      } else {
        aartis = await db.searchAartis(search)
      }
    } else if (deityId) {
      // Verify deity exists first
      const deity = await db.getDeityById(deityId)
      if (!deity) {
        return createErrorResponse('Deity not found', 404, 'DEITY_NOT_FOUND')
      }
      aartis = await db.getAartisByDeity(deityId)
    } else if (withDeities) {
      aartis = await db.getAartisWithDeities()
    } else {
      aartis = await db.getAartis()
    }

    // Apply limit if specified
    if (limitValidation.value) {
      aartis = aartis.slice(0, limitValidation.value)
    }

    return createSuccessResponse(aartis, {
      count: aartis.length,
      filters: {
        deity_id: deityId || null,
        search: search || null,
        with_deities: withDeities,
        limit: limitValidation.value || null
      }
    })
  } catch (error: unknown) {
    const errorInfo = db.handleDatabaseError(error)
    return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
  }
}