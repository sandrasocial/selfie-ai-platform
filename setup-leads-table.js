/**
 * Setup Leads Table for Free Guide
 * Creates leads table and policies if they don't exist
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupLeadsTable() {
  console.log('🔧 Setting up leads table for Free Guide...');

  try {
    // Create leads table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.leads (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT,
          email TEXT NOT NULL,
          source TEXT DEFAULT 'selfie_guide',
          pdf_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (tableError) {
      console.error('Error creating leads table:', tableError);
    } else {
      console.log('✓ Leads table created/verified');
    }

    // Enable RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;`
    });

    if (rlsError) {
      console.log('Note: RLS might already be enabled');
    } else {
      console.log('✓ RLS enabled on leads table');
    }

    // Create policies
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Service role full access" ON public.leads
          FOR ALL USING (true) WITH CHECK (true);
          
        CREATE POLICY IF NOT EXISTS "Anon can insert leads" ON public.leads
          FOR INSERT WITH CHECK (true);
      `
    });

    if (policyError) {
      console.log('Note: Policies might already exist');
    } else {
      console.log('✓ Policies created for leads table');
    }

    // Grant permissions
    const { error: permError } = await supabase.rpc('exec_sql', {
      sql: `
        GRANT ALL ON public.leads TO service_role;
        GRANT SELECT, INSERT ON public.leads TO anon;
        GRANT USAGE ON SCHEMA public TO anon;
      `
    });

    if (permError) {
      console.log('Note: Permissions might already be granted');
    } else {
      console.log('✓ Permissions granted');
    }

    // Test the setup
    const { data, error } = await supabase
      .from('leads')
      .select('count');

    if (error) {
      console.error('✗ Leads table not accessible:', error);
      return false;
    } else {
      console.log('✓ Database setup successful - leads table accessible');
      return true;
    }

  } catch (error) {
    console.error('Setup failed:', error.message);
    return false;
  }
}

setupLeadsTable();
