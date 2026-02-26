"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateThreadForm({ boardId, boardSlug }: { boardId: number, boardSlug?: string }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Used - Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isMarketplace = boardSlug === 'gear-exchange';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const username = localStorage.getItem('sme_user');

    const res = await fetch('/api/threads/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        body, 
        boardId, 
        username,
        // New fields:
        price: isMarketplace ? price : null,
        condition: isMarketplace ? condition : null,
        imageUrl: isMarketplace ? imageUrl : null
      }),
    });

    if (res.ok) {
      router.refresh();
      setTitle('');
      setBody('');
      setPrice('');
      setImageUrl('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input 
        placeholder="Listing Title (e.g. Fender Stratocaster 2014)" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
        style={{ padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }}
      />

      {/* 🎸 GEAR EXCHANGE ONLY FIELDS */}
      {isMarketplace && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input 
            placeholder="Price (e.g. £450 or Trade)" 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            style={{ padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono' }}
          />
          <select 
            value={condition} 
            onChange={e => setCondition(e.target.value)}
            style={{ padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono', background: 'white' }}
          >
            <option>Brand New</option>
            <option>Used - Mint</option>
            <option>Used - Good</option>
            <option>Used - Fair</option>
            <option>Spares/Repair</option>
          </select>
          <input 
            placeholder="Image URL (Imgur link etc.)" 
            value={imageUrl} 
            onChange={e => setImageUrl(e.target.value)} 
            style={{ padding: '12px', border: '2px solid var(--ink)', fontFamily: 'IBM Plex Mono', gridColumn: 'span 2' }}
          />
        </div>
      )}

      <textarea 
        placeholder="Description / Details..." 
        value={body} 
        onChange={e => setBody(e.target.value)} 
        rows={5} 
        required 
        style={{ padding: '12px', border: '2px solid var(--ink)', fontFamily: 'Barlow' }}
      />
      
      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'POSTING...' : 'PUBLISH LISTING →'}
      </button>
    </form>
  );
}
