'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface MenuState {
  // Category selection
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  
  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  // Error states
  error: string | null
  setError: (error: string | null) => void
  clearError: () => void
  
  // Search/filter state
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // UI state
  isRefreshing: boolean
  setIsRefreshing: (refreshing: boolean) => void
  
  // Reset all state
  reset: () => void
}

const initialState = {
  selectedCategory: 'all',
  isLoading: false,
  error: null,
  searchQuery: '',
  isRefreshing: false,
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category }, false, 'setSelectedCategory')
      },
      
      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, 'setIsLoading')
      },
      
      setError: (error: string | null) => {
        set({ error }, false, 'setError')
      },
      
      clearError: () => {
        set({ error: null }, false, 'clearError')
      },
      
      setSearchQuery: (query: string) => {
        set({ searchQuery: query }, false, 'setSearchQuery')
      },
      
      setIsRefreshing: (refreshing: boolean) => {
        set({ isRefreshing: refreshing }, false, 'setIsRefreshing')
      },
      
      reset: () => {
        set(initialState, false, 'reset')
      },
    }),
    {
      name: 'menu-store',
    }
  )
)
