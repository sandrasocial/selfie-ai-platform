// Email validation utilities for SELFIE AI™
// Prevents bounced emails that threaten Supabase service

// List of known problematic domains that cause bounces
const BLOCKED_DOMAINS = [
  'test.com',
  'fake.com', 
  'example.com',
  'invalid.com',
  'test.org',
  'fake.org',
  'example.org',
  'invalid.org',
  'localhost',
  '127.0.0.1',
  'temp.com',
  'temporary.com'
];

// List of known problematic email patterns
const BLOCKED_PATTERNS = [
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

// Comprehensive email validation
export function validateEmail(email: string): { isValid: boolean; error?: string } {
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
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(lowerEmail)) {
      return { 
        isValid: false, 
        error: 'Please use your real email address. Test emails are not allowed.' 
      };
    }
  }

  // Check for blocked domains
  const domain = lowerEmail.split('@')[1];
  if (BLOCKED_DOMAINS.includes(domain)) {
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

  // Additional security checks
  if (lowerEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  const localPart = lowerEmail.split('@')[0];
  if (localPart.length > 64) {
    return { isValid: false, error: 'Email address format is invalid' };
  }

  return { isValid: true };
}

// Safe email suggestions for testing
export const SAFE_TEST_EMAILS = [
  'Use your real email address',
  'Try temp-mail.org for temporary testing',
  'Use 10minutemail.com for quick tests',
  'Use guerrillamail.com for disposable emails'
];

// Log validation attempts for monitoring
export function logEmailValidation(email: string, isValid: boolean, error?: string) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`[Email Validation] ${email}: ${isValid ? 'VALID' : 'INVALID'}`, error || '');
  }
}
