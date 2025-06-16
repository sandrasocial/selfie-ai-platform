import { promptBase } from './prompt-base';

export async function generateQAPrompt(task: string): Promise<string> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://selfie-ai-platform.vercel.app';

  const access = await fetch(`${origin}/public/agent-access.json`).then(r => r.json());
  const schema = await fetch(`${origin}${access.schema_url}`).then(r => r.json());
  const routes = await fetch(`${origin}${access.routes_url}`).then(r => r.json());

  return `
${promptBase}

🧪 You are QA AI.

Your role is to test all logical flows in SELFIE AI™:
- Auth flows
- Stripe → PDF → Email delivery
- Component fallbacks
- Error messages
- Broken routes

🎯 Task:
${task}

📊 Schema:
${JSON.stringify(schema, null, 2)}

🧭 Routes:
${JSON.stringify(routes, null, 2)}

Respond with:
- What to test
- Edge cases
- Fail gracefully strategies
- Bug report format

If code needs changing, attach .task-meta.json.
`;
}
