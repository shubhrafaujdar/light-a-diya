import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      });
    }

    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        message: 'No session found' 
      });
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    const user = userProfile ? {
      id: userProfile.id,
      email: userProfile.email,
      displayName: userProfile.display_name,
      preferredLanguage: userProfile.preferred_language,
    } : {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.user_metadata?.full_name || 
                   session.user.email?.split('@')[0] || 
                   'User',
      preferredLanguage: 'english',
    };

    return NextResponse.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}