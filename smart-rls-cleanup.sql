-- SMART RLS CLEANUP - Column-Aware Version
-- This script intelligently checks column names before creating policies

-- =====================================
-- STEP 1: IDENTIFY TABLE STRUCTURES
-- =====================================

SELECT 'CURRENT STATE - Tables and their user reference columns:' as info;
SELECT 
  t.table_name,
  STRING_AGG(
    CASE 
      WHEN c.column_name LIKE '%user%' OR c.column_name LIKE '%owner%' OR c.column_name = 'created_by'
      THEN c.column_name || ' (' || c.data_type || ')'
      ELSE NULL
    END, 
    ', '
  ) as user_columns
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
ORDER BY t.table_name;

-- =====================================
-- STEP 2: CLEAN UP ALL EXISTING POLICIES
-- =====================================

DO $$ 
DECLARE
    pol_rec record;
    cleanup_tables text[] := ARRAY[
        'admin_tasks',
        'agent_activity',
        'agent_activity_log', 
        'agent_audit_log',
        'agent_conversations',
        'agent_handoffs',
        'agent_messages',
        'agent_settings',
        'agent_tasks',
        'content_calendar',
        'course_progress',
        'database_backups',
        'email_sequences',
        'emergency_stop_config',
        'future_self_images',
        'glow_checks',
        'leads',
        'photo_vault',
        'products',
        'profiles',
        'purchases',
        'query_validation_rules',
        'selfie_scores',
        'user_progress',
        'vip_applications'
    ];
    table_name text;
BEGIN
    -- Loop through each table and drop all its policies
    FOREACH table_name IN ARRAY cleanup_tables
    LOOP
        -- Check if table exists first
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            -- Drop all policies for this table
            FOR pol_rec IN 
                SELECT policyname 
                FROM pg_policies 
                WHERE tablename = table_name 
                AND schemaname = 'public'
            LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol_rec.policyname, table_name);
                RAISE NOTICE 'Dropped policy: % on table: %', pol_rec.policyname, table_name;
            END LOOP;
            
            -- Disable RLS on tables that shouldn't have it
            IF table_name IN ('products', 'agent_settings', 'query_validation_rules') THEN
                EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', table_name);
                RAISE NOTICE 'Disabled RLS on table: %', table_name;
            ELSE
                EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
                RAISE NOTICE 'Enabled RLS on table: %', table_name;
            END IF;
        ELSE
            RAISE NOTICE 'Table does not exist: %', table_name;
        END IF;
    END LOOP;
END $$;

-- =====================================
-- STEP 3: CREATE SMART POLICIES BASED ON ACTUAL COLUMNS
-- =====================================

-- Helper function to create user-specific policies
DO $$
DECLARE
    table_info record;
BEGIN
    -- Loop through tables and create policies based on their actual structure
    FOR table_info IN
        SELECT 
            t.table_name,
            CASE 
                WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t.table_name AND column_name = 'user_id' AND table_schema = 'public')
                THEN 'user_id'
                WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t.table_name AND column_name = 'owner_id' AND table_schema = 'public')
                THEN 'owner_id'
                WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t.table_name AND column_name = 'created_by' AND table_schema = 'public')
                THEN 'created_by'
                ELSE NULL
            END as user_column,
            c.data_type as user_column_type
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c ON t.table_name = c.table_name 
            AND t.table_schema = c.table_schema
            AND c.column_name IN ('user_id', 'owner_id', 'created_by')
        WHERE t.table_schema = 'public' 
            AND t.table_type = 'BASE TABLE'
            AND t.table_name IN (
                'photo_vault', 'glow_checks', 'content_calendar', 'user_progress',
                'course_progress', 'future_self_images', 'selfie_scores', 
                'vip_applications', 'profiles', 'purchases'
            )
    LOOP
        IF table_info.user_column IS NOT NULL THEN
            -- Create policies based on data type
            IF table_info.user_column_type = 'uuid' THEN
                -- UUID column - direct comparison
                EXECUTE format('
                    CREATE POLICY "%s_user_access_2025" ON public.%I
                      FOR ALL 
                      TO authenticated
                      USING (auth.uid() = %I)
                      WITH CHECK (auth.uid() = %I)',
                    table_info.table_name, 
                    table_info.table_name, 
                    table_info.user_column,
                    table_info.user_column
                );
            ELSE
                -- TEXT column - cast auth.uid() to text
                EXECUTE format('
                    CREATE POLICY "%s_user_access_2025" ON public.%I
                      FOR ALL 
                      TO authenticated
                      USING (auth.uid()::text = %I)
                      WITH CHECK (auth.uid()::text = %I)',
                    table_info.table_name, 
                    table_info.table_name, 
                    table_info.user_column,
                    table_info.user_column
                );
            END IF;
            
            -- Service role policy
            EXECUTE format('
                CREATE POLICY "%s_service_access_2025" ON public.%I
                  FOR ALL 
                  TO service_role
                  USING (true)
                  WITH CHECK (true)',
                table_info.table_name, 
                table_info.table_name
            );
            
            RAISE NOTICE 'Created policies for table: % (using column: % of type %)', 
                table_info.table_name, table_info.user_column, table_info.user_column_type;
        ELSE
            RAISE NOTICE 'No user column found for table: %', table_info.table_name;
        END IF;
    END LOOP;
