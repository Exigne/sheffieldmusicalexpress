export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensures the marketplace is always live and never cached

import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm';

export default async function MarketplacePage() {
  // 1. Fetch all listings from our dedicated gear table
  const listings = await sql`
    SELECT g.*, u.username 
    FROM gear_listings g
    JOIN users u ON g.user_id = u.id
    ORDER BY g.created_at DESC
  `;

  // 2. Find the board ID for 'gear-exchange' to ensure the form posts to the right place
  const boardRes = await sql`SELECT id FROM boards WHERE slug = 'gear-exchange' LIMIT 1`;
  const gearBoardId = boardRes[0]?.id;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 📢 MARKETPLACE HEADER */}
        <header style={{ 
          borderBottom: '12px solid var(--ink)', 
          paddingBottom: '30px', 
          marginBottom: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '8rem', margin: 0, lineHeight: '0.8' }}>THE EXCHANGE</h1>
            <p style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginTop: '10px' }}>
              SHEFFIELD'S INDEPENDENT GEAR MARKET · NO FEES
            </p>
          </div>
          <a href="#post-advert" style={{ 
            background: 'var(--rust)', 
            color: 'white', 
            padding: '15px 30px', 
            fontFamily: 'Bebas Neue', 
            fontSize: '1.5rem', 
            textDecoration: 'none',
            boxShadow: '6px 6px 0px var(--ink)'
          }}>
            + LIST YOUR GEAR
          </a>
        </header>

        {/* 🛒 THE LISTINGS GRID */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '40px' 
        }}>
          {listings.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '100px', textAlign: 'center', background: 'var(--paper)', border: '3px dashed var(--aged)' }}>
               <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem' }}>NO LISTINGS YET</h2>
               <p style={{ fontFamily: 'IBM Plex Mono' }}>Be the first to post gear in the exchange below.</p>
            </div>
          ) : (
            listings.map((item) => (
              <Link 
                key={item.id} 
                href={`/threads/${item.id}?type=gear`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ 
                  background: 'white', 
                  border: '4px solid var(--ink)', 
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: '10px 10px 0px var(--aged)',
                  transition: 'transform 0.2s ease'
                }}>
                  {/* Image Container */}
                  <div style={{ 
                    height: '280px', 
                    background: '#111', 
                    borderBottom: '4px solid var(--ink)', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ color: '#444', fontFamily: 'Bebas Neue', fontSize: '2rem' }}>NO PHOTO</span>
                    )}
                  </div>

                  {/* Details Container */}
                  <div style={{ padding: '25px', flexGrow: 1 }}>
                    <div style={{ 
                      fontSize: '2.8rem', 
                      fontFamily: 'Bebas Neue', 
                      color: 'var(--rust)', 
                      lineHeight: '1',
                      marginBottom: '10px'
                    }}>
                      {item.price || 'TBC'}
                    </div>
                    <h3 style={{ 
                      fontFamily: 'Bebas Neue', 
                      fontSize: '1.8rem', 
                      margin: '0 0 15px 0',
                      lineHeight: '1.1',
                      height: '2.2em',
                      overflow: 'hidden'
                    }}>
                      {item.title}
                    </h3>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'IBM Plex Mono', 
                      fontWeight: 'bold', 
                      background: 'var(--ink)', 
                      color: 'white',
                      display: 'inline-block', 
                      padding: '4px 10px',
                      textTransform: 'uppercase'
                    }}>
                      {item.condition}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ 
                    padding: '15px 25px', 
                    borderTop: '1px solid #ddd', 
                    fontSize: '0.8rem', 
                    fontFamily: 'IBM Plex Mono',
                    color: '#666',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>BY {item.username?.toUpperCase()}</span>
                    <span>VIEW ADVERT →</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* ✍️ POSTING SECTION */}
        <div id="post-advert" style={{ 
          marginTop: '120px', 
          padding: '60px', 
          background: 'var(--paper)', 
          border: '6px solid var(--ink)',
          boxShadow: '20px 20px 0px var(--aged)' 
        }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', marginBottom: '10px' }}>SELL YOUR GEAR</h2>
          <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', marginBottom: '40px', color: 'var(--rust)' }}>
            FILL IN THE DETAILS BELOW TO PUBLISH YOUR ADVERT
          </p>
          
          <CreateThreadForm 
            boardId={gearBoardId} 
            boardSlug="gear-exchange" 
          />
        </div>

      </div>
    </div>
  );
}
