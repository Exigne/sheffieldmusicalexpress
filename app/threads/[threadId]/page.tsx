export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import PostReplyForm from '@/components/PostReplyForm';

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch thread details + Board Slug (to check if it's a listing)
  const threadRes = await sql`
    SELECT t.*, b.slug as board_slug, b.name as board_name, u.username 
    FROM threads t 
    JOIN boards b ON t.board_id = b.id
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ${id} 
    LIMIT 1
  `;
  const thread = threadRes[0];

  if (!thread) return <div className="page-wrapper">Thread not found.</div>;

  // 2. Fetch all posts (messages) in this thread
  const posts = await sql`
    SELECT p.*, u.username 
    FROM posts p 
    JOIN users u ON p.user_id = u.id
    WHERE p.thread_id = ${id} 
    ORDER BY p.created_at ASC
  `;

  const isGearListing = thread.board_slug === 'gear-exchange';

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        <nav className="breadcrumb" style={{ marginBottom: '20px' }}>
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link href={`/boards/${thread.board_slug}`}>{thread.board_name}</Link>
        </nav>

        {/* 🎸 MARKETPLACE LISTING CARD (Only shows if in gear-exchange) */}
        {isGearListing && (
          <div style={{ 
            background: 'var(--paper)', 
            border: '4px solid var(--ink)', 
            marginBottom: '40px',
            boxShadow: '10px 10px 0px var(--rust)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: thread.image_url ? '1fr 1fr' : '1fr', gap: '0' }}>
              
              {/* Left Side: Image */}
              {thread.image_url && (
                <div style={{ borderRight: '4px solid var(--ink)', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={thread.image_url} 
                    alt={thread.title} 
                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} 
                  />
                </div>
              )}

              {/* Right Side: Details */}
              <div style={{ padding: '30px' }}>
                <div style={{ 
                  display: 'inline-block', 
                  background: 'var(--rust)', 
                  color: 'white', 
                  padding: '5px 15px', 
                  fontFamily: 'Bebas Neue', 
                  fontSize: '1.5rem',
                  marginBottom: '10px'
                }}>
                  FOR SALE / TRADE
                </div>

                <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', lineHeight: '1', margin: '10px 0' }}>
                  {thread.title}
                </h1>

                <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}>Price</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--ink)' }}>{thread.price || 'N/A'}</div>
                  </div>
                  <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase' }}>Condition</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{thread.condition || 'Used'}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#555', fontFamily: 'IBM Plex Mono' }}>
                  Listed by <strong>{thread.username}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📝 STANDARD THREAD VIEW (If not a listing, show title normally) */}
        {!isGearListing && (
          <div style={{ borderBottom: '4px solid var(--ink)', paddingBottom: '20px', marginBottom: '40px' }}>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', margin: 0 }}>{thread.title}</h1>
            <p style={{ fontFamily: 'IBM Plex Mono', color: '#666' }}>Started by {thread.username}</p>
          </div>
        )}

        {/* 💬 POSTS / MESSAGES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {posts.map((post: any, index: number) => (
            <div key={post.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '150px 1fr', 
              gap: '20px',
              borderBottom: '1px solid var(--aged)',
              paddingBottom: '30px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '60px', height: '60px', background: 'var(--ink)', color: 'white', 
                  margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue', fontSize: '1.5rem'
                }}>
                  {post.username.slice(0,2).toUpperCase()}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{post.username}</div>
                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '5px' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>

              <div style={{ 
                fontFamily: 'Barlow', fontSize: '1.1rem', lineHeight: '1.6', 
                whiteSpace: 'pre-wrap', color: '#222' 
              }}>
                {/* Highlight the first post as the "Description" in marketplace */}
                {isGearListing && index === 0 && (
                  <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 'bold', color: 'var(--rust)', marginBottom: '10px', fontSize: '0.8rem' }}>
                    ITEM DESCRIPTION:
                  </div>
                )}
                {post.body}
              </div>
            </div>
          ))}
        </div>

        {/* ✍️ REPLY FORM */}
        <div style={{ marginTop: '50px', padding: '30px', background: 'var(--paper)', border: '2px solid var(--ink)' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', marginBottom: '20px' }}>Send a Message / Reply</h3>
          <PostReplyForm threadId={thread.id} />
        </div>

      </div>
    </div>
  );
}
