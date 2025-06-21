async function testAgentAutomation() {
  console.log('🚀 Testing agent automation...\n');
  
  // Test MAYA creating a component
  const testData = {
    action: 'commit',
    filePath: 'components/test-component.tsx',
    content: `// Created automatically by MAYA (Dev AI)
// Date: ${new Date().toISOString()}

export default function TestComponent() {
  return (
    <div className="p-8 bg-soft-white">
      <h1 className="text-4xl font-bodoni text-luxury-black">
        Automation Success!
      </h1>
      <p className="text-warm-gray mt-4">
        This component was created automatically by MAYA without any manual intervention.
      </p>
      <p className="text-sm text-warm-gray mt-8">
        Your agents can now work autonomously! 🎉
      </p>
    </div>
  );
}`,
    task: {
      title: 'Create Test Component',
      description: 'Testing automated component creation by MAYA'
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/admin/agents/maya', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer maya_agent_token_2024_unique_identifier'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ SUCCESS! MAYA has created a component automatically!');
      console.log('📁 Check your GitHub: https://github.com/sandrasocial/selfie-ai-platform/tree/v4-rebuild');
      console.log('🎉 Your agents are now fully autonomous!');
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('Failed:', error);
  }
}

testAgentAutomation(); 