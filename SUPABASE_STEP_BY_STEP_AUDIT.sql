-- 🔍 STEP-BY-STEP SUPABASE AUDIT
-- Run these queries ONE AT A TIME in Supabase SQL Editor

-- STEP 1: Check if user_profiles table exists
SELECT 
    'user_profiles table check' as status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public')
        THEN '✅ Table exists'
        ELSE '❌ Table missing'
    END as table_status;

-- STEP 2: If table exists, check its columns
SELECT 
    'Column: ' || column_name as column_info,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- STEP 3: Check for triggers on auth.users
SELECT 
    'Trigger: ' || trigger_name as trigger_info,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- STEP 4: Check RLS status
SELECT 
    'RLS Status' as check_type,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS enabled'
        ELSE '❌ RLS disabled'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'user_profiles' 
AND schemaname = 'public';

-- STEP 5: Check what tables you DO have
SELECT 
    'Available tables:' as info,
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name;
