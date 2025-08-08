MVP backlog (execution order)

- Upload + storage
  - Implement `POST /upload` to create `documents` row and enqueue Redis job
  - Create MinIO bucket `study-buddy`, signed PUTs from frontend

- Ingestion worker
  - Replace stub embeddings with real model (OpenAI or sentence-transformers)
  - Write to `chunks` with page, chunk_index, char offsets, headers
  - Upsert to pgvector and create ivfflat index

- Retrieval API
  - `kNN` search by question embedding, configurable K
  - Rerank (cross-encoder or small LLM)
  - Source-checker (keyword presence for critical terms)

- Generation
  - System prompt from `docs/prompts/system_prompt.txt`
  - Constrain output to Zod schemas; reject/repair invalid JSON

- Verification
  - Span-extractor to map claims → exact text spans
  - Compute support_ratio, confidence, verifiable flag
  - Log to `qa_log`

- Quiz
  - MCQ generator with validated distractors
  - `POST /check_answer` evidence-based feedback

- UI
  - Upload UI, study session chat, evidence pane, quiz flow
  - Export notes (HTML/Markdown)

- Monitoring & admin
  - Low-confidence review queue
  - Metrics: hallucination rate, support coverage

