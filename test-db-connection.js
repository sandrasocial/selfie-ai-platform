// Test Supabase Connection and Migration
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function testConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Test basic connection
    console.log('🔍 Testing Supabase connection...')
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
    
    if (error) {
      console.log('📝 user_profiles table does not exist yet (expected before migration)')
      console.log('Error:', error.message)
    } else {
      console.log('✅ Connected to Supabase successfully')
      console.log('📊 user_profiles table exists with data:', data)
    }

    // Check if we can access auth.users
    console.log('🔍 Checking auth.users access...')
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.log('❌ Cannot access auth.users:', authError.message)
    } else {
      console.log('✅ Auth access working. Current users:', authData.users.length)
    }

    return true
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return false
  }
}

// Check if user_profiles table has the new columns
async function checkMigrationStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('🔍 Checking migration status...')
    
    // Try to query a column that should exist after migration
    const { data, error } = await supabase
      .from('user_profiles')
      .select('tier, onboarding_status')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "user_profiles" does not exist')) {
        console.log('📝 user_profiles table needs to be created')
        return false
      } else if (error.message.includes('column "tier" does not exist')) {
        console.log('📝 Migration needed - tier column missing')
        return false
      } else {
        console.log('❓ Unknown error:', error.message)
        return false
      }
    } else {
      console.log('✅ Migration appears to be complete')
      return true
    }
  } catch (error) {
    console.error('❌ Migration check failed:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 SELFIE AI™ Database Connection Test\n')
  
  const connected = await testConnection()
  if (!connected) {
    console.log('❌ Cannot proceed - connection failed')
    return
  }

  const migrated = await checkMigrationStatus()
  if (migrated) {
    console.log('✅ Database appears to be ready for testing!')
  } else {
    console.log('⚠️  Migration needed before testing')
  }
}

main().catch(console.error)
