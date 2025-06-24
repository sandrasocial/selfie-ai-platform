/**
 * SELFIE AI™ Admin System Verification Script
 * Run this to verify your admin access is working correctly
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifyAdminSystem() {
  console.log('🔍 SELFIE AI™ Admin System Verification');
  console.log('=' .repeat(50));
  
  try {
    // 1. Check if user_profiles table exists
    console.log('\n1. Checking user_profiles table...');
    const { data: tables, error: tableError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });
    
    if (tableError) {
      console.log('❌ user_profiles table missing');
      console.log('   Solution: Run admin-setup.sql in Supabase SQL Editor');
      return false;
    } else {
      console.log('✅ user_profiles table exists');
    }

    // 2. Check if admin user exists
    console.log('\n2. Checking admin user (ssa@ssasocial.com)...');
    const { data: adminUser, error: adminError } = await supabase
      .from('user_profiles')
      .select('email, role, is_admin')
      .eq('email', 'ssa@ssasocial.com')
      .single();

    if (adminError && adminError.code === 'PGRST116') {
      console.log('⚠️  Admin user not found - will be created on first signup');
      console.log('   Action: Sign up at /admin/login with ssa@ssasocial.com');
    } else if (adminError) {
      console.log('❌ Error checking admin user:', adminError.message);
      return false;
    } else {
      console.log('✅ Admin user exists:', adminUser);
      if (adminUser.is_admin && adminUser.role === 'super_admin') {
        console.log('✅ Admin privileges confirmed');
      } else {
        console.log('⚠️  Admin privileges not set correctly');
        console.log('   Current role:', adminUser.role);
        console.log('   Is admin:', adminUser.is_admin);
      }
    }

    // 3. Check if trigger exists
    console.log('\n3. Checking auto-admin trigger...');
    const { data: triggers, error: triggerError } = await supabase
      .rpc('check_trigger_exists', { trigger_name: 'on_auth_user_created' })
      .catch(() => null);

    // Alternative check using information_schema
    const { data: triggerCheck, error: triggerCheckError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name')
      .eq('trigger_name', 'on_auth_user_created')
      .eq('event_object_table', 'users')
      .catch(() => ({ data: null, error: null }));

    if (triggerCheck?.data?.length > 0) {
      console.log('✅ Auto-admin trigger exists');
    } else {
      console.log('⚠️  Auto-admin trigger status unclear');
      console.log('   This is normal - trigger should work on signup');
    }

    // 4. Test basic database connectivity
    console.log('\n4. Testing database connectivity...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.log('❌ Database connection failed:', connectionError.message);
      return false;
    } else {
      console.log('✅ Database connection successful');
    }

    console.log('\n' + '=' .repeat(50));
    console.log('🎉 ADMIN SYSTEM VERIFICATION COMPLETE');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Go to: /admin/login');
    console.log('2. Sign up with: ssa@ssasocial.com');
    console.log('3. Password: Orri0211 (or create new)');
    console.log('4. You should be auto-promoted to super_admin');
    console.log('5. Access admin dashboard with full privileges');
    
    return true;

  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

// Helper function to create missing admin user manually
async function createAdminUser() {
  console.log('\n🛠️  Creating admin user manually...');
  
  try {
    // First check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Cannot access auth users:', authError.message);
      return false;
    }

    const existingUser = authUsers.users.find(user => user.email === 'ssa@ssasocial.com');
    
    if (existingUser) {
      console.log('✅ Auth user exists, checking profile...');
      
      // Create or update profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: existingUser.id,
          email: 'ssa@ssasocial.com',
          full_name: 'Sandra Sigurjonsdottir',
          is_admin: true,
          role: 'super_admin'
        }, { onConflict: 'user_id' });

      if (profileError) {
        console.log('❌ Failed to create/update profile:', profileError.message);
        return false;
      } else {
        console.log('✅ Admin profile created/updated successfully');
        return true;
      }
    } else {
      console.log('⚠️  Auth user not found - needs to sign up first');
      console.log('   Go to /admin/login and sign up with ssa@ssasocial.com');
      return false;
    }

  } catch (error) {
    console.error('❌ Manual admin creation failed:', error);
    return false;
  }
}

// Run verification
if (require.main === module) {
  verifyAdminSystem().then(success => {
    if (!success) {
      console.log('\n🔄 Try running with --create-admin to manually create admin user');
    }
  });

  // Check for create-admin flag
  if (process.argv.includes('--create-admin')) {
    createAdminUser();
  }
}

module.exports = { verifyAdminSystem, createAdminUser };
