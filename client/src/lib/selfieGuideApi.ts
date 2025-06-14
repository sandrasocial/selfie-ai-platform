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

    // Send email via Resend through our API
    const response = await fetch('/api/send-selfie-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

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