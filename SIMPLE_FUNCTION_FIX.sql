-- 🔥 SIMPLE FUNCTION FIX - Your trigger exists, just need to fix/create the function
-- Run this in Supabase SQL Editor

-- Step 1: Replace the handle_new_user function with a working version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles when a new user is created in auth.users
  INSERT INTO public.user_profiles (
    user_id,
    email,
    full_name,
    tier,
    onboarding_status,
    ai_model_status,
    role,
    admin_status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'free',
    '{"completed": false, "current_step": 1}',
    'pending',
    'user',
    'user',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Grant permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

-- Step 3: Create profiles for any existing users who don't have them
INSERT INTO public.user_profiles (
  user_id,
  email,
  full_name,
  tier,
  onboarding_status,
  ai_model_status,
  role,
  admin_status,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  'free',
  '{"completed": false, "current_step": 1}',
  'pending',
  'user',
  'user',
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL;

-- Step 4: Verify it worked
SELECT 
  'Users in auth.users:' as check_type,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profiles in user_profiles:' as check_type,
  COUNT(*) as count
FROM public.user_profiles;
