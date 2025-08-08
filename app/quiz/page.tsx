"use client";
import React, { useState } from 'react';

type Choice = string;
type QuizItem = { id: string; question_text: string; choices: Choice[]; correct_index: number };

export default function QuizPage() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);

  const loadQuiz = async () => {
    const res = await fetch('/api/generate_quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: '00000000-0000-0000-0000-000000000001', topic, num_questions: 3, type: 'mcq' }) });
    const data = await res.json();
    setQuestions(data.questions || []);
    setAnswers({});
    setResult(null);
  };

  const check = async (qid: string, idx: number) => {
    const res = await fetch('/api/check_answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: '00000000-0000-0000-0000-000000000001', question_id: qid, user_answer: String(idx) }) });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="container">
      <h1>Quiz</h1>
      <div className="card">
        <label>Topic</label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., photosynthesis" />
        <div style={{ height: 8 }} />
        <button onClick={loadQuiz}>Generate Quiz</button>
      </div>
      {questions.map((q) => (
        <div className="card" key={q.id} style={{ marginTop: 12 }}>
          <p><strong>{q.question_text}</strong></p>
          {q.choices.map((c, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <label><input type="radio" name={q.id} onChange={() => setAnswers({ ...answers, [q.id]: i })} /> {c}</label>
            </div>
          ))}
          <button onClick={() => check(q.id, answers[q.id])} disabled={answers[q.id] === undefined}>Check Answer</button>
        </div>
      ))}
      {result && (
        <div className="card" style={{ marginTop: 16 }}>
          <p>Correct: {String(result.is_correct)}</p>
          <p><small>{result.explanation}</small></p>
          {result.evidence_snippet && <p><code>{result.evidence_snippet}</code></p>}
        </div>
      )}
    </div>
  );
}

