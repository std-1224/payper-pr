"use client"

import { useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requireRole?: boolean
  fallbackPath?: string
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireRole = true,
  fallbackPath = "/auth"
}: ProtectedRouteProps) => {
  const { user, profile, isLoading, hasRequiredRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return

    // If authentication is required but user is not authenticated
    if (requireAuth && !user) {
      router.push(fallbackPath)
      return
    }

    // If user is authenticated but role check is required
    if (requireAuth && requireRole && user) {
      if (!hasRequiredRole()) {
        router.push('/role-access')
        return
      }
    }
  }, [user, profile, isLoading, hasRequiredRole, requireAuth, requireRole, router, fallbackPath])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded grid grid-cols-2 gap-0.5 p-1">
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
            </div>
            <span className="text-white font-bold text-2xl">Payper</span>
          </div>
          <div className="text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null
  }

  // If role is required but user doesn't have proper role, don't render children
  if (requireAuth && requireRole && user && !hasRequiredRole()) {
    return null
  }

  // Render children if all checks pass
  return <>{children}</>
}
