-- SELFIE AI™ Database Schema for Live Supabase Project
-- Project: https://zlslzllzejdhyfczcumv.supabase.co

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'selfie_guide',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can do everything on leads" ON public.leads
  FOR ALL USING (true) WITH CHECK (true);

-- Create policy for anon access (read-only)
CREATE POLICY "Anon can read leads" ON public.leads
  FOR SELECT USING (true);

-- Create policy for anon inserts (for form submissions)
CREATE POLICY "Anon can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.leads TO service_role;
GRANT SELECT, INSERT ON public.leads TO anon;
GRANT USAGE ON SCHEMA public TO anon;