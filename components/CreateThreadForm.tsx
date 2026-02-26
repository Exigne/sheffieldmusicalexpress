"use client";
import { useState } from 'react';

export default function CreateThreadForm({ boardId, boardSlug, onSuccess }: { 
  boardId: number, 
  boardSlug: string,
  onSuccess?: () => void
}) {
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
          title, 
          body, 
          boardId, 
          boardSlug, 
          username,
          price: isMarketplace ? price : null,
          condition: isMarketplace ? condition : null,
          imageUrl: isMarketplace ? imageUrl : null
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosted(true);
        setTimeout(() => {
          onSuccess?.(); // closes modal & refreshes board — no page navigation
        }, 1000);
      } else {
        alert(data.error || "Failed to post. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      alert("Connection error. Check your internet.");
      setLoading(false);
    }
  };

  if (posted) {
    return (
      <div style={{ 
        padding: '60px', 
        textAlign: 'center', 
        background: 'var(--paper)', 
        border: '4px solid var(--ink)',
        boxShadow: '10px 10px 0px var(--rust)'
      }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', color: 'var(--rust)', margin: 0 }}>PUBLISHED!</h2>
        <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', marginTop: '10px' }}>
          {isMarketplace ? 'Advert posted!' : 'Thread posted!'} Closing...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* 1. TITLE FIELD */}
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
          {isMarketplace ? 'ITEM NAME (Make it clear)' : 'DISCUSSION TITLE'}
        </label>
        <input 
          placeholder={isMarketplace ? "e.g. 1970s Fender Twin Reverb" : "What's happening?"}
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ 
            width: '100%', 
            padding: '15px', 
            border: '3px solid var(--ink)', 
            fontFamily: 'Barlow', 
            fontSize: '1.2rem',
            background: 'white'
          }}
        />
      </div>

      {/* 2. MARKETPLACE FIELDS */}
      {isMarketplace && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '25px', 
          padding: '30px', 
          background: '#f8f8f8', 
          border: '2px solid var(--ink)',
          boxShadow: '8px 8px 0px var(--rust)'
        }}>
          <div className="form-group">
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>PRICE / OFFER</label>
            <input 
              placeholder="e.g. £450 or Trade" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required={isMarketplace}
              style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }}
            />
          </div>

          <div className="form-group">
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>CONDITION</label>
            <select 
              value={condition} 
              onChange={e => setCondition(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono', background: 'white' }}
            >
              <option>Used - Good</option>
              <option>Used - Mint</option>
              <option>Used - Fair</option>
              <option>Brand New</option>
              <option>Spares / Repairs</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>PHOTO URL (Imgur or Discord Link)</label>
            <input 
              placeholder="Paste image link here..." 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }}
            />
          </div>
        </div>
      )}

      {/* 3. DESCRIPTION FIELD */}
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
          {isMarketplace ? 'ITEM DESCRIPTION' : 'MESSAGE'}
        </label>
        <textarea 
          placeholder={isMarketplace ? "Give as much detail as possible about the kit..." : "Start typing..."}
          value={body} 
          onChange={e => setBody(e.target.value)} 
          rows={8} 
          required 
          style={{ 
            width: '100%', 
            padding: '15px', 
            border: '3px solid var(--ink)', 
            fontFamily: 'Barlow', 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            background: 'white'
          }}
        />
      </div>
      
      {/* 4. SUBMIT BUTTON */}
      <button 
        type="submit" 
        disabled={loading} 
        style={{ 
          background: 'var(--ink)', 
          color: 'white', 
          padding: '20px', 
          fontFamily: 'Bebas Neue', 
          fontSize: '2rem', 
          border: 'none', 
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '8px 8px 0px var(--rust)',
          transition: 'transform 0.1s'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'translate(2px, 2px)'}
        onMouseUp={e => e.currentTarget.style.transform = 'translate(0px, 0px)'}
      >
        {loading ? 'POSTING TO NEON...' : isMarketplace ? 'PUBLISH ADVERT →' : 'POST THREAD →'}
      </button>
    </form>
  );
}
