import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for the profiles table
export interface Profile {
  id: string
  email: string
  role: string
  created_at: string
  updated_at: string
  name: string | null
  status: string | null
  spent: number | null
  phone: string | null
  balance: number | null
  address: string | null
  table_id: string | null
  qr_id: string | null
  sector_id: string | null
  approval_stati: string | null
}

export interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export interface AuthSession {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  error: string | null
}
