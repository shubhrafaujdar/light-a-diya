import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deity = await db.getDeityById(params.id)
    
    if (!deity) {
      return NextResponse.json(
        { error: 'Deity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(deity)
  } catch (error) {
    console.error('Error fetching deity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deity' },
      { status: 500 }
    )
  }
}