import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/utils/supabase/route-handler';

export async function GET() {
  const supabase = createRouteHandlerClient();
  
  try {
    // Test 1: Check if admin_tasks table exists and has the correct schema
    const { data: tasksData, error: tasksError } = await supabase
      .from('admin_tasks')
      .select('*')
      .limit(1);

    // Test 2: Check if agent_activity_log table exists
    const { data: logsData, error: logsError } = await supabase
      .from('agent_activity_log')
      .select('*')
      .limit(1);

    // Test 3: Check if agent_settings table exists
    const { data: settingsData, error: settingsError } = await supabase
      .from('agent_settings')
      .select('*')
      .limit(1);

    // Test 4: Check current task statuses
    const { data: statusData, error: statusError } = await supabase
      .from('admin_tasks')
      .select('status')
      .limit(10);

    // Test 5: Try to insert a test task with 'cancelled' status
    const { data: testInsert, error: insertError } = await supabase
      .from('admin_tasks')
      .insert({
        title: 'Test Safety Task',
        description: 'Testing emergency stop functionality',
        agent: 'diana',
        status: 'cancelled',
        priority: 'low',
        workflow: ['diana'],
        current_agent_index: 0,
        agent_notes: { test: true }
      })
      .select()
      .single();

    // Clean up test data
    if (testInsert) {
      await supabase
        .from('admin_tasks')
        .delete()
        .eq('id', testInsert.id);
    }

    return NextResponse.json({
      success: true,
      tests: {
        admin_tasks_exists: !tasksError,
        admin_tasks_error: tasksError?.message || null,
        agent_activity_log_exists: !logsError,
        agent_activity_log_error: logsError?.message || null,
        agent_settings_exists: !settingsError,
        agent_settings_error: settingsError?.message || null,
        current_statuses: statusData?.map(s => s.status) || [],
        cancelled_status_test: !insertError,
        cancelled_status_error: insertError?.message || null
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error',
    }, { status: 500 });
  }
} 