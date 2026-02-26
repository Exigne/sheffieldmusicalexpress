export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm';

export default async function BoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch Board Info
  const boardRes = await sql`SELECT * FROM boards WHERE slug = ${slug} LIMIT 1`;
  const board = boardRes[0];

  if (!board) return <div className="page-wrapper">Board not found.</div>;

  const isGear = slug === 'gear-exchange';

  // 2. Fetch Items (Branching based on table)
  let items: any[] = [];
  if (isGear) {
    items = await sql`
      SELECT g.*, u.username 
      FROM gear_listings g
      JOIN users u ON g.user_id = u.id
      WHERE g.board_id = ${board.id}
      ORDER BY g.created_at DESC
    `;
  } else {
    items = await sql`
      SELECT t.*, u.username 
      FROM threads t
      JOIN users u ON t.user_id = u.id
      WHERE t.board_id = ${board.id}
      ORDER BY t.created_at DESC
    `;
  }

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: "1fr" }}>
      <div className="content-area" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <header style={{ borderBottom: '5px solid var(--ink)', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem', margin: 0 }}>{board.name}</h1>
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#444' }}>{board.description}</p>
        </header>

        {/* LISTING GRID / LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.map((item) => (
            <Link 
              key={item.id} 
              href={`/threads/${item.id}?type=${isGear ? 'gear' : 'thread'}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ 
                background: 'white', 
                border: '3px solid var(--ink)', 
                padding: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '6px 6px 0px var(--aged)'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'Bebas Neue' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>By {item.username}</div>
                </div>
                {isGear && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--rust)', fontSize: '1.4rem' }}>{item.price}</div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>{item.condition}</div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* CREATE FORM */}
        <div style={{ marginTop: '60px', padding: '40px', background: 'var(--paper)', border: '4px solid var(--ink)' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem' }}>
            {isGear ? 'Create a New Gear Listing' : 'Start a New Discussion'}
          </h2>
          <CreateThreadForm boardId={board.id} boardSlug={board.slug} />
        </div>
      </div>
    </div>
  );
}
