#!/usr/bin/env node

/**
 * SELFIE AI™ - Environment Configuration Helper
 * This script helps you update your .env.local file with the correct Supabase credentials
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env.local');

console.log('🔧 SELFIE AI™ Environment Configuration Helper');
console.log('===============================================\n');

console.log('Current .env.local contains dummy values. Let\'s update it with your real Supabase credentials.\n');

console.log('You can find your Supabase credentials at:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Settings > API\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateEnvironment() {
  try {
    console.log('Please provide your Supabase credentials:\n');
    
    const supabaseUrl = await askQuestion('Enter your Supabase URL (e.g., https://yourproject.supabase.co): ');
    const supabaseAnonKey = await askQuestion('Enter your Supabase Anon Key: ');
    const supabaseServiceKey = await askQuestion('Enter your Supabase Service Role Key: ');
    
    // Generate a secure NextAuth secret
    const nextAuthSecret = require('crypto').randomBytes(32).toString('hex');
    
    const envContent = `# SELFIE AI™ Environment Configuration
# Updated: ${new Date().toISOString()}

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# Authentication
NEXTAUTH_SECRET=${nextAuthSecret}
NEXTAUTH_URL=http://localhost:3000

# OpenAI Configuration (update with your key)
OPENAI_API_KEY=dummy_openai_key

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=ssa@ssasocial.com
ADMIN_PASSWORD=dummy_password

# Email Configuration (update with your Resend key)
RESEND_API_KEY=dummy_resend_key
`;

    // Backup existing .env.local
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, `${envPath}.backup.${Date.now()}`);
      console.log('\n✅ Backed up existing .env.local file');
    }

    // Write new .env.local
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Updated .env.local with your Supabase credentials!');
    console.log('\nNext steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Test the authentication at http://localhost:3000/diagnostic/auth');
    console.log('3. Try signing up with a new email address');
    
  } catch (error) {
    console.error('❌ Error updating environment:', error.message);
  } finally {
    rl.close();
  }
}

updateEnvironment();
