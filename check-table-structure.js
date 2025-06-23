// Check Current Table Structure
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function checkTableStructure() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🔍 Checking Current Table Structure\n')

  try {
    // Check what columns exist in user_profiles
    const { data: columns, error } = await supabase
      .rpc('sql', {
        query: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      })

    if (error) {
      console.log('Using direct query instead...')
      
      // Try to get a sample row to see structure
      const { data: sample, error: sampleError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1)
      
      if (sampleError) {
        console.log('❌ Cannot access user_profiles:', sampleError.message)
        return
      }
      
      console.log('📊 Current user_profiles structure (from sample):')
      if (sample.length > 0) {
        Object.keys(sample[0]).forEach(key => {
          console.log(`   - ${key}: ${typeof sample[0][key]}`)
        })
      } else {
        console.log('   No data to show structure')
      }
    } else {
      console.log('📊 Current user_profiles columns:')
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
      })
    }

    // Check if we can see the auth.users structure
    console.log('\n🔍 Checking auth.users structure...')
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.log('❌ Cannot access auth.users:', usersError.message)
    } else if (users.users.length > 0) {
      console.log('📊 Sample auth.users structure:')
      const sampleUser = users.users[0]
      console.log('   Available fields:', Object.keys(sampleUser))
      console.log('   Sample user:', {
        id: sampleUser.id,
        email: sampleUser.email,
        created_at: sampleUser.created_at,
        user_metadata: sampleUser.user_metadata
      })
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkTableStructure()
