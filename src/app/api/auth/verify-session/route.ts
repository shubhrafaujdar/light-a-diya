import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      });
    }

    if (!authUser) {
      return NextResponse.json({
        success: false,
        message: 'No session found'
      });
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    const user = userProfile ? {
      id: userProfile.id,
      email: userProfile.email,
      displayName: userProfile.display_name,
      preferredLanguage: userProfile.preferred_language,
    } : {
      id: authUser.id,
      email: authUser.email,
      displayName: authUser.user_metadata?.full_name ||
        authUser.email?.split('@')[0] ||
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