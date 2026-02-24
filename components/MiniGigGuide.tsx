"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MiniGigGuide() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only the next 3 gigs from your database/api
    fetch('/api/threads?board=gigs&limit=3')
      .then(res => res.json())
      .then(data => {
        setGigs(data);
        setLoading(false);
      });
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
        <Link href="/boards/gigs" style={{ fontSize: '0.7rem', color: 'var(--rust)', fontWeight: 'bold' }}>VIEW ALL →</Link>
      </div>

      {loading ? (
        <p>Scanning the city...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {gigs.map((gig: any) => (
            <Link key={gig.id} href={`/threads/${gig.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ borderLeft: '3px solid var(--rust)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'IBM Plex Mono', color: '#666' }}>
                  {new Date(gig.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}
                </div>
                <div style={{ fontWeight: 'bold', fontFamily: 'Playfair Display', fontSize: '1.1rem' }}>
                  {gig.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
