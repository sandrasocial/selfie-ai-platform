const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://usrustscragennskanfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzcnVzdHNjcmFnZW5uc2thbmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjAzMDUsImV4cCI6MjA2NTgzNjMwNX0.1PpIU8BwKihkOWC99Xc4mR_54HXHBznkikG86fAXUh0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthSystem() {
  console.log('🔍 Testing SELFIE AI™ Authentication System...\n');

  try {
    // Test 1: Check if user_profiles table exists
    console.log('1. Testing database connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (tablesError) {
      console.log('❌ Database connection failed:', tablesError.message);
      return;
    }
    
    console.log('✅ Database connected successfully');

    // Test 2: Try to sign up a test user
    console.log('\n2. Testing user signup...');
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    });

    if (signUpError) {
      console.log('❌ Signup failed:', signUpError.message);
      
      // Check if it's because email confirmations are enabled
      if (signUpError.message.includes('confirm') || signUpError.message.includes('verification')) {
        console.log('\n🚨 ISSUE FOUND: Email confirmations are enabled!');
        console.log('📋 SOLUTION:');
        console.log('1. Go to Supabase Dashboard > Authentication > Settings');
        console.log('2. Find "Enable email confirmations"');
        console.log('3. Turn it OFF (uncheck the box)');
        console.log('4. Click Save');
        console.log('\nThis is likely why you cannot sign in - Supabase is waiting for email confirmation.');
      }
      return;
    }

    console.log('✅ User signup successful');
    console.log(`👤 User ID: ${signUpData.user?.id}`);
    console.log(`📧 Email: ${signUpData.user?.email}`);
    console.log(`🔗 Confirmation sent: ${signUpData.user?.email_confirmed_at ? 'No' : 'Yes'}`);

    // Test 3: Check if user profile was created
    if (signUpData.user) {
      console.log('\n3. Testing user profile creation...');
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', signUpData.user.id)
        .single();

      if (profileError) {
        console.log('❌ Profile creation failed:', profileError.message);
        console.log('This might be because the database trigger is not set up properly.');
      } else {
        console.log('✅ User profile created successfully');
        console.log(`👤 Profile: ${profile.full_name} (${profile.email})`);
      }
    }

    // Test 4: Try to sign in with the test user
    console.log('\n4. Testing user login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.log('❌ Login failed:', signInError.message);
      
      if (signInError.message.includes('confirm') || signInError.message.includes('verification')) {
        console.log('\n🚨 CONFIRMED ISSUE: Email confirmation required!');
        console.log('You need to disable email confirmations in Supabase settings.');
      }
      return;
    }

    console.log('✅ User login successful');
    console.log(`🔑 Session active: ${signInData.session ? 'Yes' : 'No'}`);

    console.log('\n🎉 Authentication system is working correctly!');
    console.log('\n📋 Next steps:');
    console.log('1. Try creating an account at /auth/signup');
    console.log('2. Try logging in at /auth/login');
    console.log('3. Access the dashboard at /dashboard');

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

testAuthSystem();
