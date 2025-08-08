import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucket = process.env.SUPABASE_BUCKET || 'materials';

const supabase = createClient(supabaseUrl, serviceKey);

export async function POST(req: NextRequest) {
  const Body = z.object({ filename: z.string(), contentType: z.string() });
  const data = await req.json();
  const parsed = Body.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  const { filename, contentType } = parsed.data;
  const { data: out, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filename, { contentType });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ uploadUrl: out.signedUrl, path: `${bucket}/${filename}` });
}

