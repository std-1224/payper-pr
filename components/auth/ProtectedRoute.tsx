'use client'

import React from 'react'
import { useAuth, useAuthLoading, useIsAuthenticated } from '@/hooks/use-auth'
import { LoadingSpinner } from './LoadingSpinner'
import { RoleAccessDenied } from './RoleAccessDenied'
import { LoginRequired } from './LoginRequired'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: string | string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requireRole = ['pr', 'master'],
  fallback
}: ProtectedRouteProps) {
  const isLoading = useAuthLoading()
  const isAuthenticated = useIsAuthenticated()
  const { hasRole } = useAuth()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || <LoadingSpinner />
  }

  // If not authenticated, show login required
  if (!isAuthenticated) {
    return <LoginRequired />
  }

  // Check if user has any of the required roles
  const hasRequiredRole = () => {
    if (!requireRole) return true

    if (Array.isArray(requireRole)) {
      return requireRole.some(role => hasRole(role))
    }

    return hasRole(requireRole)
  }

  // If role is required and user doesn't have it, show access denied
  if (requireRole && !hasRequiredRole()) {
    const roleDisplay = Array.isArray(requireRole) ? requireRole.join(' or ') : requireRole
    return <RoleAccessDenied requiredRole={roleDisplay} />
  }

  // User is authenticated and has required role
  return <>{children}</>
}

// Convenience component for PR and Admin routes (default behavior)
export function PRProtectedRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requireRole={['pr', 'master']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

// Convenience component for PR-only routes
export function PROnlyRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requireRole="pr" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

// Convenience component for Admin-only routes
export function AdminOnlyRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requireRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requireRole?: string | string[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requireRole={requireRole}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Higher-order component for PR and Admin pages (default)
export function withPRAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, ['pr', 'master'])
}

// Higher-order component for PR-only pages
export function withPROnlyAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, 'pr')
}

// Higher-order component for Admin-only pages
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return withAuth(Component, 'master')
}
