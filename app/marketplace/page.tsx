export const dynamic = 'force-dynamic';
import { sql } from '@/lib/db';

export default async function MarketplacePage() {
  let items: any[] = [];

  try {
    // Fetching items from the table we created in Neon
    items = await sql`SELECT * FROM marketplace ORDER BY created_at DESC`;
  } catch (e) {
    console.error("Marketplace fetch error:", e);
  }

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* ADDED flexWrap AND gap HERE SO IT STACKS ON PHONES */}
        <header style={{ 
          borderBottom: '12px solid var(--ink)', 
          paddingBottom: '30px', 
          marginBottom: '60px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '20px', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end' 
        }}>
          <div>
            {/* ADDED clamp() FONT SIZE HERE */}
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(4rem, 12vw, 7rem)', margin: 0, lineHeight: '0.8' }}>
              GEAR EXCHANGE
            </h1>
            <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginTop: '10px' }}>
              BUY · SELL · TRADE LOCAL SHEFFIELD KIT
            </p>
          </div>
          <a href="/marketplace/post" style={{ 
            background: 'var(--ink)', 
            color: 'white', 
            padding: '15px 25px', 
            fontFamily: 'Bebas Neue', 
            fontSize: '1.5rem', 
            textDecoration: 'none', 
            boxShadow: '8px 8px 0px var(--rust)',
            whiteSpace: 'nowrap' // Keeps the button text on one line
          }}>
            + POST GEAR
          </a>
        </header>

        {items.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
            {items.map((item) => (
              <a href={`/marketplace/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
                <div style={{ background: 'white', border: '4px solid var(--ink)', boxShadow: '10px 10px 0px var(--aged)', overflow: 'hidden' }}>
                  
                  {item.is_sold && (
                    <div style={{ position: 'absolute', top: '20px', left: '-30px', background: 'var(--rust)', color: 'white', padding: '10px 40px', transform: 'rotate(-45deg)', fontFamily: 'Bebas Neue', fontSize: '2rem', zIndex: 10, border: '3px solid var(--ink)' }}>
                      SOLD
                    </div>
                  )}

                  <div style={{ height: '250px', background: '#eee' }}>
                    <img src={item.image_url || 'https://via.placeholder.com/300'} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: item.is_sold ? 'grayscale(100%)' : 'none' }} alt="" />
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--rust)' }}>{item.condition?.toUpperCase() || 'USED'}</span>
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>£{item.price}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', margin: '0 0 10px 0', lineHeight: '0.9' }}>{item.title}</h3>
                    <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', fontWeight: 'bold' }}>VIEW SPECS →</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0', border: '4px dashed var(--aged)' }}>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '1.2rem' }}>No gear for sale yet. Be the first to list something!</p>
          </div>
        )}
      </div>
    </div>
  );
}
