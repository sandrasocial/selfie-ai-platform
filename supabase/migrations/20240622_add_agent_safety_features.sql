-- Add 'cancelled' to the status enum for admin_tasks
ALTER TABLE admin_tasks
DROP CONSTRAINT IF EXISTS admin_tasks_status_check;

ALTER TABLE admin_tasks
ADD CONSTRAINT admin_tasks_status_check
CHECK (status IN ('pending', 'in_progress', 'needs_next_agent', 'in_review', 'ready_for_preview', 'changes_requested', 'approved', 'completed', 'cancelled')); -- Added 'cancelled'

-- Add agent safety settings table as per the prompt
ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0;
ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3;
ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS last_error TEXT;

-- Create agent_settings table
CREATE TABLE IF NOT EXISTS agent_settings (
  agent_name TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  max_tasks_per_hour INTEGER DEFAULT 10,
  current_error_count INTEGER DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings for each agent
INSERT INTO agent_settings (agent_name) VALUES
  ('diana'), ('maya'), ('victoria'), ('rachel'), ('quinn'), ('ava')
ON CONFLICT (agent_name) DO NOTHING; 