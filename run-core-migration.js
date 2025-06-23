// SELFIE AI™ Database Migration Runner
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function runMigrationSQL() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('🚀 SELFIE AI™ Database Migration\n')

  try {
    // Create enums first
    console.log('1️⃣ Creating enums...')
    
    await supabase.rpc('sql', {
      query: `
        DO $$ BEGIN
          CREATE TYPE user_tier AS ENUM ('free', 'starter', 'collective', 'vip');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    })
    
    await supabase.rpc('sql', {
      query: `
        DO $$ BEGIN
          CREATE TYPE ai_model_status AS ENUM ('pending', 'training', 'ready', 'failed');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    })
    
    console.log('✅ Enums created')

    // Add columns to user_profiles
    console.log('2️⃣ Adding columns to user_profiles...')
    
    const alterTableQueries = [
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS tier user_tier DEFAULT 'free'",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS onboarding_status JSONB DEFAULT '{\"step\": 1, \"completed\": false, \"welcome_seen\": false}'",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS ai_model_status ai_model_status DEFAULT 'pending'",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS brand_vibe TEXT",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS future_self_unlocked TIMESTAMP[]",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS confidence_scores JSONB[] DEFAULT '{}'",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_glow_check TIMESTAMP",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS phone TEXT",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS birth_date DATE",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS location TEXT",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS instagram_handle TEXT",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS website_url TEXT",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS bio TEXT",
      "ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{\"notifications\": true, \"email_marketing\": true, \"weekly_tips\": true}'"
    ]
    
    for (const query of alterTableQueries) {
      await supabase.rpc('sql', { query })
    }
    
    console.log('✅ user_profiles columns added')

    console.log('🎉 Core migration complete!')
    return true

  } catch (error) {
    console.error('❌ Migration error:', error)
    return false
  }
}

async function checkMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('🔍 Checking migration status...')
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('tier, onboarding_status, ai_model_status')
      .limit(1)
    
    if (error) {
      console.log('❌ Migration check failed:', error.message)
      return false
    } else {
      console.log('✅ Migration successful - new columns accessible!')
      console.log('📊 Sample data structure:', data[0] || 'No users yet')
      return true
    }
  } catch (error) {
    console.error('❌ Check failed:', error)
    return false
  }
}

async function main() {
  const success = await runMigrationSQL()
  if (success) {
    await checkMigration()
  }
}

main().catch(console.error)
