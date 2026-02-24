"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GigGuidePage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from the API we're about to double-check/create
    fetch('/api/gigs')
      .then(res => res.json())
      .then(data => {
        setGigs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px', borderBottom: '4px solid var(--ink)', paddingBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', margin: 0, letterSpacing: '2px' }}>LIVE GIG GUIDE</h1>
        <p style={{ color: 'var(--rust)', fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'uppercase' }}>
          The Definitive Sheffield Listings
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', fontFamily: 'IBM Plex Mono' }}>SCANNING THE CITY...</div>
      ) : gigs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed var(--aged)', background: 'white' }}>
          <h3 style={{ fontFamily: 'Playfair Display' }}>No Shows Currently Listed</h3>
          <p>Check back soon—the scene never sleeps for long.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {gigs.map((gig: any) => (
            <div key={gig.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '150px 1fr', 
              gap: '30px',
              borderBottom: '1px solid var(--aged)',
              paddingBottom: '30px'
            }}>
              {/* DATE COLUMN */}
              <div style={{ textAlign: 'right', borderRight: '4px solid var(--rust)', paddingRight: '20px' }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', lineHeight: 1 }}>
                  {new Date(gig.gig_date).getDate()}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '1rem', color: 'var(--rust)', fontWeight: 'bold' }}>
                  {new Date(gig.gig_date).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}
                </div>
              </div>

              {/* INFO COLUMN */}
              <div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', margin: '0 0 10px 0' }}>{gig.artist}</h2>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>📍 {gig.venue}</div>
                {gig.description && <p style={{ color: '#444', lineHeight: '1.6' }}>{gig.description}</p>}
                
                {gig.ticket_url && (
                  <a href={gig.ticket_url} target="_blank" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '10px' }}>
                    TICKETS / INFO →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '80px', textAlign: 'center' }}>
        <Link href="/" style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid var(--rust)' }}>
          ← RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
