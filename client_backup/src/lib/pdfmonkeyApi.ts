// LIVE DEPLOY SYNC — FINAL PATCH
export interface PDFGenerationRequest {
  templateId: string;
  payload: {
    name?: string;
    email: string;
  };
}

export interface PDFGenerationResponse {
  success: boolean;
  documentUrl?: string;
  documentId?: string;
  error?: string;
}

export async function generateSelfieGuidePDF(name: string, email: string): Promise<PDFGenerationResponse> {
  try {
    const templateId = '48780153-6e0d-4695-920f-968888304d90';
    const apiKey = import.meta.env.VITE_PDFMONKEY_API_KEY;

    console.log('PDFMonkey API Debug:');
    console.log('- Template ID:', templateId);
    console.log('- API Key present:', !!apiKey);
    console.log('- API Key length:', apiKey ? apiKey.length : 0);
    console.log('- Payload:', { name: name || 'Friend', email });

    if (!apiKey) {
      throw new Error('VITE_PDFMONKEY_API_KEY is not configured');
    }

    // Step 1: Generate the PDF using PDFMonkey
    const generateResponse = await fetch('https://api.pdfmonkey.io/api/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document: {
          document_template_id: templateId,
          payload: {
            name: name || 'Friend',
            email: email
          },
          meta: {
            _filename: `selfie-guide-${email.replace('@', '-at-')}.pdf`
          }
        }
      })
    });

    console.log('PDFMonkey Response Status:', generateResponse.status);
    console.log('PDFMonkey Response Headers:', Object.fromEntries(generateResponse.headers.entries()));

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json().catch(() => null);
      console.error('PDFMonkey generation error:', {
        status: generateResponse.status,
        statusText: generateResponse.statusText,
        errorData
      });

      if (generateResponse.status === 401) {
        throw new Error('PDFMonkey API authentication failed - check VITE_PDFMONKEY_API_KEY');
      }

      throw new Error(errorData?.message || `PDFMonkey API error: ${generateResponse.status} ${generateResponse.statusText}`);
    }

    const generateResult = await generateResponse.json();
    console.log('PDFMonkey Generation Response:', generateResult);

    const documentId = generateResult.document?.id;
    if (!documentId) {
      console.error('No document ID in response:', generateResult);
      throw new Error('No document ID received from PDFMonkey');
    }

    console.log('=== PDF GENERATION STARTED ===');
    console.log('Document ID:', documentId);
    console.log('Template ID:', templateId);
    console.log('===========================');

    // Step 2: Poll for document completion (15 second timeout)
    let attempts = 0;
    const maxAttempts = 15; // 15 seconds max wait

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      console.log(`=== POLLING ATTEMPT ${attempts + 1}/${maxAttempts} ===`);
      console.log(`Checking document status for ID: ${documentId}`);

      const statusResponse = await fetch(`https://api.pdfmonkey.io/api/v1/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!statusResponse.ok) {
        console.error('❌ Status check failed:', {
          status: statusResponse.status,
          statusText: statusResponse.statusText,
          documentId: documentId
        });
        throw new Error(`Failed to check PDF status: ${statusResponse.status}`);
      }

      const statusResult = await statusResponse.json();
      console.log('📄 Full Status Response:', JSON.stringify(statusResult, null, 2));

      // Check both possible response structures
      const document = statusResult.document || statusResult.data;

      console.log('📊 Document Status Details:', {
        status: document?.status,
        download_url: document?.download_url,
        url: document?.url,
        error_message: document?.error_message,
        metadata: document?.metadata
      });

      if (document?.status === 'success') {
        // Try multiple possible URL locations
        const downloadUrl = document.download_url || statusResult.data?.download_url || document.url;

        console.log('✅ PDF Generation Complete!');
        console.log('📎 Download URL:', downloadUrl);
        console.log('🆔 Document ID:', documentId);
        console.log('===============================');

        if (downloadUrl) {
          return {
            success: true,
            documentUrl: downloadUrl,
            documentId: documentId
          };
        } else {
          console.error('❌ No download URL found in success response:', document);
        }
      }

      if (document?.status === 'failure' || document?.status === 'error') {
        console.error('❌ PDF Generation Failed:', {
          status: document.status,
          error_message: document.error_message,
          metadata: document.metadata,
          full_document: document
        });

        // Return error flag instead of throwing to maintain user flow
        return {
          success: false,
          error: `PDF generation failed: ${document.error_message || 'Unknown error'}`,
          documentId: documentId
        };
      }

      console.log(`⏳ Current status: ${document?.status || 'unknown'} - continuing...`);
      attempts++;
    }

    console.warn('⚠️ PDF generation timed out after 15 seconds');
    console.log('🔄 Will redirect with error flag to maintain user flow');

    // Return error flag instead of throwing to maintain user flow
    return {
      success: false,
      error: 'PDF generation timed out after 15 seconds',
      documentId: documentId
    };

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
// PDFMonkey polling debug logs added