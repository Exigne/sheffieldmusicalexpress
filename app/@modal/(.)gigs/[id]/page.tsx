import Modal from '@/components/Modal';
import { sql } from '@/lib/db';

export default async function GigModal(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; 
  const rawId = params?.id; 

  let gig = null;

  try {
    const gigId = Number(rawId); 
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
        
        {/* UPDATED PRICE & BUTTON SECTION */}
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {gig.price && (
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--ink)' }}>
              TICKETS: {gig.price.includes('£') ? gig.price : `£${gig.price}`}
            </div>
          )}
          
          {gig.ticket_url && (
            <a href={gig.ticket_url} target="_blank" rel="noopener noreferrer" className="btn-submit" style={{ display: 'inline-block', textDecoration: 'none', fontSize: '1.1rem', padding: '12px 30px' }}>
              BUY TICKETS →
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
