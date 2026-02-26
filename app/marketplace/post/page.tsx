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
    formData.append('upload_preset', 'sme_marketplace'); // ⚠️ Make sure this exists in Settings > Upload

    try {
      // 🚀 UPDATED WITH YOUR CLOUD NAME: dyitrwe5h
      const res = await fetch(`https://api.cloudinary.com/v1_1/dyitrwe5h/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        console.log("SME Marketplace: Upload Successful!", data.secure_url);
      } else {
        console.error("Cloudinary Error:", data);
        alert("Upload failed: " + (data.error?.message || "Check console (F12) for details."));
      }
    } catch (err) {
      alert("Connection to Cloudinary failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return alert("Wait for the image to finish uploading...");
    if (!imageUrl) return alert("You must upload a photo first!");
    
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
        alert("DB Error: " + data.error);
      }
    } catch (err) {
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--aged)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', border: '6px solid var(--ink)', boxShadow: '15px 15px 0px var(--rust)', padding: '40px' }}>
        
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: '0 0 10px 0' }}>GEAR EXCHANGE</h1>
        <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '30px' }}>SELL YOUR KIT IN SHEFFIELD</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ border: '4px dashed var(--ink)', padding: '30px', textAlign: 'center', background: imageUrl ? '#f0fff0' : '#f9f9f9' }}>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', marginBottom: '10px' }}>
              {uploading ? '⌛ UPLOADING TO CLOUDINARY...' : imageUrl ? '✅ PHOTO ATTACHED' : '📷 CLICK TO UPLOAD GEAR PHOTO'}
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ cursor: 'pointer' }} />
            {imageUrl && (
              <div style={{ marginTop: '15px' }}>
                <img src={imageUrl} style={{ width: '200px', border: '3px solid var(--ink)' }} alt="Preview" />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.8rem' }}>ITEM NAME</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Orange Tiny Terror" style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.8rem' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.8rem' }}>PRICE (£)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} required placeholder="300" style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontWeight: 'bold' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.8rem' }}>CONDITION</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', background: 'white' }}>
                <option>Mint</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.8rem' }}>DESCRIPTION</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} required placeholder="Full specs..." style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow' }} />
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading} 
            style={{ 
              background: 'var(--ink)', color: 'white', padding: '20px', 
              fontFamily: 'Bebas Neue', fontSize: '2rem', border: 'none', 
              cursor: (loading || uploading) ? 'not-allowed' : 'pointer', 
              boxShadow: '8px 8px 0px var(--rust)'
            }}
          >
            {uploading ? 'UPLOADING...' : loading ? 'POSTING...' : 'LIST ITEM →'}
          </button>
        </form>
      </div>
    </div>
  );
}
