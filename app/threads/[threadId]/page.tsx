export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import PostReplyForm from '@/components/PostReplyForm';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  // 1. Fetch thread, board, and user info
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

  // 2. The Logic: Show advert if it's the gear-exchange OR if it has marketplace data
  const isAdvert = thread.board_slug === 'gear-exchange' || thread.price || thread.image_url;

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name}</Link>
        </nav>

        {isAdvert ? (
          /* 🎸 FULL ADVERT LAYOUT */
          <div style={{ background: 'var(--paper)', border: '4px solid var(--ink)', marginBottom: '40px', boxShadow: '12px 12px 0px var(--aged)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: thread.image_url ? '1.2fr 1fr' : '1fr', gap: '0' }}>
              
              {/* Image Side */}
              {thread.image_url && (
                <div style={{ borderRight: '4px solid var(--ink)', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={thread.image_url} alt={thread.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              )}

              {/* Text Side */}
              <div style={{ padding: '40px' }}>
                <div style={{ background: 'var(--rust)', color: 'white', display: 'inline-block', padding: '4px 12px', fontFamily: 'Bebas Neue', fontSize: '1.2rem', marginBottom: '15px' }}>
                  FOR SALE
                </div>
                <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4.5rem', lineHeight: '0.9', margin: '0 0 20px 0' }}>{thread.title}</h1>
                
                <div style={{ borderTop: '2px solid var(--ink)', borderBottom: '2px solid var(--ink)', padding: '20px 0', margin: '20px 0' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'IBM Plex Mono', color: '#666', textTransform: 'uppercase', display: 'block' }}>Price</span>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--ink)' }}>{thread.price || 'Contact for Price'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'IBM Plex Mono', color: '#666', textTransform: 'uppercase', display: 'block' }}>Condition</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{thread.condition || 'Used'}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                  Posted by <strong>{thread.username}</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 📝 STANDARD THREAD HEADER */
          <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: 0 }}>{thread.title}</h1>
          </div>
        )}

        {/* 💬 ITEM DESCRIPTION (The first post) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {posts.map((post: any, index: number) => (
            <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '30px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--ink)', color: 'white', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {post.username.slice(0,2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{post.username}</div>
              </div>
              <div style={{ fontFamily: 'Barlow', fontSize: '1.2rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {isAdvert && index === 0 && (
                  <div style={{ background: '#eee', padding: '2px 8px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    DESCRIPTION
                  </div>
                )}
                {post.body}
              </div>
            </div>
          ))}
        </div>

        {/* ✍️ REPLY FORM */}
        <div style={{ marginTop: '60px', padding: '40px', background: 'var(--paper)', border: '2px solid var(--ink)' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '20px' }}>Contact Seller / Reply</h3>
          <PostReplyForm threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
