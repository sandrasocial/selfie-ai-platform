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
    console.log('PDFMonkey Generation Response:', generateResult);
    
    const documentId = generateResult.document?.id;
    if (!documentId) {
      throw new Error('No document ID received from PDFMonkey');
    }
    
    console.log('Generated Document ID:', documentId);

    // Step 2: Poll for document completion (10 second timeout)
    let attempts = 0;
    const maxAttempts = 10; // 10 seconds max wait
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts} for document ${documentId}`);
      
      const statusResponse = await fetch(`https://api.pdfmonkey.io/api/v1/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status, statusResponse.statusText);
        throw new Error(`Failed to check PDF status: ${statusResponse.status}`);
      }

      const statusResult = await statusResponse.json();
      console.log('Status Response:', statusResult);
      
      // Check both possible response structures
      const document = statusResult.document || statusResult.data;
      
      if (document?.status === 'success') {
        // Try multiple possible URL locations
        const downloadUrl = document.download_url || statusResult.data?.download_url || document.url;
        
        console.log('PDF Generation Complete! Download URL:', downloadUrl);
        
        if (downloadUrl) {
          return {
            success: true,
            documentUrl: downloadUrl,
            documentId: documentId
          };
        } else {
          console.error('No download URL found in success response:', document);
        }
      }

      if (document?.status === 'failure') {
        console.error('PDF generation failed:', document);
        throw new Error('PDF generation failed');
      }
      
      console.log('Current status:', document?.status || 'unknown');
      attempts++;
    }

    throw new Error('PDF generation timed out after 10 seconds');

  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
// PDFMonkey polling added