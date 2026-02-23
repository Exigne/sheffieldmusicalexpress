import Modal from '@/components/Modal';

export default async function FeaturePopOut({ params }: { params: Promise<{ featureId: string }> }) {
  const { featureId } = await params;

  return (
    <Modal>
      {featureId === 'band-of-the-month' ? (
        <div>
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
          <div style={{ textAlign: 'center', borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--rust)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>📅 The Local Scene</h2>
            <h1 style={{ fontFamily: 'Playfair Display', fontSize: '2.5rem', margin: 0 }}>Weekend Gig Guide</h1>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '15px', background: 'var(--paper)', borderLeft: '4px solid var(--rust)' }}>
              <h3 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display' }}>Friday: Local Indie Showcase</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#555' }}>Five of Sheffield's best upcoming indie bands sharing one stage. Get down early.</p>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>📍 Washington | 🕗 8:00 PM | 🎟️ Free Entry</div>
            </div>
            
            <div style={{ padding: '15px', background: 'var(--paper)', borderLeft: '4px solid var(--rust)' }}>
              <h3 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display' }}>Saturday: Heavy Riffs All-Dayer</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#555' }}>10 hours of non-stop doom, sludge, and heavy rock. Earplugs highly recommended.</p>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>📍 Record Junkee | 🕑 2:00 PM | 🎟️ £10 OTD</div>
            </div>

            <div style={{ padding: '15px', background: 'var(--paper)', borderLeft: '4px solid var(--rust)' }}>
              <h3 style={{ margin: '0 0 5px 0', fontFamily: 'Playfair Display' }}>Sunday: Acoustic Open Mic</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#555' }}>Wind down your weekend with a pint and local acoustic talent. Bring your guitar to sign up.</p>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>📍 The Broadfield | 🕖 7:00 PM | 🎟️ Free Entry</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