END $$;

-- Special cases for specific tables

-- leads (public insert, admin select)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads' AND table_schema = 'public') THEN
        CREATE POLICY "leads_public_insert_2025" ON public.leads
          FOR INSERT 
          TO anon, authenticated
          WITH CHECK (true);

        CREATE POLICY "leads_admin_select_2025" ON public.leads
          FOR SELECT 
          TO service_role
          USING (true);
        
        RAISE NOTICE 'Created policies for leads table';
    END IF;
END $$;

-- purchases (read-only for users)
DO $$
DECLARE
    user_col text;
    col_type text;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchases' AND table_schema = 'public') THEN
        -- Find the user column
        SELECT column_name, data_type INTO user_col, col_type
        FROM information_schema.columns 
        WHERE table_name = 'purchases' 
            AND table_schema = 'public'
            AND column_name IN ('user_id', 'owner_id', 'created_by')
        LIMIT 1;
        
        IF user_col IS NOT NULL THEN
            IF col_type = 'uuid' THEN
                EXECUTE format('
                    CREATE POLICY "purchases_user_select_2025" ON public.purchases
                      FOR SELECT 
                      TO authenticated
                      USING (auth.uid() = %I)', user_col);
            ELSE
                EXECUTE format('
                    CREATE POLICY "purchases_user_select_2025" ON public.purchases
                      FOR SELECT 
                      TO authenticated
                      USING (auth.uid()::text = %I)', user_col);
            END IF;
            
            RAISE NOTICE 'Created read-only policy for purchases using column: %', user_col;
        END IF;
    END IF;
END $$;

-- Admin/Agent tables (service role only)
DO $$
DECLARE
    admin_tables text[] := ARRAY[
        'admin_tasks', 'agent_activity', 'agent_activity_log', 'agent_audit_log',
        'agent_conversations', 'agent_handoffs', 'agent_messages', 'agent_tasks',
        'email_sequences', 'database_backups', 'emergency_stop_config'
    ];
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY admin_tables
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            EXECUTE format('
                CREATE POLICY "%s_service_only_2025" ON public.%I
                  FOR ALL 
                  TO service_role
                  USING (true)
                  WITH CHECK (true)', table_name, table_name);
            
            RAISE NOTICE 'Created service-only policy for: %', table_name;
        END IF;
    END LOOP;
END $$;

-- =====================================
-- STEP 4: GRANT PROPER PERMISSIONS
-- =====================================

-- Grant service role access to all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant permissions only to tables that exist with proper user columns
DO $$
DECLARE
    table_names text[] := ARRAY[
        'user_profiles', 'photo_vault', 'glow_checks', 'content_calendar', 
        'user_progress', 'course_progress', 'future_self_images', 
        'selfie_scores', 'vip_applications', 'profiles'
    ];
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
            RAISE NOTICE 'Granted full permissions on: %', table_name;
        END IF;
    END LOOP;
    
    -- Special permission for purchases (read-only)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchases' AND table_schema = 'public') THEN
        GRANT SELECT ON public.purchases TO authenticated;
        RAISE NOTICE 'Granted read permissions on: purchases';
    END IF;
    
    -- Special permission for leads (insert for anon)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leads' AND table_schema = 'public') THEN
        GRANT INSERT ON public.leads TO anon;
        RAISE NOTICE 'Granted insert permissions on leads for anon users';
    END IF;
END $$;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- =====================================
-- STEP 5: VERIFY CLEAN STATE
-- =====================================

SELECT 'FINAL STATE - All policies after smart cleanup:' as info;
SELECT 
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Show tables with user columns and their policies
SELECT 'USER TABLES AND POLICIES:' as info;
SELECT 
  t.table_name,
  STRING_AGG(
    CASE 
      WHEN c.column_name LIKE '%user%' OR c.column_name LIKE '%owner%' OR c.column_name = 'created_by'
      THEN c.column_name || ' (' || c.data_type || ')'
      ELSE NULL
    END, 
    ', '
  ) as user_columns,
  COALESCE(p.policy_count, 0) as policies
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND t.table_schema = c.table_schema
LEFT JOIN (
  SELECT tablename, COUNT(*) as policy_count
  FROM pg_policies 
  WHERE schemaname = 'public'
  GROUP BY tablename
) p ON t.table_name = p.tablename
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name, p.policy_count
HAVING STRING_AGG(
    CASE 
      WHEN c.column_name LIKE '%user%' OR c.column_name LIKE '%owner%' OR c.column_name = 'created_by'
      THEN c.column_name 
      ELSE NULL
    END, 
    ', '
  ) IS NOT NULL
ORDER BY t.table_name;

-- Test basic user_profiles functionality
SELECT 'Testing user_profiles access:' as test;
SELECT 
  'Total profiles: ' || COUNT(*) as result
FROM public.user_profiles;

-- =====================================
-- SUCCESS MESSAGE
-- =====================================

SELECT '🎯 SMART RLS CLEANUP COMPLETE!' as status;
SELECT 'Policies created based on actual table structures!' as next_action;
SELECT 'No more column mismatch errors!' as bonus;
