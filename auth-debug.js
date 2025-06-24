/**
 * SSELFIE AI™ - Authentication Debug Script
 * This helps identify what's causing the login to hang
 */

console.log('🔍 AUTHENTICATION DEBUG SCRIPT');
console.log('=' .repeat(50));

// 1. Check current page and auth state
console.log('\n1. Current Page State:');
console.log('URL:', window.location.href);
console.log('User Agent:', navigator.userAgent);

// 2. Check for network requests
console.log('\n2. Network Request Monitoring:');
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Fetch request:', args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('✅ Fetch response:', response.status, args[0]);
      return response;
    })
    .catch(error => {
      console.error('❌ Fetch error:', error, args[0]);
      throw error;
    });
};

// 3. Check localStorage and sessionStorage
console.log('\n3. Storage State:');
console.log('localStorage keys:', Object.keys(localStorage));
console.log('sessionStorage keys:', Object.keys(sessionStorage));

// 4. Supabase state check
if (typeof window !== 'undefined') {
  // Check if Supabase client can be created
  try {
    console.log('\n4. Supabase Client Test:');
    
    // Try to access environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL exists:', !!supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);
    
    if (supabaseUrl) {
      console.log('Supabase URL:', supabaseUrl.substring(0, 30) + '...');
    }
    
  } catch (error) {
    console.error('❌ Supabase client error:', error);
  }
}

// 5. Form submission monitoring
console.log('\n5. Form Event Monitoring:');
document.addEventListener('submit', function(event) {
  console.log('📝 Form submitted:', event.target);
  console.log('Form action:', event.target.action);
  console.log('Form method:', event.target.method);
});

// 6. Console error monitoring
console.log('\n6. Error Monitoring Active');
const originalError = console.error;
console.error = function(...args) {
  console.log('🚨 CONSOLE ERROR DETECTED:', args);
  return originalError.apply(console, args);
};

// 7. Promise rejection monitoring
window.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 UNHANDLED PROMISE REJECTION:', event.reason);
});

console.log('\n✅ Debug monitoring active. Try logging in now.');
console.log('Watch the console for any errors or unusual network requests.');
console.log('=' .repeat(50));
