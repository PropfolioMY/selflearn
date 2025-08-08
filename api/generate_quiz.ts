import { z } from 'zod';

const Body = z.object({ session_id: z.string().uuid(), topic: z.string().optional(), num_questions: z.number().int(), type: z.enum(['mcq','tf','short']) });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  return res.status(200).json({ questions: [] });
}

