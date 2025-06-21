-- Admin tasks table
CREATE TABLE IF NOT EXISTS admin_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_agent TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  file_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Agent activity log
CREATE TABLE IF NOT EXISTS agent_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  task_id UUID REFERENCES admin_tasks(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON admin_tasks(status);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_agent ON admin_tasks(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_agent_activity_agent_name ON agent_activity(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_activity_task_id ON agent_activity(task_id); 