import { z } from 'zod';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const Body = z.object({
  session_id: z.string().uuid(),
  question: z.string(),
  mode: z.enum(['ELI5', 'exam']).optional(),
  max_sources: z.number().int().optional()
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const { question } = parsed.data;

  // TODO:
  // 1) embed question -> kNN against chunks.embedding in Supabase Postgres
  // 2) re-rank, source-check
  // 3) call LLM with strict system prompt
  // 4) verify claims and compute confidence
  return res.status(200).json({
    answer_html: '<p>I cannot confirm from the provided material.</p>',
    bullets: [],
    sources: [],
    confidence: 0,
    verifiable: false
  });
}

