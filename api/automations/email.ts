interface EmailOptions {
  to: string;
  template: string;
  variables: Record<string, any>;
  subject?: string;
}

export async function sendEmail(options: EmailOptions) {
  // Implement with Resend or your email service
  console.log('Sending email:', options);
  return {
    id: `email-${Date.now()}`,
    success: true
  };
} 