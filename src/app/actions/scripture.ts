'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { db } from '@/lib/database';
import { UserScriptureProgress } from '@/types/database';

export async function saveScriptureProgress(
    scriptureSlug: string,
    progress: {
        currentChapter: number;
        currentVerse: number;
        dailyGoal: number;
        versesReadToday: number;
        lastReadDate: string;
    }
) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        const data: UserScriptureProgress = await db.upsertScriptureProgress({
            user_id: user.id,
            scripture_slug: scriptureSlug,
            current_chapter: progress.currentChapter,
            current_verse: progress.currentVerse,
            daily_goal: progress.dailyGoal,
            verses_read_today: progress.versesReadToday,
            last_read_date: progress.lastReadDate,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Failed to save progress:', error);
        return { success: false, error: 'Failed to save progress' };
    }
}

export async function getScriptureProgress(scriptureSlug: string) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: true, data: null };
    }

    try {
        const data = await db.getScriptureProgress(user.id, scriptureSlug);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to get progress:', error);
        return { success: false, error: 'Failed to get progress' };
    }
}

export async function getVerseContent(chapter: number, verse: number) {
    try {
        // Dynamic import of JSON data
        // Note: The path must be relative or alias that Webpack can resolve statically 
        // to include the files in the bundle.
        // We use the alias '@' which points to 'src'
        const verseData = await import(`@/data/gita/chapter-${chapter}/${chapter}-${verse}.json`);

        // The module default export is the JSON content
        return { success: true, data: verseData.default };
    } catch (error) {
        console.error(`Failed to load verse ${chapter}-${verse}:`, error);
        return { success: false, error: 'Verse not found' };
    }
}
