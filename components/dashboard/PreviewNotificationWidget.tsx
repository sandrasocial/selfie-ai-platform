'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Eye, ThumbsUp, ThumbsDown, Users, Clock } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type ReadyTask = {
  id: string
  title: string
  workflow: string[]
  preview_url?: string
  created_at: string
}

export default function PreviewNotificationWidget() {
  const [readyTasks, setReadyTasks] = useState<ReadyTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReadyTasks()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('ready_tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'admin_tasks', filter: 'ready_for_review=eq.true' }, 
        () => {
          fetchReadyTasks()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchReadyTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_tasks')
        .select('id, title, workflow, preview_url, created_at')
        .eq('ready_for_review', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReadyTasks(data || [])
    } catch (error) {
      console.error('Error fetching ready tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAgentName = (agentId: string) => {
    const agentNames: Record<string, string> = {
      'director': 'Director AI',
      'ux': 'UX AI',
      'voice': 'Voice AI',
      'dev': 'Dev AI',
      'qa': 'QA AI',
      'automation': 'Automation AI'
    }
    return agentNames[agentId] || agentId
  }

  const handleQuickApprove = async (taskId: string) => {
    try {
      await supabase
        .from('admin_tasks')
        .update({ 
          status: 'approved',
          ready_for_review: false 
        })
        .eq('id', taskId)
      
      // Also mark as completed
      await supabase
        .from('admin_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId)
      
      // Log activity
      await supabase
        .from('agent_activity_log')
        .insert({
          task_id: taskId,
          agent_name: 'Sandra',
          activity: 'Approved and deployed from dashboard'
        })
      
      fetchReadyTasks()
    } catch (error) {
      console.error('Error approving task:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-warm-gray/20 p-8 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-warm-gray/20 w-1/3 mb-4"></div>
          <div className="h-20 bg-warm-gray/10"></div>
        </div>
      </div>
    )
  }

  if (readyTasks.length === 0) {
    return null // Don't show the widget if there are no tasks
  }

  return (
    <div className="bg-luxury-black text-white p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bodoni">
          {readyTasks.length} {readyTasks.length === 1 ? 'Task' : 'Tasks'} Ready for Your Review
        </h2>
        <Link 
          href="/admin/agent-hub" 
          className="text-sm text-soft-white/80 hover:text-white transition-colors"
        >
          View all in Agent Hub →
        </Link>
      </div>
      
      <div className="space-y-4">
        {readyTasks.slice(0, 3).map(task => (
          <div key={task.id} className="bg-white text-luxury-black p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <div className="flex items-center gap-4 text-sm text-warm-gray mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {task.workflow.map(w => getAgentName(w)).join(' → ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                {task.preview_url && (
                  <a 
                    href={task.preview_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Live
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickApprove(task.id)}
                  className="bg-luxury-black text-white px-6 py-2 hover:bg-warm-gray transition-colors flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Quick Approve
                </button>
                <Link
                  href="/admin/agent-hub"
                  className="border border-luxury-black px-6 py-2 hover:bg-luxury-black hover:text-white transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {readyTasks.length > 3 && (
        <div className="mt-4 text-center">
          <Link 
            href="/admin/agent-hub" 
            className="text-sm text-soft-white/80 hover:text-white transition-colors"
          >
            + {readyTasks.length - 3} more tasks waiting
          </Link>
        </div>
      )}
    </div>
  )
} 