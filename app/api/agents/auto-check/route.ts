import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { processAgentTask } from '@/lib/agent-brain'

export const dynamic = 'force-dynamic'

// This endpoint is for the client-side poller to check for pending tasks
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  try {
    // Get all pending tasks
    const { data: tasks, error } = await supabase
      .from('admin_tasks')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw error

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending tasks found.' })
    }

    // Process each task in the background
    for (const task of tasks) {
      try {
        const agentId = task.agent || (task.workflow && task.workflow[0])
        if (agentId) {
          // Run in background, don't await
          processAgentTask(agentId, task).catch(console.error)
        }
      } catch (e) {
        console.error(`Error queueing task ${task.id}:`, e)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Queued ${tasks.length} tasks for processing.`,
      tasks: tasks.map((t) => t.id),
    })
  } catch (error: any) {
    console.error('Agent auto-check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
