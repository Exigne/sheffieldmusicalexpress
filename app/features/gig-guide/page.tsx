export const dynamic = 'force-dynamic'; // This kills the cache!

import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function GigGuidePage() {
  // Fetch data directly on the server
  const gigs = await sql`
    SELECT id, artist, venue, gig_date, description, ticket_url
    FROM gig_guide
    WHERE gig_date >= CURRENT_DATE
    ORDER BY gig_date ASC
  `;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px', borderBottom: '4px solid var(--ink)', paddingBottom: '20px' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', margin: 0 }}>LIVE GIG GUIDE</h1>
        <p style={{ color: 'var(--rust)', fontWeight: 'bold' }}>OFFICIAL SHEFFIELD LISTINGS</p>
      </div>

      {gigs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: '2px dashed var(--aged)' }}>
          <p>No upcoming shows found in the database.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {gigs.map((gig: any) => (
            <div key={gig.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '30px', borderBottom: '1px solid var(--aged)', paddingBottom: '30px' }}>
              <div style={{ textAlign: 'right', borderRight: '4px solid var(--rust)', paddingRight: '20px' }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', lineHeight: 1 }}>
                  {new Date(gig.gig_date).getDate()}
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '1rem', color: 'var(--rust)', fontWeight: 'bold' }}>
                  {new Date(gig.gig_date).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}
                </div>
              </div>

              <div>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', margin: '0 0 10px 0' }}>{gig.artist}</h2>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>📍 {gig.venue}</div>
                {gig.description && <p>{gig.description}</p>}
                {gig.ticket_url && (
                  <a href={gig.ticket_url} target="_blank" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    TICKETS →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
