import Link from 'next/link';
import { sql } from '@/lib/db';

export default async function HomePage() {
  // We'll fetch the boards for the standard community section
  const boards = await sql`SELECT * FROM boards WHERE slug != 'gear-exchange' ORDER BY name ASC`;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* 🏛️ DASHBOARD HEADER */}
        <header style={{ marginBottom: '60px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', lineHeight: '0.8', margin: 0 }}>THE HUB</h1>
          <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--rust)', marginTop: '10px' }}>
            SHEFFIELD'S CENTRAL MUSIC DIRECTORY & COMMUNITY
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '50px', alignItems: 'start' }}>
          
          {/* 💬 LEFT COLUMN: COMMUNITY DISCUSSIONS */}
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', borderBottom: '6px solid var(--ink)', paddingBottom: '10px', marginBottom: '30px' }}>
              COMMUNITY BOARDS
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {boards.map((board) => (
                <Link key={board.id} href={`/boards/${board.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ 
                    padding: '30px', 
                    background: 'white', 
                    border: '3px solid var(--ink)', 
                    boxShadow: '8px 8px 0px var(--aged)',
                    transition: 'transform 0.1s'
                  }}>
                    <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 10px 0' }}>{board.name}</h3>
                    <p style={{ margin: 0, fontSize: '1rem', color: '#444', lineHeight: '1.4' }}>{board.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 🎸 RIGHT COLUMN: DEDICATED MARKETPLACE CARD */}
          <aside style={{ position: 'sticky', top: '120px' }}>
            <div style={{ 
              background: 'var(--ink)', 
              color: 'white', 
              padding: '50px 40px', 
              boxShadow: '15px 15px 0px var(--rust)',
              textAlign: 'center',
              border: '2px solid var(--rust)'
            }}>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '4.5rem', margin: 0, lineHeight: '0.9' }}>GEAR<br/>EXCHANGE</h2>
              <div style={{ 
                height: '4px', 
                background: 'var(--rust)', 
                width: '60px', 
                margin: '30px auto' 
              }}></div>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', marginBottom: '40px', lineHeight: '1.6', color: '#ccc' }}>
                Buy, sell, and trade instruments and equipment with musicians across the city. No fees, no fuss.
              </p>
              
              <Link href="/marketplace" style={{ 
                display: 'block', 
                background: 'var(--rust)', 
                color: 'white', 
                padding: '20px', 
                fontFamily: 'Bebas Neue', 
                fontSize: '2rem', 
                textDecoration: 'none',
                letterSpacing: '1px'
              }}>
                ENTER MARKETPLACE →
              </Link>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', border: '2px dashed var(--aged)', textAlign: 'center' }}>
               <p style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono', margin: 0 }}>
                 Looking for a rehearsal space? <br/>
                 <Link href="/directory" style={{ color: 'var(--rust)' }}>View the Directory</Link>
               </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
