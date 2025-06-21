import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = createClient();
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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(tasks || []);
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch tasks' 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient();
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
  try {
    const supabase = createClient();
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
  try {
    const supabase = createClient();
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