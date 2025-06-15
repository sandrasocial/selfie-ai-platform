/**
 * Make.com Webhook Test Script
 * Tests the SELFIE GUIDE automation webhook
 */

const WEBHOOK_URL = 'https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe';

async function testMakeWebhook() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com'
  };

  console.log('Testing Make.com webhook...');
  console.log('Webhook URL:', WEBHOOK_URL);
  console.log('Test Data:', testData);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response Body:', responseText);

    if (response.ok) {
      console.log('✅ Webhook test successful');
      return { success: true, response: responseText };
    } else {
      console.log('❌ Webhook test failed');
      return { success: false, error: responseText };
    }
  } catch (error) {
    console.error('❌ Webhook test error:', error);
    return { success: false, error: error.message };
  }
}

// Run test if this script is executed directly
if (typeof window === 'undefined') {
  testMakeWebhook();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testMakeWebhook };
}