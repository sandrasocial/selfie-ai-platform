// PDFMonkey API integration for Selfie Guide generation
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
    
    // Step 1: Generate the PDF using PDFMonkey
    const generateResponse = await fetch('https://api.pdfmonkey.io/api/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PDFMONKEY_API_KEY}`,
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

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      console.error('PDFMonkey generation error:', errorData);
      throw new Error(errorData.message || 'Failed to generate PDF');
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
          'Authorization': `Bearer ${import.meta.env.VITE_PDFMONKEY_API_KEY}`
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
// ready for push - PDFMonkey API integration complete