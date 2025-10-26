import { NextResponse } from 'next/server'

// API Response helpers
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  code?: string
  message?: string
  count?: number
  filters?: Record<string, unknown>
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
  setupRequired?: boolean
}

export function createSuccessResponse<T>(
  data: T,
  options?: {
    count?: number
    filters?: Record<string, unknown>
    pagination?: ApiResponse['pagination']
    message?: string
    setupRequired?: boolean
  }
): NextResponse {
  const response: ApiResponse<T> = {
    data,
    ...options
  }
  
  return NextResponse.json(response)
}

export function createErrorResponse(
  error: string,
  status: number = 500,
  code?: string
): NextResponse {
  const response: ApiResponse = {
    error,
    code
  }
  
  return NextResponse.json(response, { status })
}

// Validation helpers
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export function validateLimit(limit: string | null): { isValid: boolean; value?: number; error?: string } {
  if (!limit) {
    return { isValid: true }
  }

  const parsedLimit = parseInt(limit, 10)
  
  if (isNaN(parsedLimit)) {
    return { isValid: false, error: 'Limit must be a number' }
  }

  if (parsedLimit < 1 || parsedLimit > 100) {
    return { isValid: false, error: 'Limit must be between 1 and 100' }
  }

  return { isValid: true, value: parsedLimit }
}

export function validatePage(page: string | null): { isValid: boolean; value?: number; error?: string } {
  if (!page) {
    return { isValid: true, value: 1 }
  }

  const parsedPage = parseInt(page, 10)
  
  if (isNaN(parsedPage)) {
    return { isValid: false, error: 'Page must be a number' }
  }

  if (parsedPage < 1) {
    return { isValid: false, error: 'Page must be greater than 0' }
  }

  return { isValid: true, value: parsedPage }
}

export function sanitizeSearchQuery(query: string | null): string | null {
  if (!query) return null
  
  // Remove potentially harmful characters and trim
  const sanitized = query
    .trim()
    .replace(/[<>\"'%;()&+]/g, '') // Remove potentially harmful characters
    .substring(0, 100) // Limit length
  
  return sanitized.length > 0 ? sanitized : null
}

// Pagination helpers
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): ApiResponse['pagination'] {
  const totalPages = Math.ceil(total / limit)
  
  return {
    page,
    limit,
    total,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

export function applyPagination<T>(
  data: T[],
  page: number,
  limit: number
): { paginatedData: T[]; pagination: ApiResponse['pagination'] } {
  const total = data.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  const paginatedData = data.slice(startIndex, endIndex)
  const pagination = calculatePagination(page, limit, total)
  
  return { paginatedData, pagination }
}

// Content validation helpers
export function validateContentLanguage(content: string, language: 'hindi' | 'english' | 'sanskrit'): boolean {
  if (!content || content.trim().length === 0) return false
  
  switch (language) {
    case 'hindi':
      // Check for Devanagari characters
      return /[\u0900-\u097F]/.test(content)
    case 'english':
      // Check for Latin characters
      return /[a-zA-Z]/.test(content)
    case 'sanskrit':
      // Check for Devanagari characters (Sanskrit uses Devanagari script)
      return /[\u0900-\u097F]/.test(content)
    default:
      return false
  }
}

export function validateImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg']
    const pathname = parsedUrl.pathname.toLowerCase()
    
    return validExtensions.some(ext => pathname.endsWith(ext))
  } catch {
    return false
  }
}

export function validateAudioUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const validExtensions = ['.mp3', '.wav', '.ogg', '.m4a']
    const pathname = parsedUrl.pathname.toLowerCase()
    
    return validExtensions.some(ext => pathname.endsWith(ext))
  } catch {
    return false
  }
}