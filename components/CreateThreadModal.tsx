"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateThreadModal({ boardId, boardSlug }: { boardId: number, boardSlug: string }) {
  const router = useRouter();
  
  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Used - Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  const isGear = boardSlug === 'gear-exchange';

  useEffect(() => {
    setUsername(localStorage.getItem('sme_user') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert("Please log in to post.");
      return;
    }

    setLoading(true);

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
          price: isGear ? price : null,
          condition: isGear ? condition : null,
          imageUrl: isGear ? imageUrl : null
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Close the modal overlay
        setIsOpen(false);
        
        // 2. Clear the form
        setTitle('');
        setBody('');
        setPrice('');
        setImageUrl('');
        setLoading(false);

        // 3. THE FIX: Soft-navigate to the new thread so the Next.js Modal system stays intact!
        const targetUrl = data.type === 'gear' 
          ? `/threads/${data.id}?type=gear` 
          : `/threads/${data.id}`;
          
        router.push(targetUrl);
        router.refresh(); // Tells the background page to fetch the new data quietly
        
      } else {
        alert(data.error || "Failed to post. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Connection error. Check your internet.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* BUTTON TO OPEN MODAL */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{ 
          background: 'var(--rust)', 
          color: 'white', 
          padding: '15px 30px', 
          fontFamily: 'Bebas Neue', 
          fontSize: '2rem', 
          border: 'none', 
          cursor: 'pointer',
          boxShadow: '6px 6px 0px var(--ink)',
          transition: 'transform 0.1s'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'translate(2px, 2px)'}
        onMouseUp={e => e.currentTarget.style.transform = 'translate(0px, 0px)'}
      >
        + CREATE NEW POST
      </button>

      {/* THE MODAL OVERLAY */}
      {isOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0, 0, 0, 0.8)', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ 
            background: 'var(--paper)', 
            width: '100%', 
            maxWidth: '700px', 
            border: '6px solid var(--ink)', 
            boxShadow: '15px 15px 0px var(--rust)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            
            {/* MODAL HEADER */}
            <div style={{ background: 'var(--ink)', color: 'white', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', margin: 0 }}>
                {isGear ? 'LIST YOUR GEAR' : 'START DISCUSSION'}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--rust)', fontSize: '2rem', cursor: 'pointer', fontFamily: 'Bebas Neue' }}
              >
                X
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="form-group">
                <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>TITLE</label>
                <input 
                  value={title} onChange={e => setTitle(e.target.value)} required 
                  style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.2rem' }}
                />
              </div>

              {isGear && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'white', padding: '20px', border: '3px solid var(--ink)' }}>
                  <div className="form-group">
                    <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>PRICE</label>
                    <input value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: '10px', border: '2px solid var(--ink)' }} />
                  </div>
                  <div className="form-group">
                    <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>CONDITION</label>
                    <select value={condition} onChange={e => setCondition(e.target.value)} style={{ width: '100%', padding: '10px', border: '2px solid var(--ink)' }}>
                      <option>Used - Good</option><option>Used - Mint</option><option>Brand New</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>IMAGE URL</label>
                    <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ width: '100%', padding: '10px', border: '2px solid var(--ink)' }} />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>MESSAGE</label>
                <textarea 
                  value={body} onChange={e => setBody(e.target.value)} rows={6} required 
                  style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontSize: '1.1rem' }}
                />
              </div>

              <button 
                type="submit" disabled={loading}
                style={{ background: 'var(--ink)', color: 'white', padding: '20px', fontFamily: 'Bebas Neue', fontSize: '2rem', border: 'none', cursor: 'pointer', marginTop: '10px' }}
              >
                {loading ? 'POSTING...' : 'PUBLISH →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
