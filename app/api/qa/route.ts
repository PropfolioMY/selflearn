import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ session_id: z.string().uuid(), question: z.string(), mode: z.enum(['ELI5','exam']).optional(), max_sources: z.number().int().optional() });

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = Body.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  return NextResponse.json({ answer_html: '<p>I cannot confirm from the provided material.</p>', bullets: [], sources: [], confidence: 0, verifiable: false });
}

