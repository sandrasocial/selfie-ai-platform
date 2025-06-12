-- SELFIE AI™ Complete Automated Migration to Supabase
-- Execute this entire script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  brand_mission TEXT,
  ideal_audience TEXT,
  brand_values TEXT,
  key_phrases TEXT,
  hashtags TEXT,
  visual_aesthetic TEXT,
  content_focus TEXT[],
  tone_voice TEXT,
  industry TEXT,
  experience_level TEXT,
  main_goals TEXT,
  transformation_story TEXT,
  brand_voice TEXT,
  aesthetic_tone TEXT,
  offer TEXT,
  visibility_goals TEXT,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  plan TEXT DEFAULT 'FREE',
  profile_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Vault Table
CREATE TABLE IF NOT EXISTS content_vault (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Visual Strategies Table
CREATE TABLE IF NOT EXISTS ai_visual_strategies (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  brand_profile_snapshot JSONB,
  content_generated JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Generations Table
CREATE TABLE IF NOT EXISTS content_generations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  tone TEXT,
  brand_context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sandra AI Chats Table
CREATE TABLE IF NOT EXISTS sandra_chats (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  category TEXT,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly Drops Table
CREATE TABLE IF NOT EXISTS monthly_drops (
  id SERIAL PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_url TEXT,
  thumbnail_url TEXT,
  tier_access TEXT NOT NULL DEFAULT 'VIP',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_content_vault_user_id ON content_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_strategies_user_id ON ai_visual_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_content_generations_user_id ON content_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_sandra_chats_user_id ON sandra_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);

-- Data Migration: User Profiles
INSERT INTO user_profiles (user_id, brand_mission, ideal_audience, brand_values, key_phrases, hashtags, visual_aesthetic, content_focus, tone_voice, industry, experience_level, main_goals, transformation_story, brand_voice, aesthetic_tone, offer, visibility_goals, is_complete) VALUES 
('1', 'HElping women build personal brand ', 'Women starting over after divorce', NULL, 'Lets do this together shall we...', '#selfie', 'Moody & Modern', ARRAY['Personal Stories','Business Strategy','Fashion & Beauty','Motivation & Mindset'], 'Warm & Friendly', 'coaching and social media', NULL, 'Grow on social media', NULL, NULL, NULL, NULL, NULL, true),
('test-user-123', 'Empowering women entrepreneurs to build authentic personal brands', 'Female entrepreneurs aged 25-45 seeking brand clarity', 'Authenticity, Empowerment, Growth', 'authentic success, aligned action, purposeful growth', '#authenticbrand #femaleentrepreneur #businesscoach #mindsetmatters #purposefulbusiness', 'Luxury & Sophisticated', ARRAY['Personal Branding','Business Strategy','Mindset Coaching'], 'Inspirational & Motivating', 'Business Coaching', 'Established Creator', 'Scale to 6-figure coaching business', NULL, NULL, NULL, NULL, NULL, true),
('personalization-test-user', 'Empowering creative women to build profitable online businesses', 'Female creatives and entrepreneurs aged 28-40', 'Creativity, Authenticity, Financial Freedom, Community', 'creative freedom, authentic business, profitable passion', '#creativebusiness #femalefounder #onlineentrepreneur #creativefreedom #profitablepassion', 'Clean & Professional', ARRAY['Personal Branding','Business Strategy','Creative Process','Financial Tips'], 'Bold & Confident', 'Creative Business Coaching', 'Established Creator', 'Scale to multi-six-figure business with team of 5', NULL, NULL, NULL, NULL, NULL, true),
('ai-integration-test-user', 'Helping busy entrepreneurs build authentic personal brands that convert', 'Time-strapped business owners aged 30-50 seeking brand clarity', 'Efficiency, Authenticity, Results-Driven Growth', 'strategic efficiency, authentic leadership, premium results', '#businessstrategy #executivecoach #luxurybrand #authenticleadership #premiumconsulting', 'Luxury & Sophisticated', ARRAY['Business Strategy','Time Management','Personal Branding','Leadership'], 'Professional & Authoritative', 'Business Consulting', 'Established Creator', 'Launch premium consulting program and scale to 7-figures', NULL, NULL, NULL, NULL, NULL, true),
('test-400-fix', 'Helping women start over after heartbreak', 'Women who have lost themselves in relationship and motherhood', NULL, 'Lets do this together shall we...', '#selfie,#startingover', 'Minimalistic & Clean', ARRAY['Personal Stories','Educational Content','Business Strategy'], 'Warm & Friendly', 'Coaching', NULL, 'Grow my Instagram', NULL, NULL, NULL, NULL, NULL, true)
ON CONFLICT (user_id) DO UPDATE SET 
  brand_mission = EXCLUDED.brand_mission,
  ideal_audience = EXCLUDED.ideal_audience,
  updated_at = NOW();

-- Data Migration: Users
INSERT INTO users (email, first_name, last_name, plan, profile_data) VALUES 
('sandrajonna@gmail.com', 'Sandra', 'Sigurjonsdottir', 'pro', '{"name":"TestUser","goals":"help moms feel confident and strong","niche":"fitness coaching","offer":"28-day fitness program","story":"single mom transformation","audience":"busy moms"}'::jsonb),
('sandra@dibssocial.com', 'Sandra', 'Aamodt', 'free', NULL),
('sandra@selfieai.com', 'Sandra', 'Social', 'free', NULL),
('sandra_test_1748348627513@selfieai.com', 'Sandra', 'Social', 'free', NULL),
('sandra_test_1748348889320@selfieai.com', 'Sandra', 'Social', 'free', '{"niche":"helping women rebuild after heartbreak","offer":"personal branding coaching for major life transitions","story":"divorced single mom who rebuilt her life and grew to 120K followers","audience":"women going through divorce, career changes, and life rebuilds","firstName":"Sandra"}'::jsonb),
('sandra_test_1748349028546@selfieai.com', 'Sandra', 'Social', 'free', '{"niche":"helping women rebuild after heartbreak","offer":"personal branding coaching for major life transitions","story":"divorced single mom who rebuilt her life and grew to 120K followers","audience":"women going through divorce, career changes, and life rebuilds","firstName":"Sandra"}'::jsonb),
('sandra_test_1748349160085@selfieai.com', 'Sandra', 'Social', 'free', '{"niche":"helping women rebuild after heartbreak","offer":"personal branding coaching for major life transitions","story":"divorced single mom who rebuilt her life and grew to 120K followers","audience":"women going through divorce, career changes, and life rebuilds","firstName":"Sandra"}'::jsonb),
('sandra_test_1748349177291@selfieai.com', 'Sandra', 'Social', 'free', '{"niche":"helping women rebuild after heartbreak","offer":"personal branding coaching for major life transitions","story":"divorced single mom who rebuilt her life and grew to 120K followers","audience":"women going through divorce, career changes, and life rebuilds","firstName":"Sandra"}'::jsonb),
('sandra_test_1748349476887@selfieai.com', 'Sandra', 'Social', 'free', '{"niche":"helping women rebuild after heartbreak","offer":"personal branding coaching for major life transitions","story":"divorced single mom who rebuilt her life and grew to 120K followers","audience":"women going through divorce, career changes, and life rebuilds","firstName":"Sandra"}'::jsonb),
('sandra_test_1748349795857@selfieai.com', 'Sandra', 'Social', 'free', '{"niche":"helping women rebuild after heartbreak","offer":"personal branding coaching for major life transitions","story":"divorced single mom who rebuilt her life and grew to 120K followers","audience":"women going through divorce, career changes, and life rebuilds","firstName":"Sandra"}'::jsonb),
('sandra_test_1748349828730@selfieai.com', 'Sandra', 'Social', 'free', '{"niche":"helping women rebuild after heartbreak","offer":"personal branding coaching for major life transitions","story":"divorced single mom who rebuilt her life and grew to 120K followers","audience":"women going through divorce, career changes, and life rebuilds","firstName":"Sandra"}'::jsonb),
('ssa@ssasocial.com', 'Sandra', 'Aamodt', 'VIP', NULL)
ON CONFLICT (email) DO UPDATE SET 
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  plan = EXCLUDED.plan,
  updated_at = NOW();

-- Validate Migration
SELECT 'Migration Complete' as status,
       (SELECT COUNT(*) FROM user_profiles) as user_profiles_count,
       (SELECT COUNT(*) FROM users) as users_count,
       (SELECT brand_mission FROM user_profiles WHERE user_id = '1') as sandra_mission_check;