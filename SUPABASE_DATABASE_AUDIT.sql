-- 🔍 SSELFIE DATABASE STRUCTURE AUDIT
-- Run this SQL to check all tables, columns, and potential issues

-- Step 1: Check if user_profiles table exists and its structure
SELECT 
    'user_profiles table structure' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Check if all required columns exist in user_profiles
SELECT 
    'Missing columns check' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'user_id') 
        THEN '✅ user_id exists' 
        ELSE '❌ user_id missing' 
    END as user_id_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'email') 
        THEN '✅ email exists' 
        ELSE '❌ email missing' 
    END as email_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'full_name') 
        THEN '✅ full_name exists' 
        ELSE '❌ full_name missing' 
    END as full_name_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'tier') 
        THEN '✅ tier exists' 
        ELSE '❌ tier missing' 
    END as tier_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'onboarding_status') 
        THEN '✅ onboarding_status exists' 
        ELSE '❌ onboarding_status missing' 
    END as onboarding_status_check,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'ai_model_status') 
        THEN '✅ ai_model_status exists' 
        ELSE '❌ ai_model_status missing' 
    END as ai_model_status_check;

-- Step 3: Check existing triggers
SELECT 
    'Existing triggers' as check_type,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- Step 4: Check existing functions
SELECT 
    'Existing functions' as check_type,
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%user%' 
AND routine_schema = 'public';

-- Step 5: Check Row Level Security policies
SELECT 
    'RLS policies' as check_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Step 6: Check table permissions
SELECT 
    'Table permissions' as check_type,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public';

-- Step 7: Check if RLS is enabled
SELECT 
    'RLS status' as check_type,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'user_profiles' 
AND schemaname = 'public';

-- Step 8: Check for any conflicting tables or similar names
SELECT 
    'Similar tables' as check_type,
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name ILIKE '%user%' 
OR table_name ILIKE '%profile%'
ORDER BY table_schema, table_name;

-- Step 9: Check auth.users table structure (to ensure compatibility)
SELECT 
    'auth.users structure' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'auth'
ORDER BY ordinal_position;

-- Step 10: Final summary
SELECT 
    'AUDIT COMPLETE' as status,
    'Check results above for any issues' as message,
    NOW() as audit_timestamp;
