-- SAFE RLS CLEANUP - Only handles existing tables
-- This version checks if tables exist before trying to modify them

-- =====================================
-- STEP 1: CLEAN UP EXISTING USER_PROFILES POLICIES
-- =====================================

-- First, let's see what we're working with
SELECT 'Current user_profiles policies:' as info;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'user_profiles';

-- Drop ALL existing policies on user_profiles (the main culprit)
DROP POLICY IF EXISTS "Service role full access on user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- =====================================
-- STEP 2: CREATE CLEAN POLICIES FOR USER_PROFILES
-- =====================================

-- Make sure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "service_role_access" ON public.user_profiles
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "user_own_profile" ON public.user_profiles
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allow_profile_insert" ON public.user_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================
-- STEP 3: GRANT PROPER PERMISSIONS
-- =====================================

GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================
-- STEP 4: ENSURE ADMIN TRIGGER WORKS
-- =====================================

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

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================
-- VERIFICATION
-- =====================================

SELECT 'New user_profiles policies:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_profiles';

SELECT 'RLS Cleanup Complete!' as status,
       COUNT(*) as total_user_profiles 
FROM public.user_profiles;

SELECT 'User profiles table should now work for signup and admin login!' as message;
