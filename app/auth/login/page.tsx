'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { Eye, EyeOff, LogIn, Mail } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const redirectTo = searchParams.get('redirect') || '/'
  const urlError = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn(email, password)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      router.push(redirectTo)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    
    const result = await signInWithGoogle()
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // For OAuth, the redirect happens automatically
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded grid grid-cols-2 gap-0.5 p-1">
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
            </div>
            <span className="text-white font-medium text-xl">Payper</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Sign in to your PR account</p>
        </div>

        {/* Error Messages */}
        {(error || urlError) && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm">
              {error || (urlError === 'callback_error' ? 'Authentication failed. Please try again.' : urlError)}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-medium"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-black px-2 text-zinc-400">or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          variant="outline"
          className="w-full border-zinc-700 text-white hover:bg-zinc-800 mb-6"
        >
          <Mail className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-zinc-400 text-sm">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-lime-400 hover:text-lime-300">
              Sign up
            </Link>
          </p>
          <Link href="/auth/forgot-password" className="text-zinc-400 hover:text-white text-sm">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}
