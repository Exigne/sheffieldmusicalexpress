"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateThreadForm({ boardId, boardSlug }: { boardId: number, boardSlug: string }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Used - Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Detect if we should show the "Pro Advert" fields
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
        // Redirect based on type so the "Advert View" triggers correctly
        if (data.type === 'gear') {
          window.location.href = `/threads/${data.id}?type=gear`;
        } else {
          window.location.href = `/threads/${data.id}`;
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* BASIC INFO */}
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          {isMarketplace ? 'ITEM NAME' : 'TOPIC TITLE'}
        </label>
        <input 
          placeholder={isMarketplace ? "e.g. 1990s Japanese Squier Strat" : "What's on your mind?"}
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }}
        />
      </div>

      {/* 🎸 GEAR EXCHANGE EXTRA FIELDS */}
      {isMarketplace && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', background: '#f0f0f0', borderLeft: '5px solid var(--rust)' }}>
          <div className="form-group">
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>PRICE / OFFER</label>
            <input 
              placeholder="e.g. £450 or Trade" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
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
            <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', fontWeight: 'bold' }}>IMAGE URL (IMGUR / DISCORD LINK)</label>
            <input 
              placeholder="Paste a link to your photo here..." 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              style={{ width: '100%', padding: '10px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }}
            />
          </div>
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          {isMarketplace ? 'ITEM DESCRIPTION' : 'MESSAGE'}
        </label>
        <textarea 
          placeholder={isMarketplace ? "Tell us about the kit, any mods, or where in Sheffield you are..." : "Start typing..."}
          value={body} 
          onChange={e => setBody(e.target.value)} 
          rows={6} 
          required 
          style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1rem', lineHeight: '1.5' }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading} 
        style={{ 
          background: 'var(--ink)', 
          color: 'white', 
          padding: '15px', 
          fontFamily: 'Bebas Neue', 
          fontSize: '1.5rem', 
          border: 'none', 
          cursor: 'pointer',
          boxShadow: '4px 4px 0px var(--rust)'
        }}
      >
        {loading ? 'POSTING...' : isMarketplace ? 'PUBLISH ADVERT →' : 'POST THREAD →'}
      </button>
    </form>
  );
}
