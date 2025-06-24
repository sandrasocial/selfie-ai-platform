'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

interface DashboardUpdate {
  id: string
  type:
    | 'new_content'
    | 'progress_update'
    | 'sandra_message'
    | 'system_notification'
    | 'stats_update'
  timestamp: string | number
  data: {
    message?: string
    confidence_score?: number
    title?: string
    [key: string]: any
  }
  read?: boolean
}

interface UseRealtimeDashboardReturn {
  updates: DashboardUpdate[]
  isConnected: boolean
  dismissUpdate: (id: string | number) => void
  markAsRead?: (id: string) => void
  clearAllUpdates?: () => void
}

export function useRealtimeDashboard(userId: string): UseRealtimeDashboardReturn {
  const [updates, setUpdates] = useState<DashboardUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const supabase = createClientComponentClient<Database>()

  // Mock updates for development - replace with real-time subscription
  useEffect(() => {
    if (!userId) return

    // Simulate connection
    setIsConnected(true)

    // Mock some initial updates
    const mockUpdates: DashboardUpdate[] = [
      {
        id: '1',
        type: 'sandra_message',
        timestamp: Date.now(),
        data: {
          message: 'Sandra here! Ready to continue your journey?',
        },
        read: false,
      },
      {
        id: '2',
        type: 'progress_update',
        timestamp: Date.now() - 3600000, // 1 hour ago
        data: {
          confidence_score: 85,
        },
        read: false,
      },
      {
        id: '3',
        type: 'new_content',
        timestamp: Date.now() - 7200000, // 2 hours ago
        data: {
          title: 'Your Personal Brand Story',
          message: 'New content ready to share',
        },
        read: false,
      },
    ]

    setUpdates(mockUpdates)

    // Set up real-time subscription for dashboard updates
    const channel = supabase
      .channel('dashboard_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Dashboard update received:', payload)

          if (payload.eventType === 'INSERT') {
            const newUpdate: DashboardUpdate = {
              id: payload.new.id,
              type: payload.new.type || 'system_notification',
              timestamp: new Date(payload.new.created_at).getTime(),
              data: {
                message: payload.new.message || '',
                title: payload.new.title || 'New Update',
              },
              read: false,
            }

            setUpdates((prev) => [newUpdate, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
      setIsConnected(false)
    }
  }, [userId, supabase])

  const dismissUpdate = useCallback((id: string | number) => {
    setUpdates((prev) => prev.filter((update) => update.id !== id && update.timestamp !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setUpdates((prev) =>
      prev.map((update) => (update.id === id ? { ...update, read: true } : update))
    )
  }, [])

  const clearAllUpdates = useCallback(() => {
    setUpdates([])
  }, [])

  return {
    updates,
    isConnected,
    dismissUpdate,
    markAsRead,
    clearAllUpdates,
  }
}
