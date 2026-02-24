"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MarketplacePage() {
  const [user, setUser] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Good");
  const [category, setCategory] = useState("Guitars");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // <-- NEW IMAGE STATE

  useEffect(() => {
    setUser(localStorage.getItem('sme_user'));
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/marketplace');
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handlePostItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seller: user, title, price, condition, category, description, image_url: imageUrl 
        })
      });

      if (res.ok) {
        setShowForm(false);
        // Reset form
        setTitle(""); setPrice(""); setDescription(""); setImageUrl(""); 
        fetchItems(); // Refresh the grid
      }
    } catch (err) {
      alert("Failed to post item.");
    }
  };

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4px solid var(--rust)', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <nav className="breadcrumb" style={{ marginBottom: '10px' }}>
              <Link href="/">Home</Link>
              <span className="breadcrumb-sep">›</span>
              <span style={{ color: 'var(--rust)' }}>Gear Exchange</span>
            </nav>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: 0 }}>The Gear Exchange</h1>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>Buy, sell, and trade with Sheffield's local scene.</p>
          </div>
          
          {user ? (
            <button onClick={() => setShowForm(!showForm)} className="btn-submit" style={{ background: showForm ? '#333' : 'var(--rust)' }}>
              {showForm ? "Cancel" : "+ List an Item"}
            </button>
          ) : (
            <Link href="/sign-in" className="btn-submit" style={{ textDecoration: 'none' }}>Sign In to Sell</Link>
          )}
        </div>

        {/* Sell Item Form */}
        {showForm && (
          <div style={{ background: 'var(--paper)', border: '1px solid var(--ink)', padding: '20px', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', marginTop: 0 }}>List your gear</h2>
            <form onSubmit={handlePostItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="text" className="form-input" placeholder="What are you selling? (e.g. Fender Stratocaster)" value={title} onChange={e => setTitle(e.target.value)} required />
                <input type="text" className="form-input" placeholder="Price (e.g. £450 or Trade)" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Guitars</option><option>Basses</option><option>Pedals & Effects</option><option>Amps</option><option>Drums</option><option>Synths & Keys</option><option>Studio / PA</option>
                </select>
                <select className="form-input" value={condition} onChange={e => setCondition(e.target.value)}>
                  <option>Brand New</option><option>Excellent</option><option>Good</option><option>Road Worn</option><option>Broken / For Parts</option>
                </select>
              </div>
              
              {/* <-- NEW IMAGE URL FIELD --> */}
              <div>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="Image Link (e.g. https://imgur.com/your-image.jpg)" 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)} 
                />
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
                  Optional: Paste a direct image link from sites like Imgur or Postimages.
                </div>
              </div>

              <textarea className="reply-textarea" rows={3} placeholder="Describe the item, modifications, and why you are selling..." value={description} onChange={e => setDescription(e.target.value)} required />
              <button type="submit" className="btn-submit" style={{ alignSelf: 'flex-start' }}>Post Listing</button>
            </form>
          </div>
        )}

        {/* The Gear Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Loading the exchange...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: 'var(--paper)', border: '1px dashed var(--aged)' }}>
            No gear listed right now. Be the first to clear out your practice space!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {items.map(item => (
              <div key={item.id} style={{ border: '1px solid var(--aged)', background: 'var(--paper)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* <-- NEW IMAGE RENDERER --> */}
                {item.image_url ? (
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#eee', backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--aged)' }} />
                ) : (
                  <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--paper-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--aged)', color: '#999', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    No image provided
                  </div>
                )}
                
                <div style={{ padding: '15px', borderBottom: '1px solid var(--aged)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold' }}>{item.category}</div>
                    <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', margin: '0 0 5px 0', lineHeight: '1.2' }}>{item.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--rust)', fontWeight: 'bold' }}>{item.price}</div>
                  </div>
                </div>
                
                <div style={{ padding: '15px', flexGrow: 1, fontSize: '0.9rem', color: '#444', lineHeight: '1.5' }}>
                  <p style={{ margin: '0 0 10px 0' }}>{item.description}</p>
                  <span style={{ display: 'inline-block', background: '#f5f5f5', padding: '3px 8px', borderRadius: '3px', fontSize: '0.75rem', border: '1px solid #ddd' }}>
                    Condition: {item.condition}
                  </span>
                </div>
                
                <div style={{ padding: '15px', background: '#fdfdfc', borderTop: '1px solid var(--aged)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Seller: <Link href={`/profile/${item.seller_username}`} style={{ color: 'var(--rust)', fontWeight: 'bold', textDecoration: 'none' }}>{item.seller_username}</Link>
                  </div>
                  
                  {user && user !== item.seller_username && (
                    <Link href={`/inbox?chat=${item.seller_username}`} className="btn-submit" style={{ padding: '5px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                      ✉️ Make Offer
                    </Link>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
