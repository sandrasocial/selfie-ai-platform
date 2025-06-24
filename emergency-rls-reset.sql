-- EMERGENCY RLS RESET - Handles existing policies gracefully
-- This completely resets the user_profiles RLS policies to a clean state

-- =====================================
-- STEP 1: SHOW CURRENT STATE
-- =====================================

SELECT 'BEFORE CLEANUP - Current user_profiles policies:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_profiles';

-- =====================================
-- STEP 2: COMPLETELY CLEAN SLATE
-- =====================================

-- Drop ALL possible policy names (handles duplicates from different schema files)
DROP POLICY IF EXISTS "service_role_access" ON public.user_profiles;
DROP POLICY IF EXISTS "user_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "allow_profile_insert" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role full access on user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;

-- =====================================
-- STEP 3: CREATE FINAL CLEAN POLICIES
-- =====================================

-- Make sure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create the 3 final policies with unique names
CREATE POLICY "final_service_role_access" ON public.user_profiles
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "final_user_own_profile" ON public.user_profiles
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "final_allow_profile_creation" ON public.user_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================
-- STEP 4: ENSURE PERMISSIONS ARE CORRECT
-- =====================================

GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================
-- STEP 5: VERIFY ADMIN TRIGGER
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
-- STEP 6: FINAL VERIFICATION
-- =====================================

SELECT 'AFTER CLEANUP - Final user_profiles policies:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_profiles';

-- Test that basic queries work
SELECT 'Basic Query Test:' as test;
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_count,
  COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admin_count
FROM public.user_profiles;

-- Check if the admin user exists
SELECT 'Admin User Check:' as test;
SELECT email, is_admin, role, created_at
FROM public.user_profiles 
WHERE email = 'ssa@ssasocial.com';

SELECT '🎉 RLS EMERGENCY RESET COMPLETE!' as status;
SELECT 'Signup and admin login should work now!' as next_step;
