import { db, type Deity, type Aarti } from '@/lib/database'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  isValidUUID 
} from '@/utils/api-helpers'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Validate UUID format
    if (!isValidUUID(id)) {
      return createErrorResponse('Invalid deity ID format', 400, 'INVALID_UUID')
    }

    const { searchParams } = new URL(request.url)
    const includeAartis = searchParams.get('include_aartis') === 'true'

    const deity = await db.getDeityById(id)
    
    if (!deity) {
      return createErrorResponse('Deity not found', 404, 'DEITY_NOT_FOUND')
    }

    // Include aartis if requested
    if (includeAartis) {
      const aartis = await db.getAartisByDeity(id)
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
    const errorInfo = db.handleDatabaseError(error)
    return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
  }
}