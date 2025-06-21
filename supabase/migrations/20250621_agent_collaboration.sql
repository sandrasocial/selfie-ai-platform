-- Update the admin_tasks table with collaboration features
ALTER TABLE admin_tasks 
ADD COLUMN workflow TEXT[] DEFAULT '{}',
ADD COLUMN current_agent_index INTEGER DEFAULT 0,
ADD COLUMN agent_notes JSONB DEFAULT '{}',
ADD COLUMN preview_url TEXT,
ADD COLUMN ready_for_review BOOLEAN DEFAULT false;

-- Update the status check constraint to include new statuses
ALTER TABLE admin_tasks 
DROP CONSTRAINT IF EXISTS admin_tasks_status_check;

ALTER TABLE admin_tasks 
ADD CONSTRAINT admin_tasks_status_check 
CHECK (status IN ('pending', 'in_progress', 'needs_next_agent', 'in_review', 'ready_for_preview', 'changes_requested', 'approved', 'completed'));

-- Create an index for faster queries on ready_for_review tasks
CREATE INDEX idx_admin_tasks_ready_for_review ON admin_tasks(ready_for_review) WHERE ready_for_review = true;

-- Create an agent activity log table
CREATE TABLE IF NOT EXISTS agent_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES admin_tasks(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  activity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS on the new table
ALTER TABLE agent_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policy for agent activity log
CREATE POLICY "Allow all operations on agent_activity_log" ON agent_activity_log
  FOR ALL USING (true) WITH CHECK (true);

-- Create index for activity log queries
CREATE INDEX idx_agent_activity_log_task_id ON agent_activity_log(task_id);
CREATE INDEX idx_agent_activity_log_created_at ON agent_activity_log(created_at DESC); 