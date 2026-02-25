"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateThreadForm({ boardId }: { boardId: number }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // On mount, try to find who is logged in
  useEffect(() => {
    // Try to get username from cookies or local storage
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const savedUser = getCookie('username') || localStorage.getItem('username');
    if (savedUser) setUsername(savedUser);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert("You must be logged in to post! Please sign in first.");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch('/api/threads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          body, 
          boardId,
          username // We send the username directly since the cookie isn't working
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTitle('');
        setBody('');
        router.refresh();
        router.push(`/threads/${data.id}`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Connection error. Please try again.");
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
        // UPDATED: Removed the gear selling text
        placeholder="What's on your mind?" 
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
      {!username && (
        <p style={{ color: 'var(--rust)', fontSize: '0.8rem', textAlign: 'center' }}>
          ⚠️ You don't appear to be logged in.
        </p>
      )}
    </form>
  );
}
