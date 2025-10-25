import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let deities
    if (search) {
      deities = await db.searchDeities(search)
    } else {
      deities = await db.getDeities()
    }

    return NextResponse.json(deities)
  } catch (error) {
    console.error('Error fetching deities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deities' },
      { status: 500 }
    )
  }
}