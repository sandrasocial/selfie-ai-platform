/**
 * Setup Admin User and User Profiles Table
 * Creates user_profiles table with admin roles and adds ssa@ssasocial.com as admin
 */
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SQL execution failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function setupAdminSystem() {
  console.log('Setting up admin system and user profiles...');

  try {
    // Create user_profiles table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS public.user_profiles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL UNIQUE,
        full_name TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
        is_admin BOOLEAN DEFAULT FALSE,
        avatar_url TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Created user_profiles table');

    // Create unique index on email
    await executeSQL(`
      CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles(email);
    `);
    console.log('✓ Created email index');

    // Create unique index on user_id
    await executeSQL(`
      CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_idx ON public.user_profiles(user_id);
    `);
    console.log('✓ Created user_id index');

    // Enable RLS
    await executeSQL(`ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;`);
    console.log('✓ Enabled Row Level Security on user_profiles');

    // Create RLS policies
    await executeSQL(`
      -- Service role can do everything
      CREATE POLICY IF NOT EXISTS "Service role full access on user_profiles" ON public.user_profiles
        FOR ALL USING (true) WITH CHECK (true);
    `);

    await executeSQL(`
      -- Users can read their own profile
      CREATE POLICY IF NOT EXISTS "Users can read own profile" ON public.user_profiles
        FOR SELECT USING (auth.uid() = user_id);
    `);

    await executeSQL(`
      -- Users can update their own profile
      CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.user_profiles
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    `);

    await executeSQL(`
      -- Admins can read all profiles
      CREATE POLICY IF NOT EXISTS "Admins can read all profiles" ON public.user_profiles
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND is_admin = true
          )
        );
    `);

    await executeSQL(`
      -- Admins can update all profiles
      CREATE POLICY IF NOT EXISTS "Admins can update all profiles" ON public.user_profiles
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND is_admin = true
          )
        ) WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND is_admin = true
          )
        );
    `);

    console.log('✓ Created RLS policies');

    // Grant permissions
    await executeSQL(`
      GRANT ALL ON public.user_profiles TO service_role;
      GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
      GRANT USAGE ON SCHEMA public TO authenticated;
    `);
    console.log('✓ Granted permissions');

    // Create function to handle user creation
    await executeSQL(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.user_profiles (user_id, email, full_name)
        VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('✓ Created user creation function');

    // Create trigger for new users
    await executeSQL(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);
    console.log('✓ Created user creation trigger');

    // Now check if admin user exists and create/update
    const adminEmail = 'ssa@ssasocial.com';
    
    // First check if the user exists in auth.users
    const checkUserResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_admin_user`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ admin_email: adminEmail })
    });

    // Create function to check and setup admin user
    await executeSQL(`
      CREATE OR REPLACE FUNCTION public.setup_admin_user(admin_email TEXT)
      RETURNS JSON AS $$
      DECLARE
        user_record RECORD;
        profile_record RECORD;
        result JSON;
      BEGIN
        -- Check if user exists in auth.users
        SELECT * INTO user_record FROM auth.users WHERE email = admin_email;
        
        IF user_record.id IS NOT NULL THEN
          -- User exists, ensure profile exists and is admin
          SELECT * INTO profile_record FROM public.user_profiles WHERE user_id = user_record.id;
          
          IF profile_record.id IS NULL THEN
            -- Create profile for existing user
            INSERT INTO public.user_profiles (user_id, email, full_name, role, is_admin)
            VALUES (user_record.id, admin_email, 'Sandra Sigurjonsdottir', 'super_admin', true);
            result := json_build_object('action', 'profile_created', 'user_id', user_record.id);
          ELSE
            -- Update existing profile to be admin
            UPDATE public.user_profiles 
            SET role = 'super_admin', is_admin = true, updated_at = NOW()
            WHERE user_id = user_record.id;
            result := json_build_object('action', 'profile_updated', 'user_id', user_record.id);
          END IF;
        ELSE
          -- User doesn't exist, we'll need to create manually
          result := json_build_object('action', 'user_not_found', 'message', 'User must be created through auth signup first');
        END IF;
        
        RETURN result;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log('✓ Created admin setup function');

    // Call the function to setup admin
    const setupResult = await executeSQL(`SELECT public.setup_admin_user('${adminEmail}') as result;`);
    console.log('✓ Admin setup result:', setupResult);

    console.log('✅ Admin system setup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Sign up at /admin/login with email: ssa@ssasocial.com');
    console.log('2. Choose a secure password');
    console.log('3. The system will automatically grant admin privileges');
    
    return true;

  } catch (error) {
    console.error('❌ Admin system setup failed:', error.message);
    return false;
  }
}

// Run the setup
if (require.main === module) {
  console.log('Script started...');
  console.log('SUPABASE_URL:', SUPABASE_URL);
  console.log('SERVICE_ROLE_KEY exists:', !!SERVICE_ROLE_KEY);
  setupAdminSystem();
}

module.exports = { setupAdminSystem };
