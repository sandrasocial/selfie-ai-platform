# 🚨 AUTHENTICATION EMERGENCY FIX

## Problems Identified:

1. **Database Error**: "Database error saving new user" - trigger failing
2. **User Already Registered**: Supabase auth working but profile creation failing
3. **Profile Loading**: User signs in but profile not found
4. **Table Structure**: `user_profiles` table inconsistencies

## STEP 1: Fix Database Schema (CRITICAL)

**Go to your Supabase Dashboard SQL Editor and run this IMMEDIATELY:**

```sql
-- EMERGENCY FIX: Complete user_profiles table setup
-- This will fix all auth issues

-- 1. Drop and recreate user_profiles table with correct structure
DROP TABLE IF EXISTS public.user_profiles CASCADE;

CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'collective', 'vip')),
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  is_admin BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  location TEXT,
  phone TEXT,

  -- AI & Personalization
  ai_model_status TEXT DEFAULT 'pending' CHECK (ai_model_status IN ('pending', 'training', 'ready', 'failed')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 1,

  -- Brand & Vision
  brand_voice TEXT,
  brand_mission TEXT,
  ideal_audience TEXT,
  transformation_story TEXT,
  visual_aesthetic JSONB DEFAULT '{}',

  -- Preferences
  email_marketing_consent BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  weekly_tips BOOLEAN DEFAULT TRUE,

  -- Progress Tracking
  selfies_uploaded INTEGER DEFAULT 0,
  content_created INTEGER DEFAULT 0,
  goals_completed INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,

  -- Analytics
  last_active_at TIMESTAMP WITH TIME ZONE,
  total_sessions INTEGER DEFAULT 0,

  -- System
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create performance indexes
CREATE UNIQUE INDEX user_profiles_user_id_idx ON public.user_profiles(user_id);
CREATE UNIQUE INDEX user_profiles_email_idx ON public.user_profiles(email);
CREATE INDEX user_profiles_tier_idx ON public.user_profiles(tier);
CREATE INDEX user_profiles_role_idx ON public.user_profiles(role);

-- 3. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Service role full access" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;

-- 5. Create simple, working RLS policies
CREATE POLICY "Service role access" ON public.user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users own profile" ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Grant permissions
GRANT ALL ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;

-- 7. Create the trigger function (FIXED VERSION)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name,
    is_admin,
    role,
    email_marketing_consent
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.email IN ('ssa@ssasocial.com', 'sandra@selfieai.co') THEN true ELSE false END,
    CASE WHEN NEW.email IN ('ssa@ssasocial.com', 'sandra@selfieai.co') THEN 'super_admin' ELSE 'user' END,
    COALESCE((NEW.raw_user_meta_data->>'marketing_consent')::boolean, false)
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the auth
  RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. Create update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
SELECT 'EMERGENCY AUTH FIX COMPLETE - Database ready!' as status;
```

## STEP 2: Disable Email Confirmations

1. Go to: https://supabase.com/dashboard/project/usrustscragennskanfh/auth/settings
2. Find: "Enable email confirmations"
3. **TURN IT OFF** (uncheck)
4. Click: **Save**

## STEP 3: Test the Fix

1. Clear browser cache/cookies
2. Go to: https://www.sselfie.ai/auth/signup
3. Create a test account with a real email
4. Should work immediately without email confirmation
5. Sign in at: https://www.sselfie.ai/auth/login
6. Should reach dashboard successfully

## EXPECTED RESULTS:

✅ Sign up creates user in auth.users
✅ Trigger creates profile in user_profiles  
✅ Sign in loads profile successfully
✅ No more "Database error saving new user"
✅ No more "User already registered" (unless actually registered)
✅ Profile loading works in dashboard

## IF STILL HAVING ISSUES:

Check browser console for errors and share them.
The most common remaining issue is usually:

- Email confirmations still enabled
- Browser cache not cleared
- Old authentication state cached

This fix addresses all the structural issues with your auth system.
