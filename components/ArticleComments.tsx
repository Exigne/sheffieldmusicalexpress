"use client";

import { useState, useEffect } from 'react';

export default function ArticleComments({ articleId }: { articleId: number }) {
  const [user, setUser] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState<{id: number, username: string, text: string}[]>([]);

  useEffect(() => setUser(localStorage.getItem('sme_user')), []);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;
    setCommentsList([...commentsList, { id: Date.now(), username: user, text: comment }]);
    setComment("");
  };

  return (
    <div style={{ borderTop: '4px solid var(--paper-dark)', paddingTop: '20px' }}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '20px' }}>Comments ({commentsList.length})</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        {commentsList.map(c => (
          <div key={c.id} style={{ background: 'var(--paper)', padding: '15px', border: '1px solid var(--aged)', borderRadius: '4px' }}>
            <strong style={{ color: 'var(--rust)', display: 'block', marginBottom: '5px' }}>{c.username}</strong>
            <div style={{ fontSize: '0.95rem', color: '#333' }}>{c.text}</div>
          </div>
        ))}
      </div>

      {user ? (
        <form onSubmit={handleComment} style={{ background: '#fdfdfc', padding: '20px', border: '1px solid var(--ink)' }}>
          <textarea className="reply-textarea" rows={3} placeholder="Leave a comment..." value={comment} onChange={(e) => setComment(e.target.value)} required />
          <button type="submit" className="btn-submit" style={{ marginTop: '10px' }}>Post Comment</button>
        </form>
      ) : (
        <div style={{ padding: '15px', background: '#fdf0ee', border: '1px solid var(--rust)', textAlign: 'center' }}>
          <p style={{ color: 'var(--rust)', margin: 0, fontWeight: 'bold' }}>🔒 You must sign in to comment.</p>
        </div>
      )}
    </div>
  );
}
