-- EMERGENCY FIX: Remove Recursive RLS Policy on user_profiles
-- This fixes the "infinite recursion detected in policy" error (42P17)

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;

-- The recursive policy was:
-- CREATE POLICY "Admins can read all profiles" ON public.user_profiles
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM public.user_profiles 
--       WHERE user_id = auth.uid() AND is_admin = true
--     )
--   );

-- This caused infinite recursion because it queries user_profiles 
-- from within a user_profiles policy.

-- For admin access, we'll rely on service_role access or 
-- create a separate admin function if needed later.

SELECT 'Recursive RLS Policy Removed - Login should work now!' as status;
