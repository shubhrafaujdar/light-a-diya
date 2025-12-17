import { createClient } from './supabase'
import type { Database } from '../types/database'
import { logger } from './logger';

// Type aliases for easier use
type Tables = Database['public']['Tables']
type Deity = Tables['deities']['Row']
type Aarti = Tables['aartis']['Row']
type Celebration = Tables['celebrations']['Row']
type DiyaLight = Tables['diya_lights']['Row']
type User = Tables['users']['Row']
type QuizCategory = Tables['quiz_categories']['Row']
type QuizQuestion = Tables['quiz_questions']['Row']
type QuizAttempt = Tables['quiz_attempts']['Row']
type UserScriptureProgress = Tables['user_scripture_progress']['Row']

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
    if (!query || query.trim().length === 0) {
      return this.getDeities()
    }

    const sanitizedQuery = query.trim().toLowerCase()

    const { data, error } = await this.supabase
      .from('deities')
      .select('*')
      .or(`name_english.ilike.% ${sanitizedQuery}%, name_hindi.ilike.% ${sanitizedQuery}%, category.ilike.% ${sanitizedQuery}% `)
      .order('name_english')

    if (error) throw error
    return data || []
  }

  async searchAartis(query: string): Promise<Aarti[]> {
    if (!query || query.trim().length === 0) {
      return this.getAartis()
    }

    const sanitizedQuery = query.trim().toLowerCase()

    const { data, error } = await this.supabase
      .from('aartis')
      .select('*')
      .or(`title_english.ilike.% ${sanitizedQuery}%, title_hindi.ilike.% ${sanitizedQuery}% `)
      .order('title_english')

    if (error) throw error
    return data || []
  }

  async searchAartisWithDeities(query: string): Promise<(Aarti & { deity: Deity })[]> {
    if (!query || query.trim().length === 0) {
      return this.getAartisWithDeities()
    }

    const sanitizedQuery = query.trim().toLowerCase()

    const { data, error } = await this.supabase
      .from('aartis')
      .select(`
  *,
  deity: deities(*)
      `)
      .or(`title_english.ilike.% ${sanitizedQuery}%, title_hindi.ilike.% ${sanitizedQuery}% `)
      .order('title_english')

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
  deity: deities(*)
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

  // Quiz operations
  async getQuizCategories(): Promise<QuizCategory[]> {
    const { data, error } = await this.supabase
      .from('quiz_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error
    return data || []
  }

  async getQuizCategoryById(id: string): Promise<QuizCategory | null> {
    const { data, error } = await this.supabase
      .from('quiz_categories')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  }

  async getQuizQuestionsByCategory(categoryId: string): Promise<QuizQuestion[]> {
    const { data, error } = await this.supabase
      .from('quiz_questions')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error
    return data || []
  }

  async submitQuizAttempt(attempt: Tables['quiz_attempts']['Insert']): Promise<QuizAttempt> {
    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .insert(attempt)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Scripture Progress operations
  async getScriptureProgress(userId: string, scriptureSlug: string): Promise<UserScriptureProgress | null> {
    const { data, error } = await this.supabase
      .from('user_scripture_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('scripture_slug', scriptureSlug)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async upsertScriptureProgress(progress: Tables['user_scripture_progress']['Insert']): Promise<UserScriptureProgress> {
    const { data, error } = await this.supabase
      .from('user_scripture_progress')
      .upsert(progress)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getLeaderboard(
    categoryId: string,
    limit: number = 10,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time'
  ): Promise<QuizAttempt[]> {
    let query = this.supabase
      .from('quiz_attempts')
      .select('*')
      .eq('category_id', categoryId)

    // Apply time filters
    const now = new Date();
    let startDate: Date | null = null;

    if (timeframe === 'daily') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeframe === 'weekly') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    const { data, error } = await query
      .order('score', { ascending: false })
      .order('time_taken_seconds', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Real-time subscriptions
  subscribeToDiyaLights(celebrationId: string, callback: (payload: { new: DiyaLight }) => void) {
    return this.supabase
      .channel(`diya_lights:${celebrationId} `)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'diya_lights',
          filter: `celebration_id = eq.${celebrationId} `
        },
        callback
      )
      .subscribe()
  }

  // Content validation methods
  validateDeityData(deity: Partial<Tables['deities']['Insert']>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!deity.name_hindi || deity.name_hindi.trim().length === 0) {
      errors.push('Hindi name is required')
    }

    if (!deity.name_english || deity.name_english.trim().length === 0) {
      errors.push('English name is required')
    }

    if (!deity.image_url || deity.image_url.trim().length === 0) {
      errors.push('Image URL is required')
    } else if (!this.isValidUrl(deity.image_url)) {
      errors.push('Image URL must be a valid URL')
    }

    if (!deity.category || deity.category.trim().length === 0) {
      errors.push('Category is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validateAartiData(aarti: Partial<Tables['aartis']['Insert']>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!aarti.deity_id || aarti.deity_id.trim().length === 0) {
      errors.push('Deity ID is required')
    }

    if (!aarti.title_hindi || aarti.title_hindi.trim().length === 0) {
      errors.push('Hindi title is required')
    }

    if (!aarti.title_english || aarti.title_english.trim().length === 0) {
      errors.push('English title is required')
    }

    if (!aarti.content_sanskrit || aarti.content_sanskrit.trim().length === 0) {
      errors.push('Sanskrit content is required')
    }

    if (!aarti.content_hindi || aarti.content_hindi.trim().length === 0) {
      errors.push('Hindi content is required')
    }

    if (!aarti.content_english || aarti.content_english.trim().length === 0) {
      errors.push('English content is required')
    }

    if (!aarti.transliteration || aarti.transliteration.trim().length === 0) {
      errors.push('Transliteration is required')
    }

    if (aarti.audio_url && !this.isValidUrl(aarti.audio_url)) {
      errors.push('Audio URL must be a valid URL')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Enhanced error handling methods
  handleDatabaseError(error: unknown): { message: string; code?: string; status: number } {
    logger.error({ error }, 'Database error');

    // Type guard to check if error has expected properties
    const isErrorWithCode = (err: unknown): err is { code: string; message?: string } => {
      return typeof err === 'object' && err !== null && 'code' in err
    }

    const isErrorWithMessage = (err: unknown): err is { message: string } => {
      return typeof err === 'object' && err !== null && 'message' in err
    }

    // Handle specific Supabase/PostgreSQL errors
    if (isErrorWithCode(error)) {
      if (error.code === 'PGRST116') {
        return {
          message: 'Resource not found',
          code: 'NOT_FOUND',
          status: 404
        }
      }

      if (error.code === '23505') {
        return {
          message: 'Resource already exists',
          code: 'DUPLICATE',
          status: 409
        }
      }

      if (error.code === '23503') {
        return {
          message: 'Referenced resource does not exist',
          code: 'FOREIGN_KEY_VIOLATION',
          status: 400
        }
      }

      if (error.code === '42P01') {
        return {
          message: 'Database table not found',
          code: 'TABLE_NOT_FOUND',
          status: 500
        }
      }
    }

    // Handle network/connection errors
    if (isErrorWithMessage(error) && error.message.includes('fetch')) {
      return {
        message: 'Database connection failed',
        code: 'CONNECTION_ERROR',
        status: 503
      }
    }

    // Default error
    return {
      message: 'An unexpected database error occurred',
      code: 'INTERNAL_ERROR',
      status: 500
    }
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
export type { Deity, Aarti, Celebration, DiyaLight, User, QuizCategory, QuizQuestion, QuizAttempt, UserScriptureProgress }