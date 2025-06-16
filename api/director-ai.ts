import type { NextApiRequest, NextApiResponse } from 'next';
import { promptBase } from '@/agents/prompt-base';
import { listGitFiles, fetchGitFile } from '@/lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { goal } = req.body;

  const allFiles = await listGitFiles();
  const pages = allFiles.filter((f) => f.startsWith('app/') || f.startsWith('pages/'));
  const tools = allFiles.filter((f) => f.includes('tools') || f.includes('features'));
  const components = allFiles.filter((f) => f.includes('components'));

  const fileList = [...pages, ...tools, ...components].slice(0, 30); // Limit for now

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

🎯 GOAL:
${goal}

📁 FILE INDEX (partial):
${fileList.join('\n')}

🧠 FILE PREVIEWS:
${previews.join('\n\n')}

Your job is to scan the platform code, tools, and features — not just pages. Audit everything. Re
