import type { NextApiRequest, NextApiResponse } from 'next';
import { generateUXPrompt } from '@/agents/ux-ai';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { task } = req.body;

  const routes = fs.readFileSync(path.join(process.cwd(), 'public/routes.json'), 'utf8');
  const components = fs.readFileSync(path.join(process.cwd(), 'public/components.json'), 'utf8');

  const prompt = await generateUXPrompt(task, { routes, components });

  const result = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'system', content: prompt }],
    }),
  }).then(r => r.json());

  res.status(200).json(result);
}
