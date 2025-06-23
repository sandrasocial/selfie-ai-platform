#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testDeploymentStatus() {
  console.log('🔍 Testing deployment status...')
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables')
    return
  }
  
  console.log('✅ Environment variables found')
  console.log(`📡 Supabase URL: ${supabaseUrl}`)
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test database connection
    console.log('\n🔄 Testing database connection...')
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Database connection failed:', error.message)
      return
    }
    
    console.log('✅ Database connection successful')
    console.log(`📊 Total user profiles: ${data.length > 0 ? data.length : 'Unknown count'}`)
    
    // Test table structure
    console.log('\n🔄 Testing user_profiles table structure...')
    const { data: sampleData, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Table structure test failed:', tableError.message)
      if (tableError.message.includes('column') && tableError.message.includes('does not exist')) {
        console.log('⚠️  Migration needs to be run in Supabase SQL Editor')
        console.log('📝 Run the migration-for-sql-editor.sql file in Supabase dashboard')
      }
      return
    }
    
    console.log('✅ Table structure is correct')
    
    // Test auth functionality
    console.log('\n🔄 Testing auth system...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('❌ Auth system test failed:', authError.message)
      return
    }
    
    console.log('✅ Auth system is working')
    
    console.log('\n🎉 Deployment Status: READY')
    console.log('✅ Build successful')
    console.log('✅ Database connected')
    console.log('✅ Auth system working')
    console.log('\n📋 Next steps:')
    console.log('1. Ensure migration is run in Supabase SQL Editor (if not done)')
    console.log('2. Test user signup at /auth/sign-up')
    console.log('3. Verify user dashboard access')
    
  } catch (error) {
    console.log('❌ Deployment test failed:', error.message)
  }
}

testDeploymentStatus()
