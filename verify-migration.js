#!/usr/bin/env node

// Post-migration verification script
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function verifyMigration() {
  console.log('✅ POST-MIGRATION VERIFICATION TEST')
  console.log('=' .repeat(40))
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // Test 1: Check user_profiles table structure
    console.log('🔍 Test 1: Checking user_profiles table...')
    const { data: profilesTest, error: profilesError } = await supabase
      .from('user_profiles')
      .select('tier, email, onboarding_status, ai_model_status, admin_status')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Migration not complete:', profilesError.message)
      console.log('📝 Please run the migration SQL in Supabase SQL Editor')
      return false
    }
    console.log('✅ user_profiles table has all required columns')
    
    // Test 2: Check content tables
    console.log('\n🔍 Test 2: Checking content tables...')
    const tables = ['future_self_images', 'user_progress', 'glow_checks', 'content_calendar']
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
      
      if (error) {
        console.log(`❌ Table ${table} not found:`, error.message)
        return false
      }
      console.log(`✅ ${table} table exists`)
    }
    
    // Test 3: Check auth functionality
    console.log('\n🔍 Test 3: Checking auth system...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Auth system issue:', sessionError.message)
      return false
    }
    console.log('✅ Auth system is functional')
    
    console.log('\n🎉 MIGRATION VERIFICATION COMPLETE!')
    console.log('✅ All database tables are ready')
    console.log('✅ Auth system is working')
    console.log('✅ Login should now work')
    
    console.log('\n📋 NEXT STEPS:')
    console.log('1. Go to /auth/signup and create a test account')
    console.log('2. Go to /auth/login and login with that account')
    console.log('3. Verify you reach the dashboard')
    
    return true
    
  } catch (error) {
    console.log('❌ Verification failed:', error.message)
    return false
  }
}

verifyMigration()
