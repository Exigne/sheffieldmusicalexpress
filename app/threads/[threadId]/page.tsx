export const dynamic = 'force-dynamic';

import { sql } from '@/lib/db';
import Link from 'next/link';
import PostReplyForm from '@/components/PostReplyForm';

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params; // MUST match folder name [threadId]

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

  return (
    <div className="page-wrapper" style={{ gridTemplateColumns: '1fr' }}>
      <div className="content-area" style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Marketplace Header Card */}
        {thread.board_slug === 'gear-exchange' && (
          <div style={{ background: 'var(--paper)', border: '4px solid var(--ink)', marginBottom: '40px', boxShadow: '10px 10px 0px var(--rust)' }}>
             <div style={{ display: 'grid', gridTemplateColumns: thread.image_url ? '1fr 1fr' : '1fr' }}>
                {thread.image_url && (
                  <div style={{ borderRight: '4px solid var(--ink)', background: '#000' }}>
                    <img src={thread.image_url} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '30px' }}>
                   <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', lineHeight: '1' }}>{thread.title}</h1>
                   <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--rust)', margin: '15px 0' }}>{thread.price || 'Free/Trade'}</div>
                   <div style={{ fontSize: '0.9rem', fontFamily: 'IBM Plex Mono' }}>CONDITION: {thread.condition}</div>
                </div>
             </div>
          </div>
        )}

        {/* Standard Title for other boards */}
        {thread.board_slug !== 'gear-exchange' && (
           <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '4rem', borderBottom: '4px solid var(--ink)' }}>{thread.title}</h1>
        )}

        {/* Posts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>
          {posts.map((post: any) => (
            <div key={post.id} style={{ borderBottom: '1px solid var(--aged)', paddingBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--rust)' }}>{post.username}</div>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{post.body}</div>
            </div>
          ))}
        </div>

        {/* Reply Section */}
        <div style={{ marginTop: '50px' }}>
          <PostReplyForm threadId={thread.id} />
        </div>
      </div>
    </div>
  );
}
