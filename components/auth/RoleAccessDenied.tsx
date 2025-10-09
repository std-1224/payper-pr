'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { ShieldX, LogOut } from 'lucide-react'

interface RoleAccessDeniedProps {
  requiredRole: string
}

export function RoleAccessDenied({ requiredRole }: RoleAccessDeniedProps) {
  const { signOut, session } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ShieldX className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Restricted</h1>
          <p className="text-zinc-400 mb-4">
            You need {requiredRole.includes(' or ') ? 'one of these roles' : 'the'} <span className="text-lime-400 font-medium">"{requiredRole}"</span> {requiredRole.includes(' or ') ? '' : 'role'} to access this application.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-zinc-300 mb-2">Current user:</p>
            <p className="text-white font-medium">{session.user?.email}</p>
            {session.profile?.role && (
              <p className="text-sm text-zinc-400 mt-1">
                Role: <span className="text-orange-400">{session.profile.role}</span>
              </p>
            )}
          </div>
          <p className="text-sm text-zinc-500 mb-6">
            Please contact your administrator to request access or sign in with an account that has the required permissions.
          </p>
        </div>
        
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-zinc-700 text-white hover:bg-zinc-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
