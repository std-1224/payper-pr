'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type AuthSession, type Profile, type User } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  session: AuthSession
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>
  signInWithGoogle: () => Promise<{ error?: string }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    profile: null,
    isLoading: true,
    error: null
  })

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const updateSession = async (supabaseSession: Session | null) => {
    if (supabaseSession?.user) {
      const profile = await fetchProfile(supabaseSession.user.id)
      setSession({
        user: supabaseSession.user,
        profile,
        isLoading: false,
        error: null
      })
    } else {
      setSession({
        user: null,
        profile: null,
        isLoading: false,
        error: null
      })
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSession(session)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      updateSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setSession(prev => ({ ...prev, isLoading: false, error: error.message }))
        return { error: error.message }
      }

      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSession(prev => ({ ...prev, isLoading: false, error: errorMessage }))
      return { error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      })

      if (error) {
        setSession(prev => ({ ...prev, isLoading: false, error: error.message }))
        return { error: error.message }
      }

      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSession(prev => ({ ...prev, isLoading: false, error: errorMessage }))
      return { error: errorMessage }
    }
  }

  const signInWithGoogle = async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setSession(prev => ({ ...prev, isLoading: false, error: error.message }))
        return { error: error.message }
      }

      return {}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSession(prev => ({ ...prev, isLoading: false, error: errorMessage }))
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setSession(prev => ({ ...prev, isLoading: true }))
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshProfile = async () => {
    if (session.user) {
      const profile = await fetchProfile(session.user.id)
      setSession(prev => ({ ...prev, profile }))
    }
  }

  const hasRole = (role: string): boolean => {
    return session.profile?.role === role
  }

  const value: AuthContextType = {
    session,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshProfile,
    hasRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
