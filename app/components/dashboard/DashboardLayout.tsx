'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Widget {
  id: string
  type: 'stats' | 'progress' | 'content' | 'actions' | 'calendar' | 'affirmation'
  title: string
  position: number
  visible: boolean
  size: 'small' | 'medium' | 'large'
}

interface DashboardLayoutProps {
  userId: string
  children: React.ReactNode
}

export function DashboardLayout({ userId, children }: DashboardLayoutProps) {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    loadWidgetPreferences()
  }, [userId])

  const loadWidgetPreferences = async () => {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('dashboard_layout')
        .eq('user_id', userId)
        .single()

      if (data && data.dashboard_layout) {
        setWidgets(data.dashboard_layout)
      } else {
        // Default layout
        setWidgets([
          {
            id: 'stats',
            type: 'stats',
            title: 'Your Impact',
            position: 0,
            visible: true,
            size: 'medium'
          },
          {
            id: 'progress',
            type: 'progress',
            title: '90-Day Journey',
            position: 1,
            visible: true,
            size: 'large'
          },
          {
            id: 'content',
            type: 'content',
            title: 'Today\'s Content',
            position: 2,
            visible: true,
            size: 'large'
          },
          {
            id: 'actions',
            type: 'actions',
            title: 'Quick Actions',
            position: 3,
            visible: true,
            size: 'small'
          },
          {
            id: 'affirmation',
            type: 'affirmation',
            title: 'Daily Affirmation',
            position: 4,
            visible: true,
            size: 'small'
          }
        ])
      }
    } catch (error) {
      console.error('Error loading widget preferences:', error)
    }
  }

  const saveWidgetPreferences = async (newWidgets: Widget[]) => {
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          dashboard_layout: newWidgets,
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error saving widget preferences:', error)
    }
  }

  const handleDragStart = (widgetId: string) => {
    setIsDragging(true)
    setDraggedWidget(widgetId)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedWidget(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault()
    
    if (!draggedWidget) return

    const newWidgets = [...widgets]
    const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget)
    const targetIndex = newWidgets.findIndex(w => w.position === targetPosition)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Swap positions
      const temp = newWidgets[draggedIndex].position
      newWidgets[draggedIndex].position = newWidgets[targetIndex].position
      newWidgets[targetIndex].position = temp
      
      // Sort by position
      newWidgets.sort((a, b) => a.position - b.position)
      
      setWidgets(newWidgets)
      saveWidgetPreferences(newWidgets)
    }
    
    handleDragEnd()
  }

  const toggleWidgetVisibility = (widgetId: string) => {
    const newWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, visible: !widget.visible }
        : widget
    )
    setWidgets(newWidgets)
    saveWidgetPreferences(newWidgets)
  }

  const changeWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const newWidgets = widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, size }
        : widget
    )
    setWidgets(newWidgets)
    saveWidgetPreferences(newWidgets)
  }

  const [customizeMode, setCustomizeMode] = useState(false)

  return (
    <div className="relative">
      {/* Customize Toggle */}
      <button
        onClick={() => setCustomizeMode(!customizeMode)}
        className="fixed top-6 right-32 bg-warm-gray text-luxury-black px-4 py-2 text-sm tracking-wider uppercase hover:bg-luxury-black hover:text-soft-white transition-all z-40"
      >
        {customizeMode ? 'Save Layout' : 'Customize'}
      </button>

      {/* Customize Panel */}
      {customizeMode && (
        <div className="fixed top-20 right-6 w-80 bg-soft-white border border-warm-gray z-50 p-6">
          <h3 className="font-serif text-xl mb-4">Customize Dashboard</h3>
          
          <div className="space-y-4">
            {widgets.map((widget) => (
              <div key={widget.id} className="border border-warm-gray/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{widget.title}</span>
                  <button
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`px-3 py-1 text-xs tracking-wider uppercase transition-all ${
                      widget.visible 
                        ? 'bg-luxury-black text-soft-white' 
                        : 'bg-warm-gray text-luxury-black'
                    }`}
                  >
                    {widget.visible ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => changeWidgetSize(widget.id, size)}
                      className={`px-2 py-1 text-xs tracking-wider uppercase transition-all ${
                        widget.size === size
                          ? 'bg-luxury-black text-soft-white'
                          : 'border border-warm-gray text-warm-gray hover:bg-warm-gray hover:text-luxury-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Content with Drag and Drop */}
      <div className={`${isDragging ? 'select-none' : ''}`}>
        {children}
      </div>

      {/* Drag and Drop Indicators */}
      {isDragging && (
        <div className="fixed inset-0 bg-luxury-black/10 z-30 pointer-events-none">
          <div className="absolute inset-0 border-2 border-dashed border-luxury-black/20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-luxury-black text-soft-white px-6 py-3 text-sm tracking-wider uppercase">
            Drop to Reorder
          </div>
        </div>
      )}
    </div>
  )
}
