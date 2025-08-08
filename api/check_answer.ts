import { z } from 'zod';

const Body = z.object({ session_id: z.string().uuid(), question_id: z.string().uuid(), user_answer: z.string() });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  return res.status(200).json({ is_correct: false, evidence_snippet: '', explanation: '' });
}

