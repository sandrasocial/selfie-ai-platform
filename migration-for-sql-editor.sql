-- SELFIE AI™ Database Migration - Simplified for SQL Editor
-- Copy and paste this into Supabase SQL Editor and click "Run"

-- First, create the enums
CREATE TYPE user_tier AS ENUM ('free', 'starter', 'collective', 'vip');
CREATE TYPE ai_model_status AS ENUM ('pending', 'training', 'ready', 'failed');

-- Add new columns to user_profiles table
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

-- Update the handle_new_user function
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
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN true ELSE false END,
    CASE WHEN NEW.email = 'ssa@ssasocial.com' THEN 'super_admin' ELSE 'user' END,
    'free',
    '{"step": 1, "completed": false, "welcome_seen": false}',
    'pending',
    '{"notifications": true, "email_marketing": true, "weekly_tips": true}'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
