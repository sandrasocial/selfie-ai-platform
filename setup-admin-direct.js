/**
 * Direct Admin Table Setup via Supabase Management API
 * This script creates the user_profiles table and admin system
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 SELFIE AI™ Admin Setup via Management API');
console.log('📊 Database:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupAdminSystem() {
  try {
    console.log('\n📋 Setting up admin system...');

    // First, let's check if the table already exists
    const { data: existingData, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ user_profiles table already exists!');
      console.log('📊 Checking for admin user...');
      
      const { data: adminData, error: adminError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', 'ssa@ssasocial.com')
        .single();

      if (adminData) {
        console.log('✅ Admin user already exists:', adminData);
      } else {
        console.log('ℹ️  Admin user not found. They need to sign up first.');
      }
      return;
    }

    console.log('🔧 Table does not exist. Need to create it.');
    console.log('⚠️  Unfortunately, we cannot create tables via the REST API.');
    console.log('📝 Please run the following SQL in your Supabase SQL Editor:');
    console.log('\n' + '='.repeat(60));
    
    const adminSQL = `-- SELFIE AI™ Admin System Setup
-- Run this SQL in your Supabase SQL Editor

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

-- Create indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles(email);
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_idx ON public.user_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
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

-- Grant necessary permissions
GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Function to automatically create user profiles and assign admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, is_admin, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    -- Automatically make ssa@ssasocial.com a super admin
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN true ELSE false END,
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN 'super_admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run the function when new users sign up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'SELFIE AI™ Admin System Setup Complete!' as message;`;

    console.log(adminSQL);
    console.log('='.repeat(60));
    console.log('\n📋 Instructions:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Run the SQL');
    console.log('5. Sign up at /admin/login with ssa@ssasocial.com');
    console.log('\n✨ The admin system will be ready to use!');

  } catch (error) {
    console.error('❌ Error setting up admin system:', error);
  }
}

setupAdminSystem();
