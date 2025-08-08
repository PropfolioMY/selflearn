"use client";
import React, { useMemo, useState } from 'react';

type Source = { doc_id: string; page: number; chunk: number; snippet: string };
type QAResponse = { answer_html: string; bullets: string[]; sources: Source[]; confidence: number; verifiable: boolean };

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadPath, setUploadPath] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<QAResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const hasAnswer = useMemo(() => !!answer, [answer]);

  const onUpload = async () => {
    if (!file) return;
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream' })
    });
    const data = await res.json();
    if (!res.ok) {
      alert('Upload URL error: ' + (data.error || 'unknown'));
      return;
    }
    const { uploadUrl, path } = data;
    const up = await fetch(uploadUrl, { method: 'POST', body: file });
    if (!up.ok) {
      alert('Upload failed');
      return;
    }
    setUploadPath(path);
  };

  const onAsk = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: '00000000-0000-0000-0000-000000000001', question, mode: 'ELI5' })
      });
      const data = await res.json();
      setAnswer(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Study Buddy</h1>
      <div className="row">
        <div className="col">
          <div className="card">
            <h3>Upload Materials</h3>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div style={{ height: 8 }} />
            <button onClick={onUpload} disabled={!file}>Upload</button>
            {uploadPath && <p><small>Uploaded to: <code>{uploadPath}</code></small></p>}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Ask a Question</h3>
            <label>Question</label>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Explain photosynthesis like I'm 5" />
            <div style={{ height: 8 }} />
            <button onClick={onAsk} disabled={!question || loading}>{loading ? 'Thinking…' : 'Ask'}</button>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h3>Answer</h3>
            {!hasAnswer && <p>Ask a question to see the ELI5 answer with evidence.</p>}
            {hasAnswer && (
              <div>
                <div dangerouslySetInnerHTML={{ __html: answer!.answer_html }} />
                <ul>
                  {answer!.bullets.map((b, i) => (<li key={i}>{b}</li>))}
                </ul>
                <p><small>Confidence: {answer!.confidence.toFixed(2)} | Verifiable: {String(answer!.verifiable)}</small></p>
              </div>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Evidence</h3>
            {answer?.sources?.length ? (
              <ul>
                {answer.sources.map((s, i) => (
                  <li key={i}><code>[{s.doc_id}:{s.page}:{s.chunk}]</code> – {s.snippet}</li>
                ))}
              </ul>
            ) : <p>No sources yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

