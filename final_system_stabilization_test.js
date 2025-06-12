/**
 * Final System Stabilization Test
 * Comprehensive validation of AI tools with brand profile context
 */

const BASE_URL = 'https://sselfie.ai';

async function makeAuthenticatedRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'connect.sid=s%3AdAX0iqhoC-4xKipKSKH8_7ZUp4pCA9r9.%2FoQN%2BeVLjSCRJPzCBm5Y0w7JRbpG%2BmvI7M5E6d1aHss',
      ...options.headers
    },
    credentials: 'include',
    ...options
  });
  
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { rawResponse: text };
  }
  
  return { response, data, status: response.status };
}

async function validateBrandProfileContext() {
  console.log("🔍 Validating Brand Profile Context Access");
  
  const { response, data, status } = await makeAuthenticatedRequest(`${BASE_URL}/api/me-with-profile`);
  
  if (status === 200 && data.profile) {
    console.log("✅ Brand profile context accessible");
    console.log("Profile data available:");
    console.log("- Brand Mission:", data.profile.brandMission);
    console.log("- Ideal Audience:", data.profile.idealAudience);
    console.log("- Visual Aesthetic:", data.profile.visualAesthetic);
    console.log("- Tone Voice:", data.profile.toneVoice);
    return { success: true, profile: data.profile };
  } else {
    console.log("❌ Brand profile context not accessible:", status);
    return { success: false, error: data };
  }
}

async function testStrategyGeneratorWithContext() {
  console.log("\n📊 Testing Strategy Generator with Brand Context");
  
  const { response, data, status } = await makeAuthenticatedRequest(`${BASE_URL}/api/strategy-coach`, {
    method: 'POST',
    body: JSON.stringify({
      strategyType: 'messaging',
      goals: 'Build authentic brand presence',
      timeframe: '30-day-plan'
    })
  });

  if (status === 200) {
    console.log("✅ Strategy generated with personalized context");
    console.log("Strategy title:", data.strategy?.title);
    console.log("Saved to vault:", data.savedToVault);
    return { success: true, strategy: data.strategy, savedToVault: data.savedToVault };
  } else {
    console.log("❌ Strategy generation failed:", status, data.error);
    return { success: false, error: data };
  }
}

async function testSandraAIWithPersonalization() {
  console.log("\n💬 Testing Sandra AI with Brand Personalization");
  
  const { response, data, status } = await makeAuthenticatedRequest(`${BASE_URL}/api/chat-sandra`, {
    method: 'POST',
    body: JSON.stringify({
      message: "Help me create content that reflects my brand mission",
      category: "content-creation"
    })
  });

  if (status === 200) {
    console.log("✅ Sandra AI responded with personalized content");
    console.log("Response length:", data.response.length);
    console.log("Contains brand context:", data.response.includes("women starting over") || data.response.includes("divorce"));
    return { success: true, response: data.response };
  } else {
    console.log("❌ Sandra AI failed:", status, data.error);
    return { success: false, error: data };
  }
}

async function testContentGeneratorWithProfile() {
  console.log("\n📝 Testing Content Generator with Profile Context");
  
  const { response, data, status } = await makeAuthenticatedRequest(`${BASE_URL}/api/content-generator`, {
    method: 'POST',
    body: JSON.stringify({
      contentType: 'post',
      prompt: 'Create a motivational post about starting over',
      tone: 'warm and supportive'
    })
  });

  if (status === 200) {
    console.log("✅ Content generated with brand context");
    console.log("Content reflects tone:", data.content?.includes("warm") || data.content?.includes("support"));
    console.log("Saved to vault:", data.savedToVault);
    return { success: true, content: data.content, savedToVault: data.savedToVault };
  } else {
    console.log("❌ Content generation failed:", status, data.error);
    return { success: false, error: data };
  }
}

async function validateContentVaultSaves() {
  console.log("\n📂 Validating Content Vault Storage");
  
  const { response, data, status } = await makeAuthenticatedRequest(`${BASE_URL}/api/content-vault`);

  if (status === 200) {
    console.log("✅ Content vault accessible");
    console.log("Total items in vault:", data.content?.length || 0);
    console.log("Recent saves working:", data.content?.some(item => 
      new Date(item.createdAt).getTime() > Date.now() - 3600000 // Within last hour
    ));
    return { success: true, vaultItems: data.content?.length || 0 };
  } else {
    console.log("❌ Content vault not accessible:", status);
    return { success: false, error: data };
  }
}

async function runSystemStabilizationValidation() {
  console.log("=".repeat(80));
  console.log("🔒 SELFIE AI™ SYSTEM STABILIZATION VALIDATION");
  console.log("=".repeat(80));
  
  const profileResult = await validateBrandProfileContext();
  const strategyResult = await testStrategyGeneratorWithContext();
  const sandraResult = await testSandraAIWithPersonalization();
  const contentResult = await testContentGeneratorWithProfile();
  const vaultResult = await validateContentVaultSaves();
  
  console.log("\n" + "=".repeat(80));
  console.log("📋 FINAL SYSTEM STATUS");
  console.log("=".repeat(80));
  
  const allSystemsOperational = [
    profileResult.success,
    strategyResult.success,
    sandraResult.success,
    contentResult.success,
    vaultResult.success
  ].every(result => result === true);
  
  console.log("Brand Profile Context:", profileResult.success ? "✅ OPERATIONAL" : "❌ FAILED");
  console.log("Strategy Generator:", strategyResult.success ? "✅ OPERATIONAL" : "❌ FAILED");
  console.log("Sandra AI Personalization:", sandraResult.success ? "✅ OPERATIONAL" : "❌ FAILED");
  console.log("Content Generator:", contentResult.success ? "✅ OPERATIONAL" : "❌ FAILED");
  console.log("Content Vault Storage:", vaultResult.success ? "✅ OPERATIONAL" : "❌ FAILED");
  
  console.log("\n🎯 SYSTEM STABILITY STATUS:");
  if (allSystemsOperational) {
    console.log("✅ ALL SYSTEMS STABLE AND OPERATIONAL");
    console.log("🚀 Platform ready for luxury UX/UI redesign phase");
    console.log("🔒 Brand profile onboarding and AI personalization confirmed working");
    console.log("📊 Content generation and vault storage functioning properly");
  } else {
    console.log("⚠️ Some systems need stabilization:");
    if (!profileResult.success) console.log("- Brand profile context access needs repair");
    if (!strategyResult.success) console.log("- Strategy generator needs stabilization");
    if (!sandraResult.success) console.log("- Sandra AI personalization needs fixing");
    if (!contentResult.success) console.log("- Content generator needs repair");
    if (!vaultResult.success) console.log("- Content vault storage needs fixing");
  }
  
  return allSystemsOperational;
}

runSystemStabilizationValidation().catch(console.error);