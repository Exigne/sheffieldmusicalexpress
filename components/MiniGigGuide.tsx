"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MiniGigGuide() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gigs')
      .then(res => res.json())
      .then(data => {
        // We only want the top 3 for the sidebar
        setGigs(data.slice(0, 3));
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="sidebar-widget">Loading Gigs...</div>;

  return (
    <div className="sidebar-widget">
      <div className="widget-header">📅 UPCOMING GIGS</div>
      <div className="widget-body" style={{ padding: '15px' }}>
        {gigs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {gigs.map((gig: any) => (
              <div key={gig.id} style={{ borderLeft: '3px solid var(--rust)', paddingLeft: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
                  {new Date(gig.gig_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()} @ {gig.venue}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', fontFamily: 'Playfair Display' }}>
                  {gig.artist}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem' }}>No gigs found.</p>
        )}
        <Link href="/features/gig-guide" style={{ display: 'block', marginTop: '15px', fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textDecoration: 'none' }}>
          VIEW FULL CALENDAR →
        </Link>
      </div>
    </div>
  );
}
