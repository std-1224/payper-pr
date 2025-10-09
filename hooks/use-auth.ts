'use client'

import { useAuth as useAuthContext } from '@/contexts/AuthContext'

// Re-export the useAuth hook for convenience
export const useAuth = useAuthContext

// Additional auth-related hooks
export function useUser() {
  const { session } = useAuthContext()
  return session.user
}

export function useProfile() {
  const { session } = useAuthContext()
  return session.profile
}

export function useIsAuthenticated() {
  const { session } = useAuthContext()
  return !!session.user && !session.isLoading
}

export function useHasRole(role: string) {
  const { hasRole } = useAuthContext()
  return hasRole(role)
}

export function useIsPR() {
  return useHasRole('pr')
}

export function useIsAdmin() {
  return useHasRole('master')
}

export function useIsPROrAdmin() {
  const { hasRole } = useAuthContext()
  return hasRole('pr') || hasRole('master')
}

export function useAuthLoading() {
  const { session } = useAuthContext()
  return session.isLoading
}

export function useAuthError() {
  const { session } = useAuthContext()
  return session.error
}
