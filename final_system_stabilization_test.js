/**
 * Final System Stabilization Test
 * Comprehensive validation of AI tools with brand profile context
 */

const SUPABASE_URL = 'https://zlslzllzejdhyfczcumv.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc2x6bGx6ZWpkaHlmY3pjdW12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU4Njk0NywiZXhwIjoyMDY0MTYyOTQ3fQ.DMSn6sVsOPOSANRvP6UuQ15mGdKc3I1seWkNSHaMDSQ';
const PDFMONKEY_API_KEY = process.env.VITE_PDFMONKEY_API_KEY;

async function makeAuthenticatedRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: response.status, ok: response.ok, data };
}

async function validateBrandProfileContext() {
  console.log('Testing brand profile context validation...');
  
  const profileData = {
    businessName: "Test Beauty Brand",
    industry: "Beauty & Wellness",
    targetAudience: "Women entrepreneurs 25-45",
    brandVoice: "Empowering and authentic",
    primaryGoals: ["Increase brand awareness", "Drive sales"],
    uniqueValue: "Sustainable beauty solutions"
  };

  const result = await makeAuthenticatedRequest('http://localhost:5001/api/brand-profile', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });

  if (result.ok) {
    console.log('✓ Brand profile context validation successful');
    return result.data;
  } else {
    console.log('✗ Brand profile validation failed:', result.data);
    return null;
  }
}

async function testStrategyGeneratorWithContext() {
  console.log('Testing strategy generator with brand context...');
  
  const strategyData = {
    businessGoal: "Increase online presence",
    targetAudience: "Professional women",
    timeframe: "3 months",
    budget: "medium"
  };

  const result = await makeAuthenticatedRequest('http://localhost:5001/api/strategy-generator', {
    method: 'POST',
    body: JSON.stringify(strategyData)
  });

  if (result.ok) {
    console.log('✓ Strategy generator with context working');
    return true;
  } else {
    console.log('✗ Strategy generator failed:', result.data);
    return false;
  }
}

async function testSandraAIWithPersonalization() {
  console.log('Testing Sandra AI with personalization...');
  
  const prompt = "Create a social media post about confidence for my beauty brand";
  
  const result = await makeAuthenticatedRequest('http://localhost:5001/api/sandra-ai', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });

  if (result.ok) {
    console.log('✓ Sandra AI personalization working');
    return true;
  } else {
    console.log('✗ Sandra AI failed:', result.data);
    return false;
  }
}

async function testContentGeneratorWithProfile() {
  console.log('Testing content generator with brand profile...');
  
  const contentData = {
    type: "social_post",
    platform: "instagram",
    topic: "Brand storytelling",
    tone: "inspirational"
  };

  const result = await makeAuthenticatedRequest('http://localhost:5001/api/content-generator', {
    method: 'POST',
    body: JSON.stringify(contentData)
  });

  if (result.ok) {
    console.log('✓ Content generator with profile working');
    return true;
  } else {
    console.log('✗ Content generator failed:', result.data);
    return false;
  }
}

async function validateContentVaultSaves() {
  console.log('Testing content vault save functionality...');
  
  const saveData = {
    title: "Test Strategy",
    content: "This is a test strategy content",
    type: "strategy",
    tags: ["test", "validation"]
  };

  const result = await makeAuthenticatedRequest('http://localhost:5001/api/content-vault', {
    method: 'POST',
    body: JSON.stringify(saveData)
  });

  if (result.ok) {
    console.log('✓ Content vault save working');
    return true;
  } else {
    console.log('✗ Content vault save failed:', result.data);
    return false;
  }
}

async function runSystemStabilizationValidation() {
  console.log('Running comprehensive system validation...\n');

  try {
    // Test brand profile context
    const profileResult = await validateBrandProfileContext();
    if (!profileResult) return false;

    // Test AI tools with context
    const strategyResult = await testStrategyGeneratorWithContext();
    const sandraResult = await testSandraAIWithPersonalization();
    const contentResult = await testContentGeneratorWithProfile();
    const vaultResult = await validateContentVaultSaves();

    if (strategyResult && sandraResult && contentResult && vaultResult) {
      console.log('\n🎉 All systems operational with brand context integration!');
      return true;
    } else {
      console.log('\n❌ Some systems failed validation');
      return false;
    }

  } catch (error) {
    console.error('System validation error:', error.message);
    return false;
  }
}

runSystemStabilizationValidation();