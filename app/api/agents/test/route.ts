import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { processAgentTask } from '@/lib/agent-brain'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for admin operations
)

export async function GET() {
  try {
    // Create a test task
    const testTask = {
      title: 'Create a simple button component',
      description: 'Build a button component that follows our luxury design system. It should have hover states and be fully responsive.',
      agent: 'maya',
      priority: 'medium' as 'medium',
      status: 'pending' as 'pending',
      workflow: ['maya'],
      current_agent_index: 0
    }
    
    // Insert into database
    const { data: task, error } = await supabase
      .from('admin_tasks')
      .insert(testTask)
      .select()
      .single()
    
    if (error) throw error
    if (!task) throw new Error("Task creation failed.")
    
    // Process the task
    // We are not awaiting this because we want to return a response to the client immediately
    // The agent will work in the background.
    processAgentTask('maya', task).catch(console.error);
    
    return NextResponse.json({
      success: true,
      message: 'Test task created and processing started',
      taskId: task.id
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Test individual agents
export async function POST(request: Request) {
  try {
    const { agent } = await request.json()
    
    const testTasks = {
      maya: {
        title: 'Test MAYA: Button Component',
        description: 'Create a luxury button component with hover effects',
        agent: 'maya',
        workflow: ['maya']
      },
      victoria: {
        title: 'Test VICTORIA: Design Review',
        description: 'Review the homepage design for luxury standards',
        agent: 'victoria',
        workflow: ['victoria']
      },
      rachel: {
        title: 'Test RACHEL: Hero Copy',
        description: 'Write hero section copy for the homepage',
        agent: 'rachel',
        workflow: ['rachel']
      },
      quinn: {
        title: 'Test QUINN: Component Testing',
        description: 'Test the new testimonial component',
        agent: 'quinn',
        workflow: ['quinn']
      }
    }
    
    const taskData = testTasks[agent as keyof typeof testTasks]
    if (!taskData) {
      return NextResponse.json({ error: 'Invalid agent' }, { status: 400 })
    }
    
    // Create task
    const { data: task, error } = await supabase
      .from('admin_tasks')
      .insert({ ...taskData, status: 'pending', priority: 'medium', current_agent_index: 0 })
      .select()
      .single()
    
    if (error) throw error
    if (!task) throw new Error("Task creation failed.")
    
    // Process immediately and don't wait for it to finish
    processAgentTask(agent, task).catch(console.error);
    
    return NextResponse.json({
      success: true,
      message: `Agent ${agent} test started.`,
      agent,
      taskId: task.id,
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 