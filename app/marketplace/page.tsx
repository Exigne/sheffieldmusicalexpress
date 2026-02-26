export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm';

export default async function MarketplacePage() {
  // 1. Fetch only Gear from the dedicated table
  const listings = await sql`
    SELECT g.*, u.username 
    FROM gear_listings g
    JOIN users u ON g.user_id = u.id
    ORDER BY g.created_at DESC
  `;

  const boardRes = await sql`SELECT id FROM boards WHERE slug = 'gear-exchange' LIMIT 1`;
  const gearBoardId = boardRes[0]?.id;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ borderBottom: '10px solid var(--ink)', paddingBottom: '20px', marginBottom: '50px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '7rem', margin: 0, lineHeight: '0.8' }}>THE EXCHANGE</h1>
          <p style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)' }}>
            SHEFFIELD'S INDEPENDENT GEAR MARKET · NO FEES
          </p>
        </header>

        {/* 🛠️ GRID LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {listings.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', background: 'var(--paper)', border: '2px dashed var(--aged)' }}>
               <h2 style={{ fontFamily: 'Playfair Display' }}>The marketplace is currently empty.</h2>
               <p>Be the first to list some kit below!</p>
            </div>
          ) : (
            listings.map((item) => (
              <Link key={item.id} href={`/threads/${item.id}?type=gear`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ 
                  background: 'white', border: '4px solid var(--ink)', height: '100%',
                  display: 'flex', flexDirection: 'column', boxShadow: '8px 8px 0px var(--aged)',
                  transition: 'transform 0.2s'
                }}>
                  {item.image_url && (
                    <div style={{ height: '250px', background: '#111', borderBottom: '4px solid var(--ink)', overflow: 'hidden' }}>
                      <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: '25px', flexGrow: 1 }}>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'Bebas Neue', color: 'var(--rust)', lineHeight: '1' }}>{item.price}</div>
                    <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', margin: '10px 0' }}>{item.title}</h3>
                    <div style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', background: '#eee', display: 'inline-block', padding: '2px 8px' }}>
                      {item.condition}
                    </div>
                  </div>
                  <div style={{ padding: '15px 25px', borderTop: '1px solid #ddd', fontSize: '0.8rem', color: '#666' }}>
                    Listed by <strong>{item.username}</strong>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* ✍️ DEDICATED POSTING AREA */}
        <div id="sell" style={{ marginTop: '100px', padding: '50px', background: 'var(--paper)', border: '5px solid var(--ink)', boxShadow: '20px 20px 0px var(--aged)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', marginBottom: '30px' }}>SELL YOUR GEAR</h2>
          <CreateThreadForm boardId={gearBoardId} boardSlug="gear-exchange" />
        </div>
      </div>
    </div>
  );
}
