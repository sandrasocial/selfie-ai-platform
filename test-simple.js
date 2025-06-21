async function testSimple() {
  console.log('🧪 Testing simple GitHub automation...');
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/agents/maya', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer maya_agent_token_2024_unique_identifier'
      },
      body: JSON.stringify({
        action: 'commit',
        filePath: 'simple-test.md',
        content: `# Simple Test\n\nThis file was created at ${new Date().toISOString()}\n\n## Status\n- ✅ Working\n\nYour automation is operational! 🎉`,
        task: {
          title: 'Simple Test',
          description: 'Testing basic automation'
        }
      })
    });
    
    const result = await response.json();
    console.log('📊 Result:', result);
    
    if (result.success) {
      console.log('🎉 SUCCESS! Automation working!');
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testSimple(); 