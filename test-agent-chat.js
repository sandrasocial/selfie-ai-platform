// Test script for agent chat API
const testAgentChat = async () => {
  try {
    console.log('Testing agent chat API...');
    
    const response = await fetch('http://localhost:3001/api/admin/agent-chat/rachel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello Rachel, this is a test!'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (response.status === 405) {
      console.log('❌ 405 Method Not Allowed - This suggests the POST method is not properly exported');
    } else if (response.status === 401) {
      console.log('❌ 401 Unauthorized - Need to be logged in');
    } else if (response.status === 200) {
      console.log('✅ Success!');
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// Run the test
testAgentChat();
