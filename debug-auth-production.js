#!/usr/bin/env node

/**
 * SSELFIE AI™ Production Authentication Debug Script
 * 
 * This script tests the authentication system directly against production
 * Supabase instance to identify issues with login flow.
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration - update these with production values
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
  testEmail: 'ssa@ssasocial.com',
  testPassword: 'Orri0211'
};

console.log('🔍 SSELFIE AI™ Production Auth Debug');
console.log('=====================================\n');

async function debugAuth() {
  try {
    // Step 1: Test environment variables
    console.log('1️⃣ Testing Environment Variables...');
    console.log(`   Supabase URL: ${config.supabaseUrl ? '✅ SET' : '❌ MISSING'}`);
    console.log(`   Supabase Key: ${config.supabaseKey ? '✅ SET' : '❌ MISSING'}`);
    
    if (!config.supabaseUrl || !config.supabaseKey) {
      console.log('❌ Missing required environment variables');
      return;
    }
    
    if (config.supabaseUrl.includes('YOUR_SUPABASE')) {
      console.log('❌ Please update the configuration with real Supabase values');
      return;
    }
    
    console.log(`   URL Domain: ${new URL(config.supabaseUrl).hostname}`);
    console.log(`   Key Length: ${config.supabaseKey.length} chars\n`);
    
    // Step 2: Test Supabase client creation
    console.log('2️⃣ Testing Supabase Client...');
    const supabase = createClient(config.supabaseUrl, config.supabaseKey);
    console.log('   ✅ Client created successfully\n');
    
    // Step 3: Test basic connection
    console.log('3️⃣ Testing Basic Connection...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log(`   ❌ Session error: ${sessionError.message}`);
    } else {
      console.log('   ✅ Session check successful');
      console.log(`   Current session: ${sessionData.session ? 'EXISTS' : 'NONE'}\n`);
    }
    
    // Step 4: Test database connection
    console.log('4️⃣ Testing Database Connection...');
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Database error: ${error.message}`);
        console.log(`   Error code: ${error.code}`);
        console.log(`   Error hint: ${error.hint || 'None'}`);
      } else {
        console.log('   ✅ Database connection successful\n');
      }
    } catch (dbError) {
      console.log(`   ❌ Database connection failed: ${dbError.message}\n`);
    }
    
    // Step 5: Test admin login
    console.log('5️⃣ Testing Admin Login...');
    console.log(`   Email: ${config.testEmail}`);
    console.log(`   Password: ${config.testPassword.replace(/./g, '*')}`);
    
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: config.testEmail,
      password: config.testPassword
    });
    
    if (loginError) {
      console.log(`   ❌ Login failed: ${loginError.message}`);
      console.log(`   Error code: ${loginError.status || 'unknown'}`);
      
      // Check if user exists
      console.log('\n6️⃣ Checking if user exists...');
      try {
        const { data: users } = await supabase.auth.admin.listUsers();
        const userExists = users?.users?.find(u => u.email === config.testEmail);
        console.log(`   User exists: ${userExists ? '✅ YES' : '❌ NO'}`);
        if (userExists) {
          console.log(`   User confirmed: ${userExists.email_confirmed_at ? '✅ YES' : '❌ NO'}`);
          console.log(`   User created: ${userExists.created_at}`);
        }
      } catch (adminError) {
        console.log(`   ❌ Admin check failed: ${adminError.message}`);
      }
    } else {
      console.log('   ✅ Login successful!');
      console.log(`   User ID: ${loginData.user?.id}`);
      console.log(`   Email: ${loginData.user?.email}`);
      console.log(`   Email confirmed: ${loginData.user?.email_confirmed_at ? '✅ YES' : '❌ NO'}`);
      
      // Step 6: Test profile loading
      console.log('\n6️⃣ Testing Profile Loading...');
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', loginData.user?.id)
        .single();
      
      if (profileError) {
        console.log(`   ❌ Profile error: ${profileError.message}`);
        console.log(`   Error code: ${profileError.code}`);
        
        // Check if profiles table exists and has correct structure
        console.log('\n7️⃣ Checking Profiles Table...');
        try {
          const { data: allProfiles, error: allError } = await supabase
            .from('user_profiles')
            .select('user_id, email, role, is_admin')
            .limit(5);
          
          if (allError) {
            console.log(`   ❌ Table access error: ${allError.message}`);
          } else {
            console.log(`   ✅ Table accessible, ${allProfiles?.length || 0} profiles found`);
          }
        } catch (tableError) {
          console.log(`   ❌ Table check failed: ${tableError.message}`);
        }
      } else {
        console.log('   ✅ Profile loaded successfully!');
        console.log(`   Role: ${profile.role}`);
        console.log(`   Is Admin: ${profile.is_admin ? '✅ YES' : '❌ NO'}`);
        console.log(`   Email: ${profile.email}`);
        
        if (profile.is_admin) {
          console.log('\n🎉 ADMIN ACCESS CONFIRMED - Login should work in production!');
        } else {
          console.log('\n⚠️  ADMIN ACCESS NOT DETECTED - Check admin role assignment');
        }
      }
      
      // Clean up - sign out
      await supabase.auth.signOut();
      console.log('\n🔐 Signed out successfully');
    }
    
  } catch (error) {
    console.log(`\n💥 Unexpected error: ${error.message}`);
    console.log('Stack trace:', error.stack);
  }
}

// Run the debug
debugAuth().then(() => {
  console.log('\n✅ Debug complete!');
  process.exit(0);
}).catch((error) => {
  console.log(`\n❌ Debug failed: ${error.message}`);
  process.exit(1);
});
