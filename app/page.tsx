import Link from 'next/link';
import { sql } from '@/lib/db';

export default async function HomePage() {
  const boards = await sql`SELECT * FROM boards WHERE slug != 'gear-exchange' ORDER BY name ASC`;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        <header style={{ marginBottom: '60px' }}>
          {/* NOTICE THE clamp() FONT SIZE HERE */}
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(4rem, 15vw, 6rem)', lineHeight: '0.8', margin: 0 }}>THE HUB</h1>
          <p style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--rust)', marginTop: '10px' }}>
            SHEFFIELD'S CENTRAL MUSIC DIRECTORY & COMMUNITY
          </p>
        </header>

        {/* NOTICE THE NEW mobile-dashboard-grid CLASS HERE */}
        <div className="mobile-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '50px', alignItems: 'start' }}>
          
          {/* COMMUNITY BOARDS */}
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', borderBottom: '6px solid var(--ink)', paddingBottom: '10px', marginBottom: '30px' }}>
              COMMUNITY BOARDS
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {boards.map((board) => (
                <Link key={board.id} href={`/boards/${board.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ padding: '30px', background: 'white', border: '3px solid var(--ink)', boxShadow: '8px 8px 0px var(--aged)' }}>
                    <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', margin: '0 0 10px 0' }}>{board.name}</h3>
                    <p style={{ margin: 0, fontSize: '1rem', color: '#444' }}>{board.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 📰 NEW ARTICLES CARD */}
          <aside style={{ position: 'sticky', top: '120px' }}>
            <div style={{ 
              background: 'var(--ink)', 
              color: 'white', 
              padding: '50px 40px', 
              boxShadow: '15px 15px 0px var(--rust)',
              textAlign: 'center',
              border: '2px solid var(--rust)'
            }}>
              {/* NOTICE THE clamp() FONT SIZE HERE */}
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3.5rem, 12vw, 4.5rem)', margin: 0, lineHeight: '0.9' }}>SME<br/>ARTICLES</h2>
              <div style={{ height: '4px', background: 'var(--rust)', width: '60px', margin: '30px auto' }}></div>
              <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.9rem', marginBottom: '40px', color: '#ccc' }}>
                Interviews, gig reviews, and the latest news from the Sheffield music scene.
              </p>
              
              <Link href="/articles" style={{ 
                display: 'block', 
                background: 'var(--rust)', 
                color: 'white', 
                padding: '20px', 
                fontFamily: 'Bebas Neue', 
                fontSize: '2rem', 
                textDecoration: 'none'
              }}>
                READ ARTICLES →
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
