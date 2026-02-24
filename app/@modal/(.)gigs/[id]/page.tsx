import Modal from '@/components/Modal';
import { sql } from '@/lib/db';

export default async function GigModal({ params }: { params: { id: string } }) {
  let gig = null;

  try {
    // FIXED: Convert the string ID from the URL into a strict Number for the database
    const gigId = Number(params.id); 
    const rows = await sql`SELECT * FROM gigs WHERE id = ${gigId}`;
    gig = rows[0];
  } catch (error) {
    console.error("Failed to fetch gig details:", error);
  }

  if (!gig) {
    return (
      <Modal>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display' }}>Listing not found or removed.</h2>
          <p style={{ color: '#666' }}>The ID passed was: {params.id}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold' }}>
          {new Date(gig.gig_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', margin: '5px 0 0 0', lineHeight: '1' }}>
          {gig.title}
        </h1>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0 0 0' }}>📍 {gig.venue}</p>
      </div>

      <div style={{ padding: '10px 20px', textAlign: 'center' }}>
        {gig.description ? (
          <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>{gig.description}</p>
        ) : (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No additional details provided.</p>
        )}
        
        <div style={{ marginTop: '30px' }}>
          {gig.price && (
            <a href={gig.price.startsWith('http') ? gig.price : '#'} target="_blank" rel="noopener noreferrer" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none', fontSize: '1rem', padding: '10px 25px' }}>
              {gig.price.startsWith('http') ? 'GET TICKETS →' : `TICKETS: ${gig.price}`}
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
