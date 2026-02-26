"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostReplyForm({ threadId }: { threadId: number }) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    setUsername(localStorage.getItem('sme_user') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return alert("Please log in to reply.");
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, threadId, username }),
      });

      if (res.ok) {
        setBody(''); // 1. Clear the text box
        router.refresh(); // 2. Tell Next.js to quietly pull the new post into the modal above!
      } else {
        const data = await res.json();
        alert(data.error || "Failed to post reply.");
      }
    } catch (err) {
      alert("Connection error. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <textarea 
        value={body} 
        onChange={e => setBody(e.target.value)} 
        placeholder="Type your reply here..." 
        required 
        rows={4}
        style={{ 
          width: '100%', 
          padding: '15px', 
          border: '4px solid var(--ink)', 
          fontFamily: 'Barlow', 
          fontSize: '1.2rem',
          outline: 'none',
          resize: 'vertical',
          background: '#fdfdfd'
        }} 
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', color: '#666' }}>
          {username ? `Posting as @${username.toUpperCase()}` : 'Not logged in'}
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !body.trim()} 
          style={{ 
            background: 'var(--rust)', 
            color: 'white', 
            padding: '15px 30px', 
            fontFamily: 'Bebas Neue', 
            fontSize: '1.8rem', 
            border: '3px solid var(--ink)', 
            cursor: loading || !body.trim() ? 'not-allowed' : 'pointer',
            boxShadow: '6px 6px 0px var(--ink)',
            transition: 'transform 0.1s, box-shadow 0.1s',
            opacity: loading || !body.trim() ? 0.7 : 1
          }}
          // This makes the button "press down" into the drop shadow when clicked
          onMouseDown={e => {
            if (!loading && body.trim()) {
              e.currentTarget.style.transform = 'translate(4px, 4px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px var(--ink)';
            }
          }}
          onMouseUp={e => {
            if (!loading && body.trim()) {
              e.currentTarget.style.transform = 'translate(0px, 0px)';
              e.currentTarget.style.boxShadow = '6px 6px 0px var(--ink)';
            }
          }}
        >
          {loading ? 'POSTING...' : 'POST REPLY →'}
        </button>
      </div>
    </form>
  );
}
