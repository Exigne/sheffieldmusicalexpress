"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateThreadForm({ boardId }: { boardId: number }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/threads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, boardId }),
      });

      if (res.ok) {
        const data = await res.json();
        setTitle('');
        setBody('');
        // Refresh the page and redirect to the new thread
        router.refresh();
        router.push(`/threads/${data.id}`);
      } else {
        alert("Failed to create thread. Are you logged in?");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input
        className="form-input"
        placeholder="Thread Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)' }}
      />
      <textarea
        className="reply-textarea"
        placeholder="What's on your mind? (If selling gear, include price and details)"
        rows={5}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)', fontFamily: 'inherit' }}
      />
      <button 
        type="submit" 
        className="btn-submit" 
        disabled={loading}
        style={{ 
          background: 'var(--rust)', 
          color: 'white', 
          padding: '12px', 
          fontWeight: 'bold', 
          border: 'none', 
          cursor: loading ? 'not-allowed' : 'pointer',
          textTransform: 'uppercase'
        }}
      >
        {loading ? 'POSTING...' : 'POST DISCUSSION'}
      </button>
    </form>
  );
}
