"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, LogOut, Mail, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function RoleAccessPage() {
  const { user, profile, signOut, hasRequiredRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/auth')
      return
    }

    // Redirect if user has proper role
    if (hasRequiredRole()) {
      router.push('/menu')
      return
    }
  }, [user, hasRequiredRole, router])

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded grid grid-cols-2 gap-0.5 p-1">
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
              <div className="bg-black rounded-sm"></div>
            </div>
            <span className="text-white font-bold text-2xl">Payper</span>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <CardTitle className="text-white">Access Restricted</CardTitle>
            <CardDescription className="text-zinc-400">
              You don't have permission to access this section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">
                    {profile.name || user.user_metadata?.full_name || 'User'}
                  </h3>
                  <p className="text-zinc-400 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Current Role:</span>
                  <Badge 
                    variant="outline" 
                    className="border-zinc-600 text-zinc-300"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.role?.toUpperCase() || 'USER'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Status:</span>
                  <Badge 
                    variant="outline" 
                    className="border-red-600 text-red-400"
                  >
                    Unauthorized
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Required Roles:</span>
                  <div className="flex gap-1">
                    <Badge className="bg-lime-400 text-black text-xs">PR</Badge>
                    <Badge className="bg-orange-400 text-black text-xs">MASTER</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Information */}
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-lime-400" />
                Access Requirements
              </h4>
              <div className="space-y-2 text-sm text-zinc-400">
                <p>• You need either <strong className="text-lime-400">PR</strong> or <strong className="text-orange-400">MASTER</strong> role</p>
                <p>• Contact your administrator to request access</p>
                <p>• Your current role: <strong className="text-zinc-300">{profile.role?.toUpperCase() || 'USER'}</strong></p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Need Access?
              </h4>
              <p className="text-sm text-zinc-400 mb-3">
                Contact your system administrator to request the appropriate role permissions.
              </p>
              <Button
                variant="outline"
                className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                onClick={() => {
                  const subject = encodeURIComponent('Access Request - Payper App')
                  const body = encodeURIComponent(`Hello,

I am requesting access to the Payper PR Management application.

Current Details:
- Email: ${user.email}
- Name: ${profile.name || user.user_metadata?.full_name || 'Not provided'}
- Current Role: ${profile.role || 'USER'}

Please grant me the appropriate permissions to access the application.

Thank you.`)
                  window.open(`mailto:admin@payper.app?subject=${subject}&body=${body}`)
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Administrator
              </Button>
            </div>

            {/* Sign Out Button */}
            <Button
              onClick={signOut}
              variant="outline"
              className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
