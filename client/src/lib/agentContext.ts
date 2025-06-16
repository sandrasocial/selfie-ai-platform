import fs from 'fs';
import path from 'path';
import { promptBase } from '@/agents/prompt-base';

export function getAgentContext(agent: string, task: string): string {
  const schema = fs.readFileSync(path.join(process.cwd(), 'public/schema.json'), 'utf8');
  const routes = fs.readFileSync(path.join(process.cwd(), 'public/routes.json'), 'utf8');
  const components = fs.readFileSync(path.join(process.cwd(), 'public/components.json'), 'utf8');

  switch (agent) {
    case 'dev-ai':
      return `
${promptBase}

🧠 You are Dev AI.

Mission: Read, clean, and safely edit SELFIE AI's codebase.

📂 Repo: SELFIE AI™
📊 Schema: ${schema}
🧭 Routes: ${routes}
🧩 Components: ${components}

🎯 Task: ${task}

Return: File(s) to update, edits, and .task-meta.json
`;

    case 'ux-ai':
      return `
${promptBase}

🧑‍🎨 You are UX AI.

Mission: Elevate SELFIE AI™ layout, flow, and luxury feel.

🧭 Routes: ${routes}
🧩 Components: ${components}

🎯 Task: ${task}

Return: Layout ideas, spacing rules, component usage.
`;

    case 'qa-ai':
      return `
${promptBase}

🧪 You are QA AI.

Mission: Test all SELFIE AI™ flows for logic, errors, fallback safety.

📊 Schema: ${schema}
🧭 Routes: ${routes}

🎯 Task: ${task}

Return: Flow bugs, error handling, UX gaps.
`;

    case 'voice-ai':
      return `
${promptBase}

✍️ You are Voice AI.

Mission: Rewrite SELFIE AI™'s copy, CTAs, headlines to match the brand voice.

🧭 Routes: ${routes}

🎯 Task: ${task}

Return: Old → New copy with voice tone explained.
`;

    case 'automation-ai':
      return `
${promptBase}

🤖 You are Automation AI.

Mission: Orchestrate Stripe → PDF → Email → Supabase + Make flows.

📊 Schema: ${schema}

🎯 Task: ${task}

Return: Flow map, module suggestions, webhook logic, fallback plans.
`;

    default:
      return `Error: Unknown agent`;
  }
}
