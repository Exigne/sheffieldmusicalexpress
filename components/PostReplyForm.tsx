"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostReplyForm({ threadId }: { threadId: number }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const username = localStorage.getItem('sme_user');
    if (!username) {
      alert("You must be logged in to reply.");
      setLoading(false);
      return;
    }

    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, threadId, username }),
    });

    if (res.ok) {
      setBody('');
      router.refresh(); // This reloads the server data to show your new post
    } else {
      alert("Failed to post reply.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <textarea
        placeholder="Write your reply or ask a question about this listing..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        rows={4}
        style={{ 
          padding: '15px', 
          border: '2px solid var(--ink)', 
          fontFamily: 'Barlow', 
          fontSize: '1rem',
          outline: 'none'
        }}
      />
      <button 
        type="submit" 
        disabled={loading}
        style={{
          background: 'var(--rust)',
          color: 'white',
          padding: '12px 20px',
          fontFamily: 'Bebas Neue',
          fontSize: '1.2rem',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        {loading ? 'SENDING...' : 'POST REPLY →'}
      </button>
    </form>
  );
}
