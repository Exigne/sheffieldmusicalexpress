export const dynamic = 'force-dynamic';
import { sql } from '@/lib/db';
import Link from 'next/link';
import CreateThreadForm from '@/components/CreateThreadForm';

export default async function BoardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boardRes = await sql`SELECT * FROM boards WHERE slug = ${slug} LIMIT 1`;
  const board = boardRes[0];

  if (!board) return <div>Board not found.</div>;

  const isGear = slug === 'gear-exchange';

  // Fetch from the correct table based on the board
  const items = isGear 
    ? await sql`SELECT g.*, u.username FROM gear_listings g JOIN users u ON g.user_id = u.id WHERE g.board_id = ${board.id} ORDER BY g.created_at DESC`
    : await sql`SELECT t.*, u.username FROM threads t JOIN users u ON t.user_id = u.id WHERE t.board_id = ${board.id} ORDER BY t.created_at DESC`;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '5rem' }}>{board.name}</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {items.map((item) => (
            <Link key={item.id} href={`/threads/${item.id}?type=${isGear ? 'gear' : 'thread'}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '3px solid var(--ink)', padding: '20px', display: 'flex', justifyContent: 'space-between', boxShadow: '6px 6px 0px var(--aged)' }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'Bebas Neue', fontSize: '1.8rem' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.8rem' }}>Posted by {item.username}</div>
                </div>
                {isGear && <div style={{ fontWeight: 'bold', color: 'var(--rust)', fontSize: '1.5rem' }}>{item.price}</div>}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '50px', padding: '30px', background: 'var(--paper)', border: '4px solid var(--ink)' }}>
          <CreateThreadForm boardId={board.id} boardSlug={board.slug} />
        </div>
      </div>
    </div>
  );
}
