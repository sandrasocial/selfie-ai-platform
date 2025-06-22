-- Create photo_vault table
CREATE TABLE photo_vault (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    tags TEXT[] DEFAULT '{}',
    category TEXT NOT NULL DEFAULT 'Other',
    mood TEXT NOT NULL DEFAULT 'Casual',
    lighting TEXT NOT NULL DEFAULT 'Natural',
    style TEXT NOT NULL DEFAULT 'Clean',
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'branded', 'vip')),
    subscription_status TEXT DEFAULT 'inactive',
    subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for photo_vault
ALTER TABLE photo_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own photos" ON photo_vault
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos" ON photo_vault
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" ON photo_vault
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" ON photo_vault
    FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create storage bucket for photo vault
INSERT INTO storage.buckets (id, name, public) VALUES ('photo-vault', 'photo-vault', true);

-- Storage policies
CREATE POLICY "Users can upload photos to their folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'photo-vault' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own photos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'photo-vault' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'photo-vault' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Indexes for better performance
CREATE INDEX idx_photo_vault_user_id ON photo_vault(user_id);
CREATE INDEX idx_photo_vault_category ON photo_vault(category);
CREATE INDEX idx_photo_vault_mood ON photo_vault(mood);
CREATE INDEX idx_photo_vault_created_at ON photo_vault(created_at);
CREATE INDEX idx_photo_vault_is_favorite ON photo_vault(is_favorite);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for photo_vault
CREATE TRIGGER update_photo_vault_updated_at 
    BEFORE UPDATE ON photo_vault 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
