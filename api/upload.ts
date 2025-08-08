import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucket = process.env.SUPABASE_BUCKET || 'materials';

const supabase = createClient(supabaseUrl, serviceKey);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const Body = z.object({ filename: z.string(), contentType: z.string() });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const { filename, contentType } = parsed.data;

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUploadUrl(filename, { contentType });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ uploadUrl: data.signedUrl, path: `${bucket}/${filename}` });
}

