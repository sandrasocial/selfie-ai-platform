#!/usr/bin/env node

console.log('🔍 SELFIE AI™ Login Diagnostic Tool\n');

// Check if dev server is running
const http = require('http');

function checkServer(port) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 1000
    }, (res) => {
      resolve(true);
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

async function runDiagnostic() {
  console.log('1. Checking if development server is running...');
  const serverRunning = await checkServer(3000);
  
  if (!serverRunning) {
    console.log('❌ Development server not running on port 3000');
    console.log('');
    console.log('🔧 SOLUTION:');
    console.log('Run: npm run dev');
    console.log('Then try: http://localhost:3000/auth/login');
    return;
  }
  
  console.log('✅ Development server is running on port 3000');
  
  console.log('\n2. Checking environment variables...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase environment variables missing');
    console.log('');
    console.log('🔧 SOLUTION:');
    console.log('Make sure .env.local contains:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://usrustscragennskanfh.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    return;
  }
  
  console.log('✅ Supabase environment variables found');
  
  console.log('\n📋 NEXT STEPS TO FIX LOGIN:');
  console.log('');
  console.log('1. 🔧 DISABLE EMAIL CONFIRMATIONS:');
  console.log('   • Go to: https://supabase.com/dashboard/project/usrustscragennskanfh');
  console.log('   • Click: Authentication > Settings');
  console.log('   • Find: "Enable email confirmations"');
  console.log('   • Turn it OFF (uncheck)');
  console.log('   • Click: Save');
  console.log('');
  console.log('2. 🧪 TEST LOGIN:');
  console.log('   • Go to: http://localhost:3000/auth/signup');
  console.log('   • Create account with your email');
  console.log('   • Go to: http://localhost:3000/auth/login');
  console.log('   • Login with your credentials');
  console.log('');
  console.log('3. 🎉 ACCESS DASHBOARD:');
  console.log('   • You should be redirected to: http://localhost:3000/dashboard');
  console.log('   • You\'ll see your personalized SELFIE AI™ dashboard');
  console.log('');
  console.log('🚨 If this doesn\'t work, check the LOGIN_FIX_URGENT.md file');
  console.log('   for the database migration steps.');
}

runDiagnostic().catch(console.error);
