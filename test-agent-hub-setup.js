const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function setupAgentHub() {
  console.log('🔧 Setting up Agent Hub tables...')
  
  try {
    // Try to create admin_tasks table
    console.log('Creating admin_tasks table...')
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
          status TEXT CHECK (status IN ('pending', 'active', 'completed')) NOT NULL DEFAULT 'pending',
          completed_at TIMESTAMP WITH TIME ZONE
        );
        
        ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Allow all operations on admin_tasks" ON admin_tasks
          FOR ALL USING (true) WITH CHECK (true);
        
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON admin_tasks(status);
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_agent ON admin_tasks(agent);
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_created_at ON admin_tasks(created_at DESC);
      `
    })
    
    if (tasksError) {
      console.log('Note: admin_tasks table might already exist or need manual creation')
      console.log('Error:', tasksError.message)
    } else {
      console.log('✅ admin_tasks table created!')
    }
    
    // Try to update admin_tasks and create agent_activity_log
    console.log('Updating admin_tasks and creating agent_activity_log...')
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE admin_tasks 
        ADD COLUMN IF NOT EXISTS workflow TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS current_agent_index INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS agent_notes JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS preview_url TEXT,
        ADD COLUMN IF NOT EXISTS ready_for_review BOOLEAN DEFAULT false;
        
        ALTER TABLE admin_tasks 
        DROP CONSTRAINT IF EXISTS admin_tasks_status_check;
        
        ALTER TABLE admin_tasks 
        ADD CONSTRAINT admin_tasks_status_check 
        CHECK (status IN ('pending', 'in_progress', 'needs_next_agent', 'in_review', 'ready_for_preview', 'changes_requested', 'approved', 'completed'));
        
        CREATE INDEX IF NOT EXISTS idx_admin_tasks_ready_for_review ON admin_tasks(ready_for_review) WHERE ready_for_review = true;
        
        CREATE TABLE IF NOT EXISTS agent_activity_log (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          task_id UUID REFERENCES admin_tasks(id) ON DELETE CASCADE,
          agent_name TEXT NOT NULL,
          activity TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
        );
        
        ALTER TABLE agent_activity_log ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Allow all operations on agent_activity_log" ON agent_activity_log
          FOR ALL USING (true) WITH CHECK (true);
        
        CREATE INDEX IF NOT EXISTS idx_agent_activity_log_task_id ON agent_activity_log(task_id);
        CREATE INDEX IF NOT EXISTS idx_agent_activity_log_created_at ON agent_activity_log(created_at DESC);
      `
    })
    
    if (updateError) {
      console.log('Note: Tables might need manual creation in Supabase dashboard')
      console.log('Error:', updateError.message)
    } else {
      console.log('✅ Tables updated successfully!')
    }
    
    // Test if tables exist by trying to insert a test task
    console.log('🧪 Testing table access...')
    const { data: testTask, error: testError } = await supabase
      .from('admin_tasks')
      .insert([{
        title: 'Test Task',
        description: 'Testing Agent Hub functionality',
        agent: 'dev',
        priority: 'medium',
        status: 'pending',
        workflow: ['dev', 'qa'],
        current_agent_index: 0
      }])
      .select()
    
    if (testError) {
      console.error('❌ Error creating test task:', testError.message)
      console.log('💡 You may need to create the tables manually in your Supabase dashboard')
      console.log('📋 SQL commands to run:')
      console.log('1. Go to Supabase Dashboard > SQL Editor')
      console.log('2. Run the contents of supabase/migrations/admin_tasks.sql')
      console.log('3. Run the contents of supabase/migrations/20250621_agent_collaboration.sql')
    } else {
      console.log('✅ Test task created successfully:', testTask[0].id)
      
      // Test activity logging
      const { error: logError } = await supabase
        .from('agent_activity_log')
        .insert([{
          task_id: testTask[0].id,
          agent_name: 'System',
          activity: 'Test task created successfully'
        }])
      
      if (logError) {
        console.error('❌ Error logging activity:', logError.message)
      } else {
        console.log('✅ Activity logged successfully!')
      }
      
      // Clean up test data
      await supabase.from('admin_tasks').delete().eq('id', testTask[0].id)
      console.log('🧹 Test data cleaned up')
    }
    
    console.log('🎉 Agent Hub setup complete!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupAgentHub() 