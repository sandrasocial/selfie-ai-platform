// Test User Creation After Migration
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function testUserCreation() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🧪 Testing User Creation Flow\n')

  try {
    // Step 1: Check if migration worked
    console.log('1️⃣ Checking migration status...')
    const { data: testProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('tier, onboarding_status')
      .limit(1)
    
    if (profileError && profileError.message.includes('column "tier" does not exist')) {
      console.log('❌ Migration not complete - tier column missing')
      console.log('📋 Please run the migration in Supabase SQL Editor first')
      return false
    } else {
      console.log('✅ Migration appears successful')
    }

    // Step 2: List current users
    console.log('\n2️⃣ Checking current users...')
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.log('❌ Cannot access users:', usersError.message)
      return false
    }
    
    console.log(`👥 Current users in auth.users: ${users.users.length}`)
    users.users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.id})`)
    })

    // Step 3: Check user_profiles
    console.log('\n3️⃣ Checking user_profiles...')
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (profilesError) {
      console.log('❌ Cannot access user_profiles:', profilesError.message)
      return false
    }
    
    console.log(`📊 Profiles in user_profiles: ${profiles.length}`)
    profiles.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.email} - Tier: ${profile.tier} - Admin: ${profile.is_admin}`)
    })

    return true

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

async function testSignup() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Use anon key for signup (simulating frontend)
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('\n🆕 Testing Signup Flow...')

  const testEmail = `test${Date.now()}@gmail.com`
  const testPassword = 'TestPassword123!'
  const testName = 'Test User'

  try {
    console.log(`📧 Creating test user: ${testEmail}`)
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testName
        }
      }
    })

    if (error) {
      console.log('❌ Signup failed:', error.message)
      return false
    }

    console.log('✅ Signup successful!')
    console.log(`👤 User ID: ${data.user?.id}`)
    console.log(`📧 Email: ${data.user?.email}`)
    console.log(`✉️  Confirmation sent: ${!data.user?.email_confirmed_at ? 'Yes' : 'Already confirmed'}`)

    // Wait a moment for trigger to execute
    console.log('\n⏳ Waiting for trigger to create profile...')
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check if profile was created
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: newProfile, error: profileError } = await serviceSupabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user?.id)
      .single()

    if (profileError) {
      console.log('❌ Profile creation failed:', profileError.message)
      return false
    }

    console.log('✅ Profile created successfully!')
    console.log('📊 Profile data:', {
      email: newProfile.email,
      full_name: newProfile.full_name,
      tier: newProfile.tier,
      is_admin: newProfile.is_admin,
      onboarding_status: newProfile.onboarding_status
    })

    return {
      user: data.user,
      profile: newProfile,
      testEmail,
      testPassword
    }

  } catch (error) {
    console.error('❌ Signup test failed:', error.message)
    return false
  }
}

async function testLogin(credentials) {
  if (!credentials) {
    console.log('⏭️  Skipping login test - no credentials')
    return false
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('\n🔐 Testing Login Flow...')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.testEmail,
      password: credentials.testPassword
    })

    if (error) {
      console.log('❌ Login failed:', error.message)
      return false
    }

    console.log('✅ Login successful!')
    console.log(`👤 User ID: ${data.user?.id}`)
    console.log(`📧 Email: ${data.user?.email}`)
    console.log(`🔑 Session: ${data.session ? 'Active' : 'None'}`)

    return true

  } catch (error) {
    console.error('❌ Login test failed:', error.message)
    return false
  }
}

async function main() {
  console.log('🎯 SELFIE AI™ Complete User System Test\n')
  
  const setupOk = await testUserCreation()
  if (!setupOk) {
    console.log('\n⚠️  Setup incomplete - cannot proceed with user tests')
    return
  }

  const signupResult = await testSignup()
  if (signupResult) {
    await testLogin(signupResult)
  }

  console.log('\n🎉 End-to-end test complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. Test the signup flow at: http://localhost:3000/auth/signup')
  console.log('2. Test the login flow at: http://localhost:3000/auth/login')  
  console.log('3. Check dashboard access at: http://localhost:3000/dashboard')
}

main().catch(console.error)
