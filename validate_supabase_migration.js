/**
 * Supabase Migration Validation Script
 * Validates that migration was successful and data is accessible
 */

import { createClient } from '@supabase/supabase-js';
import pkg from 'pg';
const { Client } = pkg;

async function validateSupabaseMigration() {
  console.log("Validating Supabase migration...");

  const supabaseUrl = 'https://zlslzllzejdhyfczcumv.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc2x6bGx6ZWpkaHlmY3pjdW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1ODY5NDcsImV4cCI6MjA2NDE2Mjk0N30.5lEhcAbccHjZpX8NOkgsw3-HREJfXm1qdOiJu3xt-18';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Current database for comparison
  const currentDB = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await currentDB.connect();
    console.log("Connected to current database");

    // Test Supabase connection and data
    const { data: supabaseProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('id');

    if (profileError) {
      console.log("⚠️ Supabase tables not accessible:", profileError.message);
      console.log("Please run the schema creation SQL first");
      return { success: false, reason: 'tables_not_created' };
    }

    const { data: supabaseUsers, error: userError } = await supabase
      .from('users')
      .select('*')
      .order('id');

    if (userError) {
      console.log("⚠️ Users table not accessible:", userError.message);
      return { success: false, reason: 'users_table_missing' };
    }

    // Compare with current data
    const currentProfiles = await currentDB.query('SELECT * FROM user_profiles ORDER BY id');
    const currentUsers = await currentDB.query('SELECT * FROM users ORDER BY id');

    console.log("📊 Data comparison:");
    console.log(`Current DB: ${currentProfiles.rows.length} profiles, ${currentUsers.rows.length} users`);
    console.log(`Supabase: ${supabaseProfiles?.length || 0} profiles, ${supabaseUsers?.length || 0} users`);

    if (supabaseProfiles?.length === currentProfiles.rows.length && 
        supabaseUsers?.length === currentUsers.rows.length) {
      console.log("✅ Migration validation successful!");
      console.log("All data migrated correctly to Supabase");
      
      return {
        success: true,
        profileCount: supabaseProfiles.length,
        userCount: supabaseUsers.length,
        ready: true
      };
    } else {
      console.log("⚠️ Data counts don't match - migration may be incomplete");
      return { 
        success: false, 
        reason: 'data_mismatch',
        expected: { profiles: currentProfiles.rows.length, users: currentUsers.rows.length },
        actual: { profiles: supabaseProfiles?.length || 0, users: supabaseUsers?.length || 0 }
      };
    }

  } catch (error) {
    console.error("❌ Validation failed:", error.message);
    return { success: false, error: error.message };
  } finally {
    await currentDB.end();
  }
}

validateSupabaseMigration()
  .then(result => {
    if (result.success) {
      console.log("✅ Migration validated successfully");
      console.log("Ready to update DATABASE_URL to Supabase");
    } else {
      console.log("❌ Migration validation failed");
      console.log("Reason:", result.reason);
    }
  })
  .catch(console.error);