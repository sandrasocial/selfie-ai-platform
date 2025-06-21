// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Octokit } = require('@octokit/rest');

// Test GitHub integration
async function testGitHubIntegration() {
  console.log('🧪 Testing GitHub Integration...\n');

  // Check if environment variables are set
  const githubToken = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'sandrasocial';
  const repo = process.env.GITHUB_REPO || 'selfie-ai-platform';

  if (!githubToken) {
    console.log('❌ GITHUB_TOKEN not found in environment variables');
    console.log('Please add GITHUB_TOKEN=[your_github_personal_access_token] to your .env.local file');
    console.log('\n💡 Debug info:');
    console.log(`   .env.local exists: ${require('fs').existsSync('.env.local')}`);
    console.log(`   Current working directory: ${process.cwd()}`);
    console.log(`   Available env vars: ${Object.keys(process.env).filter(key => key.includes('GITHUB')).join(', ')}`);
    return;
  }

  console.log(`📋 Configuration:`);
  console.log(`   Owner: ${owner}`);
  console.log(`   Repository: ${repo}`);
  console.log(`   Token: ${githubToken.substring(0, 10)}...\n`);

  const octokit = new Octokit({
    auth: githubToken,
  });

  try {
    // Test 1: Repository connection
    console.log('🔗 Testing repository connection...');
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    });
    console.log('✅ Repository connection successful');
    console.log(`   Name: ${repoData.name}`);
    console.log(`   Description: ${repoData.description || 'No description'}`);
    console.log(`   URL: ${repoData.html_url}`);
    console.log(`   Default Branch: ${repoData.default_branch}\n`);

    // Test 2: List files
    console.log('📁 Testing file listing...');
    const { data: files } = await octokit.repos.getContent({
      owner,
      repo,
      path: '',
    });
    console.log('✅ File listing successful');
    console.log(`   Found ${Array.isArray(files) ? files.length : 1} items in root directory\n`);

    // Test 3: Create test file
    console.log('📝 Testing file creation...');
    const testContent = `# GitHub Integration Test

This file was created by the admin dashboard GitHub integration test.

Created at: ${new Date().toISOString()}
Test ID: ${Date.now()}

This file can be safely deleted after testing.`;

    const testFileName = `test/github-integration-test-${Date.now()}.md`;
    
    const createResponse = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: testFileName,
      message: 'Test: GitHub integration file creation',
      content: Buffer.from(testContent).toString('base64'),
    });

    console.log('✅ File creation successful');
    console.log(`   File: ${createResponse.data.content?.path}`);
    console.log(`   URL: ${createResponse.data.content?.html_url}`);
    console.log(`   SHA: ${createResponse.data.content?.sha}\n`);

    // Test 4: Delete test file
    console.log('🗑️  Testing file deletion...');
    const deleteResponse = await octokit.repos.deleteFile({
      owner,
      repo,
      path: testFileName,
      message: 'Test: Clean up GitHub integration test file',
      sha: createResponse.data.content?.sha,
    });

    console.log('✅ File deletion successful');
    console.log(`   Commit SHA: ${deleteResponse.data.commit?.sha}\n`);

    console.log('🎉 All GitHub integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Repository connection');
    console.log('   ✅ File listing');
    console.log('   ✅ File creation');
    console.log('   ✅ File deletion');
    console.log('\n🚀 GitHub integration is ready for use!');

  } catch (error) {
    console.error('❌ GitHub integration test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.status === 401) {
      console.error('\n💡 This might be an authentication issue. Please check:');
      console.error('   1. Your GitHub token is valid');
      console.error('   2. Your token has the necessary permissions (repo access)');
      console.error('   3. The repository exists and is accessible');
    } else if (error.status === 404) {
      console.error('\n💡 Repository not found. Please check:');
      console.error('   1. The repository name is correct');
      console.error('   2. The owner/organization name is correct');
      console.error('   3. You have access to the repository');
    }
  }
}

// Run the test
testGitHubIntegration(); 