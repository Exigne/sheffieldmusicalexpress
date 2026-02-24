import { sql } from '@/lib/db';
import Link from 'next/link';

export default async function GigFallbackPage({ params }: { params: { id: string } }) {
  let gig = null;

  try {
    const rows = await sql`SELECT * FROM gigs WHERE id = ${params.id}`;
    gig = rows[0];
  } catch (error) {
    console.error("Failed to fetch gig details:", error);
  }

  if (!gig) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', minHeight: '60vh' }}>
        <h2>Listing not found or removed.</h2>
        <Link href="/" style={{ color: 'var(--rust)', fontWeight: 'bold' }}>← Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '70vh' }}>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold' }}>
          {new Date(gig.gig_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', margin: '10px 0 0 0', lineHeight: '1' }}>
          {gig.title}
        </h1>
        <p style={{ fontWeight: 'bold', fontSize: '1.5rem', margin: '10px 0 0 0' }}>📍 {gig.venue}</p>
      </div>

      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'center' }}>
        {gig.description ? <p>{gig.description}</p> : <p style={{ color: '#666', fontStyle: 'italic' }}>No additional details provided.</p>}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        {gig.price && (
          <a href={gig.price.startsWith('http') ? gig.price : '#'} target="_blank" rel="noopener noreferrer" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none', padding: '15px 30px', fontSize: '1.2rem' }}>
            {gig.price.startsWith('http') ? 'GET TICKETS →' : `TICKETS: ${gig.price}`}
          </a>
        )}
      </div>
      
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold', color: 'var(--ink)', borderBottom: '2px solid var(--rust)', textDecoration: 'none' }}>
          ← Back to Sheffield Music Express
        </Link>
      </div>
    </div>
  );
}
