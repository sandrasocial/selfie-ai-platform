/**
 * Run Admin Table Migrations
 * Creates admin_tasks and agent_activity_log tables for Agent Hub
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigrations() {
  console.log('Running admin table migrations...');

  try {
    // Create admin_tasks table
    const { error: tasksError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_tasks (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          agent TEXT NOT NULL,
          priority TEXT CHECK (priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'medium',
          file_path TEXT,
          status TEXT CHECK (status IN ('pending', 'in_progress', 'needs_next_agent', 'in_review', 'ready_for_preview', 'changes_requested', 'approved', 'completed')) NOT NULL DEFAULT 'pending',
          completed_at TIMESTAMP WITH TIME ZONE,
          workflow TEXT[] DEFAULT '{}',
          current_agent_index INTEGER DEFAULT 0,
          agent_notes JSONB DEFAULT '{}',
          preview_url TEXT,
          ready_for_review BOOLEAN DEFAULT false
        );
      `
    });

    if (tasksError) {
      console.error('Error creating admin_tasks table:', tasksError);
    } else {
      console.log('✓ Created admin_tasks table');
    }

    // Enable RLS on admin_tasks
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;`
    });

    if (rlsError) {
      console.error('Error enabling RLS:', rlsError);
    } else {
      console.log('✓ Enabled RLS on admin_tasks');
    }

    // Create policy for admin_tasks
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Allow all operations on admin_tasks" ON admin_tasks
          FOR ALL USING (true) WITH CHECK (true);
      `
    });

    if (policyError) {
      console.error('Error creating policy:', policyError);
    } else {
      console.log('✓ Created policy for admin_tasks');
    }

    // Create indexes for admin_tasks
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON admin_tasks(status);
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_agent ON admin_tasks(agent);
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_created_at ON admin_tasks(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_ready_for_review ON admin_tasks(ready_for_review) WHERE ready_for_review = true;
      `
    });
    console.log('✓ Created indexes for admin_tasks');

    // Create agent_activity_log table
    const { error: logsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS agent_activity_log (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          task_id UUID REFERENCES admin_tasks(id) ON DELETE CASCADE,
          agent_name TEXT NOT NULL,
          activity TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
        );
      `
    });

    if (logsError) {
      console.error('Error creating agent_activity_log table:', logsError);
    } else {
      console.log('✓ Created agent_activity_log table');
    }

    // Enable RLS on agent_activity_log
    const { error: logsRlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE agent_activity_log ENABLE ROW LEVEL SECURITY;`
    });

    if (logsRlsError) {
      console.error('Error enabling RLS on logs:', logsRlsError);
    } else {
      console.log('✓ Enabled RLS on agent_activity_log');
    }

    // Create policy for agent_activity_log
    const { error: logsPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Allow all operations on agent_activity_log" ON agent_activity_log
          FOR ALL USING (true) WITH CHECK (true);
      `
    });

    if (logsPolicyError) {
      console.error('Error creating logs policy:', logsPolicyError);
    } else {
      console.log('✓ Created policy for agent_activity_log');
    }

    // Create indexes for agent_activity_log
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_agent_activity_log_task_id ON agent_activity_log(task_id);
        CREATE INDEX IF NOT EXISTS idx_agent_activity_log_created_at ON agent_activity_log(created_at DESC);
      `
    });
    console.log('✓ Created indexes for agent_activity_log');

    // Test the setup
    const { data: testData, error: testError } = await supabase
      .from('admin_tasks')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('✗ Tables not accessible:', testError);
      return false;
    } else {
      console.log('✓ Database setup successful - tables accessible');
      return true;
    }

  } catch (error) {
    console.error('Migration failed:', error.message);
    return false;
  }
}

runMigrations(); 