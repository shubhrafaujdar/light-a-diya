import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const deityId = searchParams.get('deity_id')
    const withDeities = searchParams.get('with_deities') === 'true'

    let aartis
    if (deityId) {
      aartis = await db.getAartisByDeity(deityId)
    } else if (withDeities) {
      aartis = await db.getAartisWithDeities()
    } else {
      aartis = await db.getAartis()
    }

    return NextResponse.json(aartis)
  } catch (error) {
    console.error('Error fetching aartis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch aartis' },
      { status: 500 }
    )
  }
}