// PDFMonkey API integration for Selfie Guide generation // DEBUGGING DEPLOY SYNC — FORCE GIT TRACKING
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
    const templateId = '1D0EE38C-3FAF-4A16-B5C8-6222AA82A629';
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
    const documentId = generateResult.document.id;

    // Step 2: Poll for document completion
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max wait
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const statusResponse = await fetch(`https://api.pdfmonkey.io/api/v1/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check PDF status');
      }

      const statusResult = await statusResponse.json();
      const document = statusResult.document;

      if (document.status === 'success' && document.download_url) {
        return {
          success: true,
          documentUrl: document.download_url,
          documentId: documentId
        };
      }

      if (document.status === 'failure') {
        throw new Error('PDF generation failed');
      }

      attempts++;
    }

    throw new Error('PDF generation timed out');

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
// PDFMonkey auth fixed