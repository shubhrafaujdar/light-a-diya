import {
  createSuccessResponse,
  createErrorResponse,
  validateLimit,
  sanitizeSearchQuery
} from '@/utils/api-helpers'
import { getAllDeities } from '@/lib/aarti-data'

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

    // Fetch all deities from JSON
    let deities = await getAllDeities()

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase()
      deities = deities.filter(deity =>
        deity.name_english.toLowerCase().includes(searchLower) ||
        deity.name_hindi.includes(searchLower)
      )
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return createErrorResponse(errorMessage, 500, 'INTERNAL_SERVER_ERROR')
  }
}