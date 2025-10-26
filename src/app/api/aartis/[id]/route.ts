import { db, type Aarti, type Deity } from '@/lib/database'
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
      return createErrorResponse('Invalid aarti ID format', 400, 'INVALID_UUID')
    }

    const { searchParams } = new URL(request.url)
    const includeDeity = searchParams.get('include_deity') === 'true'

    const aarti = await db.getAartiById(id)
    
    if (!aarti) {
      return createErrorResponse('Aarti not found', 404, 'AARTI_NOT_FOUND')
    }

    // Include deity information if requested
    if (includeDeity) {
      const deity = await db.getDeityById(aarti.deity_id)
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
    const errorInfo = db.handleDatabaseError(error)
    return createErrorResponse(errorInfo.message, errorInfo.status, errorInfo.code)
  }
}