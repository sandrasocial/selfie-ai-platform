#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function runMigration() {
  console.log('🚀 RUNNING COMPLETE USER SYSTEM MIGRATION')
  console.log('=' .repeat(50))
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    console.log('❌ Missing SUPABASE_SERVICE_ROLE_KEY')
    console.log('📝 Manual migration required in Supabase SQL Editor')
    console.log('📁 Run: COMPLETE_USER_SYSTEM_MIGRATION.sql')
    return
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    console.log('🔍 Step 1: Adding missing columns to user_profiles...')
    
    const alterTableSQL = `
      ALTER TABLE user_profiles 
      ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS email TEXT,
      ADD COLUMN IF NOT EXISTS onboarding_status JSONB DEFAULT '{"completed": false, "current_step": 1}',
      ADD COLUMN IF NOT EXISTS ai_model_status TEXT DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS brand_vibe TEXT,
      ADD COLUMN IF NOT EXISTS future_self_unlocked TIMESTAMP[],
      ADD COLUMN IF NOT EXISTS confidence_scores JSONB[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS last_glow_check TIMESTAMP,
      ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'user',
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `
    
    const { error: alterError } = await supabase.rpc('exec_sql', { sql: alterTableSQL })
    
    if (alterError) {
      console.log('❌ Column addition failed:', alterError.message)
      return
    }
    
    console.log('✅ Columns added successfully')
    
    console.log('🔍 Step 2: Creating content tables...')
    
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS future_self_images (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          image_url TEXT NOT NULL,
          scenario TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          is_featured BOOLEAN DEFAULT false
      );
      
      CREATE TABLE IF NOT EXISTS user_progress (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          metric_type TEXT NOT NULL,
          value JSONB NOT NULL,
          recorded_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS glow_checks (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          image_url TEXT NOT NULL,
          feedback JSONB NOT NULL,
          score INTEGER CHECK (score >= 0 AND score <= 100),
          created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS content_calendar (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          content TEXT,
          scheduled_date DATE,
          platform TEXT,
          status TEXT DEFAULT 'draft',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTablesSQL })
    
    if (createError) {
      console.log('❌ Table creation failed:', createError.message)
      return
    }
    
    console.log('✅ Content tables created successfully')
    
    console.log('🔍 Step 3: Testing migration...')
    
    const { data: testData, error: testError } = await supabase
      .from('user_profiles')
      .select('tier, email, onboarding_status')
      .limit(1)
    
    if (testError) {
      console.log('❌ Migration test failed:', testError.message)
      return
    }
    
    console.log('✅ Migration completed successfully!')
    console.log('🎉 User system is now ready')
    
  } catch (error) {
    console.log('❌ Migration failed:', error.message)
    console.log('📝 Please run COMPLETE_USER_SYSTEM_MIGRATION.sql manually in Supabase SQL Editor')
  }
}

runMigration()
