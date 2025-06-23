// Check and Fix User Profiles
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function checkAndFixProfiles() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🔍 Checking User Profiles Status\n')

  try {
    // Get all auth users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) throw usersError

    console.log(`👥 Auth Users Found: ${users.users.length}`)
    
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
    
    if (profilesError) throw profilesError

    console.log(`📊 Profiles Found: ${profiles.length}`)

    // Check which users are missing profiles
    const usersMissingProfiles = users.users.filter(user => 
      !profiles.find(profile => profile.user_id === user.id)
    )

    console.log(`❌ Users Missing Profiles: ${usersMissingProfiles.length}`)

    // Create missing profiles manually
    for (const user of usersMissingProfiles) {
      console.log(`\n🔧 Creating profile for ${user.email}...`)
      
      const profileData = {
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        is_admin: user.email === 'ssa@ssasocial.com',
        role: user.email === 'ssa@ssasocial.com' ? 'super_admin' : 'user',
        tier: 'free',
        onboarding_status: { step: 1, completed: false, welcome_seen: false },
        ai_model_status: 'pending',
        preferences: { notifications: true, email_marketing: true, weekly_tips: true }
      }

      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single()

      if (createError) {
        console.log(`   ❌ Failed: ${createError.message}`)
      } else {
        console.log(`   ✅ Created profile for ${user.email}`)
      }
    }

    // Final check
    const { data: finalProfiles, error: finalError } = await supabase
      .from('user_profiles')
      .select('email, tier, is_admin, role')
    
    if (finalError) throw finalError

    console.log('\n📊 Final Profile Status:')
    finalProfiles.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.email} - ${profile.tier} - ${profile.role}`)
    })

    return true

  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

checkAndFixProfiles()
