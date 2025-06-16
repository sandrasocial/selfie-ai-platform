import { promptBase } from './prompt-base';

export async function generateDevPrompt(task: string): Promise<string> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://selfie-ai-platform.vercel.app';

  const access = await fetch(`${origin}/public/agent-access.json`).then(r => r.json());
  const schema = await fetch(`${origin}${access.schema_url}`).then(r => r.json());
  const routes = await fetch(`${origin}${access.routes_url}`).then(r => r.json());
  const components = await fetch(`${origin}${access.components_url}`).then(r => r.json());

  return `
${promptBase}

📂 Repo: ${access.repo}
🧠 Task: ${task}

📊 Schema:
${JSON.stringify(schema, null, 2)}

🧭 Routes:
${JSON.stringify(routes, null, 2)}

🧩 Components:
${JSON.stringify(components, null, 2)}

Your job: Make safe code edits and suggest a commit with a .task-meta.json
`;
}
