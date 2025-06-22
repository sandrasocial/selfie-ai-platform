/**
 * SELFIE AI™ Admin System - Automated Table Creation
 * This script attempts to create the admin tables using various methods
 */
require('dotenv').config({ path: '.env.local' });
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 SELFIE AI™ Automated Admin Setup');
console.log('📊 Database:', supabaseUrl);

// Extract project ref from URL
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
console.log('🔗 Project Ref:', projectRef);

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

async function createTablesViaAPI() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: adminSQL
    });

    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('📊 Response Status:', res.statusCode);
        console.log('📊 Response:', data);
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function setupAdmin() {
  try {
    console.log('\n🔧 Attempting to create admin tables via API...');
    
    try {
      const result = await createTablesViaAPI();
      console.log('✅ Tables created successfully!');
      console.log('📊 Result:', result);
    } catch (apiError) {
      console.log('⚠️  API method failed:', apiError.message);
      console.log('\n📝 Manual Setup Required:');
      console.log('1. Go to https://supabase.com/dashboard/project/' + projectRef);
      console.log('2. Navigate to SQL Editor');
      console.log('3. Run the SQL from admin-setup.sql file');
      console.log('4. Sign up at /admin/login with ssa@ssasocial.com');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupAdmin();
