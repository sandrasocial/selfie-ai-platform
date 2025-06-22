/**
 * Direct SQL Table Creation for SELFIE AI™ Admin System
 * This script creates the necessary tables using direct database connection
 */
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 SELFIE AI™ Direct Table Setup');
console.log('📊 Database:', supabaseUrl);

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAdminTables() {
  try {
    console.log('\n📋 Creating admin tables...');

    // Create user_profiles table with direct SQL
    const { error: tableError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (!tableError) {
      console.log('✅ user_profiles table already exists!');
      await checkAdminUser();
      return true;
    }

    console.log('🔧 Table does not exist, attempting to create...');

    // Since we can't execute raw SQL via the REST API easily, 
    // let's create the SQL file and provide instructions
    const fs = require('fs');
    const setupSQL = `-- SELFIE AI™ Admin System Setup
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
SELECT 'SELFIE AI™ Admin System Setup Complete!' as message;
`;

    fs.writeFileSync('admin-setup.sql', setupSQL);
    console.log('📁 Created admin-setup.sql file');

    console.log('\n' + '='.repeat(70));
    console.log('🎯 MANUAL SETUP REQUIRED');
    console.log('');
    console.log('1. Open your Supabase project dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the SQL from admin-setup.sql file');
    console.log('4. Or copy the SQL below:');
    console.log('');
    console.log(setupSQL);
    console.log('='.repeat(70));

    return false;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function checkAdminUser() {
  try {
    console.log('🔍 Checking for admin user...');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('email, role, is_admin')
      .eq('email', 'ssa@ssasocial.com')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      console.log('✅ Admin user exists:', data);
    } else {
      console.log('ℹ️  Admin user will be created automatically when ssa@ssasocial.com signs up');
    }

    return true;
  } catch (error) {
    console.log('⚠️  Could not check admin user:', error.message);
    return false;
  }
}

async function testTableAccess() {
  try {
    console.log('\n🧪 Testing table access...');
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Table access test failed:', error.message);
      return false;
    }

    console.log('✅ Table access successful!');
    return true;
  } catch (error) {
    console.log('❌ Table access error:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n🎯 Starting admin system setup...\n');
  
  const success = await createAdminTables();
  
  if (success) {
    await testTableAccess();
    console.log('\n🎉 Setup complete! You can now sign up at /admin/login');
  } else {
    console.log('\n📋 Please run the SQL manually in Supabase as shown above');
  }

  console.log('\n🚀 Next steps after running the SQL:');
  console.log('1. Go to /admin/login');
  console.log('2. Sign up with: ssa@ssasocial.com');
  console.log('3. Choose a secure password');
  console.log('4. You will automatically become super_admin!');
  console.log('5. Access the full admin panel');
}

main();
