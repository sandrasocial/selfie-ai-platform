-- SELFIE AI™ Complete User System Migration
-- This migration creates the complete user system with all required tables and relationships

-- First, create enums for user tiers and AI model status
CREATE TYPE user_tier AS ENUM ('free', 'starter', 'collective', 'vip');
CREATE TYPE ai_model_status AS ENUM ('pending', 'training', 'ready', 'failed');

-- Extend user_profiles table with new columns for SELFIE AI™
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS tier user_tier DEFAULT 'free',
ADD COLUMN IF NOT EXISTS onboarding_status JSONB DEFAULT '{"step": 1, "completed": false, "welcome_seen": false}',
ADD COLUMN IF NOT EXISTS ai_model_status ai_model_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS brand_vibe TEXT,
ADD COLUMN IF NOT EXISTS future_self_unlocked TIMESTAMP[],
ADD COLUMN IF NOT EXISTS confidence_scores JSONB[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_glow_check TIMESTAMP,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"notifications": true, "email_marketing": true, "weekly_tips": true}';

-- Create future_self_images table
CREATE TABLE IF NOT EXISTS public.future_self_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  scenario TEXT NOT NULL,
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'
);

-- Create user_progress table for tracking metrics
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value JSONB NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create lead_magnets table for tracking free downloads
CREATE TABLE IF NOT EXISTS public.lead_magnets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  magnet_type TEXT NOT NULL, -- 'glow_check', 'selfie_guide', 'starter_preview'
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT, -- where they came from
  metadata JSONB DEFAULT '{}'
);

-- Create glow_check_results table for storing Glow Check results
CREATE TABLE IF NOT EXISTS public.glow_check_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  image_url TEXT,
  analysis_results JSONB NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT TRUE
);

-- Create email_sequences table for automation tracking  
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  sequence_type TEXT NOT NULL, -- 'welcome', 'starter_kit', 'branded', 'vip'
  current_step INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Create user_sessions table for detailed session tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  pages_visited TEXT[],
  actions_taken JSONB DEFAULT '[]',
  device_info JSONB,
  referrer TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_future_self_images_user_id ON public.future_self_images(user_id);
