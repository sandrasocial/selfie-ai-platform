-- Run this in Supabase SQL Editor to set up leads table
-- Project: https://zlslzllzejdhyfczcumv.supabase.co

-- Create leads table
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'selfie_guide',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "service_role_policy" ON public.leads
  AS PERMISSIVE FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert leads (for form submissions)
CREATE POLICY "anon_insert_policy" ON public.leads
  AS PERMISSIVE FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to read leads (if needed)
CREATE POLICY "anon_select_policy" ON public.leads
  AS PERMISSIVE FOR SELECT
  TO anon
  USING (true);