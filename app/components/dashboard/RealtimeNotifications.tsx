'use client'

import { useState, useEffect } from 'react'
import { useRealtimeDashboard } from '@/hooks/useRealtimeDashboard'

interface RealtimeNotificationsProps {
  userId: string
}

export function RealtimeNotifications({ userId }: RealtimeNotificationsProps) {
  const { updates, isConnected, dismissUpdate } = useRealtimeDashboard(userId)
  const [showNotifications, setShowNotifications] = useState(false)

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'new_content':
        return '📝'
      case 'progress_update':
        return '📈'
      case 'sandra_message':
        return '🤖'
      case 'stats_update':
        return '📊'
      default:
        return '💫'
    }
  }

  const getUpdateTitle = (type: string) => {
    switch (type) {
      case 'new_content':
        return 'New Content Ready'
      case 'progress_update':
        return 'Progress Updated'
      case 'sandra_message':
        return 'Sandra AI Message'
      case 'stats_update':
        return 'Stats Updated'
      default:
        return 'Update'
    }
  }

  const formatUpdateMessage = (update: any) => {
    switch (update.type) {
      case 'sandra_message':
        return update.data.message
      case 'progress_update':
        return `Your confidence score updated to ${update.data.confidence_score}%`
      case 'new_content':
        return `New post "${update.data.title}" is ready to share`
      default:
        return 'New update available'
    }
  }

  if (updates.length === 0) return null

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed top-6 right-20 bg-luxury-black text-soft-white w-12 h-12 flex items-center justify-center hover:bg-warm-gray hover:text-luxury-black transition-all z-40 relative"
      >
        <span className="text-xl">🔔</span>
        {updates.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-soft-white text-luxury-black w-6 h-6 flex items-center justify-center text-xs font-bold">
            {updates.length}
          </span>
        )}
        
        {/* Connection Status */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-20 right-6 w-80 bg-soft-white border border-warm-gray z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-warm-gray/20">
            <h3 className="font-serif text-lg">Live Updates</h3>
            <div className="flex items-center gap-2 text-sm text-warm-gray">
              <div className={`w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {updates.map((update) => (
              <div key={update.timestamp} className="p-4 border-b border-warm-gray/10 hover:bg-[#FAFAFA] group">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getUpdateIcon(update.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      {getUpdateTitle(update.type)}
                    </div>
                    <div className="text-sm text-warm-gray leading-relaxed">
                      {formatUpdateMessage(update)}
                    </div>
                    <div className="text-xs text-warm-gray/70 mt-2">
                      {new Date(update.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissUpdate(update.timestamp)}
                    className="opacity-0 group-hover:opacity-100 text-warm-gray hover:text-luxury-black transition-opacity"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {updates.length === 0 && (
            <div className="p-8 text-center text-warm-gray">
              No new updates
            </div>
          )}
        </div>
      )}

      {/* New Update Toast Notifications */}
      <div className="fixed top-24 right-6 z-50 space-y-2">
        {updates.slice(0, 3).map((update, index) => (
          <div
            key={update.timestamp}
            className={`bg-luxury-black text-soft-white p-4 w-80 transform transition-all duration-500 ${
              index === 0 ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-80'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{getUpdateIcon(update.type)}</span>
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">
                  {getUpdateTitle(update.type)}
                </div>
                <div className="text-xs text-warm-gray">
                  {formatUpdateMessage(update).slice(0, 60)}...
                </div>
              </div>
              <button
                onClick={() => dismissUpdate(update.timestamp)}
                className="text-warm-gray hover:text-soft-white"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
