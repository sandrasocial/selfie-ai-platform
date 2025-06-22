/**
 * Simple Admin Setup Script
 */
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== ADMIN SETUP SCRIPT ===');
console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SERVICE_ROLE_KEY exists:', !!SERVICE_ROLE_KEY);

async function executeSQL(sql) {
  console.log('Executing SQL...');
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

async function setupUserProfiles() {
  try {
    console.log('Creating user_profiles table...');
    
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

    // Enable RLS
    await executeSQL(`ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;`);
    console.log('✓ Enabled Row Level Security');

    // Create basic policies
    await executeSQL(`
      CREATE POLICY IF NOT EXISTS "Service role full access on user_profiles" ON public.user_profiles
        FOR ALL USING (true) WITH CHECK (true);
    `);
    console.log('✓ Created service role policy');

    // Grant permissions
    await executeSQL(`
      GRANT ALL ON public.user_profiles TO service_role;
      GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
    `);
    console.log('✓ Granted permissions');

    console.log('✅ User profiles setup complete!');
    return true;
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    return false;
  }
}

// Run immediately
setupUserProfiles();
