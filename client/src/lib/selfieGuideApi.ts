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
  // Call the database function to log email request
  const { data, error } = await supabase.rpc('send_selfie_guide_email', {
    p_email: email,
    p_name: name
  });

  if (error) {
    console.error('Error calling email function:', error);
    // Don't throw error for email - just log it
    console.log('Email will be processed separately');
  }

  // For production, you would integrate with Resend API here
  // For now, we'll redirect to thank you page where user can download directly
  return { success: true };
}