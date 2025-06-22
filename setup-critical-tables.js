/**
 * CRITICAL DATABASE SETUP
 * Sets up missing essential tables for Selfie AI platform
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envFile = path.join(__dirname, '.env.local');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key] = valueParts.join('=');
    }
  });
}

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log('🔌 Connecting to Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'URL found' : 'URL missing');
console.log('🔑 Service key:', process.env.SUPABASE_SERVICE_KEY ? 'Key found' : 'Key missing');

async function executeSQL(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('SQL Error:', error);
    throw error;
  }
  return data;
}

async function setupCriticalTables() {
  console.log('🚀 Setting up critical missing tables...');
  
  try {
    // 1. CREATE LEADS TABLE (Critical for signups)
    console.log('📝 Creating leads table...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS public.leads (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT,
        source TEXT DEFAULT 'homepage',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'
      );
      
      CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
      CREATE INDEX IF NOT EXISTS leads_source_idx ON public.leads(source);
      CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at);
    `);
    console.log('✅ Leads table created');

    // 2. FIX PROFILES TABLE INCONSISTENCY
    console.log('🔧 Fixing profiles table...');
    
    // First check if profiles table exists
    const { data: profilesExists } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');

    const { data: userProfilesExists } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_profiles');

    if (!profilesExists?.length && userProfilesExists?.length) {
      // Create profiles as view/alias to user_profiles
      console.log('📋 Creating profiles view from user_profiles...');
      await executeSQL(`
        CREATE OR REPLACE VIEW public.profiles AS 
        SELECT 
          id,
          user_id,
          email,
          full_name,
          role,
          is_admin,
          avatar_url,
          COALESCE((metadata->>'tier'), 'free') as tier,
          metadata,
          created_at,
          updated_at
        FROM public.user_profiles;
        
        -- Grant access to the view
        GRANT SELECT ON public.profiles TO authenticated;
        GRANT SELECT ON public.profiles TO service_role;
      `);
      console.log('✅ Profiles view created');
    }

    // 3. ENSURE TIER COLUMN EXISTS
    console.log('🎯 Checking tier access...');
    await executeSQL(`
      -- Add tier to user_profiles metadata if not exists
      UPDATE public.user_profiles 
      SET metadata = jsonb_set(
        COALESCE(metadata, '{}'), 
        '{tier}', 
        '"free"'
      )
      WHERE metadata->>'tier' IS NULL OR metadata->>'tier' = '';
    `);
    console.log('✅ Tier defaults set');

    // 4. CREATE VIP APPLICATIONS TABLE
    console.log('⭐ Creating VIP applications table...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS public.vip_applications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT,
        business_description TEXT,
        goals TEXT,
        current_challenges TEXT,
        timeline TEXT,
        budget TEXT,
        application_data JSONB DEFAULT '{}',
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS vip_applications_email_idx ON public.vip_applications(email);
      CREATE INDEX IF NOT EXISTS vip_applications_status_idx ON public.vip_applications(status);
    `);
    console.log('✅ VIP applications table created');

    // 5. CREATE PHOTO VAULT TABLE
    console.log('📸 Creating photo vault table...');
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS public.photo_vault (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER,
        file_type TEXT,
        upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        tags TEXT[],
        metadata JSONB DEFAULT '{}',
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS photo_vault_user_id_idx ON public.photo_vault(user_id);
      CREATE INDEX IF NOT EXISTS photo_vault_upload_date_idx ON public.photo_vault(upload_date);
      CREATE INDEX IF NOT EXISTS photo_vault_tags_idx ON public.photo_vault USING GIN(tags);
      
      -- Enable RLS
      ALTER TABLE public.photo_vault ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY IF NOT EXISTS "Users can manage own photos" ON public.photo_vault
        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    `);
    console.log('✅ Photo vault table created');

    console.log('');
    console.log('🎉 CRITICAL TABLES SETUP COMPLETE!');
    console.log('');
    console.log('✅ Tables now available:');
    console.log('   - leads (for signups)');
    console.log('   - profiles (view of user_profiles)');
    console.log('   - user_profiles (with tier support)');
    console.log('   - vip_applications');
    console.log('   - photo_vault');
    console.log('');
    console.log('🔧 Issues fixed:');
    console.log('   - Freebie signups will now work');
    console.log('   - Authentication tier checking works');
    console.log('   - Photo vault storage ready');
    console.log('   - VIP applications can be submitted');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupCriticalTables();
