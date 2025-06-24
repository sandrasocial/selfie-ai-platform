-- COMPREHENSIVE RLS CLEANUP - All Tables
-- This script cleans up all RLS policies across the entire database

-- =====================================
-- STEP 1: IDENTIFY ALL CURRENT POLICIES
-- =====================================

SELECT 'CURRENT STATE - All RLS policies in database:' as info;
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

-- =====================================
-- STEP 2: CLEAN UP PROBLEMATIC TABLES
-- =====================================

-- Drop all policies from tables with messy/duplicate policies
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
    END LOOP;
END $$;

-- =====================================
-- STEP 3: CREATE CLEAN, MINIMAL POLICIES
-- =====================================

-- user_profiles (already clean from nuclear reset, but verify)
-- No changes needed - policies are clean

-- leads (public insert, admin select)
CREATE POLICY "leads_public_insert_2025" ON public.leads
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "leads_admin_select_2025" ON public.leads
  FOR SELECT 
  TO service_role
  USING (true);

-- photo_vault (users manage own photos)
CREATE POLICY "photo_vault_user_access_2025" ON public.photo_vault
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "photo_vault_service_access_2025" ON public.photo_vault
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- glow_checks (users manage own checks)
CREATE POLICY "glow_checks_user_access_2025" ON public.glow_checks
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "glow_checks_service_access_2025" ON public.glow_checks
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- content_calendar (users manage own content)
CREATE POLICY "content_calendar_user_access_2025" ON public.content_calendar
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "content_calendar_service_access_2025" ON public.content_calendar
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- user_progress (users manage own progress)
CREATE POLICY "user_progress_user_access_2025" ON public.user_progress
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "user_progress_service_access_2025" ON public.user_progress
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- course_progress (users manage own progress)
CREATE POLICY "course_progress_user_access_2025" ON public.course_progress
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "course_progress_service_access_2025" ON public.course_progress
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- future_self_images (users manage own images)
CREATE POLICY "future_self_images_user_access_2025" ON public.future_self_images
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "future_self_images_service_access_2025" ON public.future_self_images
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- selfie_scores (users manage own scores)
CREATE POLICY "selfie_scores_user_access_2025" ON public.selfie_scores
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "selfie_scores_service_access_2025" ON public.selfie_scores
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- purchases (users view own, service manages all)
CREATE POLICY "purchases_user_select_2025" ON public.purchases
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id::uuid);

CREATE POLICY "purchases_service_access_2025" ON public.purchases
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- vip_applications (users manage own applications)
CREATE POLICY "vip_applications_user_access_2025" ON public.vip_applications
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "vip_applications_service_access_2025" ON public.vip_applications
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- profiles (if different from user_profiles)
CREATE POLICY "profiles_user_access_2025" ON public.profiles
  FOR ALL 
  TO authenticated
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "profiles_service_access_2025" ON public.profiles
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admin/Agent tables (service role only)
CREATE POLICY "admin_tasks_service_only_2025" ON public.admin_tasks
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_activity_service_only_2025" ON public.agent_activity
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_activity_log_service_only_2025" ON public.agent_activity_log
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_audit_log_service_only_2025" ON public.agent_audit_log
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_conversations_service_only_2025" ON public.agent_conversations
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_handoffs_service_only_2025" ON public.agent_handoffs
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_messages_service_only_2025" ON public.agent_messages
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "agent_tasks_service_only_2025" ON public.agent_tasks
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- System tables (service role only)
CREATE POLICY "email_sequences_service_only_2025" ON public.email_sequences
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "database_backups_service_only_2025" ON public.database_backups
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "emergency_stop_config_service_only_2025" ON public.emergency_stop_config
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================
-- STEP 4: GRANT PROPER PERMISSIONS
-- =====================================

-- Grant service role access to all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant authenticated users access to their own data tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_vault TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.glow_checks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_calendar TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.future_self_images TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.selfie_scores TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vip_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.purchases TO authenticated;

-- Grant anon users access to leads for signup forms
GRANT INSERT ON public.leads TO anon;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- =====================================
-- STEP 5: VERIFY CLEAN STATE
-- =====================================

SELECT 'FINAL STATE - All policies after cleanup:' as info;
SELECT 
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Check for tables with no policies (might need attention)
SELECT 'Tables with RLS enabled but no policies:' as warning;
SELECT 
  t.tablename,
  t.rowsecurity as rls_enabled
FROM information_schema.tables t
LEFT JOIN pg_policies p ON t.table_name = p.tablename 
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
  AND p.policyname IS NULL
  AND EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON c.relnamespace = n.oid 
    WHERE c.relname = t.table_name 
    AND n.nspname = 'public' 
    AND c.relrowsecurity = true
  );

-- Test basic user_profiles functionality
SELECT 'Testing user_profiles access:' as test;
SELECT 
  'Total profiles: ' || COUNT(*) as result
FROM public.user_profiles;

-- =====================================
-- SUCCESS MESSAGE
-- =====================================

SELECT '🎯 COMPREHENSIVE RLS CLEANUP COMPLETE!' as status;
SELECT 'All tables now have clean, minimal RLS policies!' as next_action;
SELECT 'No more duplicate or conflicting policies!' as bonus;
