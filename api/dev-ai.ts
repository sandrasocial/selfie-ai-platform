import type { NextApiRequest, NextApiResponse } from 'next';
import { promptBase } from '@/agents/prompt-base';
import { listGitFiles, fetchGitFile } from '@/lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { task } = req.body;

  const allFiles = await listGitFiles();
  const files = allFiles.filter((f) =>
    f.match(/(app|pages|tools|components)\/.*\.(ts|tsx|js|jsx)$/)
  );

  const fileList = files.slice(0, 30); // Cap for now

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

🧠 You are Dev AI.

🎯 Task: ${task}

📁 FILE INDEX:
${fileList.join('\n')}

🧠 FILE PREVIEWS:
${previews.join('\n\n')}

Your job is to find the relevant files and suggest precise code updates.
Return:
1. File(s) to change
2. New code blocks
3. task-meta.json (commit message + reason)
`;

  const result = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      'Content-
