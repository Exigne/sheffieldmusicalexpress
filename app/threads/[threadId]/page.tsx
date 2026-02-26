export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { sql } from '@/lib/db';
import PostReplyForm from '@/components/PostReplyForm';
import Link from 'next/link';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // 1. Check the dedicated Gear Table first
  const gearRes = await sql`
    SELECT g.*, u.username, b.name as board_name, b.slug as board_slug
    FROM gear_listings g 
    JOIN users u ON g.user_id = u.id 
    JOIN boards b ON g.board_id = b.id
    WHERE g.id = ${threadId} LIMIT 1
  `;
  const gear = gearRes[0];

  if (gear) {
    return (
      <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
        <div className="content-area" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link href="/marketplace">Marketplace</Link>
          </nav>

          <div style={{ 
            background: 'white', border: '6px solid var(--ink)', display: 'grid', 
            gridTemplateColumns: gear.image_url ? '1.3fr 1fr' : '1fr',
            boxShadow: '25px 25px 0px var(--rust)', marginBottom: '60px' 
          }}>
            {gear.image_url && (
              <div style={{ background: '#000', borderRight: '6px solid var(--ink)', display: 'flex', alignItems: 'center' }}>
                <img src={gear.image_url} style={{ width: '100%', height: 'auto' }} alt="Listing" />
              </div>
            )}
            <div style={{ padding: '60px' }}>
              <div style={{ background: 'var(--rust)', color: 'white', padding: '6px 18px', fontFamily: 'Bebas Neue', fontSize: '1.4rem', marginBottom: '20px', display: 'inline-block' }}>
                GEAR FOR SALE
              </div>
              <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '6rem', lineHeight: '0.8', margin: '0 0 25px 0' }}>{gear.title}</h1>
              
              <div style={{ borderTop: '5px solid var(--ink)', borderBottom: '5px solid var(--ink)', padding: '30px 0', margin: '30px 0' }}>
                <div style={{ fontSize: '4.5rem', fontWeight: 'bold', color: 'var(--ink)', lineHeight: '1' }}>{gear.price}</div>
                <div style={{ fontSize: '1.2rem', fontFamily: 'IBM Plex Mono', marginTop: '10px' }}>CONDITION: <strong>{gear.condition}</strong></div>
              </div>

              <p style={{ fontSize: '1.5rem', lineHeight: '1.6', fontFamily: 'Barlow', whiteSpace: 'pre-wrap', color: '#111' }}>
                {gear.description}
              </p>

              <div style={{ marginTop: '50px', color: '#666', fontFamily: 'IBM Plex Mono', fontSize: '0.9rem' }}>
                Posted by <span style={{color: 'var(--rust)', fontWeight: 'bold'}}>{gear.username}</span>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: '800px' }}>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem', marginBottom: '20px' }}>Questions & Offers</h2>
            <PostReplyForm threadId={Number(threadId)} />
          </div>
        </div>
      </div>
    );
  }

  // 2. Fallback to standard threads
  const threadRes = await sql`SELECT t.*, u.username FROM threads t JOIN users u ON t.user_id = u.id WHERE t.id = ${threadId} LIMIT 1`;
  const thread = threadRes[0];

  if (!thread) return <div className="page-wrapper" style={{textAlign: 'center', padding: '100px'}}><h1 style={{fontFamily: 'Bebas Neue'}}>NOT FOUND</h1><Link href="/">Back Home</Link></div>;

  const posts = await sql`SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.thread_id = ${threadId} ORDER BY p.created_at ASC`;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', borderBottom: '5px solid var(--ink)' }}>{thread.title}</h1>
        <div style={{ marginTop: '30px' }}>
           {posts.map(p => <div key={p.id} style={{marginBottom: '20px'}}><small>{p.username}</small><p>{p.body}</p></div>)}
        </div>
        <PostReplyForm threadId={thread.id} />
      </div>
    </div>
  );
}
