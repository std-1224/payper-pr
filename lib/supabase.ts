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

// Database types for the products table
export interface Product {
  id: string
  name: string
  description: string | null
  category: string | null
  stock: number
  image_url: string | null
  created_at: string
  updated_at: string
  purchase_price: number | null
  sale_price: number
  is_active: boolean
  is_pr: boolean
  is_courtesy: boolean
  type: string | null
  has_recipe: boolean
  recipe_id: string | null
  ingredient_id: string | null
  deleted_at: string | null
}

// Database types for the tables table
export interface Table {
  id: string
  venue_id: string | null
  table_number: number
  capacity: number | null
  current_guest: number
  status: 'free' | 'occupied' | 'waiting_order' | 'producing' | 'delivered' | 'bill_requested' | 'paid'
  assigned_waiter: string | null
  created_at: string
  updated_at: string
  extra_balance: number | null
  description?: string | null
}

// Table status type for better type safety
export type TableStatus = 'free' | 'occupied' | 'waiting_order' | 'producing' | 'delivered' | 'bill_requested' | 'paid'

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
