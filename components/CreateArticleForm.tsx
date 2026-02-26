"use client";
import { useState, useEffect } from 'react';

export default function CreateArticleForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('News');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('sme_user') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return alert("Please log in to publish.");
    
    setLoading(true);

    const res = await fetch('/api/articles/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category, imageUrl, username }),
    });

    const data = await res.json();

    if (res.ok) {
      // Hard refresh to show the new article instantly
      window.location.href = `/articles/${data.id}`;
    } else {
      alert("Error: " + data.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>ARTICLE TITLE</label>
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          placeholder="e.g. The Return of the Leadmill..."
          style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.8rem' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="form-group">
          <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>CATEGORY</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)', background: 'white', fontFamily: 'IBM Plex Mono' }}
          >
            <option>News</option>
            <option>Interview</option>
            <option>Gig Review</option>
            <option>Scene Report</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>IMAGE URL (Landscape preferred)</label>
          <input 
            value={imageUrl} 
            onChange={e => setImageUrl(e.target.value)} 
            placeholder="https://..."
            style={{ width: '100%', padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }} 
          />
        </div>
      </div>

      <div className="form-group">
        <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>FULL ARTICLE CONTENT</label>
        <textarea 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          rows={12} 
          required 
          placeholder="Write your story here..."
          style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }} 
        />
      </div>

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
          cursor: 'pointer',
          boxShadow: '8px 8px 0px var(--rust)'
        }}
      >
        {loading ? 'PUBLISHING...' : 'PUBLISH ARTICLE →'}
      </button>
    </form>
  );
}
