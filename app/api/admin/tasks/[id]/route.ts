import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params

    // Mock task data - in a real app, this would come from a database
    const mockTasks = {
      '1': {
        id: '1',
        title: 'User Data Cleanup',
        description: 'Clean up orphaned user data and optimize database performance',
        status: 'in_progress',
        progress: 65,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T14:30:00Z',
        estimated_completion: '2024-01-20T16:00:00Z',
        priority: 'medium',
        category: 'maintenance',
        assignee: 'system',
        logs: [
          { timestamp: '2024-01-20T10:00:00Z', message: 'Task started', level: 'info' },
          { timestamp: '2024-01-20T12:00:00Z', message: 'Processed 1000 records', level: 'info' },
          { timestamp: '2024-01-20T14:30:00Z', message: 'Halfway complete', level: 'info' },
        ],
      },
      '2': {
        id: '2',
        title: 'Email Campaign Analytics',
        description: 'Generate comprehensive analytics report for recent email campaigns',
        status: 'completed',
        progress: 100,
        created_at: '2024-01-19T09:00:00Z',
        updated_at: '2024-01-19T11:45:00Z',
        estimated_completion: '2024-01-19T12:00:00Z',
        priority: 'high',
        category: 'analytics',
        assignee: 'analytics_agent',
        result: {
          total_emails: 5247,
          open_rate: 23.4,
          click_rate: 4.2,
          conversion_rate: 1.8,
        },
        logs: [
          { timestamp: '2024-01-19T09:00:00Z', message: 'Task started', level: 'info' },
          { timestamp: '2024-01-19T10:30:00Z', message: 'Data collection complete', level: 'info' },
          {
            timestamp: '2024-01-19T11:45:00Z',
            message: 'Report generated successfully',
            level: 'success',
          },
        ],
      },
      '3': {
        id: '3',
        title: 'Content Generation Queue',
        description: 'Process pending content generation requests',
        status: 'pending',
        progress: 0,
        created_at: '2024-01-21T08:00:00Z',
        updated_at: '2024-01-21T08:00:00Z',
        estimated_completion: '2024-01-21T10:00:00Z',
        priority: 'low',
        category: 'content',
        assignee: 'content_agent',
        logs: [{ timestamp: '2024-01-21T08:00:00Z', message: 'Task queued', level: 'info' }],
      },
    }

    const task = mockTasks[id as keyof typeof mockTasks]

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Log the task access
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'task_manager',
      message: `Accessed task: ${task.title}`,
      response: `Task status: ${task.status}`,
      context: {
        task_id: id,
        task_title: task.title,
        status: task.status,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      task,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Task fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params
    const { status, priority, assignee, notes } = await request.json()

    // Simulate task update
    const updatedTask = {
      id,
      status: status || 'updated',
      priority: priority || 'medium',
      assignee: assignee || 'admin',
      notes: notes || '',
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    }

    // Log the task update
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'task_manager',
      message: `Updated task ${id}`,
      response: `Task updated successfully`,
      context: {
        task_id: id,
        updates: { status, priority, assignee, notes },
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: 'Task updated successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params

    // Log the task deletion
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'task_manager',
      message: `Deleted task ${id}`,
      response: `Task deleted successfully`,
      context: {
        task_id: id,
        action: 'delete',
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: `Task ${id} deleted successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Task deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
