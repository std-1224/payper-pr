'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus } from 'lucide-react'

export function LoginRequired() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
          <p className="text-zinc-400 mb-6">
            Please sign in to access the Payper PR application.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-medium"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          
          <Button 
            onClick={() => router.push('/auth/signup')}
            variant="outline"
            className="w-full border-zinc-700 text-white hover:bg-zinc-800"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        </div>
      </div>
    </div>
  )
}
