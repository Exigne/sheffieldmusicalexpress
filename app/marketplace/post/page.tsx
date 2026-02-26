"use client";
import { useState, useEffect } from 'react';

export default function PostGearPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Excellent');
  const [imageUrl, setImageUrl] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('sme_user');
    if (!user) window.location.href = '/login';
    setUsername(user);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sme_marketplace'); // MUST be your 'Unsigned' preset name

    try {
      // ⚠️ IMPORTANT: Replace YOUR_CLOUD_NAME with your Cloudinary name
      const res = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        console.log("Upload Success:", data.secure_url);
      } else {
        alert("Upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      alert("Connection to Cloudinary failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploading) return alert("Still uploading your photo... hang on.");
    if (!imageUrl) return alert("Please select a photo and wait for the '✅' before posting.");
    if (!username) return alert("Session expired. Please log in again.");

    setLoading(true);

    try {
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
      }
    } catch (err) {
      alert("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--aged)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', border: '6px solid var(--ink)', boxShadow: '15px 15px 0px var(--rust)', padding: '40px' }}>
        
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: '0 0 10px 0' }}>LIST YOUR GEAR</h1>
        <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '30px' }}>SELL YOUR KIT IN SHEFFIELD</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* PHOTO UPLOAD */}
          <div style={{ border: '4px dashed var(--ink)', padding: '30px', textAlign: 'center', background: imageUrl ? '#f0fff0' : '#f9f9f9' }}>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', marginBottom: '10px' }}>
              {uploading ? '⌛ UPLOADING...' : imageUrl ? '✅ PHOTO ATTACHED' : '📷 UPLOAD ITEM PHOTO'}
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
            {imageUrl && (
              <div style={{ marginTop: '15px' }}>
                <img src={imageUrl} style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid var(--ink)' }} alt="Preview" />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>ITEM NAME</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Marshall DSL40 Combo" style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.8rem' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>PRICE (£)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} required placeholder="450" style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontWeight: 'bold' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>CONDITION</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', background: 'white' }}>
                <option>Mint</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>DESCRIPTION</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} required placeholder="Specs, issues, or trade interests..." style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow' }} />
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading} 
            style={{ 
              background: 'var(--ink)', color: 'white', padding: '20px', 
              fontFamily: 'Bebas Neue', fontSize: '2rem', border: 'none', 
              cursor: (loading || uploading) ? 'not-allowed' : 'pointer', 
              boxShadow: '8px 8px 0px var(--rust)',
              opacity: (loading || uploading) ? 0.7 : 1
            }}
          >
            {uploading ? 'WAIT FOR UPLOAD...' : loading ? 'POSTING...' : 'LIST ITEM NOW →'}
          </button>
        </form>
      </div>
    </div>
  );
}
