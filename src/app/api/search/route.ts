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
    const rawQuery = searchParams.get('q')
    const type = searchParams.get('type') // 'deities', 'aartis', or 'all'
    const rawLimit = searchParams.get('limit')

    // Validate and sanitize query parameter
    const query = sanitizeSearchQuery(rawQuery)
    if (!query) {
      return createErrorResponse('Search query is required', 400, 'MISSING_QUERY')
    }

    // Validate type parameter
    const validTypes = ['deities', 'aartis', 'all']
    const searchType = type || 'all'
    if (!validTypes.includes(searchType)) {
      return createErrorResponse('Type must be one of: deities, aartis, all', 400, 'INVALID_TYPE')
    }

    // Validate limit parameter
    const limitValidation = validateLimit(rawLimit)
    if (!limitValidation.isValid) {
      return createErrorResponse(limitValidation.error!, 400, 'INVALID_LIMIT')
    }

    const results = {
      query,
      type: searchType,
      results: {} as Record<string, unknown>,
      counts: {} as Record<string, number>,
      total_results: 0
    }

    // Search deities
    if (searchType === 'deities' || searchType === 'all') {
      const deities = await db.searchDeities(query)
      const limitedDeities = limitValidation.value ? deities.slice(0, limitValidation.value) : deities
      results.results.deities = limitedDeities
      results.counts.deities = deities.length
    }

    // Search aartis
    if (searchType === 'aartis' || searchType === 'all') {
      const aartis = await db.searchAartisWithDeities(query)
      const limitedAartis = limitValidation.value ? aartis.slice(0, limitValidation.value) : aartis
      results.results.aartis = limitedAartis
      results.counts.aartis = aartis.length
    }

    // Calculate total results
    const totalResults = Object.values(results.counts).reduce((sum: number, count: number) => sum + count, 0)
    results.total_results = totalResults

    return createSuccessResponse(results, {
      filters: {
        query,
        type: searchType,
        limit: limitValidation.value || null
      }
    })
  } catch (error: unknown) {
    const errorInfo = db.handleDatabaseError(error)
    return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
  }
}