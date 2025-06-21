-- Create VIP Applications table
CREATE TABLE IF NOT EXISTS vip_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram TEXT NOT NULL,
  current_revenue TEXT NOT NULL,
  revenue_goal TEXT NOT NULL,
  biggest_challenge TEXT NOT NULL,
  previous_investment TEXT NOT NULL,
  why_now TEXT NOT NULL,
  commitment TEXT NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'archived')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_vip_applications_user_id ON vip_applications(user_id);
CREATE INDEX idx_vip_applications_status ON vip_applications(status);
CREATE INDEX idx_vip_applications_email ON vip_applications(email);
CREATE INDEX idx_vip_applications_submitted_at ON vip_applications(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE vip_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON vip_applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert own applications" ON vip_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Service role can do everything (for admin access)
CREATE POLICY "Service role has full access" ON vip_applications
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vip_applications_updated_at
  BEFORE UPDATE ON vip_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 