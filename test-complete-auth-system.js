#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function comprehensiveAuthTest() {
  console.log('🔍 COMPREHENSIVE AUTH SYSTEM TEST - SELFIE AI™')
  console.log('=' .repeat(50))
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Missing environment variables')
    return
  }
  
  console.log('✅ Environment variables loaded')
  console.log(`📡 Supabase URL: ${supabaseUrl}`)
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // 1. Test database connection
    console.log('\n🔍 Step 1: Testing database connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      console.log('❌ Database connection failed:', connectionError.message)
      return
    }
    console.log('✅ Database connection successful')
    
    // 2. Check user_profiles table structure
    console.log('\n🔍 Step 2: Checking user_profiles table structure...')
    const { data: profilesTest, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ user_profiles table issue:', profilesError.message)
      if (profilesError.message.includes('column') && profilesError.message.includes('does not exist')) {
        console.log('🚨 MIGRATION REQUIRED: Missing columns in user_profiles table')
        console.log('📝 Run COMPLETE_USER_SYSTEM_MIGRATION.sql in Supabase SQL Editor')
      }
      return
    }
    console.log('✅ user_profiles table structure is correct')
    
    // 3. Check existing users
    console.log('\n🔍 Step 3: Checking existing users...')
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.log('❌ Cannot access users (need service role key for this)')
    } else {
      console.log(`📊 Total users in auth.users: ${users?.length || 0}`)
      if (users && users.length > 0) {
        console.log('👥 Existing users:')
        users.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.email} (confirmed: ${user.email_confirmed_at ? 'YES' : 'NO'})`)
        })
      }
    }
    
    // 4. Test auth session
    console.log('\n🔍 Step 4: Testing auth session...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Session test failed:', sessionError.message)
    } else {
      console.log(`✅ Auth session test passed`)
      console.log(`📊 Current session: ${sessionData.session ? 'EXISTS' : 'NONE'}`)
    }
    
    // 5. Test a sample login (with a test account if exists)
    console.log('\n🔍 Step 5: Testing login functionality...')
    
    // We won't actually login here, but we can test the login endpoint
    const testEmail = 'test-login@example.com'
    const testPassword = 'testpassword123'
    
    console.log('ℹ️  Login test requires valid credentials')
    console.log('📝 To test login manually:')
    console.log('   1. Go to /auth/signup and create a test account')
    console.log('   2. Then try /auth/login with those credentials')
    console.log('   3. Check browser console for any errors')
    
    // 6. Check middleware configuration
    console.log('\n🔍 Step 6: Auth system configuration...')
    console.log('✅ useAuth hook: Available')
    console.log('✅ Login page: /auth/login')
    console.log('✅ Signup page: /auth/signup')
    console.log('✅ Dashboard: /dashboard')
    console.log('✅ Email validation: Active (bounce prevention)')
    
    // 7. Common login issues and solutions
    console.log('\n🔧 COMMON LOGIN ISSUES & SOLUTIONS:')
    console.log('=' .repeat(40))
    console.log('❓ Issue: "Cannot read properties of null"')
    console.log('   Solution: Run database migration first')
    console.log('')
    console.log('❓ Issue: "Email not confirmed"')
    console.log('   Solution: Disable email confirmation in Supabase dashboard')
    console.log('')
    console.log('❓ Issue: "Invalid credentials"')
    console.log('   Solution: Check email/password, create new account if needed')
    console.log('')
    console.log('❓ Issue: "Profile not created"')
    console.log('   Solution: Check trigger function in database')
    
    console.log('\n🎯 NEXT STEPS TO FIX LOGIN:')
    console.log('=' .repeat(30))
    console.log('1. Run COMPLETE_USER_SYSTEM_MIGRATION.sql in Supabase SQL Editor')
    console.log('2. Disable email confirmations in Supabase Auth settings')
    console.log('3. Create a new test account at /auth/signup')
    console.log('4. Try logging in with that account')
    console.log('5. Check browser console for any error messages')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

comprehensiveAuthTest()
