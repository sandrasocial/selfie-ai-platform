-- 🔍 INDIVIDUAL QUERIES FOR SUPABASE SQL EDITOR
-- Run these ONE AT A TIME to see the actual results

-- Query 1: Check if user_profiles table exists and its structure
-- Copy and paste this first:
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Query 2: Check what tables exist with "user" or "profile" in the name
-- Copy and paste this second:
SELECT 
    table_name,
    table_schema
FROM information_schema.tables 
WHERE (table_name ILIKE '%user%' OR table_name ILIKE '%profile%')
AND table_schema = 'public'
ORDER BY table_name;

-- Query 3: Check if auth.users table exists (this should exist)
-- Copy and paste this third:
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'auth'
ORDER BY ordinal_position;

-- Query 4: Check for any existing triggers on auth.users
-- Copy and paste this fourth:
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- Query 5: Check for any existing functions that might handle user profiles
-- Copy and paste this fifth:
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name ILIKE '%user%' 
AND routine_schema = 'public';

-- Query 6: Check all public tables (to see what we're working with)
-- Copy and paste this sixth:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
