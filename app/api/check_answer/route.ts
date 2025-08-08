import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ session_id: z.string().uuid(), question_id: z.string().uuid(), user_answer: z.string() });

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = Body.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  return NextResponse.json({ is_correct: false, evidence_snippet: '', explanation: '' });
}

