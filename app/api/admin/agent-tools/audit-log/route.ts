import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const agentType = searchParams.get('agent_type')
    const userId = searchParams.get('user_id')

    // Build query
    let query = supabase
      .from('admin_agent_logs')
      .select(
        `
        *,
        user_profiles(name, email)
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (agentType) {
      query = query.eq('agent_type', agentType)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: logs, error: logsError } = await query

    if (logsError) {
      console.error('Error fetching audit logs:', logsError)
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
    }

    // Get total count for pagination
    let countQuery = supabase.from('admin_agent_logs').select('*', { count: 'exact', head: true })

    if (agentType) {
      countQuery = countQuery.eq('agent_type', agentType)
    }

    if (userId) {
      countQuery = countQuery.eq('user_id', userId)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error counting audit logs:', countError)
    }

    return NextResponse.json({
      success: true,
      data: logs || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error) {
    console.error('Audit log error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { action, target_user_id, details } = await request.json()

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    // Create audit log entry
    const { data: logEntry, error: logError } = await supabase
      .from('admin_agent_logs')
      .insert({
        user_id: user.id,
        agent_type: 'admin_tools',
        message: action,
        response: 'Manual admin action',
        context: {
          action,
          target_user_id,
          details: details || {},
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (logError) {
      console.error('Error creating audit log:', logError)
      return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: logEntry,
    })
  } catch (error) {
    console.error('Audit log creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
