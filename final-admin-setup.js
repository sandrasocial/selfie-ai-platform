/**
 * SELFIE AI™ Admin System - Management API Setup
 * This script uses Supabase Management API to create migrations
 */
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 SELFIE AI™ Management API Setup');
console.log('📊 Database:', supabaseUrl);

// Extract project ref from URL
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
console.log('🔗 Project Ref:', projectRef);

const migrationSQL = `-- SELFIE AI™ Admin System Setup Migration
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

CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles(email);
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_idx ON public.user_profiles(user_id);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Service role full access on user_profiles" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can read all profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

// Since all automated methods have limitations, let's provide the user with all possible options
async function provideFinalInstructions() {
  console.log('\n📋 SELFIE AI™ Admin System Setup Instructions');
  console.log('=' .repeat(60));
  console.log('\n🎯 OPTION 1: Manual SQL Execution (Recommended)');
  console.log('1. Go to: https://supabase.com/dashboard/project/' + projectRef);
  console.log('2. Navigate to: SQL Editor');
  console.log('3. Copy and paste the SQL from: admin-setup.sql');
  console.log('4. Click "Run" to execute the SQL');
  console.log('5. Sign up at /admin/login with ssa@ssasocial.com');
  
  console.log('\n🎯 OPTION 2: Use Supabase CLI (Advanced)');
  console.log('1. Install Supabase CLI: npm install -g supabase');
  console.log('2. Login: supabase login');
  console.log('3. Link project: supabase link --project-ref ' + projectRef);
  console.log('4. Apply migration: supabase db push');
  
  console.log('\n🎯 OPTION 3: API Route (Fallback)');
  console.log('1. Visit: /api/setup-admin-tables');
  console.log('2. This will attempt to create tables via Next.js API');
  
  console.log('\n📊 Ready-to-use SQL:');
  console.log('-'.repeat(40));
  console.log(migrationSQL);
  console.log('-'.repeat(40));
  
  console.log('\n✨ After setup:');
  console.log('• Go to /admin/login');
  console.log('• Sign up with ssa@ssasocial.com');
  console.log('• You will be automatically assigned super_admin role');
  console.log('• Access full admin panel with all permissions');
  
  console.log('\n🔧 Admin System Features:');
  console.log('• User management and profiles');
  console.log('• Role-based access control');
  console.log('• Content management tools');
  console.log('• AI agent configuration');
  console.log('• Analytics and reporting');
  console.log('• Platform settings');
}

provideFinalInstructions();
