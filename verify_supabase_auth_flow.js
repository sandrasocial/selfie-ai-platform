/**
 * Verify Live Supabase Connection and Auth Flow
 * Tests database access and form submission pipeline
 */

const SUPABASE_URL = 'https://zlslzllzejdhyfczcumv.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_URL; // Note: env vars are swapped

async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: response.status, ok: response.ok, data };
}

async function verifyAuthFlow() {
  console.log('🔍 Verifying Supabase connection and auth flow...\n');

  try {
    // Test 1: Check if leads table exists
    console.log('1. Testing leads table access...');
    const tableCheck = await makeRequest(`${SUPABASE_URL}/rest/v1/leads?select=count&limit=1`);
    
    if (tableCheck.ok) {
      console.log('✅ Leads table accessible');
    } else {
      console.log('❌ Leads table not found - run supabase-policies.sql first');
      console.log('   Error:', tableCheck.data);
      return false;
    }

    // Test 2: Insert test lead
    console.log('\n2. Testing lead insertion...');
    const testLead = {
      name: 'Verification Test',
      email: 'verify@selfieai.co',
      source: 'system_test',
      pdf_url: 'https://example.com/test.pdf'
    };

    const insertResult = await makeRequest(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(testLead)
    });

    if (insertResult.ok) {
      console.log('✅ Lead insertion successful');
      console.log('   Inserted:', insertResult.data);
    } else {
      console.log('❌ Lead insertion failed');
      console.log('   Error:', insertResult.data);
      return false;
    }

    // Test 3: Query leads
    console.log('\n3. Testing lead retrieval...');
    const queryResult = await makeRequest(`${SUPABASE_URL}/rest/v1/leads?select=*&limit=3`);
    
    if (queryResult.ok) {
      console.log('✅ Lead retrieval successful');
      console.log(`   Found ${queryResult.data.length} leads`);
    } else {
      console.log('❌ Lead retrieval failed');
      console.log('   Error:', queryResult.data);
      return false;
    }

    // Test 4: Cleanup test record
    console.log('\n4. Cleaning up test record...');
    const deleteResult = await makeRequest(
      `${SUPABASE_URL}/rest/v1/leads?email=eq.verify@selfieai.co`,
      { method: 'DELETE' }
    );

    if (deleteResult.ok) {
      console.log('✅ Test cleanup successful');
    } else {
      console.log('⚠️  Test cleanup failed (non-critical)');
    }

    console.log('\n🎉 Supabase verification complete - all systems operational!');
    return true;

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

// Run verification if script is executed directly
verifyAuthFlow();