-- Create selfie_scores table
CREATE TABLE IF NOT EXISTS selfie_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  sub_scores JSONB NOT NULL DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  share_id VARCHAR(12) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_selfie_scores_user_id ON selfie_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_selfie_scores_share_id ON selfie_scores(share_id);
CREATE INDEX IF NOT EXISTS idx_selfie_scores_created_at ON selfie_scores(created_at);

-- Create function to generate share_id
CREATE OR REPLACE FUNCTION generate_share_id() RETURNS VARCHAR(12) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate share_id
CREATE OR REPLACE FUNCTION set_share_id() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_id IS NULL THEN
    NEW.share_id := generate_share_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_share_id
  BEFORE INSERT ON selfie_scores
  FOR EACH ROW
  EXECUTE FUNCTION set_share_id();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_selfie_scores_updated_at
  BEFORE UPDATE ON selfie_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE selfie_scores ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own scores
CREATE POLICY "Users can view own scores" ON selfie_scores
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own scores
CREATE POLICY "Users can insert own scores" ON selfie_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Public can view shared scores
CREATE POLICY "Public can view shared scores" ON selfie_scores
  FOR SELECT USING (true);

-- Create view for leaderboard (anonymous)
CREATE OR REPLACE VIEW leaderboard_scores AS
SELECT 
  share_id,
  overall_score,
  created_at,
  CASE 
    WHEN overall_score >= 91 THEN 'Legend'
    WHEN overall_score >= 71 THEN 'Icon'
    WHEN overall_score >= 41 THEN 'Rising Star'
    ELSE 'Beginner'
  END as badge
FROM selfie_scores
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY overall_score DESC, created_at DESC
LIMIT 50; 