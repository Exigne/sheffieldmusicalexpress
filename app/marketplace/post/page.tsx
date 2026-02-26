"use client";
import { useState, useEffect } from 'react';

export default function PostGearPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('sme_user');
    if (!user) {
      alert("You must be logged in to post gear.");
      window.location.href = '/login';
    }
    setUsername(user);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    
    setLoading(true);

    const res = await fetch('/api/marketplace/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price, condition, imageUrl, username }),
    });

    if (res.ok) {
      window.location.href = '/marketplace';
    } else {
      const data = await res.json();
      alert("Error: " + data.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--aged)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', border: '6px solid var(--ink)', boxShadow: '15px 15px 0px var(--rust)', padding: '40px' }}>
        
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: '0 0 10px 0', lineHeight: '0.9' }}>LIST YOUR GEAR</h1>
        <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '30px' }}>SELL YOUR KIT TO THE SHEFFIELD SCENE</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div className="form-group">
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>ITEM NAME</label>
            <input 
              value={title} onChange={e => setTitle(e.target.value)} required 
              placeholder="e.g. 1990 Fender Stratocaster"
              style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.8rem' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>PRICE (£)</label>
              <input 
                type="text" value={price} onChange={e => setPrice(e.target.value)} required 
                placeholder="250"
                style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontWeight: 'bold' }} 
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>CONDITION</label>
              <select 
                value={condition} onChange={e => setCondition(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', background: 'white', fontFamily: 'IBM Plex Mono' }}
              >
                <option>Brand New</option>
                <option>Mint</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor / For Parts</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>IMAGE URL</label>
            <input 
              value={imageUrl} onChange={e => setImageUrl(e.target.value)} required 
              placeholder="https://imgur.com/your-image.jpg"
              style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow' }} 
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>DESCRIPTION</label>
            <textarea 
              value={description} onChange={e => setDescription(e.target.value)} rows={6} required 
              placeholder="Tell us about the kit, any mods, or known issues..."
              style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }} 
            />
          </div>

          <button 
            type="submit" disabled={loading} 
            style={{ background: 'var(--ink)', color: 'white', padding: '20px', fontFamily: 'Bebas Neue', fontSize: '2rem', border: 'none', cursor: 'pointer', boxShadow: '8px 8px 0px var(--rust)' }}
          >
            {loading ? 'POSTING...' : 'LIST ITEM FOR SALE →'}
          </button>
        </form>
      </div>
    </div>
  );
}
