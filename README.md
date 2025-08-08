AI Study Buddy — Vercel + Supabase

Run locally

1) Create `.env.local` in repo root with:
```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_BUCKET=materials
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
OPENAI_API_KEY=sk-...
```

2) Supabase setup
- In Dashboard → SQL: run `supabase/migrations/0001_init.sql`
- Storage: create bucket `materials`

3) Dev server (Vercel)
```
npm i -g vercel
vercel dev
```

Endpoints
- POST `/api/upload` → returns signed upload URL and storage path
- POST `/api/qa` → returns stubbed evidence-first JSON
- POST `/api/generate_quiz` → stubbed quiz
- POST `/api/check_answer` → stubbed answer check

Deploy
- Connect repo to Vercel → set env vars in Project Settings → deploy

