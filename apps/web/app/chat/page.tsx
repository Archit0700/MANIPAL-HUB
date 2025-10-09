'use client';

import { FormEvent, useState } from 'react';
import { api } from '../../lib/api';
import type { ChatCitation, ChatResponse } from '../../lib/types';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [citations, setCitations] = useState<ChatCitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contactDisplay = '+91 7976958639';
  const contactTel = '+917976958639';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.chat(message.trim());
      setResponse(result);
      setCitations(result.citations);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch an answer. Confirm the API is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Chat</h1>
        <p style={{ color: 'rgba(226,232,240,0.75)', maxWidth: '640px' }}>
          Ask questions about campus life. Responses use OpenAI with context retrieved via pgvector similarity search over ingested documents.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Where can I get academic advising?"
          rows={4}
          style={{
            padding: '1rem',
            borderRadius: '1rem',
            border: '1px solid rgba(148,163,184,0.25)',
            background: 'rgba(15,23,42,0.6)',
            color: '#e2e8f0',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            justifySelf: 'flex-start',
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
            color: '#0f172a',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {response && (
        <div className="card" style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <h2 style={{ marginTop: 0 }}>Assistant response</h2>
            <p style={{ color: 'rgba(226,232,240,0.85)' }}>{response.answer}</p>
            <a
              href={`tel:${contactTel}`}
              style={{
                display: 'inline-block',
                marginTop: '0.75rem',
                color: '#22d3ee',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Call {contactDisplay}
            </a>
          </div>
          <div>
            <h3>Citations</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
              {citations.map((citation) => (
                <li key={citation.id} style={{ background: 'rgba(15,23,42,0.65)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>{citation.source ?? 'Internal document'}</p>
                  <p style={{ margin: '0.35rem 0 0', color: 'rgba(226,232,240,0.75)' }}>{citation.content}</p>
                  <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: 'rgba(148,163,184,0.8)' }}>
                    Distance score: {citation.distance.toFixed(4)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
