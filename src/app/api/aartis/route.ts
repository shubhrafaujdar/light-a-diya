import {
  createSuccessResponse,
  createErrorResponse,
  validateLimit,
  sanitizeSearchQuery,
  isValidUUID
} from '@/utils/api-helpers'
import { getAllAartis, getAartisByDeityId, getAllDeities } from '@/lib/aarti-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const deityId = searchParams.get('deity_id')
    const withDeities = searchParams.get('with_deities') === 'true'
    const rawSearch = searchParams.get('search')
    const rawLimit = searchParams.get('limit')

    // Validate deity_id if provided (now accepts slugs too, so we skip strict UUID check)
    // if (deityId && !isValidUUID(deityId)) {
    //   return createErrorResponse('Invalid deity ID format', 400, 'INVALID_UUID')
    // }

    // Validate and sanitize inputs
    const search = sanitizeSearchQuery(rawSearch)
    const limitValidation = validateLimit(rawLimit)

    if (!limitValidation.isValid) {
      return createErrorResponse(limitValidation.error!, 400, 'INVALID_LIMIT')
    }

    let aartis

    // Handle search functionality
    if (search) {
      const allAartis = await getAllAartis();
      const searchLower = search.toLowerCase();

      if (withDeities) {
        const deities = await getAllDeities();
        aartis = allAartis.map(aarti => {
          const deity = deities.find(d => d.id === aarti.deity_id);
          return { ...aarti, deity };
        }).filter(item => {
          // Expanded search logic for joined data
          return item.title_english.toLowerCase().includes(searchLower) ||
            item.title_hindi.includes(searchLower) ||
            item.deity?.name_english.toLowerCase().includes(searchLower) ||
            item.deity?.name_hindi.includes(searchLower);
        });
      } else {
        aartis = allAartis.filter(aarti =>
          aarti.title_english.toLowerCase().includes(searchLower) ||
          aarti.title_hindi.includes(searchLower)
        );
      }
    } else if (deityId) {
      aartis = await getAartisByDeityId(deityId)
    } else if (withDeities) {
      const allAartis = await getAllAartis();
      const deities = await getAllDeities();
      aartis = allAartis.map(aarti => {
        const deity = deities.find(d => d.id === aarti.deity_id);
        return { ...aarti, deity };
      });
    } else {
      aartis = await getAllAartis()
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return createErrorResponse(errorMessage, 500, 'INTERNAL_SERVER_ERROR')
  }
}