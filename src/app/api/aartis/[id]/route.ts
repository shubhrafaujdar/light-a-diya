import { type Aarti, type Deity } from '@/lib/database'
import {
  createSuccessResponse,
  createErrorResponse,
  isValidUUID
} from '@/utils/api-helpers'
import { getAartiById, getDeityById } from '@/lib/aarti-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // We now accept simple slugs or UUIDs, so simple check is enough
    if (!id) {
      return createErrorResponse('Invalid ID', 400, 'INVALID_ID')
    }

    const { searchParams } = new URL(request.url)
    const includeDeity = searchParams.get('include_deity') === 'true'

    const aarti = await getAartiById(id)

    if (!aarti) {
      return createErrorResponse('Aarti not found', 404, 'AARTI_NOT_FOUND')
    }

    // Include deity information if requested
    if (includeDeity) {
      const deity = await getDeityById(aarti.deity_id)
      if (deity) {
        const responseData: Aarti & { deity: Deity } = {
          ...aarti,
          deity
        }

        return createSuccessResponse(responseData, {
          filters: { include_deity: true }
        })
      }
    }

    return createSuccessResponse(aarti)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return createErrorResponse(errorMessage, 500, 'INTERNAL_SERVER_ERROR')
  }
}