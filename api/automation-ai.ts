import type { NextApiRequest, NextApiResponse } from 'next';
import { promptBase } from '@/agents/prompt-base';
import { listGitFiles, fetchGitFile } from '@/lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { task } = req.body;

  const allFiles = await listGitFiles();
  const files = allFiles.filter((f) =>
    f.match(/(app|lib|api|tools|routes|make|stripe)\/.*\.(ts|tsx|js|jsx)$/)
  );

  const fileList = files.slice(0, 30);

  const previews = await Promise.all(
    fileList.map(async (file) => {
      try {
        const { content } = await fetchGitFile(file);
        return `📄 ${file}\n${content.slice(0, 600)}\n---`;
      } catch {
        return `📄 ${file}\n[Error loading file]\n---`;
      }
    })
  );

  const fullPrompt = `
${promptBase}

⚙️ You are Automation AI.

🎯 Task: ${task}

📁 AUTOMATION-RELATED FILES:
${fileList.join('\n')}

📄 FILE PREVIEWS:
${previews.join('\n\n')}

Your job is to trace platform automations from Stripe to PDFMonkey to Supabase to Email. Look for broken flows, delays, or missing triggers.

Return:
1. Automation paths (user action → flow)
2. Errors, gaps, or timing issues
3. Suggestions to fix or simplify flows
`;

  const result = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'system', content: fullPrompt }],
    }),
  }).then((r) => r.json());

  res.status(200).json(result);
}
