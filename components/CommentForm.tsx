"use client";
import { useState } from "react";

export default function CommentForm({ itemId }: { itemId: number }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem('sme_user');
    if (!user) return alert("You must be logged in to comment.");

    setLoading(true);
    const res = await fetch('/api/marketplace/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, username: user, comment })
    });

    if (res.ok) {
      setComment("");
      window.location.reload();
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <textarea 
        placeholder="ASK A QUESTION..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        style={{ 
          width: '100%', padding: '15px', border: '3px solid var(--ink)', 
          fontFamily: 'Barlow', fontSize: '1rem', minHeight: '100px' 
        }}
      />
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          marginTop: '10px', background: 'var(--ink)', color: 'white', 
          padding: '10px 25px', border: 'none', fontFamily: 'Bebas Neue', 
          fontSize: '1.2rem', cursor: 'pointer' 
        }}
      >
        {loading ? "POSTING..." : "POST COMMENT"}
      </button>
    </form>
  );
}
