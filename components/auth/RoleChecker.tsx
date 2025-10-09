'use client'

import React from 'react'
import { useAuth } from '@/hooks/use-auth'

interface RoleCheckerProps {
  role: string
  children: React.ReactNode
  fallback?: React.ReactNode
  inverse?: boolean // Show children when user DOESN'T have the role
}

export function RoleChecker({ 
  role, 
  children, 
  fallback = null, 
  inverse = false 
}: RoleCheckerProps) {
  const { hasRole } = useAuth()
  const userHasRole = hasRole(role)
  
  const shouldShow = inverse ? !userHasRole : userHasRole
  
  return shouldShow ? <>{children}</> : <>{fallback}</>
}

// Convenience components for common roles
export function PROnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleChecker role="pr" fallback={fallback}>
      {children}
    </RoleChecker>
  )
}

export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleChecker role="admin" fallback={fallback}>
      {children}
    </RoleChecker>
  )
}

// Component for PR or Admin access
export function PROrAdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { hasRole } = useAuth()
  const hasAccess = hasRole('pr') || hasRole('master')

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

export function NonPROnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleChecker role="pr" inverse fallback={fallback}>
      {children}
    </RoleChecker>
  )
}

// Hook for conditional rendering based on roles
export function useRoleBasedContent() {
  const { hasRole, session } = useAuth()

  return {
    hasRole,
    isPR: hasRole('pr'),
    isAdmin: hasRole('master'),
    isPROrAdmin: hasRole('pr') || hasRole('master'),
    isAuthenticated: !!session.user,
    userRole: session.profile?.role,
    renderForRole: (role: string, content: React.ReactNode, fallback?: React.ReactNode) =>
      hasRole(role) ? content : fallback,
    renderForRoles: (roles: string[], content: React.ReactNode, fallback?: React.ReactNode) =>
      roles.some(role => hasRole(role)) ? content : fallback
  }
}
