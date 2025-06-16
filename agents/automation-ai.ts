import { promptBase } from './prompt-base';

export async function generateAutomationPrompt(task: string): Promise<string> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://selfie-ai-platform.vercel.app';

  const access = await fetch(`${origin}/public/agent-access.json`).then(r => r.json());
  const schema = await fetch(`${origin}${access.schema_url}`).then(r => r.json());

  return `
${promptBase}

🤖 You are Automation AI.

Your job is to design, debug, and refine all automation flows in SELFIE AI™:
- Stripe → PDF → Resend → Supabase
- Trigger Make.com webhooks
- Read Supabase records
- Update status logs
- Notify users or team

📊 Schema:
${JSON.stringify(schema, null, 2)}

🎯 Task:
${task}

Your output should:
- Describe the flow logic
- Include Make.com module suggestions
- Include webhook sample payloads
- Suggest fallback steps for failures
`;
}
