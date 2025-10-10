'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase, Table, TableStatus } from '@/lib/supabase'
import { useRealtimeConnection } from './use-realtime-connection'

// Query key factory
export const tableKeys = {
  all: ['tables'] as const,
  lists: () => [...tableKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...tableKeys.lists(), { filters }] as const,
  details: () => [...tableKeys.all, 'detail'] as const,
  detail: (id: string) => [...tableKeys.details(), id] as const,
}

// Fetch tables from Supabase
async function fetchTables(): Promise<Table[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('table_number', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch tables: ${error.message}`)
  }

  return data || []
}

// Hook to get all tables
export function useTables() {
  const queryClient = useQueryClient()
  const { isConnected } = useRealtimeConnection()

  const query = useQuery({
    queryKey: tableKeys.lists(),
    queryFn: fetchTables,
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
        .channel('tables-changes', {
          config: {
            presence: {
              key: 'tables-subscription'
            }
          }
        })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tables',
          },
          async (payload) => {

            // Handle different types of changes
            if (payload.eventType === 'UPDATE' && payload.new) {
              // For updates, immediately update the cache with the new data
              const updatedTable = payload.new as Table
              queryClient.setQueryData(tableKeys.lists(), (oldData: Table[] | undefined) => {
                if (!oldData) return oldData
                return oldData.map(table =>
                  table.id === updatedTable.id ? updatedTable : table
                )
              })
            } else if (payload.eventType === 'INSERT' && payload.new) {
              // For inserts, add the new table to the cache
              const newTable = payload.new as Table
              queryClient.setQueryData(tableKeys.lists(), (oldData: Table[] | undefined) => {
                if (!oldData) return [newTable]
                return [...oldData, newTable]
              })
            } else if (payload.eventType === 'DELETE' && payload.old) {
              // For deletes, remove the table from the cache
              const deletedTable = payload.old as Table
              queryClient.setQueryData(tableKeys.lists(), (oldData: Table[] | undefined) => {
                if (!oldData) return oldData
                return oldData.filter(table => table.id !== deletedTable.id)
              })
            }

            // Also invalidate and refetch as backup
            await queryClient.invalidateQueries({
              queryKey: tableKeys.lists(),
              exact: false,
              refetchType: 'active'
            })
          }
        )
        .subscribe((status) => {

          if (status === 'SUBSCRIBED') {
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
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
        queryClient.invalidateQueries({ queryKey: tableKeys.lists() })

        // Ensure subscription is active
        if (channel && channel.state !== 'joined') {
          setupSubscription()
        }
      }
    }

    // Handle online/offline events
    const handleOnline = () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
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

// Hook to get tables by status
export function useTablesByStatus(status?: TableStatus) {
  const { data: tables, ...rest } = useTables()

  const filteredTables = tables?.filter((table) => {
    if (!status) return true
    return table.status === status
  })

  return {
    data: filteredTables,
    ...rest,
  }
}

// Hook to get a single table
export function useTable(id: string) {
  return useQuery({
    queryKey: tableKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Failed to fetch table: ${error.message}`)
      }

      return data as Table
    },
    enabled: !!id,
  })
}

// Mutation to update table status
export function useUpdateTableStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      tableId,
      status,
      description
    }: {
      tableId: string
      status: TableStatus
      description?: string
    }) => {
      const updateData: Partial<Table> = {
        status,
        updated_at: new Date().toISOString(),
      }

      if (description !== undefined) {
        updateData.description = description
      }

      const { data, error } = await supabase
        .from('tables')
        .update(updateData)
        .eq('id', tableId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update table: ${error.message}`)
      }

      return data as Table
    },
    onSuccess: () => {
      // Invalidate tables queries to refetch data
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
    },
  })
}

// Mutation to update table guest count
export function useUpdateTableGuests() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      tableId,
      guestCount
    }: {
      tableId: string
      guestCount: number
    }) => {
      const { data, error } = await supabase
        .from('tables')
        .update({
          current_guest: guestCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tableId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update table guests: ${error.message}`)
      }

      return data as Table
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() })
    },
  })
}
