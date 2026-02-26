export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadModal from '@/components/CreateThreadModal';

export default async function BoardPage({ params }: { params: Promise<{ slug?: string, boardSlug?: string }> }) {
  // FIX 1: Safely grab the slug whether your folder is named [slug] OR [boardSlug]
  const resolvedParams = await params;
  const slug = resolvedParams.slug || resolvedParams.boardSlug;
  
  // FIX 2: Use ILIKE so 'albums' and 'Albums' both match successfully
  const boardRes = await sql`SELECT * FROM boards WHERE slug ILIKE ${slug} LIMIT 1`;
  const board = boardRes[0];
  
  if (!board) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '100px' }}>
         <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem' }}>BOARD NOT FOUND</h1>
         <p style={{ fontFamily: 'IBM Plex Mono', marginBottom: '30px' }}>We couldn't find a board matching "{slug}".</p>
         <Link href="/" style={{ padding: '10px 20px', background: 'var(--ink)', color: 'white', textDecoration: 'none', fontFamily: 'Bebas Neue', fontSize: '1.5rem' }}>
           ← BACK TO DASHBOARD
         </Link>
      </div>
    );
  }
  
  const isGear = board.slug === 'gear-exchange';

  const items = isGear 
    ? await sql`
        SELECT g.id, g.title, g.price, g.condition, g.created_at, u.username 
        FROM gear_listings g 
        JOIN users u ON g.user_id = u.id 
        WHERE g.board_id = ${board.id} 
        ORDER BY g.created_at DESC`
    : await sql`
        SELECT t.id, t.title, t.created_at, u.username 
        FROM threads t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.board_id = ${board.id} 
        ORDER BY t.created_at DESC`;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr', background: 'var(--aged)', minHeight: '100vh' }}>
      <div className="content-area" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* BREADCRUMB NAVIGATION */}
        <nav style={{ marginBottom: '20px', fontFamily: 'IBM Plex Mono', fontSize: '0.8rem' }}>
          <Link href="/" style={{ color: 'inherit' }}>HOME</Link>
          <span style={{ margin: '0 10px', color: 'var(--rust)' }}>/</span>
          <span>{board.name.toUpperCase()}</span>
        </nav>

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', marginBottom: '30px', lineHeight: '0.9' }}>
          {board.name}
        </h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.length === 0 ? (
            <div style={{ padding: '40px', background: 'white', border: '3px dashed var(--ink)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'IBM Plex Mono' }}>No posts yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            items.map((item) => (
              <Link 
                key={item.id} 
                href={`/threads/${item.id}?type=${isGear ? 'gear' : 'thread'}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
                prefetch={false}
              >
                <div style={{ background: 'white', border: '3px solid var(--ink)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '6px 6px 0px var(--aged)', transition: 'transform 0.1s' }}>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'Bebas Neue', fontSize: '2rem' }}>{item.title}</h3>
                    <div style={{ fontSize: '0.8rem', fontFamily: 'IBM Plex Mono' }}>By {item.username}</div>
                  </div>
                  {isGear ? (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--rust)', fontWeight: 'bold', fontSize: '1.8rem', fontFamily: 'Bebas Neue' }}>{item.price || 'TBC'}</div>
                      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.condition}</div>
                    </div>
                  ) : (
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: 'var(--ink)' }}>VIEW →</div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* POSTING SECTION */}
        <div style={{ marginTop: '60px', padding: '40px', background: 'white', border: '4px solid var(--ink)', boxShadow: '12px 12px 0px var(--rust)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', marginBottom: '20px' }}>START A NEW THREAD</h2>
          <CreateThreadModal boardId={board.id} boardSlug={board.slug} />
        </div>
      </div>
    </div>
  );
}
