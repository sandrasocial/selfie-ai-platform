-- NUCLEAR OPTION: Complete RLS Reset for user_profiles
-- This script will completely wipe and rebuild all RLS policies from scratch

-- =====================================
-- STEP 1: SHOW WHAT EXISTS NOW
-- =====================================

SELECT 'CURRENT STATE - All user_profiles policies:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_profiles';

-- =====================================
-- STEP 2: NUCLEAR CLEANUP - DROP EVERYTHING
-- =====================================

-- This will drop ALL policies, regardless of name
DO $$ 
DECLARE
    pol_name text;
BEGIN
    -- Loop through all policies on user_profiles and drop them
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || pol_name || '" ON public.user_profiles';
        RAISE NOTICE 'Dropped policy: %', pol_name;
    END LOOP;
END $$;

SELECT 'All policies dropped. Remaining policies:' as info;
SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles';

-- =====================================
-- STEP 3: CREATE BRAND NEW POLICIES
-- =====================================

-- Make sure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with timestamp to make them unique
CREATE POLICY "service_role_2025_clean" ON public.user_profiles
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "user_own_profile_2025_clean" ON public.user_profiles
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profile_creation_2025_clean" ON public.user_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================
-- STEP 4: GRANT PERMISSIONS
-- =====================================

GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================
-- STEP 5: RECREATE ADMIN TRIGGER
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
-- STEP 6: VERIFY CLEAN STATE
-- =====================================

SELECT 'FINAL STATE - New clean policies:' as info;
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'user_profiles';

-- Test basic functionality
SELECT 'Testing basic queries:' as test;
SELECT 
  'Total profiles: ' || COUNT(*) as result
FROM public.user_profiles;

SELECT 
  'Admin users: ' || COUNT(*) as result
FROM public.user_profiles 
WHERE is_admin = true;

-- Check if Sandra's admin account exists
SELECT 'Sandra admin check:' as test;
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.user_profiles WHERE email = 'ssa@ssasocial.com' AND is_admin = true)
    THEN 'Sandra admin account exists ✓'
    ELSE 'Sandra admin account missing - need to create it'
  END as result;

-- =====================================
-- SUCCESS MESSAGE
-- =====================================

SELECT '🎯 NUCLEAR RLS RESET COMPLETE!' as status;
SELECT 'Clean slate achieved. Test your login flows now!' as next_action;
