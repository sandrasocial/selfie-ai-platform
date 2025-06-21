import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(request.url);
    const agentName = searchParams.get('agent');
    const taskId = searchParams.get('task_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('agent_activity')
      .select(`
        *,
        admin_tasks (
          id,
          title,
          status
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (agentName) {
      query = query.eq('agent_name', agentName);
    }

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    const { data: activities, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error('Error fetching agent activity:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch agent activity',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { agent_name, task_id, action, details } = body;

    const { data: activity, error } = await supabase
      .from('agent_activity')
      .insert([
        {
          agent_name,
          task_id,
          action,
          details,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
      activity,
    });
  } catch (error) {
    console.error('Error logging agent activity:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to log agent activity',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 