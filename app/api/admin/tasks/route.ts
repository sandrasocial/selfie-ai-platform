import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/utils/supabase/route-handler';

const logEnvVars = () => {
  console.log('--- Vercel Environment Debug ---');
  console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY.length);
  }
  console.log('--- End Debug ---');
};

export async function GET(req: Request) {
  logEnvVars();
  try {
    const supabase = createRouteHandlerClient();
    const url = new URL(req.url);
    const agent = url.searchParams.get('agent');
    const status = url.searchParams.get('status');
    
    let query = supabase
      .from('admin_tasks')
      .select('*');
    
    if (agent) {
      query = query.eq('agent', agent);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: tasks, error } = await query
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase query error in GET /api/admin/tasks:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: 'Supabase query failed.', details: error.message }, { status: 500 });
    }
    
    return NextResponse.json(tasks || []);
  } catch (error: any) {
    console.error('Fatal error in GET /api/admin/tasks:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      error: 'A server error occurred.',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  logEnvVars();
  try {
    const supabase = createRouteHandlerClient();
    const taskData = await req.json();
    
    // Ensure required fields
    const task = {
      title: taskData.title,
      description: taskData.description,
      agent: taskData.agent,
      priority: taskData.priority || 'medium',
      status: 'pending',
      created_by: null,
      created_at: new Date().toISOString(),
      ...taskData
    };
    
    const { data, error } = await supabase
      .from('admin_tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create task' 
    }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  logEnvVars();
  try {
    const supabase = createRouteHandlerClient();
    const { id, ...updates } = await req.json();
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Task ID required' 
      }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('admin_tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to update task' 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  logEnvVars();
  try {
    const supabase = createRouteHandlerClient();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Task ID required' 
      }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('admin_tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to delete task' 
    }, { status: 500 });
  }
} 