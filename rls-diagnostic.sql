-- DIAGNOSTIC SCRIPT - Check current RLS state and table structures
-- Run this BEFORE the cleanup to see what we're working with

-- Check all tables and their user_id column types
SELECT 
    t.tablename,
    CASE 
        WHEN c.column_name IS NOT NULL THEN 
            CASE 
                WHEN c.data_type = 'character varying' THEN 'varchar'
                WHEN c.data_type = 'text' THEN 'text' 
                WHEN c.data_type = 'integer' THEN 'integer'
                ELSE c.data_type
            END
        ELSE 'NO_USER_ID'
    END as user_id_type,
    CASE WHEN rls.tablename IS NOT NULL THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables t
LEFT JOIN information_schema.columns c ON (
    c.table_schema = 'public' 
    AND c.table_name = t.tablename 
    AND c.column_name = 'user_id'
)
LEFT JOIN (
    SELECT DISTINCT tablename 
    FROM pg_tables pt
    JOIN pg_class pc ON pc.relname = pt.tablename
    WHERE pc.relrowsecurity = true
    AND pt.schemaname = 'public'
) rls ON rls.tablename = t.tablename
WHERE t.schemaname = 'public'
AND t.tablename NOT LIKE 'pg_%'
AND t.tablename NOT LIKE 'information_%'
ORDER BY t.tablename;

-- Check current RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if admin account exists
SELECT user_id, email, full_name, is_admin, created_at 
FROM user_profiles 
WHERE is_admin = true OR email = 'sandra@selfieai.app';

-- Check total table count
SELECT COUNT(*) as total_tables
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
AND tablename NOT LIKE 'information_%';

-- Check tables with user_id
SELECT COUNT(*) as tables_with_user_id
FROM pg_tables t
JOIN information_schema.columns c ON (
    c.table_schema = 'public' 
    AND c.table_name = t.tablename 
    AND c.column_name = 'user_id'
)
WHERE t.schemaname = 'public';

-- Check tables with integer user_id (potentially problematic)
SELECT tablename, data_type
FROM pg_tables t
JOIN information_schema.columns c ON (
    c.table_schema = 'public' 
    AND c.table_name = t.tablename 
    AND c.column_name = 'user_id'
)
WHERE t.schemaname = 'public'
AND c.data_type = 'integer'
ORDER BY tablename;
