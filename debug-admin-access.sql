-- Debug Admin Access Issues
-- Run this to check what's happening with admin authentication

-- 1. Check if the admin user exists
SELECT 
  'Admin User Check' as test_type,
  email,
  is_admin,
  role,
  created_at
FROM public.user_profiles 
WHERE email = 'ssa@ssasocial.com';

-- 2. Check all user profiles structure
SELECT 
  'User Profiles Structure' as test_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if auth.users has the admin user
SELECT 
  'Auth Users Check' as test_type,
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'ssa@ssasocial.com';

-- 4. Check current RLS policies
SELECT 
  'Current RLS Policies' as test_type,
  schemaname, 
  tablename, 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 5. Test basic query access
SELECT 
  'Basic Query Test' as test_type,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN is_admin = true THEN 1 END) as admin_count,
  COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admin_count
FROM public.user_profiles;

-- 6. Check if table has proper permissions
SELECT 
  'Table Permissions' as test_type,
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public';

SELECT 'Admin Debug Complete - Check results above' as status;
