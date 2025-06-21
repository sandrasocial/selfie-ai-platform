-- Create admin_tasks table
CREATE TABLE admin_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  agent TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'medium',
  file_path TEXT,
  status TEXT CHECK (status IN ('pending', 'active', 'completed')) NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on admin_tasks" ON admin_tasks
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_admin_tasks_status ON admin_tasks(status);
CREATE INDEX idx_admin_tasks_agent ON admin_tasks(agent);
CREATE INDEX idx_admin_tasks_created_at ON admin_tasks(created_at DESC); 