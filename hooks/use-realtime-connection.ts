'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeConnection() {
  const [isConnected, setIsConnected] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<string>('CONNECTING')

  useEffect(() => {
    // Monitor Supabase connection status
    const checkConnection = () => {
      // Check if we can reach Supabase
      supabase.auth.getSession().then(({ error }) => {
        if (error) {
          console.warn('Supabase connection issue:', error)
          setIsConnected(false)
        } else {
          setIsConnected(true)
        }
      }).catch(() => {
        setIsConnected(false)
      })
    }

    // Initial check
    checkConnection()

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkConnection()
      }
    }

    // Handle online/offline
    const handleOnline = () => {
      console.log('🌐 Connection restored')
      setIsConnected(true)
      checkConnection()
    }

    const handleOffline = () => {
      console.log('📴 Connection lost')
      setIsConnected(false)
      setConnectionStatus('OFFLINE')
    }

    // Handle page focus (additional safety)
    const handleFocus = () => {
      console.log('👁️ Window focused, checking connection...')
      checkConnection()
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('focus', handleFocus)

    // Periodic connection check (every 30 seconds when tab is visible)
    const connectionInterval = setInterval(() => {
      if (!document.hidden) {
        checkConnection()
      }
    }, 30000)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('focus', handleFocus)
      clearInterval(connectionInterval)
    }
  }, [])

  return {
    isConnected,
    connectionStatus,
  }
}
