import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  template: string
  variables: Record<string, any>
  subject?: string
}

interface EmailTemplate {
  subject: string
  html: string
}

// Template cache for performance
const templateCache = new Map<string, EmailTemplate>()

// Load and compile email template
async function loadTemplate(
  templateName: string,
  variables: Record<string, any>
): Promise<EmailTemplate> {
  const cacheKey = `${templateName}-${JSON.stringify(variables)}`

  if (templateCache.has(cacheKey)) {
    return templateCache.get(cacheKey)!
  }

  const templatePath = path.join(process.cwd(), 'email-templates', `${templateName}.html`)

  try {
    let html = fs.readFileSync(templatePath, 'utf-8')

    // Replace template variables with actual values
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, String(value))
    })

    // Default subject mapping
    const subjectMap: Record<string, string> = {
      welcome: `Welcome to SSELFIE, ${variables.name || 'friend'}!`,
      'auth-confirmation': 'Welcome to SSELFIE - Confirm your email',
      'password-reset': 'Reset your SSELFIE password',
      'purchase-confirmation': `Your SSELFIE order is confirmed, ${variables.name}!`,
      'milestone-celebration': `Congratulations ${variables.name}! You've reached a milestone`,
      'vip-application': `Thanks for your VIP application, ${variables.name}`,
      'course-completion': `Amazing work ${variables.name}! Course completed`,
      'exclusive-content': `Your exclusive SSELFIE content is ready, ${variables.name}`,
    }

    const template = {
      subject: subjectMap[templateName] || `Message from SSELFIE`,
      html,
    }

    templateCache.set(cacheKey, template)
    return template
  } catch (error) {
    console.error(`Failed to load template ${templateName}:`, error)
    throw new Error(`Email template ${templateName} not found`)
  }
}

export async function sendEmail(
  options: EmailOptions
): Promise<{ id: string; success: boolean; error?: string }> {
  try {
    const template = await loadTemplate(options.template, options.variables)

    const result = await resend.emails.send({
      from: 'SSELFIE <hello@sselfie.ai>',
      to: options.to,
      subject: options.subject || template.subject,
      html: template.html,
      // Add tracking and branding
      headers: {
        'X-Brand': 'SSELFIE',
        'X-Template': options.template,
      },
    })

    console.log(`✅ Email sent successfully: ${options.template} to ${options.to}`)

    return {
      id: result.data?.id || `email-${Date.now()}`,
      success: true,
    }
  } catch (error) {
    console.error(`❌ Failed to send email ${options.template} to ${options.to}:`, error)

    return {
      id: `failed-${Date.now()}`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Convenience functions for common email types
export async function sendWelcomeEmail(to: string, name: string, purchaseType?: string) {
  return sendEmail({
    to,
    template: 'welcome',
    variables: { name, purchaseType: purchaseType || 'starter' },
  })
}

export async function sendPurchaseConfirmation(
  to: string,
  name: string,
  orderDetails: Record<string, any>
) {
  return sendEmail({
    to,
    template: 'purchase-confirmation',
    variables: { name, ...orderDetails },
  })
}

export async function sendMilestoneCelebration(to: string, name: string, milestone: string) {
  return sendEmail({
    to,
    template: 'milestone-celebration',
    variables: { name, milestone },
  })
}
