-- 🚀 SSELFIE USER PROFILE AUTO-CREATION TRIGGER
-- Run this EXACT SQL in Supabase SQL Editor to fix user profile creation

-- Step 1: Create the user profile creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    email,
    full_name,
    tier,
    onboarding_status,
    ai_model_status,
    goals,
    created_at,
    updated_at
  ) VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    '{"completed": false, "current_step": 1}',
    'pending',
    '[]',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Remove any existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Create the new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 4: Set up Row Level Security policies
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create the policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Step 5: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO service_role;

-- Step 6: Confirmation message
SELECT 'SUCCESS: User profile trigger is now active!' as status;
