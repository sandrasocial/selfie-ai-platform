/**
 * Complete Selfie Guide Flow Test
 * Tests: PDFMonkey generation → polling until "done" → Supabase insertion
 */

const SUPABASE_URL = 'https://zlslzllzejdhyfczcumv.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PDFMONKEY_API_KEY = process.env.VITE_PDFMONKEY_API_KEY;

async function testCompleteSelfieGuideFlow() {
  console.log('Testing complete Selfie Guide flow...\n');

  const testData = {
    name: 'Flow Test User',
    email: 'flowtest@selfieai.co'
  };

  try {
    // Step 1: Generate PDF with PDFMonkey
    console.log('1. Generating PDF with PDFMonkey...');
    const pdfResponse = await fetch('https://api.pdfmonkey.io/api/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PDFMONKEY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document: {
          document_template_id: '1D0EE38C-3FAF-4A16-B5C8-6222AA82A629',
          payload: {
            name: testData.name || 'Friend',
            email: testData.email
          },
          meta: {
            _filename: `selfie-guide-${testData.email.replace('@', '-at-')}.pdf`
          }
        }
      })
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      throw new Error(`PDF generation failed: ${pdfResponse.status} ${errorText}`);
    }

    const pdfData = await pdfResponse.json();
    const documentId = pdfData.document.id;
    console.log(`✓ PDF generation started - Document ID: ${documentId}`);

    // Step 2: Poll until document status is "success"
    console.log('\n2. Polling for PDF completion...');
    let attempts = 0;
    let maxAttempts = 15;
    let pdfUrl = null;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`   Attempt ${attempts}/${maxAttempts} - Checking status...`);

      const statusResponse = await fetch(`https://api.pdfmonkey.io/api/v1/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${PDFMONKEY_API_KEY}`
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      const status = statusData.document.status;
      
      console.log(`   Status: ${status}`);

      if (status === 'success') {
        pdfUrl = statusData.document.download_url;
        console.log(`✓ PDF ready! URL: ${pdfUrl}`);
        break;
      } else if (status === 'error') {
        throw new Error('PDF generation failed with error status');
      }

      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!pdfUrl) {
      throw new Error('PDF generation timed out after 30 seconds');
    }

    // Step 3: Insert lead into Supabase
    console.log('\n3. Inserting lead into Supabase...');
    const leadData = {
      name: testData.name,
      email: testData.email,
      source: 'selfie_guide',
      pdf_url: pdfUrl,
      created_at: new Date().toISOString()
    };

    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(leadData)
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      throw new Error(`Supabase insertion failed: ${insertResponse.status} ${errorText}`);
    }

    const insertedLead = await insertResponse.json();
    console.log('✓ Lead inserted successfully:', insertedLead);

    // Step 4: Verify the lead was saved correctly
    console.log('\n4. Verifying lead retrieval...');
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?email=eq.${testData.email}&select=*`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (!verifyResponse.ok) {
      throw new Error(`Lead verification failed: ${verifyResponse.status}`);
    }

    const retrievedLeads = await verifyResponse.json();
    if (retrievedLeads.length === 0) {
      throw new Error('Lead not found in database');
    }

    const retrievedLead = retrievedLeads[0];
    console.log('✓ Lead retrieved successfully:', {
      id: retrievedLead.id,
      name: retrievedLead.name,
      email: retrievedLead.email,
      pdf_url: retrievedLead.pdf_url ? 'Present' : 'Missing',
      created_at: retrievedLead.created_at
    });

    // Step 5: Cleanup test record
    console.log('\n5. Cleaning up test record...');
    const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/leads?email=eq.${testData.email}`, {
      method: 'DELETE',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (deleteResponse.ok) {
      console.log('✓ Test cleanup successful');
    } else {
      console.log('⚠ Test cleanup failed (non-critical)');
    }

    console.log('\n🎉 COMPLETE FLOW TEST SUCCESSFUL!');
    console.log('All components working: PDFMonkey → Polling → Supabase');
    return true;

  } catch (error) {
    console.error('\n❌ Flow test failed:', error.message);
    return false;
  }
}

testCompleteSelfieGuideFlow();