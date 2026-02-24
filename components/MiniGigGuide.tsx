"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MiniGigGuide() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIXED: Fetching from our new admin-only gig API
    fetch('/api/gigs')
      .then(res => res.json())
      .then(data => {
        setGigs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ 
      background: 'white', 
      border: '4px solid var(--ink)', 
      padding: '20px',
      boxShadow: '10px 10px 0px var(--rust)' 
    }}>
      <div style={{ borderBottom: '2px solid var(--ink)', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', margin: 0 }}>📅 UPCOMING GIGS</h2>
        <Link href="/features/gig-guide" style={{ fontSize: '0.7rem', color: 'var(--rust)', fontWeight: 'bold', textDecoration: 'none' }}>VIEW ALL →</Link>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem' }}>Scanning the city...</p>
      ) : gigs.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: '#666' }}>No gigs listed for this week.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {gigs.map((gig: any) => (
            <div key={gig.id} style={{ borderLeft: '3px solid var(--rust)', paddingLeft: '12px' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'IBM Plex Mono', color: '#666', textTransform: 'uppercase' }}>
                {new Date(gig.gig_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} @ {gig.venue}
              </div>
              <div style={{ fontWeight: 'bold', fontFamily: 'Playfair Display', fontSize: '1.1rem', color: 'var(--ink)' }}>
                {gig.artist}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
