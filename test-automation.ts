import { agents } from './lib/agent-helpers';

async function testGitHubAutomation() {
  console.log('Testing GitHub automation...');
  
  try {
    const result = await agents.maya.commit({
      filePath: 'test-automation-file.md',
      content: '# Automation Test\n\nThis file was created automatically by MAYA at ' + new Date().toISOString(),
      task: {
        title: 'Test GitHub Automation',
        description: 'Testing if MAYA can commit directly to GitHub'
      }
    });
    
    console.log('Test result:', result);
    
    if (result.success) {
      console.log('✅ SUCCESS! Check your GitHub repo for the new file.');
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testGitHubAutomation(); 