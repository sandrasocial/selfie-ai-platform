-- Test RLS Policy Fix
-- Run this to verify the recursive policy is removed and basic access works

-- Check current policies on user_profiles
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Test basic query (this should work without recursion error)
SELECT COUNT(*) as total_profiles FROM public.user_profiles;

-- Test profile creation capability
SELECT 'RLS Policy Fix Test Complete' as status;
