-- 🔍 COMPREHENSIVE SSELFIE DATABASE AUDIT
-- This version returns all results in a single comprehensive query

WITH audit_results AS (
  -- Check if user_profiles table exists
  SELECT 
    1 as section_order,
    'TABLE_EXISTENCE' as check_category,
    'user_profiles table' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public')
      THEN '✅ EXISTS'
      ELSE '❌ MISSING - CRITICAL ISSUE'
    END as status,
    '' as details
  
  UNION ALL
  
  -- Check required columns
  SELECT 
    2 as section_order,
    'REQUIRED_COLUMNS' as check_category,
    'user_id column' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'user_id' AND table_schema = 'public')
      THEN '✅ EXISTS'
      ELSE '❌ MISSING'
    END as status,
    COALESCE((SELECT data_type FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'user_id' AND table_schema = 'public'), 'N/A') as details
    
  UNION ALL
  
  SELECT 
    2 as section_order,
    'REQUIRED_COLUMNS' as check_category,
    'email column' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'email' AND table_schema = 'public')
      THEN '✅ EXISTS'
      ELSE '❌ MISSING'
    END as status,
    COALESCE((SELECT data_type FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'email' AND table_schema = 'public'), 'N/A') as details
    
  UNION ALL
  
  SELECT 
    2 as section_order,
    'REQUIRED_COLUMNS' as check_category,
    'full_name column' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'full_name' AND table_schema = 'public')
      THEN '✅ EXISTS'
      ELSE '❌ MISSING'
    END as status,
    COALESCE((SELECT data_type FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'full_name' AND table_schema = 'public'), 'N/A') as details
    
  UNION ALL
  
  SELECT 
    2 as section_order,
    'REQUIRED_COLUMNS' as check_category,
    'tier column' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'tier' AND table_schema = 'public')
      THEN '✅ EXISTS'
      ELSE '❌ MISSING'
    END as status,
    COALESCE((SELECT data_type FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'tier' AND table_schema = 'public'), 'N/A') as details
    
  UNION ALL
  
  -- Check for user profile trigger
  SELECT 
    3 as section_order,
    'TRIGGERS' as check_category,
    'create_user_profile trigger' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name LIKE '%user_profile%' OR trigger_name LIKE '%create_user%')
      THEN '✅ EXISTS'
      ELSE '❌ MISSING - USERS WON\'T GET PROFILES'
    END as status,
    COALESCE((SELECT string_agg(trigger_name, ', ') FROM information_schema.triggers WHERE trigger_name LIKE '%user%'), 'None found') as details
    
  UNION ALL
  
  -- Check RLS status
  SELECT 
    4 as section_order,
    'SECURITY' as check_category,
    'RLS enabled on user_profiles' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_profiles' AND schemaname = 'public' AND rowsecurity = true)
      THEN '✅ ENABLED'
      ELSE '❌ DISABLED - SECURITY RISK'
    END as status,
    '' as details
    
  UNION ALL
  
  -- Check RLS policies
  SELECT 
    4 as section_order,
    'SECURITY' as check_category,
    'RLS policies count' as check_item,
    CASE 
      WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles') > 0
      THEN '✅ POLICIES EXIST (' || (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_profiles')::text || ')'
      ELSE '❌ NO POLICIES - USERS CAN\'T ACCESS DATA'
    END as status,
    COALESCE((SELECT string_agg(policyname, ', ') FROM pg_policies WHERE tablename = 'user_profiles'), 'None') as details
    
  UNION ALL
  
  -- Check auth.users table
  SELECT 
    5 as section_order,
    'AUTH_SYSTEM' as check_category,
    'auth.users table' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'auth')
      THEN '✅ EXISTS'
      ELSE '❌ MISSING - AUTHENTICATION BROKEN'
    END as status,
    '' as details
    
  UNION ALL
  
  -- Check for any existing user data
  SELECT 
    6 as section_order,
    'DATA_CHECK' as check_category,
    'user_profiles data count' as check_item,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public')
      THEN '✅ TABLE EXISTS - ' || COALESCE((SELECT COUNT(*)::text FROM user_profiles), '0') || ' records'
      ELSE '❌ TABLE MISSING'
    END as status,
    '' as details
)

SELECT 
  section_order,
  check_category,
  check_item,
  status,
  details
FROM audit_results
ORDER BY section_order, check_category, check_item;

-- Additional detailed information if user_profiles exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
    RAISE NOTICE '=== DETAILED user_profiles STRUCTURE ===';
    FOR rec IN 
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' AND table_schema = 'public'
      ORDER BY ordinal_position
    LOOP
      RAISE NOTICE 'Column: % | Type: % | Nullable: % | Default: %', 
        rec.column_name, rec.data_type, rec.is_nullable, COALESCE(rec.column_default, 'None');
    END LOOP;
  END IF;
END $$;
