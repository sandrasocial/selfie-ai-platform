-- 🔥 EMERGENCY USER PROFILE TRIGGER FIX
-- This will automatically create user_profiles when users sign up

-- Step 1: Create the trigger function
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;

-- Step 4: Enable RLS and create policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own profile  
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Service role can do everything
CREATE POLICY "Service role can manage all profiles" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Step 5: Create missing profiles for existing users (if any)
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

-- Verification query
SELECT 
    'SUCCESS: User profile trigger created!' as status,
    'Run this to verify:' as next_step,
    'SELECT COUNT(*) FROM user_profiles;' as verification_query;
