-- Supabase Magic Link Authentication Database Policies
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security on auth.users (if not already enabled)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid references auth.users on delete cascade,
  business_name text,
  industry text,
  target_audience text,
  brand_voice text,
  avatar_url text,
  plan text default 'freebie',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  uploads_this_month integer default 0,
  image_generations_today integer default 0,
  last_image_reset_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create generated_content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  type text not null,
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on generated_content
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own content
CREATE POLICY "Users can view own content" ON generated_content
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own content
CREATE POLICY "Users can insert own content" ON generated_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own content
CREATE POLICY "Users can update own content" ON generated_content
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own content
CREATE POLICY "Users can delete own content" ON generated_content
  FOR DELETE USING (auth.uid() = user_id);

-- Create visual_gallery table
CREATE TABLE IF NOT EXISTS visual_gallery (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  image_url text not null,
  prompt text,
  style text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on visual_gallery
ALTER TABLE visual_gallery ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own gallery
CREATE POLICY "Users can view own gallery" ON visual_gallery
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert to their own gallery
CREATE POLICY "Users can insert own gallery" ON visual_gallery
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete from their own gallery
CREATE POLICY "Users can delete own gallery" ON visual_gallery
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update user profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Storage bucket for user uploads (if using Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Users can upload to their own folder
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Users can view their own files
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Public can view files in public folder
CREATE POLICY "Public can view public files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-uploads' AND (storage.foldername(name))[1] = 'public');

-- Enable realtime (if needed for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE generated_content;
ALTER PUBLICATION supabase_realtime ADD TABLE visual_gallery;