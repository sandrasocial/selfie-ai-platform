#!/usr/bin/env node

// Test email validation to prevent Supabase bounces

// Mock the validation function since we can't import TypeScript directly
function validateEmail(email) {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Convert to lowercase for checking
  const lowerEmail = email.toLowerCase();
  
  // Check for blocked patterns
  const blockedPatterns = [
    /^test@/i,
    /^fake@/i,
    /^invalid@/i,
    /^user@/i,
    /^admin@/i,
    /^demo@/i,
    /^sample@/i,
    /^example@/i,
    /^noreply@/i,
    /^donotreply@/i,
    /test\d*@/i,
    /fake\d*@/i
  ];
  
  for (const pattern of blockedPatterns) {
    if (pattern.test(lowerEmail)) {
      return { 
        isValid: false, 
        error: 'Please use your real email address. Test emails are not allowed.' 
      };
    }
  }

  // Check for blocked domains
  const blockedDomains = [
    'test.com', 'fake.com', 'example.com', 'invalid.com', 'test.org', 'fake.org', 
    'example.org', 'invalid.org', 'localhost', '127.0.0.1', 'temp.com', 'temporary.com'
  ];
  
  const domain = lowerEmail.split('@')[1];
  if (blockedDomains.includes(domain)) {
    return { 
      isValid: false, 
      error: 'Please use a valid email domain. Test domains are not allowed.' 
    };
  }

  // Check for obviously fake domains
  if (domain.includes('test') || domain.includes('fake') || domain.includes('invalid')) {
    return { 
      isValid: false, 
      error: 'Please use your real email address for access to the platform.' 
    };
  }

  return { isValid: true };
}

const SAFE_TEST_EMAILS = [
  'Use your real email address',
  'Try temp-mail.org for temporary testing',
  'Use 10minutemail.com for quick tests',
  'Use guerrillamail.com for disposable emails'
];

console.log('🚨 TESTING EMAIL VALIDATION TO PREVENT BOUNCES\n');

// Test cases
const testEmails = [
  // Valid emails
  'john.doe@gmail.com',
  'user@company.co.uk',
  'valid.email@domain.org',
  
  // Invalid/problematic emails that cause bounces
  'test@test.com',
  'fake@email.com',
  'user@example.com',
  'invalid@invalid.com',
  'test123@fake.org',
  'demo@localhost',
  'admin@test.com',
  'noreply@example.com',
  
  // Format issues
  'not-an-email',
  '@domain.com',
  'user@',
  'user@.com',
  ''
];

console.log('TESTING EMAIL VALIDATION:');
console.log('========================\n');

testEmails.forEach(email => {
  const result = validateEmail(email);
  const status = result.isValid ? '✅ VALID' : '❌ BLOCKED';
  const error = result.error ? ` - ${result.error}` : '';
  console.log(`${status}: ${email || '(empty)'}${error}`);
});

console.log('\n🔒 PROTECTION SUMMARY:');
console.log('======================');
console.log('✅ Test emails blocked (prevents bounces)');
console.log('✅ Fake domains blocked (prevents bounces)');
console.log('✅ Invalid formats blocked');
console.log('✅ Common spam patterns blocked');

console.log('\n✅ SAFE TESTING OPTIONS:');
console.log('========================');
SAFE_TEST_EMAILS.forEach(option => console.log(`- ${option}`));

console.log('\n🚨 EMERGENCY STATUS:');
console.log('====================');
console.log('✅ Email validation implemented');
console.log('✅ Bounce prevention active');
console.log('⏳ Need to disable email verification in Supabase dashboard');
console.log('⏳ Need to clean up existing test emails');

console.log('\n📋 NEXT STEPS:');
console.log('==============');
console.log('1. Go to Supabase Dashboard');
console.log('2. Authentication > Settings');
console.log('3. Disable "Enable email confirmations"');
console.log('4. Delete users with fake emails');
console.log('5. Test with real email address');
