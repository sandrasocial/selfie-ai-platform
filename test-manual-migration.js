// Simple Migration Test
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function manualTest() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🧪 Manual Migration Test')
  console.log('📍 Supabase URL:', supabaseUrl)
  console.log('🔑 Service Key:', supabaseKey ? 'Configured' : 'Missing')

  try {
    // Check current table structure
    const { data: tableInfo, error: infoError } = await supabase
      .rpc('sql', { 
        query: `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      })

    if (infoError) {
      console.log('❌ Cannot check table structure:', infoError.message)
    } else {
      console.log('📊 Current user_profiles columns:')
      tableInfo.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`)
      })
    }

    // Check if we can create a simple enum
    console.log('\n🔄 Testing enum creation...')
    const { error: enumError } = await supabase.rpc('sql', {
      query: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'test_tier') THEN
            CREATE TYPE test_tier AS ENUM ('test1', 'test2');
          END IF;
        END $$;
      `
    })

    if (enumError) {
      console.log('❌ Enum test failed:', enumError.message)
    } else {
      console.log('✅ Enum creation works')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }

  console.log('\n📋 NEXT STEPS:')
  console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard/project/usrustscragennskanfh/sql')
  console.log('2. Copy and paste the migration SQL manually')
  console.log('3. Click "Run" to execute')
  console.log('4. Return here to test user creation')
}

manualTest()
