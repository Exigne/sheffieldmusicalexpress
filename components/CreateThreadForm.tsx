"use client";
import { useState } from 'react';

export default function CreateThreadForm({ boardId, boardSlug }: { boardId: number, boardSlug: string }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Used - Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);

  const isMarketplace = boardSlug === 'gear-exchange';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const username = localStorage.getItem('sme_user');
    if (!username) {
      alert("Please log in to post.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/threads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, body, boardId, boardSlug, username,
          price: isMarketplace ? price : null,
          condition: isMarketplace ? condition : null,
          imageUrl: isMarketplace ? imageUrl : null
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosted(true);
        // THE HARD REDIRECT: Bypass Next.js cache so the listing shows up instantly
        const targetUrl = data.type === 'gear' 
          ? `/threads/${data.id}?type=gear` 
          : `/threads/${data.id}`;
        
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 500);
      } else {
        alert(data.error || "Failed to post.");
        setLoading(false);
      }
    } catch (err) {
      alert("Connection error.");
      setLoading(false);
    }
  };

  if (posted) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: 'var(--paper)', border: '3px solid var(--ink)' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', color: 'var(--rust)' }}>Listing Published!</h2>
        <p style={{ fontFamily: 'IBM Plex Mono' }}>Redirecting you to your advert...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>{isMarketplace ? 'GEAR ITEM NAME' : 'TITLE'}</label>
        <input placeholder="Name..." value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.2rem' }} />
      </div>

      {isMarketplace && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '25px', background: '#f8f8f8', border: '2px solid var(--ink)', boxShadow: '6px 6px 0px var(--rust)' }}>
          <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required={isMarketplace} style={{ padding: '10px', border: '2px solid var(--ink)' }} />
          <select value={condition} onChange={e => setCondition(e.target.value)} style={{ padding: '10px', border: '2px solid var(--ink)', background: 'white' }}>
            <option>Brand New</option><option>Used - Mint</option><option>Used - Good</option><option>Used - Fair</option><option>Broken / Spares</option>
          </select>
          <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ gridColumn: 'span 2', padding: '10px', border: '2px solid var(--ink)' }} />
        </div>
      )}

      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>{isMarketplace ? 'DESCRIPTION' : 'MESSAGE'}</label>
        <textarea placeholder="Details..." value={body} onChange={e => setBody(e.target.value)} rows={6} required style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow' }} />
      </div>
      
      <button type="submit" disabled={loading} style={{ background: 'var(--ink)', color: 'white', padding: '18px', fontFamily: 'Bebas Neue', fontSize: '1.8rem', border: 'none', boxShadow: '6px 6px 0px var(--rust)', cursor: 'pointer' }}>
        {loading ? 'POSTING...' : 'PUBLISH →'}
      </button>
    </form>
  );
}
