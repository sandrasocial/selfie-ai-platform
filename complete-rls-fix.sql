-- EMERGENCY: Complete RLS Policy Cleanup and Fix
-- This fixes ALL RLS policy issues across the SSELFIE platform
-- Run this in your Supabase SQL Editor

-- =====================================
-- STEP 1: CLEAN UP ALL EXISTING POLICIES
-- =====================================

-- Drop ALL policies on user_profiles (from all different schema files)
DROP POLICY IF EXISTS "Service role full access on user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;

-- Drop policies on other tables that might have recursive issues
DROP POLICY IF EXISTS "Users can view own content" ON public.content_vault;
DROP POLICY IF EXISTS "Users can manage own content" ON public.content_vault;
DROP POLICY IF EXISTS "Users can view own strategies" ON public.ai_visual_strategies;
DROP POLICY IF EXISTS "Users can manage own strategies" ON public.ai_visual_strategies;

-- =====================================
-- STEP 2: CREATE CLEAN, NON-RECURSIVE POLICIES
-- =====================================

-- Enable RLS on core tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- CORE PRINCIPLE: Keep it simple, no recursive queries

-- 1. Service role gets full access (for server operations)
CREATE POLICY "service_role_access" ON public.user_profiles
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Authenticated users can manage their own profile
CREATE POLICY "user_own_profile" ON public.user_profiles
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Allow new profile creation (for signup)
CREATE POLICY "allow_profile_insert" ON public.user_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================
-- STEP 3: FIX OTHER TABLES (IF THEY EXIST)
-- =====================================

-- Content vault (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'content_vault') THEN
    ALTER TABLE public.content_vault ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "service_role_content" ON public.content_vault
      FOR ALL TO service_role USING (true) WITH CHECK (true);
      
    CREATE POLICY "user_own_content" ON public.content_vault
      FOR ALL TO authenticated 
      USING (auth.uid()::text = user_id) 
      WITH CHECK (auth.uid()::text = user_id);
  END IF;
END $$;

-- AI strategies (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_visual_strategies') THEN
    ALTER TABLE public.ai_visual_strategies ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "service_role_strategies" ON public.ai_visual_strategies
      FOR ALL TO service_role USING (true) WITH CHECK (true);
      
    CREATE POLICY "user_own_strategies" ON public.ai_visual_strategies
      FOR ALL TO authenticated 
      USING (auth.uid()::text = user_id) 
      WITH CHECK (auth.uid()::text = user_id);
  END IF;
END $$;

-- =====================================
-- STEP 4: GRANT PROPER PERMISSIONS
-- =====================================

-- Grant permissions
GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant on other tables if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'content_vault') THEN
    GRANT ALL ON public.content_vault TO service_role;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_vault TO authenticated;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ai_visual_strategies') THEN
    GRANT ALL ON public.ai_visual_strategies TO service_role;
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_visual_strategies TO authenticated;
  END IF;
END $$;

-- =====================================
-- STEP 5: ENSURE ADMIN TRIGGER WORKS
-- =====================================

-- Make sure the admin trigger function exists and works
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, is_admin, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    -- Auto-admin for Sandra
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN true ELSE false END,
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN 'super_admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================
-- VERIFICATION QUERIES
-- =====================================

-- Check current policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  roles
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'content_vault', 'ai_visual_strategies')
ORDER BY tablename, policyname;

-- Test basic access
SELECT 'RLS Policy Cleanup Complete!' as status,
       COUNT(*) as total_user_profiles 
FROM public.user_profiles;

SELECT 'All RLS recursion issues should be resolved!' as message;
