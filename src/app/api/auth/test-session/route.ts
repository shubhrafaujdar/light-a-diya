import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    return NextResponse.json({
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      error: error?.message,
      cookies: request.headers.get('cookie'),
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}