export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';

export default async function FeaturePopOut({ params }: { params: Promise<{ featureId: string }> }) {
  const { featureId } = await params;

  // 1. Fetch Band of the Month if requested
  if (featureId === 'band-of-the-month') {
    let band = null;
    try {
      const bandRes = await sql`SELECT * FROM featured_bands ORDER BY created_at DESC LIMIT 1`;
      band = bandRes[0];
    } catch(e) {}
    
    if (!band) return <Modal><div style={{padding: '30px', textAlign: 'center'}}>No band set yet.</div></Modal>;

    return (
      <Modal>
        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--rust)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>🎸 Band of the Month</h2>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', margin: 0 }}>{band.name}</h1>
        </div>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
          <p>{band.description}</p>
          <div style={{ marginTop: '20px', padding: '15px', background: 'var(--paper)', borderLeft: '4px solid var(--rust)' }}>
            <p style={{ margin: '0 0 10px 0' }}><strong>Next Gig:</strong> {band.next_gig}</p>
            <p style={{ margin: 0 }}><strong>Essential Track:</strong> {band.essential_track}</p>
          </div>
        </div>
      </Modal>
    );
  }

  // 2. Fetch Live Gig Guide if requested
  if (featureId === 'gig-guide') {
    let gigs: any[] = [];
    try {
      const result = await sql`
        SELECT * FROM gigs 
        WHERE gig_date >= CURRENT_DATE 
        ORDER BY gig_date ASC 
        LIMIT 10
      `;
      gigs = result || [];
    } catch (e) {}

    return (
      <Modal>
        <div style={{ textAlign: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--rust)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>📅 The Local Scene</h2>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: 0 }}>Live Gig Guide</h1>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {gigs.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No upcoming gigs announced yet. Check back soon!
            </p>
          ) : (
            gigs.map((gig: any) => (
              <div key={gig.id} style={{ padding: '15px', background: 'var(--paper)', borderLeft: '4px solid var(--rust)' }}>
                <h3 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display', color: 'var(--ink)' }}>
                  {new Date(gig.gig_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}: {gig.title}
                </h3>
                {gig.description && (
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#555' }}>{gig.description}</p>
                )}
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--rust)' }}>
                  📍 {gig.venue} | 🎟️ {gig.price}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    );
  }

  return null;
}
