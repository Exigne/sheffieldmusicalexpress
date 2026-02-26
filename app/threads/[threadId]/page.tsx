export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import PostReplyForm from '@/components/PostReplyForm';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // 1. Fetch thread details (We include ALL columns with t.*)
  const threadRes = await sql`
    SELECT t.*, b.slug as board_slug, b.name as board_name, u.username 
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

  const isGearListing = thread.board_slug === 'gear-exchange';

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name}</Link>
        </nav>

        {/* 🎸 THE "PROPER ADVERT" HEADER */}
        {isGearListing ? (
          <div style={{ 
            background: 'var(--paper)', 
            border: '4px solid var(--ink)', 
            marginBottom: '40px',
            boxShadow: '12px 12px 0px var(--aged)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: thread.image_url ? '1.2fr 1fr' : '1fr', gap: '0' }}>
              
              {/* Image Section */}
              {thread.image_url && (
                <div style={{ borderRight: '4px solid var(--ink)', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img 
                    src={thread.image_url} 
                    alt={thread.title} 
                    style={{ width: '100%', height: 'auto', display: 'block' }} 
                  />
                </div>
              )}

              {/* Data Section */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ background: 'var(--rust)', color: 'white', display: 'inline-block', padding: '4px 12px', fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginBottom: '15px', alignSelf: 'flex-start' }}>
                  GEAR FOR SALE
                </div>

                <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', lineHeight: '0.9', margin: '0 0 20px 0' }}>
                  {thread.title}
                </h1>

                <div style={{ borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)', padding: '20px 0', margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'IBM Plex Mono', color: '#666', textTransform: 'uppercase' }}>Asking Price</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--ink)' }}>{thread.price || 'TBC'}</div>
                  </div>
                  <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'IBM Plex Mono', color: '#666', textTransform: 'uppercase' }}>Condition</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{thread.condition || 'Used'}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#666', fontFamily: 'IBM Plex Mono' }}>
                  Seller: <Link href={`/profile/${thread.username}`} style={{color: 'var(--rust)', fontWeight: 'bold'}}>{thread.username}</Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Thread Header for non-marketplace boards */
          <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: 0 }}>{thread.title}</h1>
          </div>
        )}

        {/* 💬 POSTS / DESCRIPTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {posts.map((post: any, index: number) => (
            <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--ink)', color: 'white', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue', fontSize: '1.2rem' }}>
                  {post.username.slice(0,2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{post.username}</div>
              </div>

              <div style={{ fontFamily: 'Barlow', fontSize: '1.15rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {isGearListing && index === 0 && (
                  <div style={{ background: '#f5f5f5', padding: '2px 8px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px', borderRadius: '3px' }}>
                    DESCRIPTION
                  </div>
                )}
                {post.body}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px', padding: '40px', background: 'var(--paper)', border: '2px solid var(--ink)' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '20px' }}>Interested? Reply to the Seller</h3>
          <PostReplyForm threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
