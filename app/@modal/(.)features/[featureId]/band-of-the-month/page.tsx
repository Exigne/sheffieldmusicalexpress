export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';

export default async function BandModal() {
  let band = null;

  try {
    // Fetch the single newest band from the database
    const rows = await sql`SELECT * FROM featured_bands ORDER BY created_at DESC LIMIT 1`;
    band = rows[0];
  } catch (error) {
    console.error("Failed to fetch Band of the Month:", error);
  }

  if (!band) {
    return (
      <Modal>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display' }}>No band featured this month.</h2>
          <p style={{ color: '#666' }}>Use the Admin Panel to feature a local artist!</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontFamily: 'IBM Plex Mono', color: 'var(--rust)', fontWeight: 'bold' }}>
          🎸 BAND OF THE MONTH
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: '5px 0 0 0', lineHeight: '1' }}>
          {band.name}
        </h1>
      </div>

      <div style={{ padding: '10px 20px' }}>
        <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333', textAlign: 'center', marginBottom: '30px' }}>
          {band.description}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '2px dashed var(--aged)', paddingTop: '20px' }}>
          <div style={{ background: 'var(--paper)', padding: '15px', border: '1px solid var(--aged)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>🎧 Essential Track</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: 'bold' }}>{band.essential_track || "TBA"}</div>
          </div>
          
          <div style={{ background: 'var(--paper)', padding: '15px', border: '1px solid var(--aged)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--rust)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>📅 Catch Them Live</div>
            <div style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem', fontWeight: 'bold' }}>{band.next_gig || "No upcoming dates"}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
