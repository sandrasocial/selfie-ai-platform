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
    // Send email directly using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Sandra <sandra@selfieai.com>',
        to: [email],
        subject: 'Your Free Selfie Guide 💖',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Free Selfie Guide</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; }
        @media screen and (max-width: 600px) {
            .mobile-padding { padding: 20px !important; }
            .mobile-center { text-align: center !important; }
            .container { width: 100% !important; max-width: 100% !important; }
            .mobile-button { width: 100% !important; }
            .headline { font-size: 36px !important; line-height: 1.2 !important; }
            .body-text { font-size: 16px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F1F1; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">

<div style="display: none; font-size: 1px; color: #F1F1F1; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Your journey to selfie confidence starts here
</div>

<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F1F1F1;">
    <tr>
        <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #FFFFFF; box-shadow: 0 8px 40px rgba(0,0,0,0.05);" class="container">
                
                <tr>
                    <td align="center" style="padding: 60px 40px 40px;" class="mobile-padding">
                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: #B5B5B3; font-weight: 300;">SELFIE AI™</p>
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="padding: 0 40px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="60">
                            <tr>
                                <td style="border-bottom: 1px solid #B5B5B3; font-size: 1px; line-height: 1px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="padding: 40px 40px 30px;" class="mobile-padding">
                        <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, 'Times New Roman', serif; font-size: 48px; line-height: 1.1; color: #171719; font-weight: 300; letter-spacing: -1px;" class="headline">
                            Welcome to<br>
                            <em style="font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-style: italic; color: #171719;">SELFIE AI™</em>
                        </h1>
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="padding: 0 60px 40px;" class="mobile-padding">
                        <p style="margin: 0 0 20px; font-family: 'Inter', Arial, sans-serif; font-size: 18px; line-height: 1.7; color: #4C4B4B; font-weight: 300;" class="body-text">
                            Beautiful${name ? ` ${name}` : ''}, your guide to selfie confidence is ready! Inside, you'll discover my personal secrets to mastering lighting, finding your best angles, and capturing the authentic you.
                        </p>
                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 18px; line-height: 1.7; color: #4C4B4B; font-weight: 300;" class="body-text">
                            This isn't just about taking better photos — it's about seeing yourself through a lens of love and confidence.
                        </p>
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="padding: 0 40px 50px;" class="mobile-padding">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="mobile-button">
                            <tr>
                                <td style="background-color: #171719; text-align: center; border-radius: 0;">
                                    <a href="https://app.pdfmonkey.io/api/v1/documents/1D0EE38C-3FAF-4A16-B5C8-6222AA82A629/generate" target="_blank" style="display: inline-block; padding: 20px 60px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #FFFFFF; text-decoration: none; font-weight: 300;">
                                        Download Your Guide
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <tr>
                    <td style="background-color: #F1F1F1; padding: 50px 40px;" class="mobile-padding">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td align="center">
                                    <p style="margin: 0 0 15px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 24px; font-style: italic; color: #171719;">With love,</p>
                                    <p style="margin: 0 0 10px; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 32px; color: #171719; font-weight: 400;">Sandra</p>
                                    <p style="margin: 20px 0 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; color: #B5B5B3; font-weight: 300;">Founder, SELFIE AI™</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
            </table>
            
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container">
                <tr>
                    <td align="center" style="padding: 30px 20px;">
                        <p style="margin: 0 0 10px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; color: #B5B5B3; font-weight: 300;">
                            Follow along for daily inspiration
                        </p>
                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 13px; color: #B5B5B3;">
                            <a href="https://instagram.com/sandra.social" style="color: #171719; text-decoration: none;">@sandra.social</a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 0 20px 30px;">
                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: #D4D4D4; line-height: 1.5;">
                            © 2024 SELFIE AI™. All rights reserved.<br>
                            <a href="#" style="color: #D4D4D4; text-decoration: underline;">Unsubscribe</a> | 
                            <a href="#" style="color: #D4D4D4; text-decoration: underline;">Privacy Policy</a>
                        </p>
                    </td>
                </tr>
            </table>
            
        </td>
    </tr>
</table>

</body>
</html>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return { success: true, emailError: 'Email service unavailable' };
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: true, emailError: error };
  }
}