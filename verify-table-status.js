const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkCurrentTableStatus() {
  console.log('🔍 CURRENT TABLE STATUS CHECK')
  console.log('=====================================\n')

  const criticalTables = [
    { name: 'profiles', expectedColumns: ['id', 'email', 'tier', 'subscription_status'] },
    { name: 'leads', expectedColumns: ['id', 'email', 'name', 'lead_type'] },
    { name: 'user_profiles', expectedColumns: ['id', 'user_id'] }
  ]

  for (const table of criticalTables) {
    console.log(`Checking ${table.name.toUpperCase()} table...`)
    
    try {
      // Test if table exists and what columns it has
      const testRecord = {}
      for (const col of table.expectedColumns) {
        if (col === 'id' && table.name === 'profiles') {
          testRecord[col] = '00000000-0000-0000-0000-000000000001'
        } else if (col === 'id' && table.name === 'leads') {
          // Skip - this is auto-generated
        } else if (col === 'email') {
          testRecord[col] = 'test@example.com'
        } else if (col === 'tier') {
          testRecord[col] = 'free'
        } else if (col === 'name') {
          testRecord[col] = 'Test User'
        } else if (col === 'lead_type') {
          testRecord[col] = 'freebie'
        } else if (col === 'subscription_status') {
          testRecord[col] = 'inactive'
        } else if (col === 'user_id') {
          testRecord[col] = '00000000-0000-0000-0000-000000000001'
        }
      }

      const { data, error } = await supabase
        .from(table.name)
        .insert(testRecord)
        .select()

      if (error) {
        console.log(`❌ ${table.name}: ERROR - ${error.message}`)
        
        // Try to determine what columns actually exist
        try {
          const { data: selectData, error: selectError } = await supabase
            .from(table.name)
            .select('*')
            .limit(1)

          if (selectError) {
            console.log(`   Table might not exist: ${selectError.message}`)
          } else {
            console.log(`   Table exists but structure is wrong`)
          }
        } catch (err) {
          console.log(`   Cannot access table: ${err.message}`)
        }
      } else {
        console.log(`✅ ${table.name}: Has correct structure`)
        
        // Clean up test record
        try {
          if (table.name === 'profiles') {
            await supabase.from(table.name).delete().eq('id', '00000000-0000-0000-0000-000000000001')
          } else if (table.name === 'leads') {
            await supabase.from(table.name).delete().eq('email', 'test@example.com')
          } else {
            await supabase.from(table.name).delete().eq('user_id', '00000000-0000-0000-0000-000000000001')
          }
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
      }
    } catch (err) {
      console.log(`❌ ${table.name}: FATAL ERROR - ${err.message}`)
    }
    
    console.log('')
  }

  console.log('🎯 NEXT STEPS:')
  console.log('=====================================')
  console.log('1. Open Supabase Dashboard -> SQL Editor')
  console.log('2. Copy and paste the complete-table-setup.sql file')
  console.log('3. Run the SQL script to create correct tables')
  console.log('4. Run this script again to verify everything works')
  console.log('\nSQL file location: /workspaces/selfie-ai-platform/complete-table-setup.sql')
}

// Also check if we can connect to Supabase at all
async function checkSupabaseConnection() {
  console.log('🔗 Testing Supabase connection...')
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      return false
    } else {
      console.log('✅ Supabase connection successful')
      return true
    }
  } catch (err) {
    console.log('❌ Supabase connection error:', err.message)
    return false
  }
}

async function main() {
  const connected = await checkSupabaseConnection()
  console.log('')
  
  if (connected) {
    await checkCurrentTableStatus()
  } else {
    console.log('❌ Cannot proceed - Supabase connection failed')
    console.log('Check your .env.local file has correct Supabase credentials')
  }
}

main().catch(console.error)
