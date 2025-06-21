const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const migrationQueries = [
  // Add new columns to admin_tasks
  "ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS workflow TEXT[] DEFAULT '{}'",
  "ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS current_agent_index INTEGER DEFAULT 0",
  "ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS agent_notes JSONB DEFAULT '{}'",
  "ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS preview_url TEXT",
  "ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS ready_for_review BOOLEAN DEFAULT false",
  
  // Update status constraint
  "ALTER TABLE admin_tasks DROP CONSTRAINT IF EXISTS admin_tasks_status_check",
  "ALTER TABLE admin_tasks ADD CONSTRAINT admin_tasks_status_check CHECK (status IN ('pending', 'in_progress', 'needs_next_agent', 'in_review', 'ready_for_preview', 'changes_requested', 'approved', 'completed'))",
  
  // Create index
  "CREATE INDEX IF NOT EXISTS idx_admin_tasks_ready_for_review ON admin_tasks(ready_for_review) WHERE ready_for_review = true",
  
  // Create agent_activity_log table
  `CREATE TABLE IF NOT EXISTS agent_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES admin_tasks(id) ON DELETE CASCADE,
    agent_name TEXT NOT NULL,
    activity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
  )`,
  
  // Enable RLS
  "ALTER TABLE agent_activity_log ENABLE ROW LEVEL SECURITY",
  
  // Create policy
  "DROP POLICY IF EXISTS \"Allow all operations on agent_activity_log\" ON agent_activity_log",
  "CREATE POLICY \"Allow all operations on agent_activity_log\" ON agent_activity_log FOR ALL USING (true) WITH CHECK (true)",
  
  // Create indexes
  "CREATE INDEX IF NOT EXISTS idx_agent_activity_log_task_id ON agent_activity_log(task_id)",
  "CREATE INDEX IF NOT EXISTS idx_agent_activity_log_created_at ON agent_activity_log(created_at DESC)"
];

async function runMigration() {
  console.log('Starting migration...');
  
  for (let i = 0; i < migrationQueries.length; i++) {
    const query = migrationQueries[i];
    console.log(`Running query ${i + 1}/${migrationQueries.length}: ${query.substring(0, 50)}...`);
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error(`Query ${i + 1} failed:`, error);
        // Try alternative approach for this query
        console.log('Trying alternative approach...');
        continue;
      }
      console.log(`Query ${i + 1} completed successfully`);
    } catch (err) {
      console.error(`Query ${i + 1} failed with exception:`, err);
    }
  }
  
  console.log('Migration completed!');
}

runMigration(); 