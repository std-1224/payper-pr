'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'
import { useRealtimeConnection } from './use-realtime-connection'

// Query key factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

// Fetch products from Supabase
async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('id', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return data || []
}

// Hook to get all active products
export function useProducts() {
  const queryClient = useQueryClient()
  const { isConnected } = useRealtimeConnection()

  const query = useQuery({
    queryKey: productKeys.lists(),
    queryFn: fetchProducts,
    staleTime: 1000 * 30, // 30 seconds (tables change frequently and we want fresh data)
    refetchInterval: false, // Disable polling since we use real-time
  })

  // Set up real-time subscription with reconnection logic
  useEffect(() => {
    let channel: any = null
    let reconnectTimeout: NodeJS.Timeout | null = null

    const setupSubscription = () => {
      // Only setup subscription if connected
      if (!isConnected) {
        return
      }

      // Clean up existing channel if any
      if (channel) {
        supabase.removeChannel(channel)
      }

      channel = supabase
        .channel('products-changes', {
          config: {
            presence: {
              key: 'products-subscription'
            }
          }
        })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
          },
          async (payload) => {
            console.log('Products change received:', payload)

            if (payload.eventType === 'INSERT' && payload.new) {
              // For inserts, add the new product to the cache if it's active
              const newProduct = payload.new as Product
              if (newProduct.is_active && !newProduct.deleted_at) {
                queryClient.setQueryData(productKeys.lists(), (oldData: Product[] | undefined) => {
                  if (!oldData) return [newProduct]
                  return [...oldData, newProduct].sort((a, b) => a.name.localeCompare(b.name))
                })
              }
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              // For updates, update the product in the cache
              const updatedProduct = payload.new as Product
              queryClient.setQueryData(productKeys.lists(), (oldData: Product[] | undefined) => {
                if (!oldData) return oldData

                // If product is no longer active or is deleted, remove it
                if (!updatedProduct.is_active || updatedProduct.deleted_at) {
                  return oldData.filter(product => product.id !== updatedProduct.id)
                }

                // Otherwise update it
                const index = oldData.findIndex(product => product.id === updatedProduct.id)
                if (index >= 0) {
                  const newData = [...oldData]
                  newData[index] = updatedProduct
                  return newData.sort((a, b) => a.name.localeCompare(b.name))
                } else {
                  // Product wasn't in cache but is now active, add it
                  return [...oldData, updatedProduct].sort((a, b) => a.name.localeCompare(b.name))
                }
              })
            } else if (payload.eventType === 'DELETE' && payload.old) {
              // For deletes, remove the product from the cache
              const deletedProduct = payload.old as Product
              queryClient.setQueryData(productKeys.lists(), (oldData: Product[] | undefined) => {
                if (!oldData) return oldData
                return oldData.filter(product => product.id !== deletedProduct.id)
              })
            }

            // Also invalidate and refetch as backup
            await queryClient.invalidateQueries({
              queryKey: productKeys.lists(),
              exact: false,
              refetchType: 'active'
            })
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Products subscription active')
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.warn('Products subscription error, attempting to reconnect...')
            // Attempt to reconnect after a delay
            reconnectTimeout = setTimeout(() => {
              setupSubscription()
            }, 2000)
          }
        })
    }

    // Initial setup
    setupSubscription()

    // Handle visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refetch data when tab becomes visible
        queryClient.invalidateQueries({ queryKey: productKeys.lists() })

        // Ensure subscription is active
        if (channel && channel.state !== 'joined') {
          setupSubscription()
        }
      }
    }

    // Handle online/offline events
    const handleOnline = () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      setupSubscription()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (channel) {
        supabase.removeChannel(channel)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('online', handleOnline)
    }
  }, [queryClient, isConnected]) // Re-run when connection status changes

  return query
}

// Hook to get products by category
export function useProductsByCategory(category?: string) {
  const { data: products, ...rest } = useProducts()

  const filteredProducts = products?.filter((product) => {
    if (!category || category === 'all') return true
    return product.category === category
  })

  return {
    data: filteredProducts,
    ...rest,
  }
}

// Hook to get a single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Failed to fetch product: ${error.message}`)
      }

      return data as Product
    },
    enabled: !!id,
  })
}

// Mutation to update product stock
export function useUpdateProductStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      stock,
    }: {
      productId: string
      stock: number
    }) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          stock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update product stock: ${error.message}`)
      }

      return data as Product
    },
    onSuccess: () => {
      // Invalidate products queries to refetch data
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}
