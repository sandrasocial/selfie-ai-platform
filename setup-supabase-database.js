/**
 * Setup Live Supabase Database Schema
 * Creates leads table and RLS policies for SELFIE AI™
 */

const SUPABASE_URL = 'https://zlslzllzejdhyfczcumv.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_URL; // Note: variables are swapped in env

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql })
  });

  if (!response.ok) {
    throw new Error(`SQL execution failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function setupDatabase() {
  console.log('Setting up Supabase database schema...');

  try {
    // Create leads table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS public.leads (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT,
        email TEXT NOT NULL,
        source TEXT DEFAULT 'selfie_guide',
        pdf_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✓ Created leads table');

    // Enable RLS
    await executeSQL(`ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;`);
    console.log('✓ Enabled Row Level Security');

    // Create policies
    await executeSQL(`
      CREATE POLICY IF NOT EXISTS "Service role full access" ON public.leads
        FOR ALL USING (true) WITH CHECK (true);
    `);
    console.log('✓ Created service role policy');

    await executeSQL(`
      CREATE POLICY IF NOT EXISTS "Anon can insert leads" ON public.leads
        FOR INSERT WITH CHECK (true);
    `);
    console.log('✓ Created anon insert policy');

    // Grant permissions
    await executeSQL(`
      GRANT ALL ON public.leads TO service_role;
      GRANT SELECT, INSERT ON public.leads TO anon;
      GRANT USAGE ON SCHEMA public TO anon;
    `);
    console.log('✓ Granted permissions');

    // Test the setup
    const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=count`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (testResponse.ok) {
      console.log('✓ Database setup successful - table accessible');
      return true;
    } else {
      console.error('✗ Table not accessible:', await testResponse.text());
      return false;
    }

  } catch (error) {
    console.error('Database setup failed:', error.message);
    return false;
  }
}

setupDatabase();