// Diya Lighting Database Utilities
import { createClient } from '@/lib/supabase';
import type {
  Celebration,
  DiyaLight,
  CelebrationStats,
  UserParticipation,
} from '@/types/database';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Generate a unique shareable link for a celebration
 */
export function generateShareLink(celebrationId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/celebrations/${celebrationId}`;
}

/**
 * Create a new celebration
 */
export async function createCelebration(
  name: string,
  userId: string,
  diyaCount: number = 108
): Promise<{ data: Celebration | null; error: Error | null }> {
  const supabase = createClient();
  const celebrationId = crypto.randomUUID();
  const shareLink = generateShareLink(celebrationId);

  const { data, error } = await supabase
    .from('celebrations')
    .insert({
      id: celebrationId,
      name,
      created_by: userId,
      share_link: shareLink,
      diya_count: diyaCount,
      is_active: true,
    })
    .select()
    .single();

  return {
    data: data as Celebration | null,
    error: error as Error | null,
  };
}

/**
 * Get celebration by ID
 */
export async function getCelebration(
  celebrationId: string
): Promise<{ data: Celebration | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('celebrations')
    .select('*')
    .eq('id', celebrationId)
    .single();

  return {
    data: data as Celebration | null,
    error: error as Error | null,
  };
}

/**
 * Get celebration by share link
 */
export async function getCelebrationByShareLink(
  shareLink: string
): Promise<{ data: Celebration | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('celebrations')
    .select('*')
    .eq('share_link', shareLink)
    .single();

  return {
    data: data as Celebration | null,
    error: error as Error | null,
  };
}

/**
 * Light a diya at a specific position
 */
export async function lightDiya(
  celebrationId: string,
  position: number,
  userName: string,
  userId?: string
): Promise<{ data: DiyaLight | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('diya_lights')
    .insert({
      celebration_id: celebrationId,
      position,
      user_name: userName,
      lit_by: userId || null,
      lit_at: new Date().toISOString(),
    })
    .select()
    .single();

  return {
    data: data as DiyaLight | null,
    error: error as Error | null,
  };
}

/**
 * Get all lit diyas for a celebration
 */
export async function getLitDiyas(
  celebrationId: string
): Promise<{ data: DiyaLight[] | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('diya_lights')
    .select('*')
    .eq('celebration_id', celebrationId)
    .order('lit_at', { ascending: true });

  return {
    data: data as DiyaLight[] | null,
    error: error as Error | null,
  };
}

/**
 * Get celebration statistics
 */
export async function getCelebrationStats(
  celebrationId: string
): Promise<{ data: CelebrationStats | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_celebration_stats', {
    celebration_uuid: celebrationId,
  });

  if (error) {
    return { data: null, error: error as Error };
  }

  return {
    data: data?.[0] as CelebrationStats | null,
    error: null,
  };
}

/**
 * Check if a diya position is available
 */
export async function isDiyaPositionAvailable(
  celebrationId: string,
  position: number
): Promise<{ data: boolean; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('is_diya_position_available', {
    celebration_uuid: celebrationId,
    diya_position: position,
  });

  return {
    data: data as boolean,
    error: error as Error | null,
  };
}

/**
 * Get next available diya position
 */
export async function getNextAvailablePosition(
  celebrationId: string
): Promise<{ data: number | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_next_available_position', {
    celebration_uuid: celebrationId,
  });

  return {
    data: data as number | null,
    error: error as Error | null,
  };
}

/**
 * Get user's participation in a celebration
 */
export async function getUserParticipation(
  celebrationId: string,
  userName: string
): Promise<{ data: UserParticipation[] | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_user_participation', {
    celebration_uuid: celebrationId,
    participant_name: userName,
  });

  return {
    data: data as UserParticipation[] | null,
    error: error as Error | null,
  };
}

/**
 * Subscribe to real-time updates for a celebration
 */
export function subscribeToCelebration(
  celebrationId: string,
  onCelebrationUpdate: (payload: RealtimePostgresChangesPayload<Celebration>) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`celebration:${celebrationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'celebrations',
        filter: `id=eq.${celebrationId}`,
      },
      (payload) => {
        onCelebrationUpdate(payload as RealtimePostgresChangesPayload<Celebration>);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to real-time diya lighting updates
 */
export function subscribeToDiyaLights(
  celebrationId: string,
  onDiyaLit: (payload: RealtimePostgresChangesPayload<DiyaLight>) => void
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase
    .channel(`diya_lights:${celebrationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'diya_lights',
        filter: `celebration_id=eq.${celebrationId}`,
      },
      (payload) => {
        onDiyaLit(payload as RealtimePostgresChangesPayload<DiyaLight>);
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a real-time channel
 */
export async function unsubscribeChannel(
  channel: RealtimeChannel
): Promise<void> {
  const supabase = createClient();
  await supabase.removeChannel(channel);
}

/**
 * Subscribe to all diya lighting updates for a celebration
 * Combines both celebration and diya_lights subscriptions
 */
export function subscribeToFullCelebration(
  celebrationId: string,
  callbacks: {
    onCelebrationUpdate?: (payload: RealtimePostgresChangesPayload<Celebration>) => void;
    onDiyaLit?: (payload: RealtimePostgresChangesPayload<DiyaLight>) => void;
  }
): RealtimeChannel {
  const supabase = createClient();

  const channel = supabase.channel(`full_celebration:${celebrationId}`);

  if (callbacks.onCelebrationUpdate) {
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'celebrations',
        filter: `id=eq.${celebrationId}`,
      },
      (payload) => {
        callbacks.onCelebrationUpdate?.(payload as RealtimePostgresChangesPayload<Celebration>);
      }
    );
  }

  if (callbacks.onDiyaLit) {
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'diya_lights',
        filter: `celebration_id=eq.${celebrationId}`,
      },
      (payload) => {
        callbacks.onDiyaLit?.(payload as RealtimePostgresChangesPayload<DiyaLight>);
      }
    );
  }

  channel.subscribe();

  return channel;
}
