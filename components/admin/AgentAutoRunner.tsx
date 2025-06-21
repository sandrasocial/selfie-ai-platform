'use client'

import { useState, useEffect } from 'react'
import { Zap, Play } from 'lucide-react'

export default function AgentAutoRunner() {
  const [isPolling, setIsPolling] = useState(false)
  const [lastRun, setLastRun] = useState<Date | null>(null)
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Only run auto-polling in development
    setIsDevelopment(process.env.NODE_ENV === 'development')
    
    if (process.env.NODE_ENV !== 'development') {
      return // Don't set up polling in production
    }

    const intervalId = setInterval(async () => {
      if (document.hidden) return // Don't run if the tab is not active
      
      console.log('Auto-checking for agent tasks...')
      setIsPolling(true)
      try {
        await fetch('/api/agents/auto-check')
        setLastRun(new Date())
      } catch (error) {
        console.error('Failed to run auto-check:', error)
      } finally {
        setIsPolling(false)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  const handleManualRun = async () => {
    setIsPolling(true)
    try {
      await fetch('/api/agents/auto-check')
      setLastRun(new Date())
    } catch (error) {
      console.error('Failed to run auto-check:', error)
    } finally {
      setIsPolling(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-luxury-black text-soft-white p-2 shadow-lg flex items-center gap-2 border border-warm-gray/20">
      <Zap className={`w-4 h-4 ${isPolling ? 'animate-pulse text-yellow-400' : 'text-green-400'}`} />
      <span className="text-xs">
        {isPolling ? 'Agents active...' : 'Agents idle.'}
      </span>
      {!isDevelopment && (
        <button
          onClick={handleManualRun}
          disabled={isPolling}
          className="ml-2 p-1 bg-warm-gray/20 hover:bg-warm-gray/30 disabled:opacity-50"
          title="Process pending tasks"
        >
          <Play className="w-3 h-3" />
        </button>
      )}
    </div>
  )
} 