CREATE INDEX IF NOT EXISTS idx_future_self_images_created_at ON public.future_self_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_type_date ON public.user_progress(metric_type, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_email ON public.lead_magnets(email);
CREATE INDEX IF NOT EXISTS idx_lead_magnets_type ON public.lead_magnets(magnet_type);
CREATE INDEX IF NOT EXISTS idx_glow_check_email ON public.glow_check_results(email);
CREATE INDEX IF NOT EXISTS idx_glow_check_user_id ON public.glow_check_results(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_email ON public.email_sequences(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);

-- Enable RLS on all tables
ALTER TABLE public.future_self_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glow_check_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for future_self_images
CREATE POLICY "Users can view own future self images" ON public.future_self_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own future self images" ON public.future_self_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own future self images" ON public.future_self_images
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on future_self_images" ON public.future_self_images
  FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on user_progress" ON public.user_progress
  FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for lead_magnets (service role only for admin access)
CREATE POLICY "Service role full access on lead_magnets" ON public.lead_magnets
  FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for glow_check_results
CREATE POLICY "Users can view own glow check results" ON public.glow_check_results
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role full access on glow_check_results" ON public.glow_check_results
  FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for email_sequences
CREATE POLICY "Users can view own email sequences" ON public.email_sequences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on email_sequences" ON public.email_sequences
  FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access on user_sessions" ON public.user_sessions
  FOR ALL USING (true) WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.future_self_images TO service_role;
GRANT ALL ON public.user_progress TO service_role;
GRANT ALL ON public.lead_magnets TO service_role;
GRANT ALL ON public.glow_check_results TO service_role;
GRANT ALL ON public.email_sequences TO service_role;
GRANT ALL ON public.user_sessions TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.future_self_images TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_progress TO authenticated;
GRANT SELECT, INSERT ON public.glow_check_results TO authenticated;
GRANT SELECT ON public.email_sequences TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_sessions TO authenticated;

-- Create helpful functions for user management

-- Function to upgrade user tier
CREATE OR REPLACE FUNCTION public.upgrade_user_tier(user_id UUID, new_tier user_tier)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles 
  SET tier = new_tier, updated_at = NOW()
  WHERE user_profiles.user_id = upgrade_user_tier.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track lead magnet download
CREATE OR REPLACE FUNCTION public.track_lead_magnet(
  email_input TEXT,
  magnet_type_input TEXT,
  source_input TEXT DEFAULT NULL,
  metadata_input JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  lead_id UUID;
  user_record UUID;
BEGIN
  -- Try to find existing user by email
  SELECT user_id INTO user_record 
  FROM public.user_profiles 
  WHERE email = email_input;
  
  -- Insert lead magnet record
  INSERT INTO public.lead_magnets (email, magnet_type, user_id, source, metadata)
  VALUES (email_input, magnet_type_input, user_record, source_input, metadata_input)
  RETURNING id INTO lead_id;
  
  RETURN lead_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to save glow check result
CREATE OR REPLACE FUNCTION public.save_glow_check_result(
  email_input TEXT,
  image_url_input TEXT,
  analysis_input JSONB,
  score_input INTEGER,
  recommendations_input TEXT[]
)
RETURNS UUID AS $$
DECLARE
  result_id UUID;
  user_record UUID;
BEGIN
  -- Try to find existing user by email
  SELECT user_id INTO user_record 
  FROM public.user_profiles 
  WHERE email = email_input;
  
  -- Insert glow check result
  INSERT INTO public.glow_check_results (
    user_id, email, image_url, analysis_results, score, recommendations, is_anonymous
  )
  VALUES (
    user_record, email_input, image_url_input, analysis_input, score_input, 
    recommendations_input, (user_record IS NULL)
  )
  RETURNING id INTO result_id;
  
  -- Update last_glow_check for registered users
  IF user_record IS NOT NULL THEN
    UPDATE public.user_profiles 
    SET last_glow_check = NOW()
    WHERE user_id = user_record;
  END IF;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update onboarding progress
CREATE OR REPLACE FUNCTION public.update_onboarding_step(
  user_id_input UUID,
  step_data JSONB
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles 
  SET onboarding_status = step_data, updated_at = NOW()
  WHERE user_id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    email, 
    full_name, 
    is_admin, 
    role,
    tier,
    onboarding_status,
    ai_model_status,
    preferences
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    -- Make ssa@ssasocial.com admin automatically
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN true ELSE false END,
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN 'super_admin' ELSE 'user' END,
    'free',
    '{"step": 1, "completed": false, "welcome_seen": false}',
    'pending',
    '{"notifications": true, "email_marketing": true, "weekly_tips": true}'
  );
  
  -- Start welcome email sequence
  INSERT INTO public.email_sequences (user_id, email, sequence_type)
  VALUES (NEW.id, NEW.email, 'welcome');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.upgrade_user_tier(UUID, user_tier) TO service_role;
GRANT EXECUTE ON FUNCTION public.track_lead_magnet(TEXT, TEXT, TEXT, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.save_glow_check_result(TEXT, TEXT, JSONB, INTEGER, TEXT[]) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_onboarding_step(UUID, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Add some sample data for testing (optional)
-- Uncomment to add test data

/*
-- Sample lead magnets
INSERT INTO public.lead_magnets (email, magnet_type, source, metadata) VALUES
('test@example.com', 'glow_check', 'landing_page', '{"utm_source": "organic"}'),
('demo@example.com', 'selfie_guide', 'popup', '{"utm_source": "facebook"}');

-- Sample glow check results
INSERT INTO public.glow_check_results (email, analysis_results, score, recommendations, is_anonymous) VALUES
('test@example.com', '{"skin_tone": "warm", "lighting": "good", "confidence": "high"}', 85, ARRAY['Try softer lighting', 'Angle slightly higher'], false);
*/
