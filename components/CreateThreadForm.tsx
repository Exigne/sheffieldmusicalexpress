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

  // Detect if we are in the Marketplace
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
        // THE CACHE FIX: We use a hard redirect to ensure the board list updates
        const targetUrl = data.type === 'gear' 
          ? `/threads/${data.id}?type=gear` 
          : `/threads/${data.id}`;
        
        // Give the database a millisecond to breathe, then hard-reload to the new page
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 500);
      } else {
        alert(data.error || "Failed to post.");
        setLoading(false);
      }
    } catch (err) {
      alert("Connection error. Try again.");
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
      
      {/* 1. TITLE / ITEM NAME */}
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          {isMarketplace ? 'GEAR ITEM NAME' : 'DISCUSSION TITLE'}
        </label>
        <input 
          placeholder={isMarketplace ? "e.g. Vintage 1970s Marshall Cab" : "Thread Title..."}
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.2rem' }}
        />
      </div>

      {/* 2. MARKETPLACE SPECIAL FIELDS */}
      {isMarketplace && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px', 
          padding: '25px', 
          background: '#f8f8f8', 
          border: '2px solid var(--ink)',
          boxShadow: '6px 6px 0px var(--rust)'
        }}>
          <div className="form-group">
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>PRICE</label>
            <input 
              placeholder="£ Price or 'Trade'" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              required={isMarketplace}
              style={{ width: '100%', padding: '10px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }}
            />
          </div>

          <div className="form-group">
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>CONDITION</label>
            <select 
              value={condition} 
              onChange={e => setCondition(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono', background: 'white' }}
            >
              <option>Brand New</option>
              <option>Used - Mint</option>
              <option>Used - Good</option>
              <option>Used - Fair</option>
              <option>Broken / Spares</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>PHOTO URL (Imgur, Discord, or Website link)</label>
            <input 
              placeholder="Paste image link here..." 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              style={{ width: '100%', padding: '10px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }}
            />
          </div>
        </div>
      )}

      {/* 3. DESCRIPTION / MESSAGE */}
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          {isMarketplace ? 'FULL ITEM DETAILS' : 'MESSAGE BODY'}
        </label>
        <textarea 
          placeholder={isMarketplace ? "Tell the Sheffield scene about this kit..." : "Write your post..."}
          value={body} 
          onChange={e => setBody(e.target.value)} 
          rows={6} 
          required 
          style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem', lineHeight: '1.5' }}
        />
      </div>
      
      {/* 4. SUBMIT BUTTON */}
      <button 
        type="submit" 
        disabled={loading} 
        style={{ 
          background: 'var(--ink)', 
          color: 'white', 
          padding: '18px', 
          fontFamily: 'Bebas Neue', 
          fontSize: '1.8rem', 
          border: 'none', 
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '6px 6px 0px var(--rust)',
          transition: 'transform 0.1s'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'translate(2px, 2px)'}
        onMouseUp={e => e.currentTarget.style.transform = 'translate(0px, 0px)'}
      >
        {loading ? 'SYNCING WITH NEON...' : isMarketplace ? 'PUBLISH GEAR ADVERT →' : 'POST TO FORUM →'}
      </button>
    </form>
  );
}
