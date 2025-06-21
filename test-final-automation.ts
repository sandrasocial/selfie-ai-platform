import { agents } from './lib/agent-helpers';

async function testFinalAutomation() {
  console.log('🧪 Testing complete GitHub automation flow...');
  
  try {
    const result = await agents.maya.commit({
      filePath: 'final-test-automation.md',
      content: `# Final Automation Test\n\nThis file was created by MAYA agent at ${new Date().toISOString()}\n\n## Test Results\n- ✅ Authentication working\n- ✅ GitHub API integration working  \n- ✅ File creation working\n- ✅ Agent system working\n\nYour SELFIE AI platform automation is now fully operational! 🎉`,
      task: {
        title: 'Final Automation Test',
        description: 'Testing complete GitHub automation flow with new token'
      }
    });
    
    console.log('📊 Test result:', result);
    
    if (result.success) {
      console.log('🎉 SUCCESS! Your GitHub automation is fully working!');
      console.log('🔗 Check your GitHub repo for the new file');
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testFinalAutomation(); 