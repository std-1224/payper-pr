"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function HomePage() {
  const { user, hasRequiredRole, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      // No user, redirect to auth
      router.push('/auth')
    } else if (hasRequiredRole()) {
      // User has proper role, redirect to menu
      router.push('/menu')
    } else {
      // User doesn't have proper role, redirect to role access page
      router.push('/role-access')
    }
  }, [user, hasRequiredRole, isLoading, router])

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

  return null
}