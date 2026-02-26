"use client";
import { useState } from 'react';

export default function CreateThreadForm({ boardId, boardSlug }: { boardId: number, boardSlug: string }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Used - Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const isMarketplace = boardSlug === 'gear-exchange';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const username = localStorage.getItem('sme_user');
    
    const res = await fetch('/api/threads/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, boardId, boardSlug, username, price, condition, imageUrl }),
    });

    const data = await res.json();
    if (res.ok) {
      // FORCE REDIRECT to the thread page with type gear
      window.location.href = data.type === 'gear' 
        ? `/threads/${data.id}?type=gear` 
        : `/threads/${data.id}`;
    } else {
      alert("Error: " + data.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>{isMarketplace ? 'GEAR ITEM NAME' : 'TOPIC TITLE'}</label>
        <input placeholder="Name..." value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.8rem' }} />
      </div>

      {isMarketplace && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '30px', background: '#f8f8f8', border: '2px solid var(--ink)', boxShadow: '8px 8px 0px var(--rust)' }}>
          <div className="form-group">
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>PRICE</label>
            <input placeholder="£0.00" value={price} onChange={e => setPrice(e.target.value)} required={isMarketplace} style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)' }} />
          </div>
          <div className="form-group">
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>CONDITION</label>
            <select value={condition} onChange={e => setCondition(e.target.value)} style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)', background: 'white' }}>
              <option>Brand New</option><option>Used - Mint</option><option>Used - Good</option><option>Used - Fair</option><option>Spares / Repairs</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>IMAGE URL (IMGUR LINK)</label>
            <input placeholder="https://i.imgur.com/..." value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)' }} />
          </div>
        </div>
      )}

      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>{isMarketplace ? 'FULL DETAILS' : 'MESSAGE'}</label>
        <textarea placeholder="Write here..." value={body} onChange={e => setBody(e.target.value)} rows={8} required style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }} />
      </div>
      
      <button type="submit" disabled={loading} style={{ background: 'var(--ink)', color: 'white', padding: '20px', fontFamily: 'Bebas Neue', fontSize: '2rem', border: 'none', boxShadow: '6px 6px 0px var(--rust)', cursor: 'pointer' }}>
        {loading ? 'POSTING...' : 'PUBLISH NOW →'}
      </button>
    </form>
  );
}
