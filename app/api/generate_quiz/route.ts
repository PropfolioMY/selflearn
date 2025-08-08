import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ session_id: z.string().uuid(), topic: z.string().optional(), num_questions: z.number().int(), type: z.enum(['mcq','tf','short']) });

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = Body.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  return NextResponse.json({ questions: [] });
}

