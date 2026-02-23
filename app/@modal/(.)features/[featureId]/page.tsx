export const dynamic = 'force-dynamic';

import Modal from '@/components/Modal';
import { sql } from '@/lib/db';

export default async function FeaturePopOut({ params }: { params: Promise<{ featureId: string }> }) {
  const { featureId } = await params;

  // 1. If the user clicks the Gig Guide, fetch the gigs from Neon!
  let gigs: any[] = [];
  if (featureId === 'gig-guide') {
    try {
      // Get all gigs from today onwards, sorted by closest date
      const result = await sql`
        SELECT * FROM gigs 
        WHERE gig_date >= CURRENT_DATE 
        ORDER BY gig_date ASC 
        LIMIT 10
      `;
      gigs = result || [];
    } catch (e) {
      console.log("Database fetch error or table missing");
    }
  }

  return (
    <Modal>
      {featureId === 'band-of-the-month' ? (
        <div>
          {/* HARDCODED BAND OF THE MONTH (We can hook this to SQL later!) */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--rust)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>🎸 Band of the Month</h2>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3rem', margin: 0 }}>The Lead Lungs</h1>
          </div>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
            <p>Hailing from the depths of S1, The Lead Lungs have spent the last six months tearing up every independent venue in the city. Their unique blend of heavy alt-rock and melodic choruses has earned them a loyal following.</p>
            <p><strong>Next Gig:</strong> This Friday @ Sidney & Matilda (EP Release Party)</p>
            <p><strong>Essential Track:</strong> "Steel City Smoke"</p>
          </div>
        </div>
      ) : (
        <div>
          {/* LIVE GIG GUIDE PULLED FROM NEON */}
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
                    {/* Formats date nicely: "Friday, 24 Nov" */}
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
        </div>
      )}
    </Modal>
  );
}
