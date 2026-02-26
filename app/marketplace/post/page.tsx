"use client";
import { useState, useEffect } from 'react';

export default function PostGearPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Good');
  const [imageUrl, setImageUrl] = useState(''); // This will hold the URL Cloudinary gives us
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('sme_user');
    if (!user) window.location.href = '/login';
    setUsername(user);
  }, []);

  // 💡 THE NEW UPLOAD LOGIC
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sme_marketplace'); // MUST match your Cloudinary preset name

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.secure_url); // Save the public URL link
      setUploading(false);
    } catch (err) {
      alert("Upload failed. Check Cloudinary settings.");
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return alert("Please upload an image first!");
    
    setLoading(true);
    const res = await fetch('/api/marketplace/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, price, condition, imageUrl, username }),
    });

    if (res.ok) window.location.href = '/marketplace';
    else setLoading(false);
  };

  return (
    <div style={{ background: 'var(--aged)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', border: '6px solid var(--ink)', boxShadow: '15px 15px 0px var(--rust)', padding: '40px' }}>
        
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: '0 0 30px 0' }}>LIST YOUR GEAR</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* IMAGE UPLOAD SECTION */}
          <div style={{ border: '3px dashed var(--ink)', padding: '20px', textAlign: 'center', background: '#f9f9f9' }}>
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', marginBottom: '10px' }}>
              {imageUrl ? '✅ IMAGE UPLOADED' : '📷 UPLOAD PHOTO'}
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px' }} />
            {uploading && <p>Uploading to Cloudinary...</p>}
            {imageUrl && <img src={imageUrl} style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', border: '2px solid var(--ink)' }} />}
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>ITEM NAME</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Bebas Neue', fontSize: '1.8rem' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>PRICE (£)</label>
              <input value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', fontFamily: 'Barlow', fontWeight: 'bold' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>CONDITION</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={{ width: '100%', padding: '12px', border: '3px solid var(--ink)', background: 'white' }}>
                <option>Mint</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>DESCRIPTION</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} required style={{ width: '100%', padding: '15px', border: '3px solid var(--ink)', fontFamily: 'Barlow' }} />
          </div>

          <button type="submit" disabled={loading || uploading} style={{ background: 'var(--ink)', color: 'white', padding: '20px', fontFamily: 'Bebas Neue', fontSize: '2rem', border: 'none', cursor: 'pointer', boxShadow: '8px 8px 0px var(--rust)' }}>
            {loading ? 'POSTING...' : 'LIST ITEM FOR SALE →'}
          </button>
        </form>
      </div>
    </div>
  );
}
