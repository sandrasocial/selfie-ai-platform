import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Test basic connection
    const { data: tasks, error: tasksError } = await supabase
      .from('admin_tasks')
      .select('count')
      .limit(1)

    const { data: logs, error: logsError } = await supabase
      .from('agent_activity_log')
      .select('count')
      .limit(1)

    return NextResponse.json({
      success: true,
      tables: {
        admin_tasks: {
          exists: !tasksError,
          error: tasksError?.message
        },
        agent_activity_log: {
          exists: !logsError,
          error: logsError?.message
        }
      },
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 