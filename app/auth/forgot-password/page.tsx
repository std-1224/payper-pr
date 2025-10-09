'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthService } from '@/lib/auth-service'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await AuthService.resetPassword(email)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-zinc-400 mb-6">
              We've sent a password reset link to <span className="text-white">{email}</span>
            </p>
            <p className="text-sm text-zinc-500 mb-8">
              If you don't see the email, check your spam folder or try again with a different email address.
            </p>
          </div>
          
          <Link href="/auth/login">
            <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-zinc-400">Enter your email to receive a reset link</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="email" className="text-white">Email Address</Label>
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-medium"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            Send Reset Link
          </Button>
        </form>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/auth/login" className="text-zinc-400 hover:text-white text-sm inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
