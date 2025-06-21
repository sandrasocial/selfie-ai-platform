import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/utils/supabase/route-handler';

export async function GET() {
  const supabase = createRouteHandlerClient();
  try {
    // Test basic connection
    const { error: tasksError } = await supabase
      .from('admin_tasks')
      .select('id')
      .limit(1);

    const { error: logsError } = await supabase
      .from('agent_activity_log')
      .select('id')
      .limit(1);

    return NextResponse.json({
      success: true,
      tables: {
        admin_tasks: {
          exists: !tasksError,
          error: tasksError?.message || null
        },
        agent_activity_log: {
          exists: !logsError,
          error: logsError?.message || null
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error',
    }, { status: 500 });
  }
} 