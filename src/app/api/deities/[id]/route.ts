import { type Deity, type Aarti } from '@/lib/database'
import {
  createSuccessResponse,
  createErrorResponse,
  isValidUUID
} from '@/utils/api-helpers'
import { getDeityById, getAartisByDeityId } from '@/lib/aarti-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`[API] Received ID/Slug request: ${id}`);

    // We now accept simple slugs or UUIDs, so simple check is enough
    if (!id) {
      return createErrorResponse('Invalid ID', 400, 'INVALID_ID')
    }

    const { searchParams } = new URL(request.url)
    const includeAartis = searchParams.get('include_aartis') === 'true'

    const deity = await getDeityById(id)

    if (!deity) {
      return createErrorResponse('Deity not found', 404, 'DEITY_NOT_FOUND')
    }

    // Include aartis if requested
    if (includeAartis) {
      const aartis = await getAartisByDeityId(id)
      const responseData: Deity & { aartis: Aarti[] } = {
        ...deity,
        aartis
      }

      return createSuccessResponse(responseData, {
        count: aartis.length,
        filters: { include_aartis: true }
      })
    }

    return createSuccessResponse(deity)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return createErrorResponse(errorMessage, 500, 'INTERNAL_SERVER_ERROR')
  }
}