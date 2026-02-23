"use client"; // Needs to be client to handle the mock comments state for now

import { useState, useEffect, use } from 'react';
import Modal from '@/components/Modal';

// Temporary mock database for our 3 articles
const articlesDB: Record<string, any> = {
  'leadmill-legacy': {
    title: "The Leadmill Legacy: 40 Years of Sweat, Steel, and Sound",
    category: "Exclusive Interview",
    content: "The story of Sheffield's most iconic independent venue is written in spilled pints and ringing ears. From Pulp and Arctic Monkeys playing their early gigs here, to the modern fight to keep independent venues alive, The Leadmill remains the beating heart of the Steel City music scene. \n\nWe sat down with the sound engineers to hear the craziest stories from behind the mixing desk...",
  },
  'forgemaster-fuzz': {
    title: "Testing the new 'Forgemaster' Fuzz Pedal",
    category: "Gear Review",
    content: "Hand-wired in a small workshop in Kelham Island, the 'Forgemaster' promises to deliver the thick, sludgy tones that Sheffield doom bands have been chasing for decades. \n\nWe plugged it into a Marshall stack at Yellow Arch Studios to see if it actually cuts through the mix, or if it just turns your tone to muddy water. Spoiler: It's a beast.",
  },
  'basement-practice': {
    title: "5 Basement Practice Rooms You Haven't Tried",
    category: "Scene Report",
    content: "If you're tired of fighting for the prime 7 PM slots at Pirate Studios, it's time to look underground. Sheffield is full of hidden, independent rehearsal spaces if you know who to ask. \n\nHere are 5 basement rooms that offer cheap rates, decent house kits, and enough soundproofing to keep the noise complaints at bay.",
  }
};

export default function ArticlePopOut({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap the params using React.use()
  const { slug } = use(params);
  const article = articlesDB[slug];
  
  const [user, setUser] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  // Mock comments array so you can interact with it instantly
  const [commentsList, setCommentsList] = useState([
    { id: 1, username: "SteelCityShredder", text: "Great read! Totally agree.", date: "Just now" }
  ]);

  useEffect(() => {
    setUser(localStorage.getItem('sme_user'));
  }, []);

  if (!article) return null;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;
    
    // Add to our mock state immediately
    setCommentsList([...commentsList, { id: Date.now(), username: user, text: comment, date: "Just now" }]);
    setComment("");
  };

  return (
    <Modal>
      {/* Article Header */}
      <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--rust)', textTransform: 'uppercase', marginBottom: '10px' }}>
          {article.category}
        </div>
        <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: '0 0 10px 0', lineHeight: '1.1' }}>
          {article.title}
        </h1>
        <div style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
          By The Editor · Published Today
        </div>
      </div>

      {/* Article Body */}
      <div style={{ fontFamily: 'Barlow', fontSize: '1.1rem', lineHeight: '1.8', color: '#222', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
        {article.content}
      </div>

      {/* Comments Section */}
      <div style={{ borderTop: '4px solid var(--paper-dark)', paddingTop: '20px' }}>
        <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginBottom: '20px' }}>Comments ({commentsList.length})</h3>
        
        {/* Comment List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          {commentsList.map(c => (
            <div key={c.id} style={{ background: 'var(--paper)', padding: '15px', border: '1px solid var(--aged)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: 'var(--rust)' }}>{c.username}</strong>
                <span style={{ fontSize: '0.75rem', color: '#666' }}>{c.date}</span>
              </div>
              <div style={{ fontSize: '0.95rem', color: '#333' }}>{c.text}</div>
            </div>
          ))}
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleComment} style={{ background: '#fdfdfc', padding: '20px', border: '1px solid var(--ink)', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.8rem', marginBottom: '10px', color: '#666' }}>Commenting as: <strong>{user}</strong></div>
            <textarea
              className="reply-textarea"
              rows={3}
              placeholder="Leave a comment on this article..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit" style={{ marginTop: '10px' }}>Post Comment</button>
          </form>
        ) : (
          <div style={{ padding: '15px', background: '#fdf0ee', border: '1px solid var(--rust)', borderRadius: '4px', textAlign: 'center' }}>
            <p style={{ color: 'var(--rust)', margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>🔒 You must sign in to comment.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
