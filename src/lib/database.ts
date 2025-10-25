import { createClient } from './supabase'
import type { Database } from '../types/database'

// Type aliases for easier use
type Tables = Database['public']['Tables']
type Deity = Tables['deities']['Row']
type Aarti = Tables['aartis']['Row']
type Celebration = Tables['celebrations']['Row']
type DiyaLight = Tables['diya_lights']['Row']
type User = Tables['users']['Row']

export class DatabaseService {
  private supabase = createClient()

  // Deity operations
  async getDeities(): Promise<Deity[]> {
    const { data, error } = await this.supabase
      .from('deities')
      .select('*')
      .order('name_english')

    if (error) throw error
    return data || []
  }

  async getDeityById(id: string): Promise<Deity | null> {
    const { data, error } = await this.supabase
      .from('deities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async searchDeities(query: string): Promise<Deity[]> {
    const { data, error } = await this.supabase
      .from('deities')
      .select('*')
      .or(`name_english.ilike.%${query}%,name_hindi.ilike.%${query}%`)
      .order('name_english')

    if (error) throw error
    return data || []
  }

  // Aarti operations
  async getAartis(): Promise<Aarti[]> {
    const { data, error } = await this.supabase
      .from('aartis')
      .select('*')
      .order('title_english')

    if (error) throw error
    return data || []
  }

  async getAartisByDeity(deityId: string): Promise<Aarti[]> {
    const { data, error } = await this.supabase
      .from('aartis')
      .select('*')
      .eq('deity_id', deityId)
      .order('title_english')

    if (error) throw error
    return data || []
  }

  async getAartiById(id: string): Promise<Aarti | null> {
    const { data, error } = await this.supabase
      .from('aartis')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Get aartis with deity information
  async getAartisWithDeities(): Promise<(Aarti & { deity: Deity })[]> {
    const { data, error } = await this.supabase
      .from('aartis')
      .select(`
        *,
        deity:deities(*)
      `)
      .order('title_english')

    if (error) throw error
    return data || []
  }

  // User operations
  async createUser(user: Tables['users']['Insert']): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateUser(id: string, updates: Tables['users']['Update']): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Celebration operations
  async createCelebration(celebration: Tables['celebrations']['Insert']): Promise<Celebration> {
    const { data, error } = await this.supabase
      .from('celebrations')
      .insert(celebration)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getCelebrationByShareLink(shareLink: string): Promise<Celebration | null> {
    const { data, error } = await this.supabase
      .from('celebrations')
      .select('*')
      .eq('share_link', shareLink)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  }

  async getCelebrationById(id: string): Promise<Celebration | null> {
    const { data, error } = await this.supabase
      .from('celebrations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Diya light operations
  async lightDiya(diyaLight: Tables['diya_lights']['Insert']): Promise<DiyaLight> {
    const { data, error } = await this.supabase
      .from('diya_lights')
      .insert(diyaLight)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getDiyaLights(celebrationId: string): Promise<DiyaLight[]> {
    const { data, error } = await this.supabase
      .from('diya_lights')
      .select('*')
      .eq('celebration_id', celebrationId)
      .order('position')

    if (error) throw error
    return data || []
  }

  async getCelebrationStats(celebrationId: string): Promise<{
    totalDiyas: number
    litDiyas: number
    participants: string[]
  }> {
    const celebration = await this.getCelebrationById(celebrationId)
    if (!celebration) throw new Error('Celebration not found')

    const diyaLights = await this.getDiyaLights(celebrationId)
    
    const participants = [...new Set(diyaLights.map(dl => dl.user_name))]

    return {
      totalDiyas: celebration.diya_count,
      litDiyas: diyaLights.length,
      participants
    }
  }

  // Real-time subscriptions
  subscribeToDiyaLights(celebrationId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`diya_lights:${celebrationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'diya_lights',
          filter: `celebration_id=eq.${celebrationId}`
        },
        callback
      )
      .subscribe()
  }

  // Utility methods
  async checkDiyaPosition(celebrationId: string, position: number): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('diya_lights')
      .select('id')
      .eq('celebration_id', celebrationId)
      .eq('position', position)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Export types for use in components
export type { Deity, Aarti, Celebration, DiyaLight, User }