'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIsAuthenticated, useAuthLoading } from '@/hooks/use-auth'
import { LoadingSpinner } from './LoadingSpinner'

interface AuthRedirectProps {
  children: React.ReactNode
  redirectTo?: string
  redirectIfAuthenticated?: boolean
}

/**
 * Component that redirects authenticated users away from auth pages
 * and unauthenticated users to auth pages
 */
export function AuthRedirect({
  children,
  redirectTo = '/',
  redirectIfAuthenticated = true
}: AuthRedirectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()

  useEffect(() => {
    if (!isLoading && redirectIfAuthenticated && isAuthenticated) {
      // Check if there's a redirect parameter in the URL
      const redirectParam = searchParams.get('redirect')
      const finalRedirectTo = redirectParam || redirectTo
      router.replace(finalRedirectTo)
    }
  }, [isAuthenticated, isLoading, redirectIfAuthenticated, redirectTo, router, searchParams])

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />
  }

  // If user is authenticated and we should redirect, show loading
  // (the redirect will happen via useEffect)
  if (redirectIfAuthenticated && isAuthenticated) {
    return <LoadingSpinner />
  }

  return <>{children}</>
}

/**
 * Wrapper for auth pages that redirects authenticated users to the main app
 */
export function AuthPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthRedirect redirectIfAuthenticated={true} redirectTo="/">
      {children}
    </AuthRedirect>
  )
}

/**
 * Wrapper for protected pages that redirects unauthenticated users to login
 */
export function ProtectedPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthRedirect redirectIfAuthenticated={false} redirectTo="/auth/login">
      {children}
    </AuthRedirect>
  )
}
