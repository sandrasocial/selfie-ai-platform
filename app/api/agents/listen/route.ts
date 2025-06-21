import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { processAgentTask } from '@/lib/agent-brain'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for admin operations
)

// This endpoint is for the cron job to check for pending tasks
export async function GET() {
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
          processAgentTask(agentId, task).catch(console.error)
        }
      } catch (e) {
        console.error(`Error queueing task ${task.id}:`, e)
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Queued ${tasks.length} tasks for processing.`,
      tasks: tasks.map(t => t.id)
    })
  } catch (error: any) {
    console.error('Agent listener GET error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}

// Webhook endpoint for real-time task processing from Supabase
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    
    // Check if it's a new task insert
    if (payload.type === 'INSERT' && payload.record) {
      const task = payload.record;
      if (task.status === 'pending') {
        const agentId = task.agent || (task.workflow && task.workflow[0]);
        
        if (agentId) {
          // Process in background, don't await
          processAgentTask(agentId, task).catch(err => {
            console.error(`Webhook processing failed for task ${task.id}:`, err);
          });
          
          return NextResponse.json({ success: true, message: 'Webhook received and task queued.' });
        }
      }
    }
    
    return NextResponse.json({ success: true, message: 'Webhook received, no action needed.' })
  } catch (error: any) {
    console.error('Agent listener POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
} 