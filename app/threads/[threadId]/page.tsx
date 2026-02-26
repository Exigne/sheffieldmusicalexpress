export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import PostReplyForm from '@/components/PostReplyForm';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // 1. Fetch thread + board info in one go
  const threadRes = await sql`
    SELECT 
      t.*, 
      b.slug AS board_slug, 
      b.name AS board_name, 
      u.username 
    FROM threads t 
    JOIN boards b ON t.board_id = b.id
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ${threadId} 
    LIMIT 1
  `;
  const thread = threadRes[0];

  if (!thread) return <div className="page-wrapper">Thread not found.</div>;

  const posts = await sql`
    SELECT p.*, u.username 
    FROM posts p 
    JOIN users u ON p.user_id = u.id
    WHERE p.thread_id = ${threadId} 
    ORDER BY p.created_at ASC
  `;

  // 2. The Critical Check (Must match your DB slug exactly)
  const isGearListing = thread.board_slug === 'gear-exchange';

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name}</Link>
        </nav>

        {/* 🎸 THE ADVERT HEADER */}
        {isGearListing ? (
          <div style={{ 
            background: 'var(--paper)', 
            border: '4px solid var(--ink)', 
            marginBottom: '40px',
            boxShadow: '12px 12px 0px var(--rust)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: thread.image_url ? '1fr 1fr' : '1fr' }}>
              
              {thread.image_url && (
                <div style={{ borderRight: '4px solid var(--ink)', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={thread.image_url} alt="Item" style={{ width: '100%', height: 'auto' }} />
                </div>
              )}

              <div style={{ padding: '40px' }}>
                <div style={{ background: 'var(--rust)', color: 'white', display: 'inline-block', padding: '4px 10px', fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginBottom: '10px' }}>
                  GEAR FOR SALE
                </div>
                <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', lineHeight: '1', margin: '0 0 15px 0' }}>{thread.title}</h1>
                
                <div style={{ display: 'flex', gap: '30px', margin: '20px 0', borderTop: '2px solid var(--ink)', paddingTop: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Price</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{thread.price || 'TBC'}</div>
                  </div>
                  <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '30px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' }}>Condition</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{thread.condition || 'Used'}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#999' }}>Listed by {thread.username}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard fallback */
          <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: 0 }}>{thread.title}</h1>
          </div>
        )}

        {/* 💬 DESCRIPTION & REPLIES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {posts.map((post: any, index: number) => (
            <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--ink)', color: 'white', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {post.username.slice(0,2).toUpperCase()}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{post.username}</div>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'Barlow', fontSize: '1.1rem' }}>
                {isGearListing && index === 0 && <strong style={{color: 'var(--rust)', display: 'block', marginBottom: '10px'}}>DESCRIPTION:</strong>}
                {post.body}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '50px', padding: '30px', background: 'var(--paper)', border: '2px solid var(--ink)' }}>
          <PostReplyForm threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
