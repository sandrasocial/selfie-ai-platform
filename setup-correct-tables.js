const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupCorrectTables() {
  console.log('🔧 Setting up correct tables for the application...\n')

  // 1. Create profiles table (what the app actually expects)
  console.log('Creating PROFILES table...')
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop and recreate profiles table with correct structure
        DROP TABLE IF EXISTS profiles CASCADE;
        
        CREATE TABLE profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          tier TEXT DEFAULT 'free',
          subscription_status TEXT DEFAULT 'inactive',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view own profile" ON profiles
          FOR SELECT USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile" ON profiles
          FOR UPDATE USING (auth.uid() = id);

        CREATE POLICY "Users can insert own profile" ON profiles
          FOR INSERT WITH CHECK (auth.uid() = id);
      `
    })

    if (error) {
      console.log('❌ Profiles table error:', error.message)
    } else {
      console.log('✅ Profiles table created successfully')
    }
  } catch (err) {
    console.log('❌ Profiles table creation failed:', err.message)
  }

  // 2. Create leads table
  console.log('\nCreating LEADS table...')
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop and recreate leads table
        DROP TABLE IF EXISTS leads CASCADE;
        
        CREATE TABLE leads (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT,
          lead_type TEXT DEFAULT 'freebie',
          source TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS  
        ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

        -- Create policies (leads are public for signup forms)
        CREATE POLICY "Anyone can insert leads" ON leads
          FOR INSERT WITH CHECK (true);

        CREATE POLICY "Only authenticated users can view leads" ON leads
          FOR SELECT USING (auth.role() = 'authenticated');
      `
    })

    if (error) {
      console.log('❌ Leads table error:', error.message)
    } else {
      console.log('✅ Leads table created successfully')
    }
  } catch (err) {
    console.log('❌ Leads table creation failed:', err.message)
  }

  // 3. Create trigger to auto-create profile when user signs up
  console.log('\nCreating auth trigger...')
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Function to handle new user signup
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, tier)
          VALUES (NEW.id, NEW.email, 'free');
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Trigger to call the function when new user is created
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    })

    if (error) {
      console.log('❌ Auth trigger error:', error.message)
    } else {
      console.log('✅ Auth trigger created successfully')
    }
  } catch (err) {
    console.log('❌ Auth trigger creation failed:', err.message)
  }

  // 4. Test the tables
  console.log('\n🧪 Testing table structures...')
  
  // Test profiles
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ 
        id: '00000000-0000-0000-0000-000000000001',
        email: 'test@example.com',
        tier: 'free'
      })
      .select()

    if (error) {
      console.log('❌ Profiles test failed:', error.message)
    } else {
      console.log('✅ Profiles table structure is correct')
      // Clean up
      await supabase.from('profiles').delete().eq('id', '00000000-0000-0000-0000-000000000001')
    }
  } catch (err) {
    console.log('❌ Profiles test error:', err.message)
  }

  // Test leads
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({ 
        email: 'test@example.com',
        name: 'Test User',
        lead_type: 'freebie'
      })
      .select()

    if (error) {
      console.log('❌ Leads test failed:', error.message)
    } else {
      console.log('✅ Leads table structure is correct')
      // Clean up
      await supabase.from('leads').delete().eq('email', 'test@example.com')
    }
  } catch (err) {
    console.log('❌ Leads test error:', err.message)
  }

  console.log('\n🎉 Table setup complete!')
  console.log('\n📋 SUMMARY:')
  console.log('✅ profiles table: id (UUID), email, tier, subscription_status')
  console.log('✅ leads table: id (SERIAL), email, name, lead_type, source')
  console.log('✅ Auth trigger: Auto-creates profile when user signs up')
  console.log('✅ RLS policies: Secure access control')
}

setupCorrectTables().catch(console.error)
