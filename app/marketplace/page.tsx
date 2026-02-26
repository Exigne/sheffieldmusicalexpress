export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm';

export default async function MarketplacePage() {
  // 1. Wrap the DB calls in a try/catch or ensure defaults
  let listings: any[] = [];
  let gearBoardId = 0;

  try {
    const data = await sql`
      SELECT g.*, u.username 
      FROM gear_listings g
      JOIN users u ON g.user_id = u.id
      ORDER BY g.created_at DESC
    `;
    listings = data || [];

    const boardRes = await sql`SELECT id FROM boards WHERE slug = 'gear-exchange' LIMIT 1`;
    gearBoardId = boardRes[0]?.id || 0;
  } catch (e) {
    console.error("Database Error:", e);
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', minHeight: '100vh', background: 'var(--paper)' }}>
      <div className="content-area" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        <header style={{ borderBottom: '10px solid var(--ink)', paddingBottom: '20px', marginBottom: '50px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(4rem, 10vw, 7rem)', margin: 0, lineHeight: '0.8' }}>
            THE EXCHANGE
          </h1>
          <p style={{ fontSize: '1.1rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginTop: '10px' }}>
            LOCAL GEAR · NO FEES · SHEFFIELD ONLY
          </p>
        </header>

        {/* 🛠️ GRID LAYOUT */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '30px' 
        }}>
          {listings.length > 0 ? (
            listings.map((item) => (
              <Link 
                key={item.id} 
                href={`/threads/${item.id}?type=gear`} 
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{ 
                  background: 'white', border: '4px solid var(--ink)', height: '100%',
                  display: 'flex', flexDirection: 'column', boxShadow: '8px 8px 0px var(--aged)'
                }}>
                  {item.image_url ? (
                    <div style={{ height: '220px', background: '#111', borderBottom: '4px solid var(--ink)', overflow: 'hidden' }}>
                      <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: '220px', background: '#eee', borderBottom: '4px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: '#999' }}>NO IMAGE</span>
                    </div>
                  )}
                  <div style={{ padding: '20px', flexGrow: 1 }}>
                    <div style={{ fontSize: '2.2rem', fontFamily: 'Bebas Neue', color: 'var(--rust)', lineHeight: '1' }}>
                      {item.price || 'FREE / TRADE'}
                    </div>
                    <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', margin: '10px 0', lineHeight: '1.1' }}>{item.title}</h3>
                    <div style={{ fontSize: '0.7rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', background: '#000', color: 'white', display: 'inline-block', padding: '2px 8px' }}>
                      {item.condition}
                    </div>
                  </div>
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #ddd', fontSize: '0.75rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
                    By {item.username?.toUpperCase()}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', border: '3px dashed var(--aged)' }}>
              <p style={{ fontFamily: 'IBM Plex Mono' }}>No listings found. Be the first to sell gear below.</p>
            </div>
          )}
        </div>

        {/* ✍️ POSTING SECTION */}
        <div id="sell" style={{ marginTop: '100px', padding: '40px', background: 'white', border: '5px solid var(--ink)', boxShadow: '15px 15px 0px var(--aged)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', marginBottom: '20px' }}>SELL YOUR GEAR</h2>
          {gearBoardId !== 0 && (
            <CreateThreadForm boardId={gearBoardId} boardSlug="gear-exchange" />
          )}
        </div>
      </div>
    </div>
  );
}
