const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function quickTest() {
  console.log('🔍 Quick Database Test');
  
  try {
    // Test basic connection
    const { data: authData, error: authError } = await supabase.auth.getUser();
    console.log('✅ Supabase connection works');
    
    // Check if user_profiles exists
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ user_profiles table does not exist');
        console.log('🔧 Migration needs to be run in Supabase SQL Editor');
      } else {
        console.log('❌ user_profiles error:', error.message);
      }
    } else {
      console.log('✅ user_profiles table exists');
    }
    
    // Check auth.users count
    const { count } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Total users in auth.users: ${count || 0}`);
    
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

quickTest();
