/**
 * Simple Login Test - Bypass complex profile loading
 * Test direct Supabase authentication without our custom hooks
 */

import { createClient } from '@/utils/supabase/client'

export async function testDirectLogin(email: string, password: string) {
  console.log('🧪 Testing direct login...');
  
  const supabase = createClient();
  
  try {
    console.log('1. Creating Supabase client...');
    console.log('✅ Supabase client created');
    
    console.log('2. Attempting sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Direct login error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Direct login successful');
    console.log('User:', data.user?.email);
    console.log('Session:', !!data.session);
    
    // Test if we can get session
    console.log('3. Testing session retrieval...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
    } else {
      console.log('✅ Session retrieved:', !!sessionData.session);
    }
    
    // Test basic database query
    console.log('4. Testing database connection...');
    try {
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.warn('⚠️ Database test error (this might be normal):', testError.message);
      } else {
        console.log('✅ Database connection works');
      }
    } catch (dbError) {
      console.warn('⚠️ Database test failed (table might not exist):', dbError);
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Direct login catch error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Add to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).testDirectLogin = testDirectLogin;
}
