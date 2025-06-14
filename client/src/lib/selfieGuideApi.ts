import { supabase } from './supabaseClient';

export interface SelfieGuideSubmission {
  name?: string;
  email: string;
}

export async function submitSelfieGuideLead(data: SelfieGuideSubmission) {
  try {
    // Insert lead into Supabase
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert([
        {
          name: data.name,
          email: data.email,
          source: 'selfie_guide',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError && insertError.code !== '23505') {
      // Ignore duplicate email errors (23505), but throw other errors
      throw insertError;
    }

    // Send email via Edge Function or direct Resend call
    await sendSelfieGuideEmail(data.email, data.name);

    // Update lead with email sent status if we have a lead ID
    if (lead?.id) {
      await supabase
        .from('leads')
        .update({
          email_sent: true,
          email_sent_at: new Date().toISOString()
        })
        .eq('id', lead.id);
    }

    return { success: true, leadId: lead?.id };
  } catch (error) {
    console.error('Error submitting selfie guide lead:', error);
    throw error;
  }
}

async function sendSelfieGuideEmail(email: string, name?: string) {
  try {
    // Call Netlify/Vercel serverless function to send email
    const response = await fetch('/api/send-selfie-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        pdfUrl: 'https://app.pdfmonkey.io/api/v1/documents/1D0EE38C-3FAF-4A16-B5C8-6222AA82A629/generate'
      }),
    });

    if (!response.ok) {
      console.error('Email API error:', response.statusText);
      // Don't throw error - continue with success for UX
      return { success: true, emailError: 'API unavailable' };
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return { success: true, emailId: result.emailId };
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error for email - just log it and continue
    return { success: true, emailError: error };
  }
}