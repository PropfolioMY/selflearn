-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists vector;

-- Schema (same as backend/sql/schema.sql but storage path instead of s3_url)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  filename text not null,
  mime text not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now(),
  processed_at timestamptz,
  length_bytes integer,
  status text not null default 'queued'
);

create table if not exists chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  page integer,
  chunk_index integer,
  text text not null,
  char_start integer,
  char_end integer,
  headers jsonb default '[]'::jsonb,
  embedding vector(1536)
);
create index if not exists idx_chunks_doc on chunks(document_id);
create index if not exists idx_chunks_embedding on chunks using ivfflat (embedding vector_cosine_ops) with (lists=100);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  document_ids uuid[] not null,
  memory jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists qa_log (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete set null,
  question text not null,
  response_json jsonb not null,
  sources jsonb not null,
  confidence numeric,
  verified boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  text text not null,
  choices text[] not null,
  correct_choice_index int not null,
  source_spans jsonb not null,
  confidence numeric,
  created_at timestamptz not null default now()
);

