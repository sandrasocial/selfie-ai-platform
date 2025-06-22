-- =====================================================
-- SUPABASE TABLE SETUP - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- This file sets up the correct table structure that the 
-- Selfie AI Platform application expects to work properly.

-- 1. CREATE PROFILES TABLE (what the app actually uses)
-- =====================================================
-- Drop existing profiles table if it exists
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with correct structure
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'branded', 'vip')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (drop existing first)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create index for performance
CREATE INDEX idx_profiles_tier ON profiles(tier);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);

-- 2. CREATE LEADS TABLE (for freebie signups)
-- =====================================================
-- Drop existing leads table if it exists
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  lead_type TEXT DEFAULT 'freebie' CHECK (lead_type IN ('freebie', 'starter', 'branded', 'vip', 'waitlist')),
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for leads (drop existing first)
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
DROP POLICY IF EXISTS "Only authenticated users can view leads" ON leads;

CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_lead_type ON leads(lead_type);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- 3. CREATE OTHER REQUIRED TABLES
-- =====================================================

-- VIP Applications table
CREATE TABLE IF NOT EXISTS vip_applications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  business_name TEXT,
  current_revenue TEXT,
  goals TEXT,
  challenges TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reviewed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photo Vault table  
CREATE TABLE IF NOT EXISTS photo_vault (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  tags TEXT[],
  aesthetic_collection TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_type TEXT NOT NULL CHECK (course_type IN ('starter_kit', 'branded', 'vip')),
  module_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_type, module_id, lesson_id)
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL CHECK (product_type IN ('starter', 'branded', 'vip')),
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREATE AUTO-PROFILE CREATION TRIGGER
-- =====================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, tier, subscription_status)
  VALUES (NEW.id, NEW.email, 'free', 'inactive');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables (drop existing first)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vip_applications_updated_at ON vip_applications;
CREATE TRIGGER update_vip_applications_updated_at
  BEFORE UPDATE ON vip_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_photo_vault_updated_at ON photo_vault;
CREATE TRIGGER update_photo_vault_updated_at
  BEFORE UPDATE ON photo_vault
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_progress_updated_at ON course_progress;
CREATE TRIGGER update_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. ENABLE RLS ON ALL TABLES
-- =====================================================

-- VIP Applications (drop existing policies first)
ALTER TABLE vip_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own VIP applications" ON vip_applications;
CREATE POLICY "Users can manage own VIP applications" ON vip_applications
  USING (auth.uid() = user_id);

-- Photo Vault (drop existing policies first)
ALTER TABLE photo_vault ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own photos" ON photo_vault;
CREATE POLICY "Users can manage own photos" ON photo_vault
  USING (auth.uid() = user_id);

-- Course Progress (drop existing policies first)
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own course progress" ON course_progress;
CREATE POLICY "Users can manage own course progress" ON course_progress
  USING (auth.uid() = user_id);

-- Purchases (drop existing policies first)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION QUERIES (run these to verify setup)
-- =====================================================

-- Check if tables exist and have correct structure
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'leads', 'vip_applications', 'photo_vault', 'course_progress', 'purchases')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Check if triggers exist
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- =====================================================
-- MANUAL VERIFICATION COMMANDS
-- =====================================================
-- After running this script, you can test with these commands:

-- Test profiles table
-- INSERT INTO profiles (id, email, tier) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'free');
-- SELECT * FROM profiles WHERE email = 'test@example.com';
-- DELETE FROM profiles WHERE email = 'test@example.com';

-- Test leads table  
-- INSERT INTO leads (email, name, lead_type) VALUES ('lead@example.com', 'Test Lead', 'freebie');
-- SELECT * FROM leads WHERE email = 'lead@example.com';
-- DELETE FROM leads WHERE email = 'lead@example.com';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- All tables, triggers, and policies are now set up correctly
-- for the Selfie AI Platform application.
--
-- Key tables created:
-- - profiles: User account data with tier and subscription info
-- - leads: Lead capture for freebie signups
-- - vip_applications: VIP tier application submissions
-- - photo_vault: User photo storage and organization
-- - course_progress: Track user progress through courses
-- - purchases: Payment and subscription tracking
--
-- All tables have RLS enabled and appropriate access policies.
-- Auto-profile creation trigger ensures users get profiles on signup.
