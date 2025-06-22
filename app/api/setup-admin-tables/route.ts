import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST() {
  try {
    console.log('Running admin table setup and agent safety migration...')

    // First, run the original admin table setup
    const { error: adminError } = await supabase.rpc('setup_admin_tables')
    
    if (adminError) {
      console.error('Admin table setup error:', adminError)
      return NextResponse.json({ error: adminError.message }, { status: 500 })
    }

    // Now run the agent safety migration
    const { error: migrationError } = await supabase.rpc('run_agent_safety_migration')
    
    if (migrationError) {
      console.error('Agent safety migration error:', migrationError)
      return NextResponse.json({ error: migrationError.message }, { status: 500 })
    }

    console.log('Admin table setup and agent safety migration completed successfully')
    return NextResponse.json({ 
      success: true, 
      message: 'Admin tables and agent safety features setup completed' 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 