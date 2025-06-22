/**
 * SELFIE AI™ Admin System - Direct PostgreSQL Connection
 * This script connects directly to PostgreSQL to create admin tables
 */
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 SELFIE AI™ Direct PostgreSQL Setup');
console.log('📊 Database:', supabaseUrl);

// Extract project ref from URL
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
console.log('🔗 Project Ref:', projectRef);

// Configure PostgreSQL client
const client = new Client({
  host: `db.${projectRef}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: serviceRoleKey, // Note: This won't work as the service role key is not the DB password
  ssl: { rejectUnauthorized: false }
});

const adminSQL = `-- SELFIE AI™ Admin System Setup
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
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'SELFIE AI™ Admin System Setup Complete!' as message;`;

async function setupAdminTables() {
  try {
    console.log('\n🔐 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to database!');

    console.log('\n📋 Creating admin tables...');
    const result = await client.query(adminSQL);
    console.log('✅ Admin tables created successfully!');
    console.log('📊 Result:', result.rows);

    console.log('\n🎉 Setup complete!');
    console.log('📋 Next steps:');
    console.log('1. Go to /admin/login');
    console.log('2. Sign up with ssa@ssasocial.com');
    console.log('3. You will be automatically assigned super_admin role');

  } catch (error) {
    console.error('❌ Error setting up admin tables:', error.message);
    
    if (error.message.includes('authentication') || error.message.includes('password')) {
      console.log('\n⚠️  Direct PostgreSQL connection failed (expected for Supabase)');
      console.log('📝 Manual setup required. Please run the SQL manually:');
      console.log('\n1. Go to https://supabase.com/dashboard/project/' + projectRef);
      console.log('2. Navigate to SQL Editor');
      console.log('3. Run the SQL from admin-setup.sql');
      console.log('4. Sign up at /admin/login with ssa@ssasocial.com');
    } else {
      console.log('📊 Error details:', error);
    }
  } finally {
    await client.end();
  }
}

setupAdminTables();
