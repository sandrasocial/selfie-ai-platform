import type { NextApiRequest, NextApiResponse } from 'next';
import { getAgentContext } from '@/lib/agentContext';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { task } = req.body;
  const prompt = getAgentContext('ux-ai', task);

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
