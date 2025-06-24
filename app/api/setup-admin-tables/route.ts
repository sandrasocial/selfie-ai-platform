import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Missing required environment variables' 
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('🚀 SELFIE AI™ Admin System Setup via API...')

    // Check if user_profiles table already exists
    const { data: existingData, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)

    if (!checkError) {
      console.log('✅ user_profiles table already exists!')

      // Check for admin user
      const { data: adminData, error: adminError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'ssa@ssasocial.com')
        .single()

      return NextResponse.json({
        success: true,
        message: 'Admin tables already exist!',
        adminExists: !!adminData,
        tableExists: true,
      })
    }

    console.log('🔧 Table does not exist, attempting to create via data operations...')

    // Since we can't execute raw SQL, let's try to create the table by attempting an insert
    // This will fail but might give us insight into the table structure
    const { error: insertError } = await supabase.from('user_profiles').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'user',
      is_admin: false,
    })

    console.log('📊 Insert attempt result:', insertError)

    return NextResponse.json({
      success: false,
      message: 'Table creation requires manual SQL execution',
      error: insertError?.message,
      instructions: {
        method1: {
          title: 'Manual SQL (Recommended)',
          steps: [
            'Go to https://supabase.com/dashboard/project/usrustscragennskanfh',
            'Navigate to SQL Editor',
            'Copy SQL from admin-setup.sql file',
            'Run the SQL',
            'Sign up at /admin/login with ssa@ssasocial.com',
          ],
        },
        method2: {
          title: 'Direct Link',
          url: 'https://supabase.com/dashboard/project/usrustscragennskanfh/sql/new',
        },
      },
    })
  } catch (error) {
    console.error('❌ Setup error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SELFIE AI™ Admin Table Setup API',
    instructions: 'Send a POST request to this endpoint to setup admin tables',
    manualSetup: {
      supabaseUrl: 'https://supabase.com/dashboard/project/usrustscragennskanfh/sql/new',
      sqlFile: 'Use the SQL from admin-setup.sql in the project root',
    },
  })
}
