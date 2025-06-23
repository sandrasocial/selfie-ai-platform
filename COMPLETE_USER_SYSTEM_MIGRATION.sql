-- COMPLETE USER SYSTEM MIGRATION FOR SELFIE AI™
-- Run this in Supabase SQL Editor

-- First, let's add the missing columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS onboarding_status JSONB DEFAULT '{"completed": false, "current_step": 1}',
ADD COLUMN IF NOT EXISTS ai_model_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS brand_vibe TEXT,
ADD COLUMN IF NOT EXISTS future_self_unlocked TIMESTAMP[],
ADD COLUMN IF NOT EXISTS confidence_scores JSONB[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_glow_check TIMESTAMP,
ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create content tables
CREATE TABLE IF NOT EXISTS future_self_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    scenario TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    value JSONB NOT NULL,
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create glow_checks table for storing selfie feedback
CREATE TABLE IF NOT EXISTS glow_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    feedback JSONB NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create content_calendar table
CREATE TABLE IF NOT EXISTS content_calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    scheduled_date DATE,
    platform TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE future_self_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE glow_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for future_self_images
DROP POLICY IF EXISTS "Users can view own future self images" ON future_self_images;
CREATE POLICY "Users can view own future self images" ON future_self_images
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own future self images" ON future_self_images;
CREATE POLICY "Users can insert own future self images" ON future_self_images
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own future self images" ON future_self_images;
CREATE POLICY "Users can update own future self images" ON future_self_images
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for glow_checks
DROP POLICY IF EXISTS "Users can view own glow checks" ON glow_checks;
CREATE POLICY "Users can view own glow checks" ON glow_checks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own glow checks" ON glow_checks;
CREATE POLICY "Users can insert own glow checks" ON glow_checks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for content_calendar
DROP POLICY IF EXISTS "Users can manage own content calendar" ON content_calendar;
CREATE POLICY "Users can manage own content calendar" ON content_calendar
    FOR ALL USING (auth.uid() = user_id);

-- Update the user profile trigger to handle new columns
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    tier, 
    onboarding_status,
    ai_model_status,
    goals,
    admin_status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    '{"completed": false, "current_step": 1}',
    'pending',
    '[]',
    CASE 
      WHEN NEW.email = 'ssa@ssasocial.com' THEN 'admin'
      WHEN NEW.email LIKE '%@ssasocial.com' THEN 'admin'
      ELSE 'user'
    END,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_future_self_images_user_id ON future_self_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_glow_checks_user_id ON glow_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON content_calendar(user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.future_self_images TO authenticated;
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.glow_checks TO authenticated;
GRANT ALL ON public.content_calendar TO authenticated;

-- Insert sample data for testing (optional)
-- This will be handled by the signup process
