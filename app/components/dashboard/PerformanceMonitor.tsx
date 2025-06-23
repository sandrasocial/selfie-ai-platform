'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  connectionLatency: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    connectionLatency: 0
  })

  useEffect(() => {
    // Measure initial load performance
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const renderTime = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      
      // Memory usage (if available)
      const memory = (performance as any).memory
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0

      setMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage * 100) / 100
      }))
    }

    // Test connection latency
    const testLatency = async () => {
      const start = performance.now()
      try {
        await fetch('/api/health', { method: 'HEAD' })
        const latency = performance.now() - start
        setMetrics(prev => ({
          ...prev,
          connectionLatency: Math.round(latency)
        }))
      } catch (error) {
        console.error('Latency test failed:', error)
      }
    }

    const timer = setTimeout(() => {
      measurePerformance()
      testLatency()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-luxury-black text-soft-white p-3 text-xs font-mono z-50 opacity-60 hover:opacity-100 transition-opacity">
      <div className="space-y-1">
        <div>Load: {metrics.loadTime}ms</div>
        <div>Render: {metrics.renderTime}ms</div>
        <div>Memory: {metrics.memoryUsage}MB</div>
        <div>Latency: {metrics.connectionLatency}ms</div>
      </div>
    </div>
  )
}

// Component to track user interactions
export function InteractionTracker({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const trackingData = {
        element: target.tagName,
        className: target.className,
        text: target.textContent?.slice(0, 50),
        timestamp: new Date().toISOString(),
        position: { x: event.clientX, y: event.clientY }
      }
      
      // In a real app, send this to analytics
      console.log('User interaction:', trackingData)
    }

    document.addEventListener('click', trackClick)
    return () => document.removeEventListener('click', trackClick)
  }, [])

  return <>{children}</>
}
