import type { NextApiRequest, NextApiResponse } from 'next';
import { generateDirectorPrompt } from '@/agents/director-ai';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { goal } = req.body;

  const schema = fs.readFileSync(path.join(process.cwd(), 'public/schema.json'), 'utf8');
  const routes = fs.readFileSync(path.join(process.cwd(), 'public/routes.json'), 'utf8');
  const components = fs.readFileSync(path.join(process.cwd(), 'public/components.json'), 'utf8');

  const prompt = await generateDirectorPrompt(goal, { schema, routes, components });

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
