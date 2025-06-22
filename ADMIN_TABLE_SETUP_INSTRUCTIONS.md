# ADMIN TABLE SETUP - FINAL INSTRUCTIONS

## Summary
I've attempted to create the admin tables for you using multiple automated approaches. Unfortunately, **Supabase requires manual SQL execution for security reasons**, so the tables need to be created manually through the Supabase dashboard.

## ✅ What I've Done

1. **Created multiple setup scripts** for different approaches
2. **Tested API routes** and database connections  
3. **Confirmed table status** - user_profiles table does not exist yet
4. **Updated the API endpoint** with better error handling and instructions
5. **Prepared all necessary SQL** and setup files

## 🎯 RECOMMENDED SOLUTION: Manual SQL Execution

### Step 1: Access Supabase SQL Editor
Go to: **https://supabase.com/dashboard/project/usrustscragennskanfh/sql/new**

### Step 2: Copy and Paste the SQL
Use the SQL from the `admin-setup.sql` file in your project root:

```sql
-- SELFIE AI™ Admin System Setup
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

-- Create RLS Policies (drop first if exists, then create)
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
```

### Step 3: Run the SQL
Click the "Run" button in the SQL Editor

### Step 4: Access Admin System
1. Go to your app: **http://localhost:3001/admin/login**
2. Sign up with: **ssa@ssasocial.com**
3. You'll be automatically assigned **super_admin** role
4. Access the full admin panel with all permissions

## 🔧 Alternative Methods (If Needed)

### Method 2: API Route Test
Visit: **http://localhost:3001/api/setup-admin-tables**
- This will check table status and provide instructions

### Method 3: Supabase CLI (Advanced)
```bash
npm install -g supabase
supabase login
supabase link --project-ref usrustscragennskanfh
supabase db push
```

## 📊 Created Files & Scripts

1. **admin-setup.sql** - Ready-to-run SQL for manual execution
2. **setup-admin-direct.js** - Node.js script for checking table status
3. **create-admin-automated.js** - Automated setup attempt
4. **create-tables-direct-pg.js** - PostgreSQL direct connection attempt
5. **final-admin-setup.js** - Comprehensive instructions
6. **Updated API route** - `/api/setup-admin-tables` with better handling

## ✨ What Happens After Setup

Once the SQL is executed:

1. **user_profiles table** will be created with proper schema
2. **RLS policies** will be enabled for security
3. **Automatic trigger** will create profiles for new users
4. **ssa@ssasocial.com** will be auto-assigned super_admin role
5. **Admin system** will be fully functional

## 🎉 Admin System Features

After setup, you'll have access to:
- **User Management** - View and manage all user profiles
- **Role-Based Access** - Control user permissions and roles
- **Content Management** - Manage site content and pages
- **AI Agent Configuration** - Configure AI tools and responses
- **Analytics Dashboard** - View platform metrics and insights
- **Platform Settings** - Configure system-wide settings

## 🔄 Next Steps

1. **Execute the SQL** in Supabase dashboard
2. **Sign up as admin** at /admin/login
3. **Test admin access** and explore the admin panel
4. **Continue development** with full admin system ready

The admin system is now fully prepared and just needs the manual SQL execution to complete the setup!
