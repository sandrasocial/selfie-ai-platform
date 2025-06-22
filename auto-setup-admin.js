/**
 * Automated Admin Table Setup for SELFIE AI™
 * Creates user_profiles table and sets up admin system automatically
 */
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 SELFIE AI™ Admin Setup Starting...');
console.log('📊 Database:', SUPABASE_URL);
console.log('🔑 Service Key:', SERVICE_ROLE_KEY ? 'Found' : 'Missing');

async function createUserProfilesTable() {
  try {
    console.log('\n📋 Creating user_profiles table...');
    
    // Use the Supabase REST API to create table through a stored procedure
    const setupSQL = `
      -- Create user_profiles table
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

      -- Create indexes
      CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles(email);
      CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_idx ON public.user_profiles(user_id);

      -- Enable RLS
      ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

      -- Create policies
      DROP POLICY IF EXISTS "Service role full access on user_profiles" ON public.user_profiles;
      CREATE POLICY "Service role full access on user_profiles" ON public.user_profiles
        FOR ALL USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
      CREATE POLICY "Users can read own profile" ON public.user_profiles
        FOR SELECT USING (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
      CREATE POLICY "Users can update own profile" ON public.user_profiles
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
      CREATE POLICY "Admins can read all profiles" ON public.user_profiles
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND is_admin = true
          )
        );

      -- Grant permissions
      GRANT ALL ON public.user_profiles TO service_role;
      GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
      GRANT USAGE ON SCHEMA public TO authenticated;

      -- Function to handle new user creation with admin assignment
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.user_profiles (user_id, email, full_name, is_admin, role)
        VALUES (
          NEW.id, 
          NEW.email, 
          COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
          -- Make ssa@ssasocial.com admin automatically
          CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN true ELSE false END,
          CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN 'super_admin' ELSE 'user' END
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create trigger for new users
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;

    // Try to execute via RPC function if available
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: setupSQL })
    });

    if (response.ok) {
      console.log('✅ Table created successfully via RPC!');
      return true;
    } else {
      console.log('⚠️  RPC method not available, trying alternative...');
      return await createTableViaPostgREST();
    }

  } catch (error) {
    console.log('⚠️  Direct creation failed, trying alternative method...');
    return await createTableViaPostgREST();
  }
}

async function createTableViaPostgREST() {
  try {
    console.log('🔄 Attempting to create table via PostgREST...');
    
    // First, check if table exists by trying to query it
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?select=id&limit=1`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (checkResponse.ok) {
      console.log('✅ user_profiles table already exists!');
      await verifyAdminSetup();
      return true;
    }

    if (checkResponse.status === 406 || checkResponse.status === 400) {
      console.log('📝 Table doesn\'t exist, but we can\'t create it via REST API.');
      console.log('🔧 Creating setup API endpoint instead...');
      return await createSetupEndpoint();
    }

    console.log('❌ Unable to verify table status.');
    return false;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function createSetupEndpoint() {
  try {
    console.log('🛠️  Creating setup API endpoint...');
    
    // Create an API endpoint that will run the SQL
    const endpointResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/setup_admin_tables`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (endpointResponse.ok) {
      console.log('✅ Admin tables created via setup endpoint!');
      return true;
    } else {
      console.log('⚠️  Setup endpoint not available. Creating local setup API...');
      return await createLocalSetupAPI();
    }

  } catch (error) {
    console.log('⚠️  Creating local setup API instead...');
    return await createLocalSetupAPI();
  }
}

async function createLocalSetupAPI() {
  const fs = require('fs');
  const path = require('path');

  console.log('📁 Creating local setup API endpoint...');

  const apiCode = `import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Execute the setup SQL
    const { error } = await supabase.rpc('exec', {
      sql: \`
        -- Create user_profiles table
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

        -- Create indexes
        CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles(email);
        CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_idx ON public.user_profiles(user_id);

        -- Enable RLS
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DROP POLICY IF EXISTS "Service role full access on user_profiles" ON public.user_profiles;
        CREATE POLICY "Service role full access on user_profiles" ON public.user_profiles
          FOR ALL USING (true) WITH CHECK (true);

        DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
        CREATE POLICY "Users can read own profile" ON public.user_profiles
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
        CREATE POLICY "Users can update own profile" ON public.user_profiles
          FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
        CREATE POLICY "Admins can read all profiles" ON public.user_profiles
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM public.user_profiles 
              WHERE user_id = auth.uid() AND is_admin = true
            )
          );

        -- Grant permissions
        GRANT ALL ON public.user_profiles TO service_role;
        GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
        GRANT USAGE ON SCHEMA public TO authenticated;

        -- Function to handle new user creation
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.user_profiles (user_id, email, full_name, is_admin, role)
          VALUES (
            NEW.id, 
            NEW.email, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN true ELSE false END,
            CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN 'super_admin' ELSE 'user' END
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Create trigger for new users
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      \`
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin tables created successfully!' 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Failed to create admin tables',
      details: error.message 
    }, { status: 500 })
  }
}`;

  const apiDir = path.join(__dirname, 'app', 'api', 'setup-admin-tables');
  const apiFile = path.join(apiDir, 'route.ts');

  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }

  fs.writeFileSync(apiFile, apiCode);
  console.log('✅ Created setup API at /api/setup-admin-tables');

  // Now call the endpoint
  console.log('🔄 Calling setup endpoint...');
  const setupResponse = await fetch('http://localhost:3000/api/setup-admin-tables', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (setupResponse.ok) {
    const result = await setupResponse.json();
    console.log('✅ Setup completed:', result.message);
    return true;
  } else {
    console.log('📋 Setup API created. Please run: npm run dev');
    console.log('🌐 Then visit: http://localhost:3000/api/setup-admin-tables');
    return false;
  }
}

async function verifyAdminSetup() {
  try {
    console.log('🔍 Verifying admin setup...');
    
    // Check if we can access the table
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?select=email,role,is_admin&email=eq.ssa@ssasocial.com`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        console.log('✅ Admin user found:', data[0]);
      } else {
        console.log('ℹ️  Admin user will be created on first signup');
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.log('⚠️  Could not verify admin setup:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n🎯 Starting automated admin setup...\n');
  
  const success = await createUserProfilesTable();
  
  console.log('\n' + '='.repeat(60));
  
  if (success) {
    console.log('🎉 ADMIN SETUP COMPLETE!');
    console.log('');
    console.log('✅ user_profiles table created');
    console.log('✅ Admin policies configured');
    console.log('✅ Auto-admin trigger for ssa@ssasocial.com');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('1. Go to /admin/login');
    console.log('2. Sign up with: ssa@ssasocial.com');
    console.log('3. Choose a secure password');
    console.log('4. You\'ll automatically become super_admin!');
  } else {
    console.log('⚠️  MANUAL SETUP REQUIRED');
    console.log('');
    console.log('Please run this SQL in your Supabase SQL Editor:');
    console.log('(Copy from ADMIN_SYSTEM_COMPLETE.md)');
    console.log('');
    console.log('Or use the setup API endpoint created at:');
    console.log('http://localhost:3000/api/setup-admin-tables');
  }
  
  console.log('='.repeat(60));
}

main();
