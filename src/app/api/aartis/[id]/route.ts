import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const aarti = await db.getAartiById(params.id)
    
    if (!aarti) {
      return NextResponse.json(
        { error: 'Aarti not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(aarti)
  } catch (error) {
    console.error('Error fetching aarti:', error)
    return NextResponse.json(
      { error: 'Failed to fetch aarti' },
      { status: 500 }
    )
  }
}