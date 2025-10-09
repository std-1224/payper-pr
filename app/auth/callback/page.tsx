"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error in auth callback:', error)
          router.push('/auth?error=callback_error')
          return
        }

        if (data.session) {
          // User is authenticated, redirect to menu
          router.push('/menu')
        } else {
          // No session, redirect to auth
          router.push('/auth')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        router.push('/auth?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

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
          <p>Completing sign in...</p>
        </div>
      </div>
    </div>
  )
}
