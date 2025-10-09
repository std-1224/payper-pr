import { supabase } from './supabase'
import type { Profile } from './supabase'

export interface AuthResult {
  success: boolean
  error?: string
  data?: any
}

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp(email: string, password: string, name?: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name?.trim()
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // If user needs to confirm email
      if (data.user && !data.session) {
        return {
          success: true,
          data,
          error: 'Please check your email to confirm your account'
        }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Sign in with Google OAuth
   */
  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: session }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: user }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Fetch user profile from profiles table
   */
  static async fetchProfile(userId: string): Promise<AuthResult & { data?: Profile }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Create or update user profile
   */
  static async upsertProfile(profile: Partial<Profile>): Promise<AuthResult> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Check if user has specific role
   */
  static async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const result = await this.fetchProfile(userId)
      return result.success && result.data?.role === role
    } catch (error) {
      console.error('Error checking user role:', error)
      return false
    }
  }

  /**
   * Check if user has any of the specified roles
   */
  static async hasAnyRole(userId: string, roles: string[]): Promise<boolean> {
    try {
      const result = await this.fetchProfile(userId)
      return result.success && roles.includes(result.data?.role || '')
    } catch (error) {
      console.error('Error checking user roles:', error)
      return false
    }
  }

  /**
   * Check if user is PR or Admin
   */
  static async isPROrAdmin(userId: string): Promise<boolean> {
    return this.hasAnyRole(userId, ['pr', 'master'])
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }
  }
}
