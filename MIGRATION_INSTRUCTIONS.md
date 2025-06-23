# 🚀 SELFIE AI™ Database Migration Deployment

## 📋 STEP-BY-STEP INSTRUCTIONS

### **STEP 1: Access Supabase SQL Editor**
1. Open: https://supabase.com/dashboard/project/usrustscragennskanfh/sql
2. Login to your Supabase account
3. Navigate to SQL Editor

### **STEP 2: Run Migration SQL**
1. Copy the contents of `migration-for-sql-editor.sql`
2. Paste into the SQL Editor
3. Click "Run" button
4. Wait for completion (should see "Success" message)

### **STEP 3: Verify Migration**
Run this command in terminal:
```bash
node test-complete-flow.js
```

### **STEP 4: Test Live User Creation**
If migration is successful, test the full flow:

1. **Signup Test**: 
   - Open: http://localhost:3000/auth/signup
   - Create account with real email
   - Check Supabase > Authentication > Users

2. **Profile Verification**:
   - Go to Supabase > Table Editor > user_profiles
   - Verify new user appears with tier='free'

3. **Login Test**:
   - Go to: http://localhost:3000/auth/login
   - Login with created account
   - Should redirect to dashboard

4. **Dashboard Test**:
   - Verify dashboard shows user info
   - Check tier display, sign out works

## 🎯 MIGRATION SQL TO COPY

```sql
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
```

## ✅ SUCCESS CRITERIA

After migration, you should see:
- ✅ New columns in user_profiles table
- ✅ Working signup flow creates both auth.users AND user_profiles entries  
- ✅ Login flow works and shows dashboard
- ✅ Dashboard displays user tier and profile info

## 🚨 TROUBLESHOOTING

**If migration fails:**
- Check for syntax errors in SQL Editor
- Verify you have proper permissions
- Try running parts of the migration separately

**If user creation fails:**
- Check Supabase logs
- Verify trigger is created
- Test with `node test-complete-flow.js`

**If login fails:**
- Check browser console for errors
- Verify environment variables
- Test API endpoints directly
