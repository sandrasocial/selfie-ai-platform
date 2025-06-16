import type { NextApiRequest, NextApiResponse } from 'next';
import { promptBase } from '@/agents/prompt-base';
import { listGitFiles, fetchGitFile } from '@/lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { task } = req.body;

  const allFiles = await listGitFiles();
  const files = allFiles.filter((f) =>
    f.match(/(app|pages|tools|lib|supabase)\/.*\.(ts|tsx|js|jsx)$/)
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

🧪 You are QA AI.

🎯 Task: ${task}

📁 FILE INDEX:
${fileList.join('\n')}

📄 FLOW + LOGIC FILES:
${previews.join('\n\n')}

Your job is to test flows, logic, and Supabase integration for bugs, confusion, or missing fallback.

Return:
1. Flows or logic with bugs
2. Error cases or missing checks
3. Recommendations to improve stability
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
